import { useEffect, useState } from "react";
import { Socket, io } from "socket.io-client";

const useSocket = (socketURL: string) => {
  // 소켓 상태
  const [socket, setSocket] = useState<Socket | null>(null);

  // 소켓 연결
  useEffect(() => {
    const newSocket = io(socketURL || "http://localhost:3000");

    newSocket.on("connect_error", socketErrorHandler);
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
      setSocket(null);
    };
  }, [socketURL]);

  return { socket };
};

const socketErrorHandler = (error: Error) => {
  console.error("시그널링 서버와의 연결에 실패했습니다.", error);
};

export default useSocket;
