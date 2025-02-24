import { useEffect, useRef } from "react";
import WebRTCManager from "../services/WebRTCManager.ts";
import { SIGNAL_EMIT_EVENT, SIGNAL_LISTEN_EVENT } from "@/constants/WebSocket/SignalingEvent.ts";
import { useMediaStore } from "../stores/useMediaStore";
import { SESSION_LISTEN_EVENT } from "@/constants/WebSocket/SessionEvent.ts";
import { useSessionStore } from "../stores/useSessionStore";
import useToast from "@/hooks/useToast";
import { usePeerStore } from "../stores/usePeerStore";
import { Socket } from "socket.io-client";

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

const usePeerConnection = (socket: Socket) => {
  const peerConnections = useRef<{ [key: string]: RTCPeerConnection }>({});
  const dataChannels = useRef<{ [peerId: string]: RTCDataChannel }>({});
  const toast = useToast();
  const setPeers = usePeerStore(state => state.setPeers);
  const setPeerMediaStatus = usePeerStore(state => state.setPeerMediaStatus);
  const stream = useMediaStore(state => state.stream);
  const nickname = useSessionStore(state => state.nickname);
  const isHost = useSessionStore(state => state.isHost);
  const setRoomMetadata = useSessionStore(state => state.setRoomMetadata);
  const setIsHost = useSessionStore(state => state.setIsHost);
  const setParticipants = useSessionStore(state => state.setParticipants);
  const webRTCManagerRef = useRef<WebRTCManager | null>(null);

  useEffect(() => {
    if (!socket || !nickname || !stream) return;

    webRTCManagerRef.current = WebRTCManager.getInstance(
      socket,
      peerConnections,
      dataChannels,
      setPeers,
      setPeerMediaStatus,
      setParticipants,
    );

    const handleGetOffer = async (data: {
      sdp: RTCSessionDescription;
      offerSendID: string;
      offerSendNickname: string;
    }) => {
      const existingPc = peerConnections.current[data.offerSendID];
      if (existingPc) {
        if (existingPc.connectionState === "failed" ||
          existingPc.connectionState === "disconnected") {
          webRTCManagerRef.current?.closePeerConnection(data.offerSendID);
        } else if (existingPc.signalingState !== "stable") {
          return;
        }
      }

      const pc = await webRTCManagerRef.current?.createPeerConnection(
        data.offerSendID,
        data.offerSendNickname,
        stream,
        false,
        { id: socket.id!, nickname, isHost }
      );

      if (!pc) return;

      try {
        await Promise.all([
          pc.setRemoteDescription(new RTCSessionDescription(data.sdp)),
          new Promise(async (resolve) => {
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);

            socket?.emit(SIGNAL_EMIT_EVENT.ANSWER, {
              answerReceiveID: data.offerSendID,
              sdp: answer,
              answerSendID: socket.id,
            });

            resolve(true);
          })
        ]);
      } catch (error) {
        console.error("Error handling offer:", error);
        webRTCManagerRef.current?.closePeerConnection(data.offerSendID);
      }
    };

    const handleGetAnswer = async (data: {
      sdp: RTCSessionDescription;
      answerSendID: string;
    }) => {
      const pc = peerConnections.current[data.answerSendID];
      if (!pc) return;

      try {
        if (pc.signalingState === "stable") return;
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
        if (pc.remoteDescription) {
          await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
        }
      } catch (error) {
        console.error("Error handling ICE candidate:", error);
      }
    };

    const handleAllUsers = async (data: RoomJoinResponse) => {
      const response = {
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

      setRoomMetadata(response);
      setIsHost(response.host.socketId === socket.id);

      setParticipants(prev => {
        const participantExists = prev.some(p => p.id === socket.id);
        if (participantExists) return prev;

        return [...prev, {
          id: socket.id!, isHost: response.host.socketId === socket.id, nickname
        }]
      });

      for (const [socketId, userInfo] of Object.entries(data.connectionMap)) {
        await webRTCManagerRef.current?.createPeerConnection(
          socketId,
          userInfo.nickname,
          stream,
          true,
          {
            id: userInfo.socketId,
            nickname,
            isHost: response.host.socketId === userInfo.socketId,
          }
        );
      }
    }

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
      if (webRTCManagerRef.current) {
        Object.keys(peerConnections.current).forEach(peerId => {
          webRTCManagerRef.current?.closePeerConnection(peerId);
        });
        webRTCManagerRef.current = null;
      };

      Object.values(dataChannels.current).forEach(channel => {
        channel.close();
      });
      dataChannels.current = {};

      Object.values(peerConnections.current).forEach(pc => {
        pc.close();
      });
      peerConnections.current = {};

      socket.off(SIGNAL_LISTEN_EVENT.OFFER, handleGetOffer);
      socket.off(SIGNAL_LISTEN_EVENT.ANSWER, handleGetAnswer);
      socket.off(SIGNAL_LISTEN_EVENT.CANDIDATE, handleGetCandidate);
      socket.off(SESSION_LISTEN_EVENT.JOIN, handleAllUsers);
      socket.off(SESSION_LISTEN_EVENT.QUIT, handleUserExit);
    };
  }, [socket, nickname, stream]);

  return { peerConnections, dataChannels };
};

export default usePeerConnection;