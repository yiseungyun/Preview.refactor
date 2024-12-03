import LoadingIndicator from "@components/common/LoadingIndicator.tsx";
import SessionCard from "@/pages/SessionListPage/view/SessionCard.tsx";
import useToast from "@hooks/useToast.ts";
import type { Session } from "@/pages/SessionListPage/types/session";
import NotFound from "@components/common/Animate/NotFound.tsx";

interface SessionListProps {
  inProgress: boolean;
  listLoading: boolean;
  sessionList: Session[];
}

const SessionList = ({ inProgress, listLoading, sessionList }: SessionListProps) => {
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
      {!listLoading && sessionList.length <= 0 ? (
        <div key={-1} className={"flex justify-center items-center"}>
          <NotFound
            message={
              inProgress ? "현재 진행 중인 세션이 없어요.\n세션을 생성해서 면접 연습을 시작하세요!"
                : "공개된 세션이 없어요.\n세션을 생성해서 면접 연습을 시작하세요!"
            }
            className={""}
          />
        </div>
      ) : (
        <ul className={"w-full grid grid-cols-2 lg:grid-cols-3 gap-4"}>
          {renderSessionList()}
        </ul>
      )}
    </div>
  );
};

export default SessionList;
