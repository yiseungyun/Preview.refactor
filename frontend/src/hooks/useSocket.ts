import { useEffect, useState } from "react";
import { Socket, io } from "socket.io-client";

const useSocket = (socketURL: string) => {
  // 소켓 상태
  const [socket, setSocket] = useState<Socket | null>(null);

  // 소켓 연결
  useEffect(() => {
    const newSocket = io(socketURL || "http://localhost:3000");

    newSocket.on("connect_error", socketErrorHandler);
    newSocket.on("connect", socketConnectHandler);
    setSocket(newSocket);
    return () => {
      newSocket.disconnect();
      setSocket(null);
    };
  }, [socketURL]);

  return { socket };
};

const socketConnectHandler = () => {
  console.log("시그널링 서버와 연결되었습니다.");
};

const socketErrorHandler = (error: Error) => {
  console.error("시그널링 서버와의 연결에 실패했습니다.", error);
};

export default useSocket;
