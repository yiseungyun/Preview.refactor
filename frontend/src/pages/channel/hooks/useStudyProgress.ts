import { STUDY_EMIT_EVENT, STUDY_LISTEN_EVENT } from "@/constants/WebSocket/StudyEvent.ts";
import useToast from "@/hooks/useToast";
import { useSessionStore } from "../stores/useSessionStore";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useBlockNavigate from "./useBlockNavigate.ts";
import { Socket } from "socket.io-client";

export interface ProgressResponse {
  status: "success" | "error";
  inProgress: boolean;
}

interface StudyProgressProps {
  socket: Socket;
  disconnect: () => void;
}

const useStudyProgress = ({ socket, disconnect }: StudyProgressProps) => {
  const navigate = useNavigate();
  const toast = useToast();
  const isHost = useSessionStore(state => state.isHost);
  const roomId = useSessionStore(state => state.roomId);
  const roomMetadata = useSessionStore(state => state.roomMetadata);
  const setRoomMetadata = useSessionStore(state => state.setRoomMetadata);
  const { setShouldBlock } = useBlockNavigate(disconnect);

  useEffect(() => {
    if (!socket) return;

    const handleChangeIndex = (data: { currentIndex: number }) => {
      const { currentIndex } = data;
      if (currentIndex >= 0) {
        setRoomMetadata((prev) => ({ ...prev!, currentIndex }));
      }
    };

    const handleProgress = (data: ProgressResponse) => {
      const { status, inProgress } = data;

      if (status === "success") {
        setRoomMetadata((prev) => ({ ...prev, inProgress: inProgress }));
        if (inProgress) toast.success("호스트가 스터디를 시작했습니다.");
        else toast.error("호스트가 스터디를 중지했습니다.");
      } else {
        toast.error("스터디를 시작하지 못했습니다.");
      }
    };

    const handleRoomProgress = () => {
      toast.error("해당 채널은 진행 중입니다.");
      setShouldBlock(false);
      navigate("/channels");
    };

    socket.on(STUDY_LISTEN_EVENT.INDEX, handleChangeIndex);
    socket.on(STUDY_LISTEN_EVENT.CURRENT, handleChangeIndex);
    socket.on(STUDY_LISTEN_EVENT.NEXT, handleChangeIndex);
    socket.on(STUDY_LISTEN_EVENT.START, handleProgress);
    socket.on(STUDY_LISTEN_EVENT.STOP, handleProgress);
    socket.on(STUDY_LISTEN_EVENT.PROGRESS, handleRoomProgress);

    return () => {
      socket.off(STUDY_LISTEN_EVENT.INDEX, handleChangeIndex);
      socket.off(STUDY_LISTEN_EVENT.CURRENT, handleChangeIndex);
      socket.off(STUDY_LISTEN_EVENT.NEXT, handleChangeIndex);
      socket.off(STUDY_LISTEN_EVENT.START, handleProgress);
      socket.off(STUDY_LISTEN_EVENT.STOP, handleProgress);
      socket.off(STUDY_LISTEN_EVENT.PROGRESS, handleRoomProgress);
    }
  }, [socket]);

  const requestChangeIndex = (
    type: "next" | "prev" | "current" | "move",
    index?: number
  ) => {
    if (!socket) return;
    if (isHost && roomMetadata) {
      switch (type) {
        case "next":
          socket.emit(STUDY_EMIT_EVENT.NEXT, { roomId });
          break;
        case "prev":
          socket.emit(STUDY_EMIT_EVENT.INDEX, {
            roomId,
            index: roomMetadata.currentIndex - 1,
          });
          break;
        case "current":
          socket.emit(STUDY_EMIT_EVENT.CURRENT, { roomId });
          break;
        case "move":
          socket.emit(STUDY_EMIT_EVENT.INDEX, { roomId, index });
          break;
      }
    }
  };

  const startStudySession = () => {
    if (socket) socket.emit(STUDY_EMIT_EVENT.START, { roomId });
  };

  const stopStudySession = () => {
    if (socket) socket.emit(STUDY_EMIT_EVENT.STOP, { roomId });
  };

  return { requestChangeIndex, startStudySession, stopStudySession };
};

export default useStudyProgress;
