import { RoomMetadata } from "@hooks/type/session";

interface SessionHeaderProps {
  roomMetadata: RoomMetadata | null;
  participantsCount: number;
}

const SessionHeader = ({
  participantsCount,
  roomMetadata,
}: SessionHeaderProps) => {
  return (
    <div
      className={
        "inline-flex justify-center items-center gap-2 text-center text-medium-xl font-bold w-full pt-4 pb-2"
      }
    >
      {roomMetadata?.title ? (
        <>
          {" "}
          <span className={"bg-green-500 rounded-md px-2 py-0.5 text-white"}>
            {roomMetadata?.category}
          </span>
          <h1>{roomMetadata?.title}</h1>
          <span className={"font-light"}>
            {roomMetadata &&
              `(${participantsCount} / ${roomMetadata.maxParticipants})`}
          </span>
        </>
      ) : (
        <h1>아직 세션에 참가하지 않았습니다.</h1>
      )}
    </div>
  );
};

export default SessionHeader;
