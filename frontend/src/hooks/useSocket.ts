import { useEffect } from "react";
import useSocketStore from "../stores/useSocketStore";

const useSocket = (socketURL: string) => {
  const { socket, connect } = useSocketStore();

  useEffect(() => {
    if (!socket) {
      connect(socketURL);
    }
  }, [socketURL]);

  return { socket };
};

export default useSocket;
