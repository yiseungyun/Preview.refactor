import { useEffect, useState } from "react";

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
      if (stream) {
        // 이미 스트림이 있으면 종료
        stream.getTracks().forEach((track) => {
          track.stop();
        });
      }
      const myStream = await navigator.mediaDevices.getUserMedia({
        video: selectedVideoDeviceId
          ? { deviceId: selectedVideoDeviceId }
          : true,
        audio: selectedAudioDeviceId
          ? { deviceId: selectedAudioDeviceId }
          : true,
      });

      setStream(myStream);
      return myStream;
    } catch (error) {
      console.error(
        "미디어 스트림을 가져오는 도중 문제가 발생했습니다.",
        error
      );
    }
  };

  // 미디어 스트림 토글 관련
  const handleVideoToggle = () => {
    try {
      // 비디오 껐다키기
      if (stream) {
        stream.getVideoTracks().forEach((videoTrack) => {
          videoTrack.enabled = !videoTrack.enabled;
        });
      }
      setIsVideoOn((prev) => !prev);
    } catch (error) {
      console.error("Error stopping video stream", error);
    }
  };

  const handleMicToggle = () => {
    try {
      if (stream) {
        stream.getAudioTracks().forEach((audioTrack) => {
          audioTrack.enabled = !audioTrack.enabled;
        });
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
    handleMicToggle,
    handleVideoToggle,
    setSelectedAudioDeviceId,
    setSelectedVideoDeviceId,
    getMedia,
  };
};

export default useMediaDevices;
