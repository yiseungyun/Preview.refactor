import { useEffect } from "react";
import useSocketStore from "../stores/useSocketStore";

const useSocket = (socketURL: string) => {
  const { socket, connect } = useSocketStore();

  useEffect(() => {
    if (!socket) {
      connect(socketURL);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
 
  }, [socketURL]);

  return { socket };
};
 
export default useSocket;
