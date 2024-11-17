import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import useToast from "@/hooks/useToast";
import useMediaDevices from "@/hooks/useMediaDevices";
import usePeerConnection from "@/hooks/usePeerConnection";
import useSocketStore from "@/stores/useSocketStore";

interface User {
  id: string;
  nickname: string;
}

export const useSession = (sessionId: string | undefined) => {
  const { socket, connect } = useSocketStore();
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
    if (!socket) connect(import.meta.env.VITE_SIGNALING_SERVER_URL);
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
  }, []);

  const setupSocketListeners = useCallback(() => {
    if (!socket || !stream) return;

    const handleAllUsers = (users: User[]) => {
      Object.entries(users).forEach(([socketId, userInfo]) => {
        createPeerConnection(socketId, userInfo.nickname, stream, true, {
          nickname,
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
    socket.on("user_exit", ({ id }) => closePeerConnection(id));
    socket.on("room_full", () => {
      toast.error("해당 세션은 이미 유저가 가득 찼습니다.");
      navigate("/sessions");
    });
    socket.on("reaction", handleReaction);

    return () => {
      socket.off("all_users", handleAllUsers);
      socket.off("getOffer", handleGetOffer);
      socket.off("getAnswer", handleGetAnswer);
      socket.off("getCandidate", handleGetCandidate);
      socket.off("user_exit");
      socket.off("room_full");
      socket.off("reaction", handleReaction);

      if (reactionTimeouts.current) {
        Object.values(reactionTimeouts.current).forEach(clearTimeout);
      }
    };
  }, [socket, stream, nickname, createPeerConnection, closePeerConnection]);

  useEffect(() => {
    const cleanup = setupSocketListeners();
    return () => cleanup?.();
  }, [setupSocketListeners]);

  useEffect(() => {
    if (selectedAudioDeviceId || selectedVideoDeviceId) {
      getMedia();
    }
  }, [selectedAudioDeviceId, selectedVideoDeviceId]);

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream]);

  const joinRoom = async () => {
    if (!socket || !sessionId || !nickname) {
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

  const emitReaction = (reactionType: string) => {
    if (socket) {
      socket.emit("reaction", {
        roomId: sessionId,
        reaction: reactionType,
      });
    }
  };

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
    handleMicToggle,
    handleVideoToggle,
    setSelectedAudioDeviceId,
    setSelectedVideoDeviceId,
    joinRoom,
    emitReaction,
  };
};
