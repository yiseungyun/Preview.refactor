import { useEffect } from "react";

export const useMediaStreamCleanup = (stream: MediaStream | null) => {
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream]);
};
