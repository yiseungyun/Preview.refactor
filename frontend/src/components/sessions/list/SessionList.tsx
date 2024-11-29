import LoadingIndicator from "@components/common/LoadingIndicator.tsx";
import SessionCard from "@components/sessions/SessionCard.tsx";
import useToast from "@hooks/useToast.ts";
import type { Session } from "@/pages/SessionListPage/types/session";
import NotFound from "@components/common/Animate/NotFound.tsx";

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
          <li key={-1} className={"flex justify-start"}>
            <NotFound
              message={"새로운 스터디 세션을 만들어 면접 준비를 시작해보세요!"}
              className={""}
            />
          </li>
        ) : (
          renderSessionList()
        )}
      </ul>
    </div>
  );
};

export default SessionList;
