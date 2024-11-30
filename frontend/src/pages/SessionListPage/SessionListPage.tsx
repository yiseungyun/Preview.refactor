import { useState } from "react";
import { IoMdAdd } from "react-icons/io";
import SearchBar from "@components/common/SearchBar.tsx";
import Select from "@components/common/Select.tsx";
import SessionList from "@/pages/SessionListPage/view/list/SessionList.tsx";
import CreateButton from "@components/common/CreateButton.tsx";
import { options } from "@/constants/CategoryData.ts";
import { useGetSessionList } from "@/pages/SessionListPage/api/useGetSessionList.ts";
import ErrorBlock from "@components/common/Error/ErrorBlock.tsx";
import SidebarPageLayout from "@components/layout/SidebarPageLayout.tsx";
import Divider from "@components/common/Divider.tsx";

const SessionListPage = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("전체");

  console.log(selectedCategory);

  const { data: sessions, error, isLoading: listLoading } = useGetSessionList();

  const [sessionList, inProgressList] = [
    sessions ? sessions.filter((session) => !session.inProgress) : [],
    sessions ? sessions.filter((session) => session.inProgress) : [],
  ];

  return (
    <SidebarPageLayout>
      <div className={"flex flex-col gap-8 max-w-7xl w-full px-12 pt-20 pb-4"}>
        <div>
          <h1 className={"text-bold-l mb-6"}>면접 스터디 세션 목록</h1>
          <div className={"h-11 flex gap-2 w-full"}>
            <SearchBar text="세션을 검색하세요" />
            <Select
              value={"FE"}
              setValue={setSelectedCategory}
              options={options}
            />
            <CreateButton
              path={"/sessions/create"}
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
        <Divider isText={false} />
        <SessionList
          listTitle={"진행 중인 세션 목록"}
          listLoading={listLoading}
          sessionList={inProgressList}
        />
        <ErrorBlock
          error={error}
          message={"서버에서 세션 목록을 불러오는데 실패했습니다!"}
        />
      </div>
    </SidebarPageLayout>
  );
};

export default SessionListPage;
