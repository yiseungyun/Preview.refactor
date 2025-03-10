import { useEffect } from "react";
import useSocketStore from "../stores/useSocketStore";

const socketURL = import.meta.env.VITE_SIGNALING_SERVER;
let connectionAttempted = false;

const useSocket = () => {
  const socket = useSocketStore(state => state.socket);
  const disconnect = useSocketStore(state => state.disconnect);
  const isConnected = useSocketStore(state => state.isConnected);

  useEffect(() => {
    if (socket) return;

    const connectSocket = async () => {
      if (!connectionAttempted) {
        connectionAttempted = true;
        try {
          const connect = useSocketStore.getState().connect;
          await connect(socketURL);
        } catch (error) {
          console.error("Socket connection failed:", error);
          connectionAttempted = false;
        }
      }
    };

    connectSocket();

    return () => {
      connectionAttempted = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { socket, disconnect, isConnected };
};

export default useSocket;
