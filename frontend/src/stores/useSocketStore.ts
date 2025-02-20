import { create } from "zustand";
import { Socket, io } from "socket.io-client";

interface SocketStore {
  socket: Socket | null;
  isConnected: boolean;
  error: Error | null;
  connect: (socketURL: string) => Promise<void>;
  disconnect: () => void;
}

const useSocketStore = create<SocketStore>((set, get) => ({
  socket: null,
  isConnected: false,
  error: null,
  connect: async (socketURL) => {
    if (get().socket) return;

    try {
      const newSocket = io(socketURL);

      return new Promise((resolve, reject) => {
        newSocket.on("connect", () => {
          console.log("소켓을 성공적으로 연결했습니다.");
          set({
            socket: newSocket,
            isConnected: true,
            error: null
          });
          resolve();
        });

        newSocket.on("connect_error", (error: Error) => {
          console.error("소켓 에러", error);
          set({
            error,
            isConnected: false
          });
          reject(error);
        });

        newSocket.on("disconnect", () => {
          set({
            isConnected: false,
          });
        });

        newSocket.on("exception", (error: Error) => {
          console.error("시그널링 서버와의 연결에 실패했습니다.", error);
          set({ error });
          reject(error);
        });

        setTimeout(() => {
          if (!newSocket.connected) {
            const error = new Error("Connection timeout");
            set({
              error,
              isConnected: false
            });
            reject(error);
          }
        }, 5000);
      });
    } catch (error) {
      set({
        error: error as Error,
        isConnected: false
      });
      throw error;
    }
  },
  disconnect: () => {
    set((state) => {
      state.socket?.disconnect();
      return {
        socket: null,
        isConnected: false,
        error: null
      };
    });
  },
}));

export default useSocketStore;
