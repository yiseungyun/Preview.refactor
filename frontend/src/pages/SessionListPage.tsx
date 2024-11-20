import { useEffect, useState } from "react";
import SessionCard from "@/components/sessions/SessionCard.tsx";
import { useNavigate } from "react-router-dom";
import { IoMdAdd } from "react-icons/io";
import SearchBar from "@/components/common/SearchBar.tsx";
import useToast from "@/hooks/useToast";
import Sidebar from "@components/common/Sidebar.tsx";
import Select from "@components/common/Select.tsx";
import axios from "axios";

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

const SessionListPage = () => {
  const [sessionList, setSessionList] = useState<Session[]>([]);
  const [listLoading, setListLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    getSessionList();
    setListLoading(false);
  }, []);

  const getSessionList = async () => {
    try {
      const response = await axios.get("/api/rooms");
      setSessionList(response.data ?? []);
    } catch (e) {
      console.error("세션리스트 불러오기 실패", e);
      const sessionData: Session[] = [
        {
          id: 1,
          title: "프론트엔드 초보만 들어올 수 있음",
          category: "프론트엔드",
          inProgress: false,
          host: {
            nickname: "J133 네모정",
            socketId: "2222",
          },
          participant: 1,
          maxParticipant: 4,
          createdAt: 1231231230,
        },
        {
          id: 2,
          title: "백엔드 고수만 들어올 수 있음",
          category: "백엔드",
          inProgress: true,
          host: {
            nickname: "J187 카드뮴",
            socketId: "2221232",
          },
          participant: 1,
          maxParticipant: 2,
          createdAt: 1231231230,
        },
      ];
      setSessionList(sessionData);
    }
  };

  const renderSessionList = (isInProgress: boolean) => {
    return sessionList.map((session) => {
      return (
        session.inProgress === isInProgress && (
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
        )
      );
    });
  };

  return (
    <section className={"flex w-screen h-screen"}>
      <Sidebar />
      <div className={"flex flex-col gap-8 max-w-7xl px-12 pt-20"}>
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
          <h2 className={"text-semibold-l mb-4"}>공개된 세션 목록</h2>
          <ul>
            {listLoading ? (
              <>loading</>
            ) : (
              <>
                {sessionList.length <= 0 ? (
                  <li>아직 아무도 세션을 열지 않았어요..!</li>
                ) : (
                  renderSessionList(false)
                )}
              </>
            )}
          </ul>
        </div>
        <div>
          <h2 className={"text-semibold-l mb-4"}>진행 중인 세션 목록</h2>
          <ul>
            {listLoading ? (
              <>loading</>
            ) : (
              <>
                {sessionList.length <= 0 ? (
                  <li>아직 아무도 세션을 열지 않았어요..!</li>
                ) : (
                  renderSessionList(true)
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
