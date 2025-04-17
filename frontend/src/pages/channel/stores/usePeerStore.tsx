import { create } from 'zustand';
import { PeerConnection, PeerMediaStatus } from '../types/WebRTCManager';

interface PeerState {
  peers: PeerConnection[];
  peerMediaStatus: Record<string, { audio: boolean; video: boolean }>;
  setPeers: (peers: PeerConnection[] | ((prev: PeerConnection[]) => PeerConnection[])) => void;
  setPeerMediaStatus: (
    status: Record<string, PeerMediaStatus> |
      ((prev: Record<string, PeerMediaStatus>) => Record<string, PeerMediaStatus>)
  ) => void;
}

export const usePeerStore = create<PeerState>((set) => ({
  peers: [],
  peerMediaStatus: {},
  setPeers: (peers) => set((state) => ({
    ...state,
    peers: typeof peers === 'function' ? peers(state.peers) : peers
  })),
  setPeerMediaStatus: (status) => set((state) => ({
    ...state,
    peerMediaStatus: typeof status === 'function' ? status(state.peerMediaStatus) : status
  })),
}));