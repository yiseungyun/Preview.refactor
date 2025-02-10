import { Socket } from "socket.io-client";
import { SIGNAL_EMIT_EVENT } from "@/constants/WebSocket/SignalingEvent";
import { EventEmitter } from "../services/EventEmitter.ts";

interface User {
  id?: string;
  nickname: string;
  isHost?: boolean;
}

interface PeerConnections {
  [key: string]: RTCPeerConnection;
}

interface DataChannels {
  [peerId: string]: RTCDataChannel;
}

const RETRY_CONNECTION_MS = 2000;

class WebRTCManager {
  private socket: Socket;
  private pcConfig: RTCConfiguration;
  private peerConnections: PeerConnections;
  private dataChannels: DataChannels;
  private eventEmitter: EventEmitter;

  constructor(
    socket: Socket,
    peerConnections: { current: PeerConnections },
    dataChannels: { current: DataChannels },
    eventEmitter: EventEmitter
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
    this.eventEmitter = eventEmitter;
  }

  private handleTrackEvent(e: RTCTrackEvent, peerSocketId: string, peerNickname: string, isHost: boolean) {
    requestAnimationFrame(() => {
      this.eventEmitter.emit('peer:updated', {
        peerId: peerSocketId,
        peerNickname,
        stream: e.streams[0],
        isHost
      });
    });

    const audioTracks = e.streams[0].getAudioTracks();
    const videoTracks = e.streams[0].getVideoTracks();

    this.eventEmitter.emit('media:statusChanged', {
      peerId: peerSocketId,
      type: 'audio',
      status: audioTracks.length > 0 && audioTracks[0].enabled
    });

    this.eventEmitter.emit('media:statusChanged', {
      peerId: peerSocketId,
      type: 'video',
      status: videoTracks.length > 0 && videoTracks[0].label !== "blackTrack"
    });
  }

  private handleConnectionFailure = (peerSocketId: string, peerNickname: string, stream: MediaStream | null, isOffer: boolean, localUser: User) => {
    this.eventEmitter.emit('peer:removed', peerSocketId);

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
      return this.peerConnections[peerSocketId];
    }

    console.log("새로운 Peer Connection 생성:", {
      peerSocketId,
      peerNickname,
      isOffer,
      localUser,
    });

    const pc = new RTCPeerConnection(this.pcConfig);
    this.peerConnections[peerSocketId] = pc;

    if (stream) {
      stream.getTracks().forEach((track) => {
        pc.addTrack(track, stream);
      });
    }

    pc.onicecandidate = (e: RTCPeerConnectionIceEvent) => {
      if (e.candidate && this.socket) {
        this.socket.emit(SIGNAL_EMIT_EVENT.CANDIDATE, {
          candidateReceiveID: peerSocketId,
          candidate: e.candidate,
          candidateSendID: this.socket.id,
        });
      }
    };

    const mediaDataChannel = pc.createDataChannel("media-status", { ordered: true });

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

    mediaDataChannel.onclose = () => {
      delete this.dataChannels[peerSocketId];
    };

    pc.ondatachannel = (event) => {
      const channel = event.channel;

      channel.onmessage = (e) => {
        const data = JSON.parse(e.data);
        this.eventEmitter.emit('media:statusChanged', {
          peerId: peerSocketId,
          ...data
        });
      };
    };

    pc.ontrack = (e) => {
      this.handleTrackEvent(e, peerSocketId, peerNickname, localUser.isHost || false);
    };

    pc.onconnectionstatechange = () => {
      if (pc.connectionState === "disconnected" || pc.connectionState === "failed") {
        this.handleConnectionFailure(peerSocketId, peerNickname, stream, isOffer, localUser);
      } else if (pc.connectionState === "closed") {
        this.closePeerConnection(peerSocketId);
      }
    };

    pc.oniceconnectionstatechange = () => {
      if (pc.iceConnectionState === "disconnected" || pc.iceConnectionState === "failed") {
        this.handleConnectionFailure(peerSocketId, peerNickname, stream, isOffer, localUser);
      } else if (pc.connectionState === "closed") {
        this.closePeerConnection(peerSocketId);
      }
    };

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

      this.eventEmitter.emit('peer:removed', peerSocketId);
    }
  };
}

export default WebRTCManager;