export interface User {
  id: string;
  nickname: string;
  isHost: boolean;
}

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

export interface PeerMediaStatuses {
  [peerId: string]: PeerMediaStatus;
}

export interface Participant {
  id: string;
  nickname: string;
  isHost: boolean;
}

export interface PeerConnections {
  [key: string]: RTCPeerConnection;
}

export interface DataChannels {
  [peerId: string]: RTCDataChannel;
}
