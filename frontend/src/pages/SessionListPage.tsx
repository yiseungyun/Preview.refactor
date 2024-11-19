import { useEffect, useState } from "react";
import SessionCard from "@/components/sessions/SessionCard.tsx";
import { useNavigate } from "react-router-dom";
import { IoMdAdd } from "react-icons/io";
import SearchBar from "@/components/common/SearchBar.tsx";
import useToast from "@/hooks/useToast";
import Sidebar from "@components/common/Sidebar.tsx";
import Select from "@components/common/Select.tsx";

interface Session {
  id: number;
  title: string;
  category: string;
  sessionStatus: "open" | "close";
  host: {
    nickname: string;
  };
  participant: number;
  maxParticipant: number;
}
enum SessionStatus {
  OPEN = "open",
  CLOSE = "close",
}

const SessionListPage = () => {
  const [sessionList, setSessionList] = useState<Session[]>([]);
  const [listLoading, setListLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    const sessionData: Session[] = [
      {
        id: 1,
        title: "프론트엔드 초보만 들어올 수 있음",
        category: "프론트엔드",
        sessionStatus: "open",
        host: {
          nickname: "J133 네모정",
        },
        participant: 1,
        maxParticipant: 4,
      },
      {
        id: 2,
        title: "백엔드 초보만 들어올 수 있음",
        category: "백엔드",
        sessionStatus: "close",
        host: {
          nickname: "J000",
        },
        participant: 1,
        maxParticipant: 2,
      },
    ];

    setTimeout(() => {
      setSessionList(sessionData);
      setListLoading(false);
    }, 100);
  }, []);

  const renderSessionList = (sessionStatus: SessionStatus) => {
    return sessionList.map((session) => {
      return (
        session.sessionStatus === sessionStatus && (
          <SessionCard
            key={session.id}
            sessionStatus={session.sessionStatus}
            category={session.category}
            title={session.title}
            host={session.host.nickname}
            questionListId={1}
            participant={session.participant}
            maxParticipant={session.maxParticipant}
            onEnter={() => {
              toast.success("세션에 참가했습니다.");
              navigate(`/session/${session.id}`);
            }}
          />
        )
      );
    });
  };

  return (
    <section className={"flex w-screen h-screen "}>
      <Sidebar />
      <div className={"flex flex-col gap-8 max-w-7xl p-20"}>
        <div>
          <h1 className={"text-bold-l mb-6"}>스터디 세션 목록</h1>
          <div className={"h-11 flex gap-2 w-[47.5rem]"}>
            <SearchBar text="세션을 검색하세요" />
            <Select
              options={[
                { label: "FE", value: "FE" },
                { label: "BE", value: "BE" },
                { label: "CS", value: "CS" },
              ]}
            />
            <button
              className={
                "flex justify-center items-center fill-current min-w-11 min-h-11 bg-green-200 rounded-custom-m box-border"
              }
              onClick={() => navigate("/sessions/create")}
            >
              <IoMdAdd className="w-[1.35rem] h-[1.35rem] text-gray-white" />
            </button>
          </div>
        </div>
        <div>
          <h2 className={"text-semibold-l mb-6"}>공개된 세션 목록</h2>
          <ul>
            {listLoading ? (
              <>loading</>
            ) : (
              <>
                {sessionList.length <= 0 ? (
                  <li>아직 아무도 세션을 열지 않았어요..!</li>
                ) : (
                  renderSessionList(SessionStatus.OPEN)
                )}
              </>
            )}
          </ul>
        </div>
        <div>
          <h2 className={"text-semibold-l mb-6"}>진행 중인 세션 목록</h2>
          <ul>
            {listLoading ? (
              <>loading</>
            ) : (
              <>
                {sessionList.length <= 0 ? (
                  <li>아직 아무도 세션을 열지 않았어요..!</li>
                ) : (
                  renderSessionList(SessionStatus.CLOSE)
                )}
              </>
            )}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default SessionListPage;
