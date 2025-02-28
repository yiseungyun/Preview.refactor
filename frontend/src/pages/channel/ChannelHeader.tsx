import { useEffect, useRef, useState } from "react";
import { useSessionStore } from "./stores/useSessionStore";

const SECOND = 1000;

const ChannelHeader = () => {
  const startTimeRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number>();
  const [uptime, setUptime] = useState<number>(0);
  const roomMetadata = useSessionStore(state => state.roomMetadata);

  useEffect(() => {
    if (!roomMetadata.inProgress) {
      startTimeRef.current = null;
      setUptime(0);
      return;
    }

    startTimeRef.current = Date.now();
    let lastUpdate = 0;

    const updateTimer = () => {
      if (!startTimeRef.current) return;

      const now = Date.now();
      const currentSecond = Math.floor((now - startTimeRef.current) / SECOND);

      if (currentSecond !== lastUpdate) {
        setUptime(currentSecond);
        lastUpdate = currentSecond;
      }

      animationFrameRef.current = requestAnimationFrame(updateTimer);
    };

    animationFrameRef.current = requestAnimationFrame(updateTimer);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [roomMetadata.inProgress]);

  return (
    <div className="h-18 text-medium-xl w-full flex justify-center items-center">
      {roomMetadata.title ? (
        <div className="flex flex-col mt-2">
          <h1 className="flex justify-center text-semibold-xl text-gray-black">
            {roomMetadata.title}
          </h1>
          <span className="text-medium-l text-gray-500">
          </span>
          {roomMetadata.inProgress ? (
            <div className="items-center flex gap-2 justify-center">
              <div>
                <span className="inline-block mr-2 rounded-full w-3 h-3 bg-red-700 animate-pulse shadow-point-1" />
                <span className="text-medium-m">스터디 진행 중</span>
              </div>
              <span className="text-medium-r text-gray-500">
                {Math.floor(uptime / 60)}분 {uptime % 60}초
              </span>
            </div>
          ) : (
            <div className="items-center flex justify-center">
              <span className="inline-block mr-2 rounded-full w-3 h-3 bg-gray-600 animate-pulse shadow-point-1" />
              <span className="text-medium-m">스터디 시작 전</span>
            </div>
          )}
        </div>
      ) : (
        <h1>아직 채널에 참가하지 않았습니다.</h1>
      )}
    </div>
  );
};

export default ChannelHeader;
