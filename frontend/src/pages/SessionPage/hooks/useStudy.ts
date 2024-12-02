import { STUDY_EMIT_EVENT } from "@/constants/WebSocket/StudyEvent";
import { Socket } from "socket.io-client";
import { RoomMetadata } from "@/pages/SessionPage/types/session";

const useStudy = (
  socket: Socket | null,
  isHost: boolean,
  sessionId: string,
  roomMetadata: RoomMetadata | null
) => {
  const requestChangeIndex = (
    type: "next" | "prev" | "current" | "move",
    index?: number
  ) => {
    if (socket) {
      if (isHost && roomMetadata) {
        switch (type) {
          case "next":
            socket.emit(STUDY_EMIT_EVENT.NEXT, { roomId: sessionId });
            break;
          case "prev":
            socket.emit(STUDY_EMIT_EVENT.INDEX, {
              roomId: sessionId,
              index: roomMetadata.currentIndex - 1,
            });
            break;
          case "current":
            socket.emit(STUDY_EMIT_EVENT.CURRENT, { roomId: sessionId });
            break;
          case "move":
            socket.emit(STUDY_EMIT_EVENT.INDEX, { roomId: sessionId, index });
            break;
        }
      }
    }
  };

  const startStudySession = () => {
    if (socket) {
      socket.emit(STUDY_EMIT_EVENT.START, { roomId: sessionId });
    }
  };

  const stopStudySession = () => {
    if (socket) {
      socket.emit(STUDY_EMIT_EVENT.STOP, { roomId: sessionId });
    }
  };

  return { requestChangeIndex, startStudySession, stopStudySession };
};

export default useStudy;
