import Category from "./Category";

const CategoryTab = () => {
  return (
    <section className="flex items-center gap-2">
      <Category tabName="myList" tabText="나의 질문지" />
      <Category tabName="savedList" tabText="저장된 질문지" />
    </section>
  );
};

export default CategoryTab;
