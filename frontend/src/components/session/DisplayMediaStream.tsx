import { useEffect, useRef } from "react";

interface DisplayMediaStreamProps {
  mediaStream: MediaStream | null;
  isLocal: boolean;
}
const DisplayMediaStream = ({
  mediaStream,
  isLocal,
}: DisplayMediaStreamProps) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (mediaStream !== null && videoRef.current) {
      videoRef.current.srcObject = mediaStream;
    } else if (videoRef.current && mediaStream === null) {
      videoRef.current.srcObject = null;
    }
  }, [mediaStream]);

  return (
    <video
      ref={videoRef}
      autoPlay
      playsInline
      muted={isLocal}
      className="h-full aspect-4-3"
    />
  );
};

export default DisplayMediaStream;
