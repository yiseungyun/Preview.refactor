import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoMdAdd } from "react-icons/io";
import SearchBar from "@/components/common/SearchBar.tsx";
import Sidebar from "@components/common/Sidebar.tsx";
import Select from "@components/common/Select.tsx";
import SessionList from "@components/sessions/list/SessionList.tsx";
import axios from "axios";
import CreateButton from "@components/common/CreateButton.tsx";
import { options } from "@/constraints/CategoryData.ts";

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
  const [inProgressList, setInProgressList] = useState<Session[]>([]);
  const [listLoading, setListLoading] = useState(true);
  const [inProgressListLoading, setInProgressListLoading] = useState(true);
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>("전체");

  useEffect(() => {
    getSessionList();
  }, [selectedCategory]);

  const getSessionList = async () => {
    try {
      const response = await axios.get("/api/rooms");
      if (Array.isArray(response.data)) {
        const sessions = response.data ?? [];
        setSessionList(sessions.filter((session) => !session.inProgress));
        setInProgressList(sessions.filter((session) => session.inProgress));
        setListLoading(false);
        setInProgressListLoading(false);
      } else {
        throw new Error("세션리스트 불러오기 실패");
      }
    } catch (e) {
      console.error("세션리스트 불러오기 실패", e);
      setSessionList([]);
      setListLoading(false);
      setInProgressListLoading(false);
    }
  };

  return (
    <section className={"flex w-screen h-screen"}>
      <Sidebar />
      <div className={"flex flex-col gap-8 max-w-5xl w-full px-12 pt-20"}>
        <div>
          <h1 className={"text-bold-l mb-6"}>스터디 세션 목록</h1>
          <div className={"h-11 flex gap-2 w-full"}>
            <SearchBar text="세션을 검색하세요" />
            <Select
              value={"FE"}
              setValue={setSelectedCategory}
              options={options}
            />
            <CreateButton
              onClick={() => navigate("/sessions/create")}
              text={"새로운 세션"}
              icon={IoMdAdd}
            />
          </div>
        </div>
        <SessionList
          listTitle={"열려있는 공개 세션 목록"}
          listLoading={listLoading}
          sessionList={sessionList}
        />
        <SessionList
          listTitle={"진행 중인 세션 목록"}
          listLoading={inProgressListLoading}
          sessionList={inProgressList}
        />
      </div>
    </section>
  );
};

export default SessionListPage;
