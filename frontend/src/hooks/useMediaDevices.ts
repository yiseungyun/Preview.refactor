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

        setUserAudioDevices(audioDevices);
        setUserVideoDevices(videoDevices);
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
      console.error("Error accessing media devices:", error);
    }
  };

  return {
    userAudioDevices,
    userVideoDevices,
    selectedAudioDeviceId,
    selectedVideoDeviceId,
    setSelectedAudioDeviceId,
    setSelectedVideoDeviceId,
    getMedia,
    stream,
  };
};

export default useMediaDevices;
