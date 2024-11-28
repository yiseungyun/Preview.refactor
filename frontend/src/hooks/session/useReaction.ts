import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Socket } from "socket.io-client";
import { PeerConnection } from "../type/session";
import { SESSION_EMIT_EVENT } from "@/constants/WebSocket/SessionEvent";

const REACTION_DURATION = 3000;

export const useReaction = (
  socket: Socket | null,
  sessionId: string,
  setPeers: Dispatch<SetStateAction<PeerConnection[]>>
) => {
  const [reaction, setReaction] = useState("");

  const reactionTimeouts = useRef<{
    [key: string]: ReturnType<typeof setTimeout>;
  }>({});

  const emitReaction = useCallback(
    (reactionType: string) => {
      if (socket) {
        socket.emit(SESSION_EMIT_EVENT.REACTION, {
          roomId: sessionId,
          reactionType: reactionType,
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

  const handleReaction = ({
    socketId,
    reactionType,
  }: {
    socketId: string;
    reactionType: string;
  }) => {
    if (reactionTimeouts.current[socketId]) {
      clearTimeout(reactionTimeouts.current[socketId]);
    }

    if (socketId === socket?.id) {
      setReaction(reactionType);
      reactionTimeouts.current[socketId] = setTimeout(() => {
        setReaction("");
        delete reactionTimeouts.current[socketId];
      }, REACTION_DURATION);
    } else {
      addReaction(socketId, reactionType);
      reactionTimeouts.current[socketId] = setTimeout(() => {
        addReaction(socketId, "");
        delete reactionTimeouts.current[socketId];
      }, REACTION_DURATION);
    }
  };

  useEffect(() => {
    return () => {
      Object.values(reactionTimeouts.current).forEach((timeout) =>
        clearTimeout(timeout)
      );
    };
  }, []);

  return { reaction, emitReaction, handleReaction };
};
