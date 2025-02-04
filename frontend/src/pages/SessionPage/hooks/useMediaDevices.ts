import { MutableRefObject, useEffect, useRef } from "react";
import { createDummyStream } from "./utils/createDummyStream";
import { useMediaStore } from "../stores/useMediaStore";
import { mediaStreamService } from "../services/mediaStreamService";

interface PeerConnectionsMap {
  [key: string]: RTCPeerConnection;
}

type DataChannels = MutableRefObject<{ [peerId: string]: RTCDataChannel }>;
interface DataChannelMessage {
  type: "audio" | "video";
  status: boolean;
}

const useMediaDevices = (dataChannels: DataChannels) => {
  const streamRef = useRef<MediaStream | null>(null);

  const {
    stream,
    setStream,
    setVideoLoading,
    setUserAudioDevices,
    setUserVideoDevices,
    isMicOn,
    isVideoOn,
    setIsMicOn,
    setIsVideoOn,
    selectedAudioDeviceId,
    selectedVideoDeviceId
  } = useMediaStore();

  useEffect(() => {
    const initializeDevices = async () => {
      try {
        const { audioDevices, videoDevices, hasPermission } = await mediaStreamService.getUserDevices();
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
  }, []);

  useEffect(() => {
    return () => {
      mediaStreamService.stopTracks(streamRef.current);
    };
  }, []);

  const getMedia = async () => {
    try {
      mediaStreamService.stopTracks(streamRef.current);
      setStream(null);
      setVideoLoading(true);

      const videoStream = isVideoOn
        ? await mediaStreamService.getMediaStream("video", selectedVideoDeviceId)
        : null;

      if (!videoStream) setIsVideoOn(false);

      const audioStream = isMicOn
        ? await mediaStreamService.getMediaStream("audio", selectedAudioDeviceId)
        : null;

      if (!audioStream) setIsMicOn(false);

      const combinedStream = mediaStreamService.combineTracks(videoStream, audioStream);
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
    Object.values(dataChannels.current).forEach((channel) => {
      channel.send(JSON.stringify(message));
    });
  };

  const handleVideoToggle = async (peerConnections: PeerConnectionsMap) => {
    try {
      if (!stream) return;
      setVideoLoading(true);

      if (isVideoOn) {
        stream.getAudioTracks().forEach((videoTrack) => {
          videoTrack.stop();
          const blackTrack = createDummyStream();
          Object.values(peerConnections).forEach((pc) => {
            mediaStreamService.replaceVideoTrack(pc, blackTrack);
          });
        })

        sendMessageToDataChannels({ type: "video", status: false });
      } else {
        const videoStream = await mediaStreamService.getMediaStream("video", selectedVideoDeviceId);
        if (!videoStream) return;

        const newVideoTrack = videoStream.getVideoTracks()[0];

        if (streamRef.current) {
          mediaStreamService.removeVideoTracks(streamRef.current);
          streamRef.current.addTrack(newVideoTrack);
          setStream(streamRef.current);

          Object.values(peerConnections).forEach((pc) => {
            mediaStreamService.replaceVideoTrack(pc, newVideoTrack);
          });
        }

        sendMessageToDataChannels({ type: "video", status: true });
      }
      setIsVideoOn((prev) => !prev);
    } catch (error) {
      console.error("비디오 스트림을 토글 할 수 없었습니다.", error);
    } finally {
      setVideoLoading(false);
    }
  };

  const handleMicToggle = async () => {
    try {
      if (!stream) return;

      const audioTracks = stream.getAudioTracks();
      audioTracks.forEach((track) => {
        mediaStreamService.toggleAudioTrack(track, !isMicOn);
      });

      setIsMicOn((prev) => !prev);
      sendMessageToDataChannels({ type: "audio", status: !isMicOn });
    } catch (error) {
      console.error("오디오 스트림을 토글 할 수 없었습니다.", error);
    }
  };

  return {
    handleMicToggle,
    handleVideoToggle,
    getMedia
  };
};

export default useMediaDevices;
