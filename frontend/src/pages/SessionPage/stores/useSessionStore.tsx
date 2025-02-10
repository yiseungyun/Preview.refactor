import { create } from 'zustand';
import { usePeerStore } from './usePeerStore';

type RoomStatus = "PUBLIC" | "PRIVATE";

interface RoomMetadata {
  title: string;
  status: RoomStatus;
  participants: number;
  maxParticipants: number;
  createdAt: number;
  inProgress: boolean;
  host: UserInfo;
  category: string | string[];
  questionListId: number;
  questionListContents: Question[];
  currentIndex: number;
}

interface Question {
  id: number;
  content: string;
  index: number;
  questionListId: number;
}

interface UserInfo {
  socketId: string;
  createdAt: number;
  nickname: string;
}

interface Participant {
  id?: string;
  nickname: string;
  isHost: boolean;
}

interface SessionState {
  nickname: string;
  isHost: boolean;
  roomId: string;
  roomMetadata: RoomMetadata;
  participants: Participant[];
  ready: boolean;

  setNickname: (nickname: string) => void;
  setIsHost: (isHost: boolean) => void;
  setRoomId: (roomId: string) => void;
  setRoomMetadata: (metadata: RoomMetadata | ((prev: RoomMetadata) => RoomMetadata)) => void;
  setParticipants: (participants: Participant[]) => void;
  updateParticipants: () => void;
  setReady: (ready: boolean) => void;
}

export const useSessionStore = create<SessionState>((set, get) => ({
  nickname: "",
  isHost: false,
  roomId: "",
  roomMetadata: {
    title: "",
    status: "PUBLIC",
    participants: -1,
    maxParticipants: -1,
    createdAt: 0,
    inProgress: false,
    host: { socketId: "", createdAt: 0, nickname: "" },
    category: "",
    questionListId: -1,
    questionListContents: [],
    currentIndex: -1
  },
  participants: [],
  ready: false,

  setNickname: (nickname) => set({ nickname }),
  setIsHost: (isHost) => set({ isHost }),
  setRoomId: (roomId) => set({ roomId }),
  setRoomMetadata: (metadata) => set((state) => ({
    roomMetadata: typeof metadata === 'function' ? metadata(state.roomMetadata) : metadata
  })),
  setParticipants: (participants) => set({ participants }),
  updateParticipants: () => {
    const { nickname, isHost } = get();
    const peers = usePeerStore.getState().peers;

    set({
      participants: [
        { nickname, isHost },
        ...peers.map((peer) => ({
          nickname: peer.peerNickname,
          isHost: peer.isHost || false,
        }))
      ]
    });
  },
  setReady: (ready) => set({ ready }),
}));