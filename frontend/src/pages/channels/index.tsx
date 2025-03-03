import { useState } from "react";
import { IoMdAdd } from "react-icons/io";
import SearchBar from "@components/common/Input/SearchBar";
import CategorySelect from "@components/common/Select/CategorySelect";
import { options } from "@/constants/CategoryData.ts";
import TabContainer from "./TabContainer";
import { Link } from "react-router-dom";
import { useGetChannelList } from "./hooks/useGetChannelList";
import ChannelList from "./ChannelList";

const ChannelListPage = () => {
  const [currentTab, setCurrentTab] = useState(false);
  const [_, setSelectedCategory] = useState<string>("전체");
  const { data: channelList } = useGetChannelList({ inProgress: currentTab });

  return (
    <div className="flex flex-col max-w-6xl w-full px-12 pt-20 pb-4">
      <div className="">
        <h1 className="text-bold-l mb-6">스터디 채널</h1>
        <div className={"h-11 flex gap-2 w-full"}>
          <div className="w-36">
            <CategorySelect
              value={"FE"}
              setValue={setSelectedCategory}
              options={options}
            />
          </div>
          <SearchBar text="채널을 검색하세요" />
        </div>
      </div>
      <div className="relative flex justify-between mt-4 pt-4 mb-12">
        <TabContainer currentTab={currentTab} setCurrentTab={setCurrentTab} />
        <Link
          to="/channels/create"
          className="flex items-center gap-1 text-semibold-r text-gray-black pr-1 pb-2 hover:text-green-400"
        >
          <IoMdAdd />
          <span>채널 생성하기</span>
        </Link>
        <div className="absolute bottom-0 -z-10 w-full h-0.1 bg-gray-100" />
      </div>
      <ChannelList
        inProgress={currentTab}
        channelList={channelList || []}
      />
    </div>
  );
};

export default ChannelListPage;
