import { useEffect } from "react";
import { MutableRefObject } from "react";

export const usePeerConnectionCleanup = (
  peerConnections: MutableRefObject<{ [key: string]: RTCPeerConnection }>
) => {
  useEffect(() => {
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
  }, [peerConnections]);
};
