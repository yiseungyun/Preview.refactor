export interface PeerConnection {
  peerId: string;
  peerNickname: string;
  stream: MediaStream;
  isHost: boolean;
  reaction: string;
}

export interface PeerMediaStatus {
  audio: boolean;
  video: boolean;
}