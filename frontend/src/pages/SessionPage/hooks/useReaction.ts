import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { SESSION_EMIT_EVENT, SESSION_LISTEN_EVENT } from "@/constants/WebSocket/SessionEvent.ts";
import { usePeerStore } from "../stores/usePeerStore";
import { useSessionStore } from "../stores/useSessionStore";
import { Socket } from "socket.io-client";

const REACTION_DURATION_MS = 3000;

export const useReaction = (socket: Socket) => {
  const [reaction, setReaction] = useState("");
  const setPeers = usePeerStore(state => state.setPeers);
  const roomId = useSessionStore(state => state.roomId);

  const reactionTimeouts = useRef<{
    [key: string]: ReturnType<typeof setTimeout>;
  }>({});

  const emitReaction = useCallback(
    (reactionType: string) => {
      if (socket) {
        socket.emit(SESSION_EMIT_EVENT.REACTION, {
          roomId: roomId,
          reactionType: reactionType,
        });
      }
    }, [socket, roomId]);

  const addReaction = useCallback(
    (senderId: string, reactionType: string) => {
      setPeers((prev) =>
        prev.map((peer) =>
          peer.peerId === senderId ? { ...peer, reaction: reactionType } : peer
        )
      );
    }, [setPeers]);

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
      }, REACTION_DURATION_MS);
    } else {
      addReaction(socketId, reactionType);
      reactionTimeouts.current[socketId] = setTimeout(() => {
        addReaction(socketId, "");
        delete reactionTimeouts.current[socketId];
      }, REACTION_DURATION_MS);
    }
  };

  useEffect(() => {
    if (!socket) return;
    socket.on(SESSION_LISTEN_EVENT.REACTION, handleReaction);

    return () => {
      socket.off(SESSION_LISTEN_EVENT.REACTION, handleReaction);

      Object.values(reactionTimeouts.current).forEach((timeout) =>
        clearTimeout(timeout)
      );
    }
  }, [socket]);

  return { reaction, emitReaction };
};
