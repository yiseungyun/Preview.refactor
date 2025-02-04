import { MutableRefObject, useEffect, useRef } from "react";
import { createDummyStream } from "./utils/createDummyStream";
import { useMediaStore } from "../stores/useMediaStore";

type MediaStreamType = "video" | "audio";
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
    const getUserDevices = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const audioDevices = devices.filter((device) => device.kind === "audioinput");
        const videoDevices = devices.filter((device) => device.kind === "videoinput");
        const dontHavePermission = devices.find((device) => device.deviceId !== "") === undefined;
        if (dontHavePermission) {
          setUserAudioDevices([]);
          setUserVideoDevices([]);
        } else {
          setUserAudioDevices(audioDevices);
          setUserVideoDevices(videoDevices);
        }
      } catch (error) {
        console.error("미디어 기기를 찾는데 문제가 발생했습니다.", error);
      }
    };

    getUserDevices();
  }, []);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => {
          track.stop();
        });
      }
    };
  }, []);

  const getMedia = async () => {
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => {
          track.stop();
        });
        setStream(null);
      }
      setVideoLoading(true);

      let videoStream = null;
      let audioStream = null;

      try {
        videoStream = isVideoOn
          ? await navigator.mediaDevices.getUserMedia({
            video: selectedVideoDeviceId
              ? { deviceId: selectedVideoDeviceId }
              : true,
            audio: false,
          })
          : null;
      } catch (videoError) {
        console.warn("비디오 스트림을 가져오는데 실패했습니다:", videoError);
        setIsVideoOn(false);
      }

      try {
        audioStream = await navigator.mediaDevices.getUserMedia({
          video: false,
          audio: selectedAudioDeviceId
            ? { deviceId: selectedAudioDeviceId }
            : true,
        });
      } catch (audioError) {
        console.warn("오디오 스트림을 가져오는데 실패했습니다:", audioError);
        setIsMicOn(false);
      }

      let combinedStream = null;
      const tracks = [
        ...(videoStream?.getVideoTracks() || [createDummyStream()]),
        ...(audioStream?.getAudioTracks() || []),
      ];

      if (tracks.length > 0) {
        combinedStream = new MediaStream(tracks);
        streamRef.current = combinedStream;
        setStream(combinedStream);
        return combinedStream;
      } else {
        throw new Error(
          "비디오와 오디오 스트림을 모두 가져오는데 실패했습니다."
        );
      }
    } catch (error) {
      console.error(
        "미디어 스트림을 가져오는 도중 문제가 발생했습니다.",
        error
      );
    } finally {
      setVideoLoading(false);
    }
  };

  const getMediaStream = async (mediaType: MediaStreamType) => {
    try {
      return navigator.mediaDevices.getUserMedia(
        mediaType === "audio"
          ? {
            audio: selectedAudioDeviceId
              ? { deviceId: selectedAudioDeviceId }
              : true,
          }
          : {
            video: selectedVideoDeviceId
              ? { deviceId: selectedVideoDeviceId }
              : true,
          }
      );
    } catch (error) {
      console.error(error);
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
        for (const videoTrack of stream.getVideoTracks()) {
          videoTrack.stop();

          const blackTrack = createDummyStream();
          Object.values(peerConnections || {}).forEach((pc) => {
            const sender = pc
              .getSenders()
              .find((s) => s.track!.kind === "video");
            if (sender) {
              sender.replaceTrack(blackTrack);
            }
          });
        }
        setIsVideoOn((prev) => !prev);
        sendMessageToDataChannels({
          type: "video",
          status: false,
        });
      } else {
        const videoStream = await getMediaStream("video");
        if (!videoStream) return;

        const newVideoTrack = videoStream.getVideoTracks()[0];

        if (videoStream) {
          if (streamRef.current) {
            const oldVideoTracks = streamRef.current.getVideoTracks();
            oldVideoTracks.forEach((track) => {
              track.stop();
              streamRef.current?.removeTrack(track);
            });

            streamRef.current.addTrack(newVideoTrack);
            setStream(streamRef.current);

            Object.values(peerConnections || {}).forEach((pc) => {
              const sender = pc
                .getSenders()
                .find((s) => s.track!.kind === "video");
              if (sender) {
                console.log("비디오 켜기 업데이트");

                sender.replaceTrack(newVideoTrack);
              }
            });
          }
        } else {
          console.error("비디오 스트림을 생성하지 못했습니다.");
        }
        setIsVideoOn((prev) => !prev);
        sendMessageToDataChannels({
          type: "video",
          status: true,
        });
      }
    } catch (error) {
      console.error("비디오 스트림을 토글 할 수 없었습니다.", error);
    } finally {
      setVideoLoading(false);
    }
  };

  const handleMicToggle = async () => {
    try {
      if (!stream) return;

      if (isMicOn) {
        for (const audioTrack of stream.getAudioTracks()) {
          if (!audioTrack.enabled) {
            setIsMicOn((prev) => !prev);
            return;
          }
          audioTrack.enabled = false;

          setIsMicOn((prev) => !prev);
          sendMessageToDataChannels({
            type: "audio",
            status: false,
          });
        }
      } else {
        for (const audioTrack of stream.getAudioTracks()) {
          audioTrack.enabled = true;
        }
        setIsMicOn((prev) => !prev);
        sendMessageToDataChannels({
          type: "audio",
          status: true,
        });
      }
    } catch (error) {
      console.error("오디오 스트림을 토글 할 수 없었습니다.", error);
    }
  };

  return {
    handleMicToggle,
    handleVideoToggle,
    getMedia,
    getMediaStream,
  };
};

export default useMediaDevices;
