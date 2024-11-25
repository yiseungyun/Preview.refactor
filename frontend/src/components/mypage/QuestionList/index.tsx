import { useState } from "react";
import CategoryTap from "./CategoryTap";

type TabName = "myList" | "savedList";

const QuestionList = () => {
  const [tab, setTab] = useState<TabName>("myList");

  return (
    <div>
      <CategoryTap tab={tab} setTab={setTab} />
    </div>
  );
};

export default QuestionList;
