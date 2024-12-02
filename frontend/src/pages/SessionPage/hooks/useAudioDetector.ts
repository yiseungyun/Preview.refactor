import { useEffect, useRef, useState } from "react";

interface UseAudioDetectorProps {
  peerConnections: React.MutableRefObject<{ [key: string]: RTCPeerConnection }>;
  audioThreshold?: number;
}

interface AudioLevels {
  [peerId: string]: boolean;
}

const CHECK_PEERCONNECTION = 1000;
const TIMER_INTERVAL = 100;

export const useAudioDetector = ({
  peerConnections,
  audioThreshold = -30,
}: UseAudioDetectorProps) => {
  const [speakingStates, setSpeakingStates] = useState<AudioLevels>(() => {
    return Object.keys(peerConnections.current).reduce(
      (acc, peerId) => ({
        ...acc,
        [peerId]: false,
      }),
      {}
    );
  });
  const intervalRefs = useRef<{ [key: string]: NodeJS.Timeout }>({});
  const [connectionCount, setConnectionCount] = useState(0);

  useEffect(() => {
    const checkConnections = setInterval(() => {
      const currentCount = Object.keys(peerConnections.current).length;
      if (currentCount !== connectionCount) {
        setConnectionCount(currentCount);
      }
    }, CHECK_PEERCONNECTION);

    return () => clearInterval(checkConnections);
  }, [peerConnections, connectionCount]);

  useEffect(() => {
    if (connectionCount === 0) return;

    // 각 피어에 대해 오디오 레벨 모니터링
    Object.entries(peerConnections.current).forEach(([peerId, connection]) => {
      if (intervalRefs.current[peerId]) {
        clearInterval(intervalRefs.current[peerId]);
      }

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
  }, [connectionCount]);

  return { speakingStates };
};
