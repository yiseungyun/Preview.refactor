import { SESSION_LISTEN_EVENT } from "@/constants/WebSocket/SessionEvent.ts";
import useSocket from "@/hooks/useSocket.ts";
import useToast from "@/hooks/useToast.ts";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useBlockNavigate from "./useBlockNavigate";
import { useSessionStore } from "../stores/useSessionStore";
import { usePeerStore } from "../stores/usePeerStore";

export interface ResponseMasterChanged {
  socketId: string;
  nickname: string;
}

export const useStudyRoom = () => {
  const { socket } = useSocket();
  if (!socket) return;
  const toast = useToast();
  const navigate = useNavigate();

  const { setShouldBlock } = useBlockNavigate();
  const { setIsHost } = useSessionStore();
  const { setPeers } = usePeerStore();

  const handleRoomFinished = () => {
    toast.error("방장이 세션을 종료했습니다.");
    setShouldBlock(false);
    navigate("/sessions");
  };

  const handleHostChange = (data: ResponseMasterChanged) => {
    if (socket && data.socketId === socket.id) {
      setIsHost(true);
      toast.success("당신이 호스트가 되었습니다.");
    } else {
      setPeers((prev) =>
        prev.map((peer) =>
          peer.peerId === data.socketId ? { ...peer, isHost: true } : peer
        )
      );
      toast.success(`${data.nickname}님이 호스트가 되었습니다.`);
    }
  }

  const handleRoomFull = () => {
    toast.error("해당 세션은 이미 유저가 가득 찼습니다.");
    setShouldBlock(false);
    navigate("/sessions");
  };

  const handleRoomNotFound = async () => {
    toast.error("해당 세션은 존재하지 않습니다.");
    setShouldBlock(false);

    navigate("/sessions");
  };

  useEffect(() => {
    socket.on(SESSION_LISTEN_EVENT.FINISH, handleRoomFinished);
    socket.on(SESSION_LISTEN_EVENT.CHANGE_HOST, handleHostChange);
    socket.on(SESSION_LISTEN_EVENT.FULL, handleRoomFull);
    socket.on(SESSION_LISTEN_EVENT.NOT_FOUND, handleRoomNotFound);

    return () => {
      socket.off(SESSION_LISTEN_EVENT.CHANGE_HOST, handleHostChange);
      socket.off(SESSION_LISTEN_EVENT.FINISH, handleRoomFinished);
      socket.off(SESSION_LISTEN_EVENT.FULL, handleRoomFull);
      socket.off(SESSION_LISTEN_EVENT.NOT_FOUND, handleRoomNotFound);
    }
  }, [socket]);
};