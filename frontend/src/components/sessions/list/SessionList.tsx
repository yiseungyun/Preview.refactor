import LoadingIndicator from "@components/common/LoadingIndicator.tsx";
import SessionCard from "@components/sessions/SessionCard.tsx";
import useToast from "@hooks/useToast.ts";
import type { Session } from "@/pages/SessionListPage/types/session";

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

  const renderSessionList = () => {
    return sessionList.map((session) => {
      return (
        <SessionCard
          key={session.id}
          id={session.id}
          inProgress={session.inProgress}
          category={session.category}
          title={session.title}
          host={session.host.nickname ?? "익명"}
          questionListId={1}
          participant={session.participants}
          maxParticipant={session.maxParticipants}
          onEnter={() => {
            toast.success("세션에 참가했습니다.");
          }}
        />
      );
    });
  };

  return (
    <div>
      <h2 className={"text-semibold-l mb-4"}>{listTitle}</h2>
      {listLoading && <LoadingIndicator loadingState={listLoading} />}
      <ul className={"grid grid-cols-1 xl:grid-cols-2 gap-4"}>
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
