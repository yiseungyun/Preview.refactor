import LoadingIndicator from "@components/common/LoadingIndicator.tsx";
import SessionCard from "@/pages/SessionListPage/view/SessionCard.tsx";
import useToast from "@hooks/useToast.ts";
import type { Session } from "@/pages/SessionListPage/types/session";
import NotFound from "@components/common/Animate/NotFound.tsx";

interface SessionListProps {
  listLoading: boolean;
  sessionList: Session[];
}

const SessionList = ({ listLoading, sessionList }: SessionListProps) => {
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
          questionListId={session.questionListId}
          questionListTitle={session.questionListTitle}
          participants={session.participants}
          maxParticipants={session.maxParticipants}
          onEnter={() => {
            toast.success("세션에 참가했습니다.");
          }}
        />
      );
    });
  };

  return (
    <div>
      {listLoading && <LoadingIndicator loadingState={listLoading} />}
      <ul className={"grid grid-cols-2 lg:grid-cols-3 gap-4"}>
        {!listLoading && sessionList.length <= 0 ? (
          <li key={-1} className={"flex justify-center items-center"}>
            <NotFound
              message={"새로운 스터디 세션을 만들어 면접 준비를 시작해보세요!"}
              className={""}
              redirect={{
                path: "/sessions/create",
                buttonText: "새로운 세션 생성하러 가기 ",
              }}
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
