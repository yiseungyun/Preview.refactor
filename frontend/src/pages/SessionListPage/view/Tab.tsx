interface TabProps {
  currentTab: 0 | 1;
  tabStatus: 0 | 1;
  setCurrentTab: React.Dispatch<React.SetStateAction<0 | 1>>;
}

const tabName = {
  0: "공개된 세션",
  1: "진행 중인 세션",
};

const Tab = ({ currentTab, tabStatus, setCurrentTab }: TabProps) => {
  return (
    <button
      className={`flex flex-row gap-1
      ${currentTab === tabStatus
          ? "text-bold-s text-green-400"
          : "text-medium-l text-gray-400"
        }`}
      onClick={() => setCurrentTab(tabStatus)}
    >
      <span
        className={`px-1 pb-1.5 border-b-2
        ${currentTab === tabStatus ? "border-green-400" : "border-transparent"}`}
      >
        {tabName[tabStatus]}
      </span>
      <div
        className={`border-b-2 ${currentTab === tabStatus ? "border-green-400" : "border-transparent"} transition-all duration-200`}
      />
    </button>
  );
};

export default Tab;
