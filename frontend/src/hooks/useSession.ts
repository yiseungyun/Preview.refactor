import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import useToast from "@/hooks/useToast";
import useMediaDevices from "@/hooks/useMediaDevices";
import usePeerConnection from "@/hooks/usePeerConnection";
import useSocket from "./useSocket";

export type RoomStatus = "PUBLIC" | "PRIVATE";
export interface RoomMetadata {
  title: string;
  status: RoomStatus;
  maxParticipants: number;
  createdAt: number;
  host: string;
}

interface AllUsersResponse {
  roomMetadata: RoomMetadata;
  users: {
    [socketId: string]: {
      joinTime: number;
      nickname: string;
      isHost: boolean;
    };
  };
}

interface ResponseMasterChanged {
  masterNickname: string;
  masterSocketId: string;
}

interface Participant {
  nickname: string;
  isHost: boolean;
}

export const useSession = (sessionId: string | undefined) => {
  const { socket } = useSocket();
  const navigate = useNavigate();
  const toast = useToast();

  const {
    createPeerConnection,
    closePeerConnection,
    peers,
    setPeers,
    peerConnections,
  } = usePeerConnection(socket!);

  const [nickname, setNickname] = useState<string>("");
  const [reaction, setReaction] = useState("");
  const [roomMetadata, setRoomMetadata] = useState<RoomMetadata | null>(null);
  const [isHost, setIsHost] = useState<boolean>(false);

  const reactionTimeouts = useRef<{
    [key: string]: ReturnType<typeof setTimeout>;
  }>({});

  const {
    userVideoDevices,
    userAudioDevices,
    selectedAudioDeviceId,
    selectedVideoDeviceId,
    stream,
    isVideoOn,
    isMicOn,
    handleMicToggle,
    handleVideoToggle,
    setSelectedAudioDeviceId,
    setSelectedVideoDeviceId,
    getMedia,
  } = useMediaDevices();

  useEffect(() => {
    const connections = peerConnections;
    return () => {
      Object.values(connections.current).forEach((pc) => {
        pc.ontrack = null;
        pc.onicecandidate = null;
        pc.oniceconnectionstatechange = null;
        pc.onconnectionstatechange = null;
        pc.close();
      });
    };
  }, [peerConnections]);

  useEffect(() => {
    if (selectedAudioDeviceId || selectedVideoDeviceId) {
      getMedia();
    }
  }, [selectedAudioDeviceId, selectedVideoDeviceId, getMedia]);

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream]);

  const handleUserExit = useCallback(
    ({ socketId }: { socketId: string }) => {
      toast.error("유저가 나갔습니다.");
      closePeerConnection(socketId);
    },
    [toast, closePeerConnection]
  );

  const handleRoomFinished = useCallback(() => {
    toast.error("방장이 세션을 종료했습니다.");
    navigate("/sessions");
  }, [toast, navigate]);

  const handleHostChange = useCallback(
    (data: ResponseMasterChanged) => {
      if (socket && data.masterSocketId === socket.id) {
        setIsHost(true);
        toast.success("당신이 호스트가 되었습니다.");
      } else {
        setPeers((prev) =>
          prev.map((peer) =>
            peer.peerId === data.masterSocketId
              ? { ...peer, isHost: true }
              : peer
          )
        );
        toast.success(`${data.masterNickname}님이 호스트가 되었습니다.`);
      }
    },
    [socket, toast, setPeers]
  );

  const setupSocketListeners = useCallback(() => {
    if (!socket || !stream) return;

    const handleAllUsers = ({ roomMetadata, users }: AllUsersResponse) => {
      if (!roomMetadata || !users) {
        console.error("Invalid data received from server:", {
          roomMetadata,
          users,
        });
        return;
      }

      setRoomMetadata(roomMetadata);
      setIsHost(roomMetadata.host === socket.id);
      Object.entries(users).forEach(([socketId, userInfo]) => {
        createPeerConnection(socketId, userInfo.nickname, stream, true, {
          nickname,
          isHost: userInfo.isHost,
        });
      });
    };

    const handleGetOffer = async (data: {
      sdp: RTCSessionDescription;
      offerSendID: string;
      offerSendNickname: string;
    }) => {
      const pc = createPeerConnection(
        data.offerSendID,
        data.offerSendNickname,
        stream,
        false,
        { nickname }
      );
      if (!pc) return;

      try {
        await pc.setRemoteDescription(new RTCSessionDescription(data.sdp));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);

        socket.emit("answer", {
          answerReceiveID: data.offerSendID,
          sdp: answer,
          answerSendID: socket.id,
        });
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
        await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
      } catch (error) {
        console.error("Error handling ICE candidate:", error);
      }
    };

    const handleReaction = ({
      senderId,
      reaction,
    }: {
      senderId: string;
      reaction: string;
    }) => {
      if (reactionTimeouts.current[senderId]) {
        clearTimeout(reactionTimeouts.current[senderId]);
      }

      if (senderId === socket.id) {
        setReaction(reaction);
        reactionTimeouts.current[senderId] = setTimeout(() => {
          setReaction("");
          delete reactionTimeouts.current[senderId];
        }, 3000);
      } else {
        addReaction(senderId, reaction);
        reactionTimeouts.current[senderId] = setTimeout(() => {
          addReaction(senderId, "");
          delete reactionTimeouts.current[senderId];
        }, 3000);
      }
    };

    socket.on("all_users", handleAllUsers);
    socket.on("getOffer", handleGetOffer);
    socket.on("getAnswer", handleGetAnswer);
    socket.on("getCandidate", handleGetCandidate);
    socket.on("user_exit", handleUserExit);
    socket.on("room_full", () => {
      toast.error("해당 세션은 이미 유저가 가득 찼습니다.");
      navigate("/sessions");
    });
    socket.on("master_changed", handleHostChange);
    socket.on("reaction", handleReaction);
    socket.on("room_finished", handleRoomFinished);

    return () => {
      socket.off("all_users", handleAllUsers);
      socket.off("getOffer", handleGetOffer);
      socket.off("getAnswer", handleGetAnswer);
      socket.off("getCandidate", handleGetCandidate);
      socket.off("user_exit");
      socket.off("room_full");
      socket.off("master_changed", handleHostChange);
      socket.off("room_finished", handleRoomFinished);
      socket.off("reaction", handleReaction);

      if (reactionTimeouts.current) {
        Object.values(reactionTimeouts.current).forEach(clearTimeout);
      }
    };
  }, [
    socket,
    stream,
    nickname,
    createPeerConnection,
    closePeerConnection,
    peerConnections,
    navigate,
    toast,
    handleHostChange,
    handleUserExit,
    handleRoomFinished,
  ]);

  useEffect(() => {
    const cleanup = setupSocketListeners();
    return () => cleanup?.();
  }, [setupSocketListeners]);

  const joinRoom = async () => {
    if (!socket) {
      toast.error("소켓 연결이 필요합니다.");
      return;
    }

    if (!sessionId) {
      toast.error("세션 ID가 필요합니다.");
      return;
    }

    if (!nickname) {
      toast.error("닉네임을 입력해주세요.");
      return;
    }

    const mediaStream = await getMedia();
    if (!mediaStream) {
      toast.error(
        "미디어 스트림을 가져오지 못했습니다. 미디어 장치를 확인 후 다시 시도해주세요."
      );
      navigate("/sessions");
      return;
    }

    socket.emit("join_room", { roomId: sessionId, nickname });
  };

  const emitReaction = useCallback(
    (reactionType: string) => {
      if (socket) {
        socket.emit("reaction", {
          roomId: sessionId,
          reaction: reactionType,
        });
      }
    },
    [socket, sessionId]
  );

  const addReaction = useCallback(
    (senderId: string, reactionType: string) => {
      setPeers((prev) =>
        prev.map((peer) =>
          peer.peerId === senderId ? { ...peer, reaction: reactionType } : peer
        )
      );
    },
    [setPeers]
  );

  const participants: Participant[] = useMemo(
    () => [
      { nickname, isHost },
      ...peers.map((peer) => ({
        nickname: peer.peerNickname,
        isHost: peer.isHost || false,
      })),
    ],
    [nickname, isHost, peers]
  );

  return {
    nickname,
    setNickname,
    reaction,
    peers,
    userVideoDevices,
    userAudioDevices,
    isVideoOn,
    isMicOn,
    stream,
    roomMetadata,
    isHost,
    participants,
    handleMicToggle,
    handleVideoToggle,
    setSelectedAudioDeviceId,
    setSelectedVideoDeviceId,
    joinRoom,
    emitReaction,
  };
};
