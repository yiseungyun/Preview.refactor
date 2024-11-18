type RoomStatus = "PUBLIC" | "PRIVATE";
interface RoomMetadata {
  title: string;
  status: RoomStatus;
  maxParticipants: number;
  createdAt: number;
  host: string;
}

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
      {roomMetadata?.title}{" "}
      <span className={"font-light"}>
        {" "}
        {roomMetadata &&
          `(${participantsCount} / ${roomMetadata.maxParticipants})`}
      </span>
    </h1>
  );
};

export default SessionHeader;
