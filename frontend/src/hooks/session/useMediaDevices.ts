import { useEffect, useRef, useState } from "react";

type MediaStreamType = "video" | "audio";

const useMediaDevices = () => {
  // 유저의 미디어 장치 리스트
  const [userAudioDevices, setUserAudioDevices] = useState<MediaDeviceInfo[]>(
    []
  );
  const [userVideoDevices, setUserVideoDevices] = useState<MediaDeviceInfo[]>(
    []
  );

  // 유저가 선택한 미디어 장치
  const [selectedVideoDeviceId, setSelectedVideoDeviceId] =
    useState<string>("");
  const [selectedAudioDeviceId, setSelectedAudioDeviceId] =
    useState<string>("");

  // 본인 미디어 스트림
  const [stream, setStream] = useState<MediaStream | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [videoLoading, setVideoLoading] = useState<boolean>(false);

  // 미디어 온오프 상태
  const [isVideoOn, setIsVideoOn] = useState<boolean>(true);
  const [isMicOn, setIsMicOn] = useState<boolean>(true);

  useEffect(() => {
    // 비디오 디바이스 목록 가져오기
    const getUserDevices = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const audioDevices = devices.filter(
          (device) => device.kind === "audioinput"
        );
        const videoDevices = devices.filter(
          (device) => device.kind === "videoinput"
        );
        const dontHavePermission =
          devices.find((device) => device.deviceId !== "") === undefined;
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

  // 미디어 스트림 가져오기: 자신의 스트림을 가져옴
  const getMedia = async () => {
    try {
      if (streamRef.current) {
        // 이미 스트림이 있으면 종료
        streamRef.current.getTracks().forEach((track) => {
          track.stop();
        });
        setStream(null);
      }
      const myStream = await navigator.mediaDevices.getUserMedia({
        video: selectedVideoDeviceId
          ? { deviceId: selectedVideoDeviceId }
          : true,
        audio: selectedAudioDeviceId
          ? { deviceId: selectedAudioDeviceId }
          : true,
      });

      streamRef.current = myStream;
      setStream(myStream);
      return myStream;
    } catch (error) {
      console.error(
        "미디어 스트림을 가져오는 도중 문제가 발생했습니다.",
        error
      );
    }
  };

  // 특정 미디어 스트림만 가져오는 함수
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

  // 미디어 스트림 토글 관련
  const handleVideoToggle = async () => {
    try {
      // 비디오 껐다키기
      if (stream) {
        for (const videoTrack of stream.getVideoTracks()) {
          if (videoTrack.enabled) {
            // 비디오 끄기
            videoTrack.stop();
            videoTrack.enabled = false;
          } else {
            // 새로운 비디오 스트림 생성
            const videoStream = await getMediaStream("video");
            if (videoStream) {
              setVideoLoading(true);
              streamRef.current?.getVideoTracks().forEach((track) => {
                streamRef.current?.removeTrack(track);
              });
              videoStream?.getVideoTracks().forEach((track) => {
                streamRef.current?.addTrack(track);
                console.log("새로운 비디오 트랙을 추가했습니다.");
              });
            } else {
              console.error("비디오 스트림을 생성하지 못했습니다.");
            }
            setVideoLoading(false);
            setStream(streamRef.current);
          }
        }
      }
      setIsVideoOn((prev) => !prev);
    } catch (error) {
      console.error("Error stopping video stream", error);
    }
  };

  const handleMicToggle = async () => {
    try {
      if (stream) {
        for (const audioTrack of stream.getAudioTracks()) {
          if (audioTrack.enabled) {
            // 오디오 끄기
            audioTrack.stop();
            audioTrack.enabled = false;
          } else {
            // 새로운 오디오 스트림 생성
            const audioStream = await getMediaStream("audio");
            if (audioStream) {
              streamRef.current?.getAudioTracks().forEach((track) => {
                streamRef.current?.removeTrack(track);
              });
              audioStream?.getAudioTracks().forEach((track) => {
                streamRef.current?.addTrack(track);
                console.log("새로운 오디오 트랙을 추가했습니다.");
              });
            } else {
              console.error("오디오 스트림을 생성하지 못했습니다.");
            }
            setStream(streamRef.current);
          }
        }
      }
      setIsMicOn((prev) => !prev);
    } catch (error) {
      console.error("Error stopping mic stream", error);
    }
  };

  return {
    userAudioDevices,
    userVideoDevices,
    selectedAudioDeviceId,
    selectedVideoDeviceId,
    stream,
    isVideoOn,
    isMicOn,
    videoLoading,
    handleMicToggle,
    handleVideoToggle,
    setSelectedAudioDeviceId,
    setSelectedVideoDeviceId,
    getMedia,
  };
};

export default useMediaDevices;
