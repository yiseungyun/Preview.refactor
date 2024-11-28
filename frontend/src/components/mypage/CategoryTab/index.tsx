import Category from "@components/mypage/CategoryTab/Category";

interface TabProps {
  tab: "myList" | "savedList";
  setTab: (tab: "myList" | "savedList") => void;
}

const CategoryTap = ({ tab, setTab }: TabProps) => {
  return (
    <section className="flex items-center gap-2">
      <Category
        tabName="myList"
        tabText="나의 질문지"
        tab={tab}
        setTab={setTab}
      />
      <Category
        tabName="savedList"
        tabText="저장된 질문지"
        tab={tab}
        setTab={setTab}
      />
    </section>
  );
};

export default CategoryTap;
