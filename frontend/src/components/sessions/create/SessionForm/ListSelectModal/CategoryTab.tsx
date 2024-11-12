interface Props {
  tab: "myList" | "savedList";
  setTab: (tab: "myList" | "savedList") => void;
}

const CategoryTap = ({ tab, setTab }: Props) => {
  return (
    <section className="flex items-center gap-2">
      <button
        className={`flex flex-row gap-1
          ${tab === "myList"
            ? "text-bold-s text-green-500"
            : "text-medium-m text-gray-400"
          }`}
        onClick={() => setTab("myList")}
      >
        <span>내 질문지</span>
        <div
          className={`w-0.375 h-0.375 rounded-2xl mt-0.375
          ${tab === "myList" ? "bg-green-500" : "null"}`}
        />
      </button>
      <button
        className={`flex flex-row gap-1
          ${tab === "savedList"
            ? "text-bold-s text-green-500"
            : "text-medium-m text-gray-400"
          }`}
        onClick={() => setTab("savedList")}
      >
        <span>저장된 질문지</span>
        <div
          className={`w-0.375 h-0.375 rounded-2xl mt-0.375
          ${tab === "savedList" ? "bg-green-500" : "null"}`}
        />
      </button>
    </section>
  );
};

export default CategoryTap;
