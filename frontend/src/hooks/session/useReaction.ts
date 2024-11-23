import { Dispatch, SetStateAction, useCallback, useRef } from "react";
import { Socket } from "socket.io-client";
import { PeerConnection } from "../type/session";

export const useReaction = (
  socket: Socket | null,
  sessionId: string,
  setPeers: Dispatch<SetStateAction<PeerConnection[]>>,
  setReaction: (reaction: string) => void
) => {
  const reactionTimeouts = useRef<{
    [key: string]: ReturnType<typeof setTimeout>;
  }>({});

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

    if (senderId === socket?.id) {
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

  return { emitReaction, handleReaction };
}