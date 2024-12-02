import { useEffect, useRef, useState } from "react";

interface UseAudioDetectorProps {
  peerConnections: React.MutableRefObject<{ [key: string]: RTCPeerConnection }>;
  audioThreshold?: number;
}

interface AudioLevels {
  [peerId: string]: boolean;
}

const TIMER_INTERVAL = 100;

export const useAudioDetector = ({
  peerConnections,
  audioThreshold = -45,
}: UseAudioDetectorProps) => {
  const [speakingStates, setSpeakingStates] = useState<AudioLevels>({});
  const intervalRefs = useRef<{ [key: string]: NodeJS.Timeout }>({});

  useEffect(() => {
    // 각 피어에 대해 오디오 레벨 모니터링
    Object.entries(peerConnections.current).forEach(([peerId, connection]) => {
      if (!intervalRefs.current[peerId]) {
        intervalRefs.current[peerId] = setInterval(async () => {
          try {
            const stats = await connection.getStats();
            let audioLevel = -Infinity;

            stats.forEach((report) => {
              if (report.type === "inbound-rtp" && report.kind === "audio") {
                audioLevel = report.audioLevel
                  ? 20 * Math.log10(report.audioLevel) // dB로 변환
                  : -Infinity;
              }
            });

            setSpeakingStates((prev) => ({
              ...prev,
              [peerId]: audioLevel > audioThreshold,
            }));
          } catch (error) {
            console.error(error);
          }
        }, TIMER_INTERVAL);
      }
    });

    return () => {
      Object.values(intervalRefs.current).forEach((interval) => {
        clearInterval(interval);
      });
      intervalRefs.current = {};
    };
  }, [peerConnections, audioThreshold]);

  return {
    speakingStates,
  };
};
