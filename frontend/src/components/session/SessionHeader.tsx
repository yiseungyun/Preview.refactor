import { RoomMetadata } from "@hooks/type/session";
import { useEffect, useState } from "react";

interface SessionHeaderProps {
  roomMetadata: RoomMetadata | null;
  participantsCount: number;
}

const SessionHeader = ({
  participantsCount,
  roomMetadata,
}: SessionHeaderProps) => {
  const [uptime, setUptime] = useState<number>(0);
  const SECOND = 1000;
  useEffect(() => {
    if (!roomMetadata?.inProgress) return;
    const interval = setInterval(() => {
      setUptime((prev) => prev + 1);
    }, SECOND);

    return () => {
      clearInterval(interval);
    };
  }, [roomMetadata?.inProgress]);

  return (
    <div
      className={
        "inline-flex justify-center items-center gap-2 text-center text-medium-xl font-bold w-full pt-4 pb-2"
      }
    >
      {roomMetadata?.title ? (
        <>
          <span className={"bg-green-500 rounded-md px-2 py-0.5 text-white"}>
            {roomMetadata?.category}
          </span>
          <h1>{roomMetadata?.title}</h1>
          <span className={"font-light"}>
            {roomMetadata &&
              `(${participantsCount} / ${roomMetadata.maxParticipants})`}
          </span>
          {roomMetadata.inProgress ? (
            <span className={"inline-flex items-center ml-4"}>
              <span
                className={
                  "inline-block mr-2 rounded-full w-4 h-4 bg-red-700 animate-pulse shadow-red-500"
                }
              ></span>
              <span>스터디 진행 중</span>
              <span className={"ml-2 w-16"}>
                {Math.floor(uptime / 60)}분 {uptime % 60}초
              </span>
            </span>
          ) : (
            <span>
              <span className={"w-3 h-3 bg-gray-300  "}></span>
              스터디 시작 전
            </span>
          )}
        </>
      ) : (
        <h1>아직 세션에 참가하지 않았습니다.</h1>
      )}
    </div>
  );
};

export default SessionHeader;
