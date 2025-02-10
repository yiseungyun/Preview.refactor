import { useEffect } from "react";
import useSocketStore from "../stores/useSocketStore";

const socketURL = import.meta.env.VITE_SIGNALING_SERVER;
let connectionAttempted = false;

const useSocket = () => {
  const { socket, connect, disconnect, isConnecting, isConnected } = useSocketStore();

  useEffect(() => {
    const connectSocket = async () => {
      if (!socket && !connectionAttempted && !isConnecting) {
        connectionAttempted = true;
        try {
          await connect(socketURL);
        } catch (error) {
          console.error("Socket connection failed:", error);
          connectionAttempted = false;
        }
      }
    };

    connectSocket();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, isConnecting, connect]);

  return { socket, disconnect, isConnected };
};

export default useSocket;
