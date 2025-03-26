import useCategory from "./hooks/useCategory.ts";
import { Suspense, useState } from "react";
import QuestionList from "./QuestionList.tsx";
import CategorySelect from "@components/Select/CategorySelect.tsx";
import SearchBar from "@components/Input/SearchBar.tsx";
import TabProvider from "@/components/Tab/TabProvider.tsx";
import TabList from "@/components/Tab/TabList.tsx";
import TabItem from "@/components/Tab/TabItem.tsx";
import { options } from "@/constants/CategoryData.ts";
import TabListContent from "@/components/Tab/TabListContent.tsx";
import { Link } from "react-router-dom";
import TabPanel from "@/components/Tab/TabPanel.tsx";
import SkeletonQuestionList from "./SkeletonQuestionList.tsx";
import { IoMdAdd } from "@/components/Icons/index.ts";

const QuestionListPage = () => {
  const { selectedCategory, setSelectedCategory } = useCategory();
  const [page, setPage] = useState(1);

  return (
    <div className="max-w-6xl flex flex-col w-full h-full px-12 pt-20">
      <div>
        <h1 className="text-bold-l text-gray-black dark:text-white mb-6">
          질문지 리스트
        </h1>
        <div className="h-11 flex gap-2 items-stretch justify-between">
          <div className="w-36">
            <CategorySelect
              value={selectedCategory}
              setValue={setSelectedCategory}
              options={options}
            />
          </div>
          <SearchBar text="질문지 검색하기" />
        </div>
      </div>
      <TabProvider defaultTab="all" className="mt-8">
        <TabList>
          <TabItem id="all">모든 질문지</TabItem>
          <TabItem id="scrap">스크랩한 질문지</TabItem>
          <TabListContent className="absolute right-0 text-semibold-m text-gray-black pb-2 hover:text-green-400">
            <Link to="/questions/create" className="flex items-center gap-1">
              <IoMdAdd />
              <span>질문지 생성하기</span>
            </Link>
          </TabListContent>
        </TabList>
        <TabPanel id="all" className="mt-8">
          <Suspense fallback={<SkeletonQuestionList />}>
            <QuestionList
              id="ALL"
              selectedCategory={selectedCategory}
              page={page}
              setPage={setPage}
            />
          </Suspense>
        </TabPanel>
        <TabPanel id="scrap" className="mt-8">
          <Suspense fallback={<SkeletonQuestionList />}>
            <QuestionList
              id="SCRAP"
              selectedCategory={selectedCategory}
              page={page}
              setPage={setPage}
            />
          </Suspense>
        </TabPanel>
      </TabProvider>
    </div>
  );
};

export default QuestionListPage;
