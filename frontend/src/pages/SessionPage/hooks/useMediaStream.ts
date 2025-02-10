import { MutableRefObject, useEffect, useRef } from "react";
import { createDummyStream } from "./utils/createDummyStream.ts";
import { useMediaStore } from "../stores/useMediaStore.tsx";
import { mediaManager } from "../services/mediaManager.ts";

interface PeerConnectionsMap {
  [key: string]: RTCPeerConnection;
}

type DataChannels = MutableRefObject<{ [peerId: string]: RTCDataChannel }>;
interface DataChannelMessage {
  type: "audio" | "video";
  status: boolean;
}

const useMediaStream = (dataChannels: DataChannels) => {
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
  }, []);

  useEffect(() => {
    return () => {
      mediaManager.stopTracks(streamRef.current);
    };
  }, []);

  const getMedia = async () => {
    try {
      mediaManager.stopTracks(streamRef.current);
      setStream(null);
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
    Object.values(dataChannels.current).forEach((channel) => {
      channel.send(JSON.stringify(message));
    });
  };

  const handleVideoToggle = async (peerConnections: PeerConnectionsMap) => {
    try {
      if (!stream) return;
      setVideoLoading(true);

      if (isVideoOn) {
        stream.getVideoTracks().forEach((videoTrack) => {
          videoTrack.stop();
          const blackTrack = createDummyStream();
          Object.values(peerConnections).forEach((pc) => {
            mediaManager.replaceVideoTrack(pc, blackTrack);
          });
        })

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

        streamRef.current = stream;
        setStream(stream);

        Object.values(peerConnections).forEach((pc) => {
          const sender = pc.getSenders().find(s => s.track?.kind === "video");
          if (sender) {
            sender.replaceTrack(newVideoTrack);
          }
        });

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
        mediaManager.toggleAudioTrack(track, !isMicOn);
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

export default useMediaStream;
