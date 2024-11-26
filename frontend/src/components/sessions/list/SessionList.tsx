import LoadingIndicator from "@components/common/LoadingIndicator.tsx";
import SessionCard from "@components/sessions/SessionCard.tsx";
import useToast from "@hooks/useToast.ts";
import { useNavigate } from "react-router-dom";

interface Session {
  id: number;
  title: string;
  category?: string;
  inProgress: boolean;
  host: {
    nickname?: string;
    socketId: string;
  };
  participant: number; // 현재 참여자
  maxParticipant: number;
  createdAt: number;
}

interface SessionListProps {
  listTitle: string;
  listLoading: boolean;
  sessionList: Session[];
}

const SessionList = ({
  listTitle,
  listLoading,
  sessionList,
}: SessionListProps) => {
  const toast = useToast();
  const navigate = useNavigate();

  const renderSessionList = () => {
    return sessionList.map((session) => {
      return (
        <SessionCard
          key={session.id}
          inProgress={session.inProgress}
          category={session.category}
          title={session.title}
          host={session.host.nickname ?? "익명"}
          questionListId={1}
          participant={session.participant}
          maxParticipant={session.maxParticipant}
          onEnter={() => {
            toast.success("세션에 참가했습니다.");
            navigate(`/session/${session.id}`);
          }}
        />
      );
    });
  };

  return (
    <div>
      <h2 className={"text-semibold-l mb-4"}>{listTitle}</h2>
      {listLoading && <LoadingIndicator loadingState={listLoading} />}
      <ul className={"flex flex-col gap-4"}>
        {!listLoading && sessionList.length <= 0 ? (
          <li key={-1}>아직 아무도 세션을 열지 않았어요..!</li>
        ) : (
          renderSessionList()
        )}
      </ul>
    </div>
  );
};

export default SessionList;
