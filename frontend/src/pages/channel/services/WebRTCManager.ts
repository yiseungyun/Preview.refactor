import { Socket } from "socket.io-client";
import { SIGNAL_EMIT_EVENT } from "@/constants/WebSocket/SignalingEvent";
import { DataChannels, Participant, PeerConnection, PeerConnections, PeerMediaStatus, PeerMediaStatuses, User } from "./WebRTCManager.type";

const RETRY_CONNECTION_MS = 2000;

class WebRTCManager {
  private static instance: WebRTCManager | null = null;

  private socket;
  private pcConfig;
  private peerConnections: PeerConnections = {};
  private dataChannels: DataChannels = {};
  private pendingIceCandidates: Map<string, RTCIceCandidate[]> = new Map();
  private setPeers;
  private setPeerMediaStatus;
  private setParticipants;

  private constructor(
    socket: Socket,
    setPeers: (update: (prev: PeerConnection[]) => PeerConnection[]) => void,
    setPeerMediaStatus: (update: (prev: PeerMediaStatuses) => PeerMediaStatuses) => void,
    setParticipants: (
      participants: Participant[] | ((prev: Participant[]) => Participant[])
    ) => void,
  ) {
    this.socket = socket;
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
  }

  public static getInstance(
    socket: Socket,
    setPeers: (peers: PeerConnection[] | ((prev: PeerConnection[]) => PeerConnection[])) => void,
    setPeerMediaStatus: (
      status: Record<string, PeerMediaStatus> |
        ((prev: Record<string, PeerMediaStatus>) => Record<string, PeerMediaStatus>)
    ) => void,
    setParticipants: (
      participants: Participant[] | ((prev: Participant[]) => Participant[])
    ) => void,
  ): WebRTCManager {
    if (WebRTCManager.instance) {
      return WebRTCManager.instance;
    }

    WebRTCManager.instance = new WebRTCManager(
      socket,
      setPeers,
      setPeerMediaStatus,
      setParticipants,
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

  public getPeerConnection() {
    return this.peerConnections;
  }

  public getDataChannels() {
    return this.dataChannels;
  }

  private peerUpdated = (
    peerId: string,
    peerNickname: string,
    stream: MediaStream,
    peerIsHost: boolean
  ) => {
    this.setPeers((prev) => {
      const newPeers = prev.map(p =>
        p.peerId === peerId ? { ...p, stream } : p
      );

      const isNewPeer = !prev.find(p => p.peerId === peerId);

      if (isNewPeer) {
        newPeers.push({
          peerId,
          peerNickname,
          isHost: peerIsHost,
          stream,
          reaction: ""
        });

        this.setParticipants((prevParticipants) => {
          const alreadyExists = prevParticipants.some(p => p.id === peerId);
          if (alreadyExists) {
            return prevParticipants;
          }

          return [...prevParticipants, {
            id: peerId,
            nickname: peerNickname,
            isHost: peerIsHost
          }];
        });
      }

      return newPeers;
    });
  }

  private peerRemoved = (peerId: string) => {
    this.setPeers(prev => {
      return prev.filter(p => p.peerId !== peerId);
    });

    this.setParticipants(prev => {
      return prev.filter(p => p.id !== peerId);
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
      this.peerUpdated(peerSocketId, peerNickname, e.streams[0], localUser.isHost);

      const audioTracks = e.streams[0].getAudioTracks();
      const videoTracks = e.streams[0].getVideoTracks();
      this.mediaStatusChanged(peerSocketId, 'audio', audioTracks.length > 0 && audioTracks[0].enabled);
      this.mediaStatusChanged(peerSocketId, 'video', videoTracks.length > 0 && videoTracks[0].label !== "blackTrack");
    };

    pc.onconnectionstatechange = () => {
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