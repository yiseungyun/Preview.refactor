interface TabProps {
  currentTab: boolean;
  tabStatus: boolean;
  setCurrentTab: React.Dispatch<React.SetStateAction<boolean>>;
}

const Tab = ({ currentTab, tabStatus, setCurrentTab }: TabProps) => {
  return (
    <>
      <button
        className={`w-28 h-full  
      ${currentTab === tabStatus
            ? "text-green-600 text-semibold-r"
            : "text-semibold-r text-gray-400"
          }`}
        onClick={() => setCurrentTab(tabStatus)}
      >
        <span
          className={`block py-2
        ${currentTab === tabStatus ? " " : "border-transparent"}`}
        >
          {tabStatus ? "진행 중인 세션" : "공개된 세션"}
        </span>
      </button>
    </>
  );
};

export default Tab;
