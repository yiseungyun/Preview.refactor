import { create } from "zustand";
import { Socket, io } from "socket.io-client";

interface SocketStore {
  socket: Socket | null;
  isConnecting: boolean;
  connect: (socketURL: string) => void;
  disconnect: () => void;
}

const useSocketStore = create<SocketStore>((set) => ({
  socket: null,
  isConnecting: false,
  connect: (socketURL) => {
    set((state) => {
      if (state.socket?.connected || state.isConnecting) {
        return state;
      }

      const newSocket = io(socketURL);

      newSocket.on("connect", () => {
        console.log("소켓을 성공적으로 연결했습니다.");
        set({ isConnecting: false });
      });
      newSocket.on("connect_error", (error: Error) => {
        console.error("소켓 에러", error);
        set({ isConnecting: true });
      });
      newSocket.on("exception", (error: Error) => {
        console.error("시그널링 서버와의 연결에 실패했습니다.", error);
      });

      return {
        socket: newSocket,
        isConnecting: true
      }
    })
  },
  disconnect: () => {
    set((state) => {
      state.socket?.disconnect();
      return { socket: null, isConnecting: false };
    });
  },
}));

export default useSocketStore;
