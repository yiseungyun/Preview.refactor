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
    <h1 className={"text-center text-medium-xl font-bold w-full pt-4 pb-2"}>
      {roomMetadata?.category} {roomMetadata?.title}{" "}
      <span className={"font-light"}>
        {" "}
        {roomMetadata &&
          `(${participantsCount} / ${roomMetadata.maxParticipants})`}
      </span>
    </h1>
  );
};

export default SessionHeader;
