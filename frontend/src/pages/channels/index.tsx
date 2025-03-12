import { Suspense, useState } from "react";
import SearchBar from "@components/common/Input/SearchBar";
import CategorySelect from "@components/common/Select/CategorySelect";
import { options } from "@/constants/CategoryData.ts";
import { Link } from "react-router-dom";
import ChannelList from "./ChannelList";
import { TabItem, TabList, TabPanel, TabProvider } from "@/components/common/Tab";
import SkeletonChannelList from "./SkeletonChannelList";
import TabListContent from "@/components/common/Tab/TabListContent";
import { IoMdAdd } from "@/components/common/Icons/IoMdAdd";

const ChannelListPage = () => {
  const [_, setSelectedCategory] = useState<string>("전체");

  return (
    <div className="flex flex-col max-w-6xl w-full px-12 pt-20 pb-4">
      <div>
        <h1 className="text-bold-l mb-6">스터디 채널</h1>
        <div className="h-11 flex gap-2 w-full">
          <div className="w-36">
            <CategorySelect
              value="FE"
              setValue={setSelectedCategory}
              options={options}
            />
          </div>
          <SearchBar text="채널 검색하기" />
        </div>
      </div>
      <TabProvider defaultTab="pending" className="mt-8">
        <TabList>
          <TabItem id="pending">대기 중인 채널</TabItem>
          <TabItem id="inProgress">진행 중인 채널</TabItem>
          <TabListContent className="absolute right-0 text-semibold-m text-gray-black pb-2 hover:text-green-400">
            <Link to="/channels/create" className="flex items-center gap-1">
              <IoMdAdd />
              <span>채널 생성하기</span>
            </Link>
          </TabListContent>
        </TabList>
        <TabPanel id="pending" className="mt-8">
          <Suspense fallback={<SkeletonChannelList />}>
            <ChannelList inProgress={false} />
          </Suspense>
        </TabPanel>
        <TabPanel id="inProgress" className="mt-8">
          <Suspense fallback={<SkeletonChannelList />}>
            <ChannelList inProgress={true} />
          </Suspense>
        </TabPanel>
      </TabProvider>
    </div>
  );
};

export default ChannelListPage;
