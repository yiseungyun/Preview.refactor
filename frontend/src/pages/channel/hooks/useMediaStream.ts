import { useEffect, useRef } from "react";
import { createDummyStream } from "./utils/createDummyStream.ts";
import { useMediaStore } from "../stores/useMediaStore.tsx";
import { mediaManager } from "../services/MediaManager.ts";
import WebRTCManager from "../services/WebRTCManager.ts";
import { Socket } from "socket.io-client";
import { usePeerStore } from "../stores/usePeerStore.tsx";
import { useSessionStore } from "../stores/useSessionStore.tsx";

interface DataChannelMessage {
  type: "audio" | "video";
  status: boolean;
}

const useMediaStream = (socket: Socket) => {
  const streamRef = useRef<MediaStream | null>(null);
  const setPeers = usePeerStore(state => state.setPeers);
  const setPeerMediaStatus = usePeerStore(state => state.setPeerMediaStatus);
  const setParticipants = useSessionStore(state => state.setParticipants);
  const stream = useMediaStore(state => state.stream);
  const setStream = useMediaStore(state => state.setStream);
  const setVideoLoading = useMediaStore(state => state.setVideoLoading);
  const setUserAudioDevices = useMediaStore(state => state.setUserAudioDevices);
  const setUserVideoDevices = useMediaStore(state => state.setUserVideoDevices);
  const isMicOn = useMediaStore(state => state.isMicOn);
  const isVideoOn = useMediaStore(state => state.isVideoOn);
  const setIsMicOn = useMediaStore(state => state.setIsMicOn);
  const setIsVideoOn = useMediaStore(state => state.setIsVideoOn);
  const selectedAudioDeviceId = useMediaStore(state => state.selectedAudioDeviceId);
  const selectedVideoDeviceId = useMediaStore(state => state.selectedVideoDeviceId);

  const webRTCManagerRef = useRef<WebRTCManager | null>(null);

  useEffect(() => {
    if (!socket) return;

    webRTCManagerRef.current = WebRTCManager.getInstance(
      socket,
      setPeers,
      setPeerMediaStatus,
      setParticipants,
    )
    const initializeDevices = async () => {
      try {
        const { audioDevices, videoDevices, hasPermission } = await mediaManager.getUserDevices();
        if (!hasPermission) {
          setUserAudioDevices([]);
          setUserVideoDevices([]);
          return;
        }
        setUserAudioDevices(audioDevices);
        setUserVideoDevices(videoDevices);
      } catch (error) {
        console.error("미디어 기기를 찾는데 문제가 발생했습니다.", error);
      }
    };

    initializeDevices();

    return () => {
      mediaManager.stopTracks(streamRef.current);
      setStream(null);
    };
  }, [socket]);

  const getMedia = async () => {
    try {
      mediaManager.stopTracks(streamRef.current);
      setVideoLoading(true);

      const videoStream = isVideoOn
        ? await mediaManager.getMediaStream("video", selectedVideoDeviceId)
        : null;

      if (!videoStream) setIsVideoOn(false);

      const audioStream = isMicOn
        ? await mediaManager.getMediaStream("audio", selectedAudioDeviceId)
        : null;

      if (!audioStream) setIsMicOn(false);

      const combinedStream = mediaManager.combineTracks(videoStream, audioStream);
      streamRef.current = combinedStream;
      setStream(combinedStream);
      return combinedStream;
    } catch (error) {
      console.error("미디어 스트림을 가져오는 도중 문제가 발생했습니다.", error);
    } finally {
      setVideoLoading(false);
    }
  };

  const sendMessageToDataChannels = (message: DataChannelMessage) => {
    if (!webRTCManagerRef.current) return;

    const dataChannels = webRTCManagerRef.current.getDataChannels();
    Object.values(dataChannels).forEach((channel) => {
      channel.send(JSON.stringify(message));
    });
  };

  const handleVideoToggle = async () => {
    try {
      if (!stream || !webRTCManagerRef.current) return;
      setVideoLoading(true);

      const peerConnections = webRTCManagerRef.current.getPeerConnection();

      if (isVideoOn) {
        const blackTrack = createDummyStream();
        stream.getVideoTracks().forEach((track) => {
          stream.removeTrack(track);
          track.stop();
        });
        stream.addTrack(blackTrack);

        await Promise.all(Object.values(peerConnections).map(async (pc) => {
          await mediaManager.replaceVideoTrack(pc, blackTrack);
        }));

        sendMessageToDataChannels({ type: "video", status: false });
      } else {
        const videoStream = await mediaManager.getMediaStream("video", selectedVideoDeviceId);
        if (!videoStream) return;

        const newVideoTrack = videoStream.getVideoTracks()[0];

        stream.getVideoTracks().forEach(track => {
          stream.removeTrack(track);
          track.stop();
        });

        stream.addTrack(newVideoTrack);

        await Promise.all(Object.values(peerConnections).map(async (pc) => {
          await mediaManager.replaceVideoTrack(pc, newVideoTrack);
        }));

        streamRef.current = stream;
        setStream(stream);
        sendMessageToDataChannels({ type: "video", status: true });
      }
      setIsVideoOn((prev) => !prev);
    } catch (error) {
      console.error("비디오 설정을 변경할 수 없습니다.", error);
    } finally {
      setVideoLoading(false);
    }
  };

  const handleMicToggle = async () => {
    try {
      if (!stream) return;

      const audioTracks = stream.getAudioTracks();
      audioTracks.forEach((track) => {
        mediaManager.toggleAudioTrack(track, !isMicOn);
      });

      setIsMicOn((prev) => !prev);
      sendMessageToDataChannels({ type: "audio", status: !isMicOn });
    } catch (error) {
      console.error("오디오 설정을 변경할 수 없습니다.", error);
    }
  };

  return {
    handleMicToggle,
    handleVideoToggle,
    getMedia
  };
};

export default useMediaStream;
