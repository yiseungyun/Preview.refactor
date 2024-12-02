import { RoomMetadata } from "@/pages/SessionPage/types/session";
import { useEffect, useState } from "react";

interface SessionHeaderProps {
  roomMetadata: RoomMetadata | null;
  participantsCount: number;
}

const SECOND = 1000;

const SessionHeader = ({
  //participantsCount,
  roomMetadata,
}: SessionHeaderProps) => {
  const [uptime, setUptime] = useState<number>(0);

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
      className={"h-18 text-medium-xl w-full flex justify-center items-center"}
    >
      {roomMetadata?.title ? (
        <div className="flex flex-col mt-2">
          <h1 className="flex justify-center text-semibold-xl text-gray-black">
            {roomMetadata?.title}
          </h1>
          <span className={"text-medium-l text-gray-500"}>
            {/*roomMetadata &&
              `(${participantsCount} / ${roomMetadata.maxParticipants})` /* TODO: 참가자 수는 사이드바의 참가자 목록 옆에 표시하는게 좋을 듯함 */}
          </span>
          {roomMetadata.inProgress ? (
            <div className={"items-center flex gap-2 justify-center"}>
              <div>
                <span className="inline-block mr-2 rounded-full w-3 h-3 bg-red-700 animate-pulse shadow-point-1" />
                <span className="text-medium-m">스터디 진행 중</span>
              </div>
              <span className={"text-medium-r text-gray-500"}>
                {Math.floor(uptime / 60)}분 {uptime % 60}초
              </span>
            </div>
          ) : (
            <div className={"items-center flex justify-center"}>
              <span className="inline-block mr-2 rounded-full w-3 h-3 bg-gray-600 animate-pulse shadow-point-1" />
              <span className="text-medium-m">스터디 시작 전</span>
            </div>
          )}
        </div>
      ) : (
        <h1>아직 세션에 참가하지 않았습니다.</h1>
      )}
    </div>
  );
};

export default SessionHeader;
