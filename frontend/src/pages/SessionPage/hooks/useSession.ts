import { useEffect, useMemo, useState } from "react";
import useToast from "@hooks/useToast";
import useMediaDevices from "./useMediaDevices";
import usePeerConnection from "./usePeerConnection";
import useSocket from "@hooks/useSocket";
import { Participant, RoomMetadata } from "@/pages/SessionPage/types/session";
import { useMediaStreamCleanup } from "./useMediaStreamCleanup";
import { usePeerConnectionCleanup } from "./usePeerConnectionCleanup";
import { useReaction } from "./useReaction";
import { useSocketEvents } from "./useSocketEvents";
import { Socket } from "socket.io-client";
import { SESSION_EMIT_EVENT } from "@/constants/WebSocket/SessionEvent";
import useAuth from "@hooks/useAuth";
import useStudy from "./useStudy";
import useModal from "@hooks/useModal.ts";
import useBlockNavigate from "@/pages/SessionPage/hooks/useBlockNavigate.ts";
import { useMediaStore } from "../stores/useMediaStore";

export const useSession = (sessionId: string) => {
  const { socket } = useSocket();
  const toast = useToast();

  const {
    createPeerConnection,
    closePeerConnection,
    peers,
    setPeers,
    peerConnections,
    dataChannels,
    peerMediaStatus,
  } = usePeerConnection(socket!);
  const { nickname: username } = useAuth();
  const [nickname, setNickname] = useState<string>("");
  const [roomMetadata, setRoomMetadata] = useState<RoomMetadata | null>(null);
  const [isHost, setIsHost] = useState<boolean>(false);
  const mediaPreviewModal = useModal();
  const [ready, setReady] = useState(false);
  useEffect(() => {
    mediaPreviewModal.openModal();
  }, []);

  const stream = useMediaStore(state => state.stream);
  const isVideoOn = useMediaStore(state => state.isVideoOn);
  const selectedVideoDeviceId = useMediaStore(state => state.selectedVideoDeviceId);
  const selectedAudioDeviceId = useMediaStore(state => state.selectedAudioDeviceId);

  const {
    handleMicToggle,
    handleVideoToggle,
    getMedia,
    getMediaStream,
  } = useMediaDevices(dataChannels);

  const { setShouldBlock } = useBlockNavigate();

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

  const { reaction, emitReaction, handleReaction } = useReaction(
    socket,
    sessionId,
    setPeers
  );

  const { requestChangeIndex, stopStudySession, startStudySession } = useStudy(
    socket,
    isHost,
    sessionId,
    roomMetadata
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
    setShouldBlock,
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
      return;
    } else if (isVideoOn && mediaStream.getVideoTracks().length === 0) {
      toast.error(
        "비디오 장치를 찾을 수 없습니다. 비디오 장치 없이 세션에 참가합니다."
      );
    } else if (mediaStream.getAudioTracks().length === 0) {
      toast.error(
        "오디오 장치를 찾을 수 없습니다. 오디오 장치 없이 세션에 참가합니다."
      );
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
    peerConnections,
    roomMetadata,
    isHost,
    participants,
    handleMicToggle: () => handleMicToggle(),
    handleVideoToggle: () => handleVideoToggle(peerConnections.current),
    joinRoom,
    emitReaction,
    peerMediaStatus,
    requestChangeIndex,
    startStudySession,
    stopStudySession,
    getMedia,
    getMediaStream,
    mediaPreviewModal,
    ready,
    setReady,
    setShouldBlock,
  };
};
