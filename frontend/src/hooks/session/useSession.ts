import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import useToast from "@hooks/useToast";
import useMediaDevices from "@hooks/session/useMediaDevices";
import usePeerConnection from "@hooks/session/usePeerConnection";
import useSocket from "@hooks/useSocket";
import { Participant, RoomMetadata } from "@hooks/type/session";
import { useMediaStreamCleanup } from "@hooks/session/useMediaStreamCleanup";
import { usePeerConnectionCleanup } from "@hooks/session/usePeerConnectionCleanup";
import { useReaction } from "@hooks/session/useReaction";
import { useSocketEvents } from "./useSocketEvents";
import { Socket } from "socket.io-client";
import { SESSION_EMIT_EVENT } from "@/constants/WebSocket/SessionEvent.ts";
import useAuth from "@hooks/useAuth.ts";

export const useSession = (sessionId: string) => {
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
  const { nickname: username } = useAuth();
  const [nickname, setNickname] = useState<string>("");
  const [reaction, setReaction] = useState("");
  const [roomMetadata, setRoomMetadata] = useState<RoomMetadata | null>(null);
  const [isHost, setIsHost] = useState<boolean>(false);

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
    if (username) {
      setNickname(username);
    }
  }, [setNickname, username]);

  useEffect(() => {
    if (selectedAudioDeviceId || selectedVideoDeviceId) {
      getMedia();
    }
  }, [selectedAudioDeviceId, selectedVideoDeviceId, getMedia]);

  usePeerConnectionCleanup(peerConnections);
  useMediaStreamCleanup(stream);

  const { emitReaction, handleReaction } = useReaction(
    socket,
    sessionId,
    setPeers,
    setReaction
  );

  useSocketEvents({
    socket,
    stream,
    nickname,
    sessionId,
    createPeerConnection,
    closePeerConnection,
    peerConnections,
    setPeers,
    setIsHost,
    setRoomMetadata,
    handleReaction,
  });

  const isValidUser = (
    socket: Socket | null,
    nickname: string
  ): socket is Socket => {
    if (!socket) {
      toast.error("소켓 연결이 필요합니다.");
      return false;
    }
    if (!nickname) {
      toast.error("닉네임을 입력해주세요.");
      return false;
    }

    return true;
  };

  const joinRoom = async () => {
    if (!isValidUser(socket, nickname)) {
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

    socket.emit(SESSION_EMIT_EVENT.JOIN, { roomId: sessionId, nickname });
  };

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
    handleMicToggle: () => handleMicToggle(),
    handleVideoToggle: () => handleVideoToggle(peerConnections.current),
    setSelectedAudioDeviceId,
    setSelectedVideoDeviceId,
    joinRoom,
    emitReaction,
  };
};
