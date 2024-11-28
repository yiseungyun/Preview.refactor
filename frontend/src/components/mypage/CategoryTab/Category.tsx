interface Props {
  tabName: "myList" | "savedList";
  tabText: "나의 질문지" | "저장된 질문지";
  tab: "myList" | "savedList";
  setTab: (tab: "myList" | "savedList") => void;
}

const Category = ({ tabName, tabText, tab, setTab }: Props) => {
  return (
    <button
      className={`flex flex-row gap-1
      ${
        tab === tabName
          ? "text-bold-s text-green-500"
          : "text-medium-l text-gray-400"
      }`}
      onClick={() => setTab(tabName)}
    >
      <span
        className={`px-1 pb-1 border-b-2
      ${tab === tabName ? "border-green-500" : "border-gray-white"}`}
      >
        {tabText}
      </span>
    </button>
  );
};

export default Category;
