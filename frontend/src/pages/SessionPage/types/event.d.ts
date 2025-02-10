export type PeerEvent = {
  peerId: string;
  peerNickname: string;
  stream: MediaStream;
  isHost?: boolean;
}

export type MediaStatusEvent = {
  peerId: string;
  type: 'audio' | 'video';
  status: boolean;
}

export interface WebRTCEvents {
  'peer:added': (event: PeerEvent) => void;
  'peer:updated': (event: PeerEvent) => void;
  'peer:removed': (peerId: string) => void;
  'media:statusChanged': (event: MediaStatusEvent) => void;
}