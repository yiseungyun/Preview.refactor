import { create } from "zustand";
import { Socket, io } from "socket.io-client";

interface SocketStore {
  socket: Socket | null;
  connect: (socketURL: string) => void;
  disconnect: () => void;
}

const useSocketStore = create<SocketStore>((set) => ({
  socket: null,
  connect: (socketURL) => {
    const newSocket = io(socketURL);

    newSocket.on("connect", socketConnectHandler);
    newSocket.on("connect_error", socketErrorHandler);
    set({ socket: newSocket });
  },
  disconnect: () => {
    set((state) => {
      state.socket?.disconnect();
      return { socket: null };
    });
  },
}));

const socketConnectHandler = () => {
  console.log("소켓을 성공적으로 연결했습니다.");
};
const socketErrorHandler = (error: Error) => {
  console.error("시그널링 서버와의 연결에 실패했습니다.", error);
};

export default useSocketStore;
