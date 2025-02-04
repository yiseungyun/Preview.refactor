import { createDummyStream } from "../hooks/utils/createDummyStream.ts";

type MediaStreamType = "video" | "audio";

class MediaStreamService {
  async getUserDevices() {
    const devices = await navigator.mediaDevices.enumerateDevices();

    return {
      audioDevices: devices.filter(device => device.kind === "audioinput"),
      videoDevices: devices.filter(device => device.kind === "videoinput"),
      hasPermission: devices.some(device => device.deviceId !== "")
    };
  }

  stopTracks(stream: MediaStream | null) {
    stream?.getTracks().forEach((track) => track.stop());
  }

  combineTracks(videoStream: MediaStream | null, audioStream: MediaStream | null) {
    const tracks = [
      ...(videoStream?.getVideoTracks() || [createDummyStream()]),
      ...(audioStream?.getAudioTracks() || [])
    ]
    return new MediaStream(tracks);
  }

  async getMediaStream(
    mediaType: MediaStreamType,
    deviceId?: string,
  ) {
    try {
      const constraints = {
        video: mediaType === "video" ? (deviceId ? { deviceId } : true) : false,
        audio: mediaType === "audio" ? (deviceId ? { deviceId } : true) : false
      };

      return await navigator.mediaDevices.getUserMedia(constraints);
    } catch (error) {
      console.warn(`${mediaType} 스트림을 가져오는데 실패했습니다:`, error);
      return null;
    }
  };

  replaceVideoTrack(peerConnection: RTCPeerConnection, newTrack: MediaStreamTrack) {
    const sender = peerConnection
      .getSenders()
      .find((s) => s.track?.kind === "video");
    if (sender) {
      return sender.replaceTrack(newTrack);
    }
  }

  removeVideoTracks(stream: MediaStream) {
    const videoTracks = stream.getVideoTracks();
    videoTracks.forEach((track) => {
      track.stop();
      stream.removeTrack(track);
    });
  }

  toggleAudioTrack(audioTrack: MediaStreamTrack, enable: boolean) {
    audioTrack.enabled = enable;
  }
}

export const mediaStreamService = new MediaStreamService();