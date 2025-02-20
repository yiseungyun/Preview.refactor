import { Socket } from "socket.io-client";
import { SIGNAL_EMIT_EVENT } from "@/constants/WebSocket/SignalingEvent";

interface User {
  id?: string;
  nickname: string;
  isHost?: boolean;
}

interface PeerConnection {
  peerId: string;
  peerNickname: string;
  stream: MediaStream;
  isHost?: boolean;
  reaction?: string;
}

interface PeerMediaStatus {
  audio: boolean;
  video: boolean;
}

interface PeerMediaStatuses {
  [peerId: string]: PeerMediaStatus;
}

interface Participant {
  id?: string;
  nickname: string;
  isHost: boolean;
}

interface PeerConnections {
  [key: string]: RTCPeerConnection;
}

interface DataChannels {
  [peerId: string]: RTCDataChannel;
}

const RETRY_CONNECTION_MS = 2000;

class WebRTCManager {
  private static instance: WebRTCManager | null = null;

  private socket;
  private pcConfig;
  private peerConnections;
  private dataChannels;
  private pendingIceCandidates: Map<string, RTCIceCandidate[]> = new Map();
  private setPeers;
  private setPeerMediaStatus;
  private setParticipants;
  private isHost: boolean;
  private nickname;

  private constructor(
    socket: Socket,
    peerConnections: { current: PeerConnections },
    dataChannels: { current: DataChannels },
    setPeers: (update: (prev: PeerConnection[]) => PeerConnection[]) => void,
    setPeerMediaStatus: (update: (prev: PeerMediaStatuses) => PeerMediaStatuses) => void,
    setParticipants: (participants: Participant[]) => void,
    isHost: boolean,
    nickname: string,
  ) {
    this.socket = socket;
    this.peerConnections = peerConnections.current;
    this.dataChannels = dataChannels.current;
    this.pcConfig = {
      iceServers: [{
        urls: import.meta.env.VITE_STUN_SERVER_URL,
        username: import.meta.env.VITE_STUN_USER_NAME,
        credential: import.meta.env.VITE_STUN_CREDENTIAL,
      }]
    };
    this.setPeers = setPeers;
    this.setPeerMediaStatus = setPeerMediaStatus;
    this.setParticipants = setParticipants;
    this.isHost = isHost;
    this.nickname = nickname;
  }

  public static createInstance(
    socket: Socket,
    peerConnections: { current: PeerConnections },
    dataChannels: { current: DataChannels },
    setPeers: (update: (prev: PeerConnection[]) => PeerConnection[]) => void,
    setPeerMediaStatus: (update: (prev: PeerMediaStatuses) => PeerMediaStatuses) => void,
    setParticipants: (participants: Participant[]) => void,
    isHost: boolean,
    nickname: string,
  ): WebRTCManager {
    if (WebRTCManager.instance) {
      return WebRTCManager.instance;
    }

    WebRTCManager.instance = new WebRTCManager(
      socket,
      peerConnections,
      dataChannels,
      setPeers,
      setPeerMediaStatus,
      setParticipants,
      isHost,
      nickname
    );

    return WebRTCManager.instance;
  }

  public cleanup() {
    Object.keys(this.peerConnections).forEach(peerId => {
      this.closePeerConnection(peerId);
    });
    this.peerConnections = {};
    this.dataChannels = {};
    WebRTCManager.instance = null;
  }

  private peerUpdated = (
    peerId: string,
    peerNickname: string,
    stream: MediaStream,
    peerIsHost: boolean
  ) => {
    this.setPeers(prev => {
      const newPeers = prev.map(p =>
        p.peerId === peerId ? { ...p, stream } : p
      );
      if (!prev.find(p => p.peerId === peerId)) {
        newPeers.push({
          peerId,
          peerNickname,
          isHost: peerIsHost,
          stream
        });
      }

      this.setParticipants([
        { nickname: this.nickname, isHost: this.isHost },
        ...newPeers.map((peer) => ({
          nickname: peer.peerNickname,
          isHost: peer.isHost || false,
        }))
      ]);

      return newPeers;
    });
  }

  private peerRemoved = (peerId: string) => {
    this.setPeers(prev => {
      const newPeers = prev.filter(p => p.peerId !== peerId);

      this.setParticipants([
        { nickname: this.nickname, isHost: this.isHost },
        ...newPeers.map((peer) => ({
          nickname: peer.peerNickname,
          isHost: peer.isHost || false,
        }))
      ]);

      return newPeers;
    });
  };

  private mediaStatusChanged = (peerId: string, type: "audio" | "video", status: boolean) => {
    this.setPeerMediaStatus(prev => ({
      ...prev,
      [peerId]: {
        ...prev[peerId] ?? { audio: true, video: true },
        [type]: status
      }
    }));
  };

  private handleConnectionFailure = (
    peerSocketId: string,
    peerNickname: string,
    stream: MediaStream | null,
    isOffer: boolean,
    localUser: User
  ) => {
    this.peerRemoved(peerSocketId);
    this.closePeerConnection(peerSocketId);

    setTimeout(() => {
      this.createPeerConnection(
        peerSocketId,
        peerNickname,
        stream,
        isOffer,
        localUser
      );
    }, RETRY_CONNECTION_MS);
  };

  async createPeerConnection(
    peerSocketId: string,
    peerNickname: string,
    stream: MediaStream | null,
    isOffer: boolean,
    localUser: User
  ) {
    if (this.peerConnections[peerSocketId]) {
      const existingPc = this.peerConnections[peerSocketId];

      if (existingPc.connectionState === "failed" ||
        existingPc.connectionState === "disconnected") {
        this.closePeerConnection(peerSocketId);
      } else {
        return existingPc;
      }
    }
    const pc = new RTCPeerConnection(this.pcConfig);
    this.peerConnections[peerSocketId] = pc;

    if (stream) {
      stream.getTracks().forEach((track) => {
        pc.addTrack(track, stream);
      });
    }

    pc.onicecandidate = (e: RTCPeerConnectionIceEvent) => {
      if (!e.candidate) return;

      this.socket.emit(SIGNAL_EMIT_EVENT.CANDIDATE, {
        candidateReceiveID: peerSocketId,
        candidate: e.candidate,
        candidateSendID: this.socket.id,
      });
    };

    pc.onsignalingstatechange = () => {
      const candidates = this.pendingIceCandidates.get(peerSocketId) || [];
      candidates.forEach(candidate => {
        this.socket.emit(SIGNAL_EMIT_EVENT.CANDIDATE, {
          candidateReceiveID: peerSocketId,
          candidate,
          candidateSendID: this.socket.id,
        });
      });
      this.pendingIceCandidates.delete(peerSocketId);
    };

    const mediaDataChannel = pc.createDataChannel("media-status", {
      ordered: true,
      negotiated: true,
      id: 0
    });

    mediaDataChannel.onopen = () => {
      this.dataChannels[peerSocketId] = mediaDataChannel;

      if (stream) {
        const audioTracks = stream.getAudioTracks();
        const audioEnabled = audioTracks.length > 0 && audioTracks[0].enabled;
        const videoTracks = stream.getVideoTracks();
        const videoEnabled = videoTracks.length > 0 && videoTracks[0].label !== "blackTrack";

        mediaDataChannel.send(JSON.stringify({ type: "audio", status: audioEnabled }));
        mediaDataChannel.send(JSON.stringify({ type: "video", status: videoEnabled }));
      }
    };

    mediaDataChannel.onmessage = (e) => {
      const data = JSON.parse(e.data);
      this.mediaStatusChanged(peerSocketId, data.type, data.status);
    };

    mediaDataChannel.onclose = () => {
      delete this.dataChannels[peerSocketId];
    };

    pc.ontrack = (e) => {
      this.peerUpdated(peerSocketId, peerNickname, e.streams[0], localUser.isHost || false);

      const audioTracks = e.streams[0].getAudioTracks();
      const videoTracks = e.streams[0].getVideoTracks();
      this.mediaStatusChanged(peerSocketId, 'audio', audioTracks.length > 0 && audioTracks[0].enabled);
      this.mediaStatusChanged(peerSocketId, 'video', videoTracks.length > 0 && videoTracks[0].label !== "blackTrack");
    };

    pc.onconnectionstatechange = () => {
      console.log(`Connection state changed for peer ${peerSocketId}: ${pc.connectionState}`);
      console.log(`ICE connection state: ${pc.iceConnectionState}`);
      console.log(`Signaling state: ${pc.signalingState}`);
      if (pc.connectionState === "connected") {
        console.log("Peer connection fully established");
        // 연결이 완료되면 스트림 상태 재확인
        const senders = pc.getSenders();
        console.log("Active senders:", senders);
      }
      if (pc.connectionState === "disconnected" || pc.connectionState === "failed") {
        this.handleConnectionFailure(peerSocketId, peerNickname, stream, isOffer, localUser);
      }
    };

    if (isOffer) {
      try {
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);

        if (this.socket && pc.localDescription) {
          this.socket.emit(SIGNAL_EMIT_EVENT.OFFER, {
            offerReceiveID: peerSocketId,
            sdp: pc.localDescription,
            offerSendID: this.socket.id,
            offerSendNickname: localUser.nickname,
          });
        }
      } catch (error) {
        console.error(error);
      }
    }

    return pc;
  };

  closePeerConnection(peerSocketId: string) {
    if (this.peerConnections[peerSocketId]) {
      const pc = this.peerConnections[peerSocketId];

      pc.ontrack = null;
      pc.onicecandidate = null;
      pc.oniceconnectionstatechange = null;
      pc.onconnectionstatechange = null;
      pc.onsignalingstatechange = null;

      delete this.peerConnections[peerSocketId];
      delete this.dataChannels[peerSocketId];
      pc.close();

      this.peerRemoved(peerSocketId);
    }
  };
}

export default WebRTCManager;  