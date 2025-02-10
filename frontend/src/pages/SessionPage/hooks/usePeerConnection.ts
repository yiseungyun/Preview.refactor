import { useEffect, useRef } from "react";
import WebRTCManager from "../services/WebRTCManager.ts";
import { SIGNAL_EMIT_EVENT, SIGNAL_LISTEN_EVENT } from "@/constants/WebSocket/SignalingEvent.ts";
import { useMediaStore } from "../stores/useMediaStore";
import { SESSION_LISTEN_EVENT } from "@/constants/WebSocket/SessionEvent.ts";
import { useSessionStore } from "../stores/useSessionStore";
import useToast from "@/hooks/useToast";
import { usePeerStore } from "../stores/usePeerStore";
import useSocket from "@/hooks/useSocket.ts";
import { MediaStatusEvent, PeerEvent } from "../types/event";
import { EventEmitter } from "../services/EventEmitter.ts";

interface UserInfo {
  socketId: string;
  createdAt: number;
  nickname: string;
}

interface Question {
  id: number;
  content: string;
  index: number;
  questionListId: number;
}

interface RoomJoinResponse {
  category: string;
  inProgress: boolean;
  createdAt: number;
  host: UserInfo;
  participants: number;
  maxParticipants: number;
  status: "PUBLIC" | "PRIVATE";
  title: string;
  id: string;
  connectionMap: { [socketId: string]: UserInfo };
  questionListId: number;
  questionListContents: Question[];
  currentIndex: number;
}

const usePeerConnection = () => {
  const peerConnections = useRef<{ [key: string]: RTCPeerConnection }>({});
  const dataChannels = useRef<{ [peerId: string]: RTCDataChannel }>({});
  const { socket } = useSocket();
  const toast = useToast();
  const { setPeers, setPeerMediaStatus } = usePeerStore();
  const { stream } = useMediaStore();
  const { nickname, setRoomMetadata, setIsHost } = useSessionStore();
  const webRTCManagerRef = useRef<WebRTCManager | null>(null);

  useEffect(() => {
    if (!socket) return;

    const eventEmitter = new EventEmitter();

    eventEmitter.on('peer:updated', (event: PeerEvent) => {
      setPeers(prev => {
        const exists = prev.find(p => p.peerId === event.peerId);
        if (exists) {
          return prev.map(p =>
            p.peerId === event.peerId ? { ...p, stream: event.stream } : p
          );
        }
        return [...prev, {
          peerId: event.peerId,
          peerNickname: event.peerNickname,
          isHost: event.isHost ?? false,
          stream: event.stream
        }];
      });
    });

    eventEmitter.on('peer:removed', (peerId: string) => {
      setPeers(prev => prev.filter(p => p.peerId !== peerId));
    });

    eventEmitter.on('media:statusChanged', (event: MediaStatusEvent) => {
      setPeerMediaStatus(prev => ({
        ...prev,
        [event.peerId]: {
          ...prev[event.peerId] ?? { audio: true, video: true },
          [event.type]: event.status
        }
      }));
    });

    webRTCManagerRef.current = new WebRTCManager(
      socket,
      peerConnections,
      dataChannels,
      eventEmitter,
    );

    const handleGetOffer = async (data: {
      sdp: RTCSessionDescription;
      offerSendID: string;
      offerSendNickname: string;
    }) => {
      const pc = await webRTCManagerRef.current?.createPeerConnection(
        data.offerSendID,
        data.offerSendNickname,
        stream,
        false,
        { nickname, isHost: false }
      );

      if (!pc) return;

      try {
        await pc.setRemoteDescription(new RTCSessionDescription(data.sdp));

        if (pc.signalingState === "have-remote-offer") {
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);

          socket.emit(SIGNAL_EMIT_EVENT.ANSWER, {
            answerReceiveID: data.offerSendID,
            sdp: answer,
            answerSendID: socket.id,
          });
        } else {
          console.log("Unexpected signaling state:", pc.signalingState);
        }
      } catch (error) {
        console.error("Error handling offer:", error);
      }
    };

    const handleGetAnswer = async (data: {
      sdp: RTCSessionDescription;
      answerSendID: string;
    }) => {
      const pc = peerConnections.current[data.answerSendID];
      if (!pc) return;

      try {
        await pc.setRemoteDescription(new RTCSessionDescription(data.sdp));
      } catch (error) {
        console.error("Error handling answer:", error);
      }
    };

    const handleGetCandidate = async (data: {
      candidate: RTCIceCandidate;
      candidateSendID: string;
    }) => {
      const pc = peerConnections.current[data.candidateSendID];
      if (!pc) return;

      try {
        if (pc.signalingState === "closed") {
          return;
        }

        if (!pc.remoteDescription) {
          const maxAttempts = 5;
          let attempts = 0;

          while (!pc.remoteDescription && attempts < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            attempts++;
          }

          if (!pc.remoteDescription) {
            console.error("Failed to set remote description after waiting");
            return;
          }
        }

        await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
      } catch (error) {
        console.error("Error handling ICE candidate:", error);
        console.log({
          signalingState: pc.signalingState,
          connectionState: pc.connectionState,
          iceConnectionState: pc.iceConnectionState
        });
      }
    };

    const handleAllUsers = async (data: RoomJoinResponse) => {
      const roomMetadata = {
        id: data.id,
        title: data.title,
        category: data.category,
        host: data.host,
        status: data.status,
        participants: data.participants,
        maxParticipants: data.maxParticipants,
        createdAt: data.createdAt,
        inProgress: data.inProgress,
        questionListId: data.questionListId,
        questionListContents: data.questionListContents,
        currentIndex: data.currentIndex,
      };

      setRoomMetadata(roomMetadata);
      setIsHost(roomMetadata.host.socketId === socket.id);

      Object.entries(data.connectionMap).forEach(async ([socketId, userInfo]) => {
        const pc = await webRTCManagerRef.current?.createPeerConnection(
          socketId,
          userInfo.nickname,
          stream,
          true,
          {
            nickname,
            isHost: roomMetadata.host.socketId === userInfo.socketId,
          }
        );

        if (pc && pc.signalingState === "stable") {
          try {
            await new Promise(resolve => setTimeout(resolve, 100));
            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);

            socket.emit(SIGNAL_EMIT_EVENT.OFFER, {
              offerReceiveID: socketId,
              sdp: offer,
              offerSendID: socket.id,
              offerSendNickname: nickname,
            });
          } catch (error) {
            console.error("Error creating offer:", error);
          }
        }
      });
    };

    const handleUserExit = ({ socketId }: { socketId: string }) => {
      toast.error("유저가 나갔습니다.");
      webRTCManagerRef.current?.closePeerConnection(socketId);
    };

    socket.on(SIGNAL_LISTEN_EVENT.OFFER, handleGetOffer);
    socket.on(SIGNAL_LISTEN_EVENT.ANSWER, handleGetAnswer);
    socket.on(SIGNAL_LISTEN_EVENT.CANDIDATE, handleGetCandidate);
    socket.on(SESSION_LISTEN_EVENT.JOIN, handleAllUsers);
    socket.on(SESSION_LISTEN_EVENT.QUIT, handleUserExit);

    return () => {
      socket.off(SIGNAL_LISTEN_EVENT.OFFER, handleGetOffer);
      socket.off(SIGNAL_LISTEN_EVENT.ANSWER, handleGetAnswer);
      socket.off(SIGNAL_LISTEN_EVENT.CANDIDATE, handleGetCandidate);
      socket.off(SESSION_LISTEN_EVENT.JOIN, handleAllUsers);
      socket.off(SESSION_LISTEN_EVENT.QUIT, handleUserExit);

      if (webRTCManagerRef.current) {
        Object.keys(peerConnections.current).forEach(peerId => {
          webRTCManagerRef.current?.closePeerConnection(peerId);
        });
        webRTCManagerRef.current = null;
      };

      Object.values(peerConnections.current).forEach((pc) => {
        pc.ontrack = null;
        pc.onicecandidate = null;
        pc.oniceconnectionstatechange = null;
        pc.onconnectionstatechange = null;
        pc.close();
      });

      eventEmitter.removeAllListeners();
      setPeers([]);
      setPeerMediaStatus({});
    };
  }, [socket, stream, nickname]);

  return {
    peerConnections,
    dataChannels,
  };
};

export default usePeerConnection;