import { SESSION_LISTEN_EVENT } from "@/constants/WebSocket/SessionEvent.ts";
import useToast from "@/hooks/useToast.ts";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useBlockNavigate from "./useBlockNavigate";
import { useSessionStore } from "../stores/useSessionStore";
import { usePeerStore } from "../stores/usePeerStore";
import { Socket } from "socket.io-client";
import useAuth from "@/hooks/useAuth";

interface ResponseMasterChanged {
  socketId: string;
  nickname: string;
}

export const useStudyRoom = (socket: Socket, disconnect: () => void) => {
  const toast = useToast();
  const navigate = useNavigate();
  const { nickname: username } = useAuth();

  const { setShouldBlock } = useBlockNavigate(disconnect);
  const setIsHost = useSessionStore(state => state.setIsHost);
  const setPeers = usePeerStore(state => state.setPeers);
  const setNickname = useSessionStore(state => state.setNickname);
  const setParticipants = useSessionStore(state => state.setParticipants);

  useEffect(() => {
    if (!socket) return;

    const handleRoomFinished = () => {
      toast.error("호스트가 스터디를 종료했습니다.");
      setShouldBlock(false);
      navigate("/channels");
    };

    const handleHostChange = (data: ResponseMasterChanged) => {
      const isLocalUserNewHost = data.socketId === socket.id;

      if (isLocalUserNewHost) {
        setIsHost(true);
        toast.success("호스트가 되었습니다.");
      } else {
        toast.success(`${data.nickname}님이 호스트가 되었습니다.`);
      }

      setPeers(prev => prev.map(peer => ({
        ...peer,
        isHost: peer.peerId === data.socketId
      })))

      setParticipants(prev => prev.map(participant => ({
        ...participant,
        isHost: participant.id === data.socketId
      })));
    }

    const handleRoomFull = () => {
      toast.error("해당 채널은 이미 유저가 가득 찼습니다.");
      setShouldBlock(false);
      navigate("/channels");
    };

    const handleRoomNotFound = async () => {
      toast.error("해당 채널은 존재하지 않습니다.");
      setShouldBlock(false);

      navigate("/channels");
    };

    socket.on(SESSION_LISTEN_EVENT.FINISH, handleRoomFinished);
    socket.on(SESSION_LISTEN_EVENT.CHANGE_HOST, handleHostChange);
    socket.on(SESSION_LISTEN_EVENT.FULL, handleRoomFull);
    socket.on(SESSION_LISTEN_EVENT.NOT_FOUND, handleRoomNotFound);

    return () => {
      socket.off(SESSION_LISTEN_EVENT.CHANGE_HOST, handleHostChange);
      socket.off(SESSION_LISTEN_EVENT.FINISH, handleRoomFinished);
      socket.off(SESSION_LISTEN_EVENT.FULL, handleRoomFull);
      socket.off(SESSION_LISTEN_EVENT.NOT_FOUND, handleRoomNotFound);

      setParticipants([]);
      setNickname(username);
    }
  }, [socket]);
};