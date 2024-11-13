import useSessionFormStore from "../../../../../stores/useSessionFormStore";

const CategoryTap = () => {
  const { tab, setTab } = useSessionFormStore();

  return (
    <section className="flex items-center gap-2">
      <button
        className={`flex flex-row gap-1
          ${
            tab === "myList"
              ? "text-bold-s text-green-500"
              : "text-medium-m text-gray-400"
          }`}
        onClick={() => setTab("myList")}
      >
        <span
          className={`px-1 pb-1 border-b-2
          ${tab === "myList" ? "border-green-500" : "border-gray-white"}`}
        >
          내 질문지
        </span>
      </button>
      <button
        className={`flex flex-row gap-1
          ${
            tab === "savedList"
              ? "text-bold-s text-green-500"
              : "text-medium-m text-gray-400"
          }`}
        onClick={() => setTab("savedList")}
      >
        <span
          className={`px-1 pb-1 border-b-2
          ${tab === "savedList" ? "border-green-500" : "border-gray-white"}`}
        >
          저장된 질문지
        </span>
      </button>
    </section>
  );
};

export default CategoryTap;
