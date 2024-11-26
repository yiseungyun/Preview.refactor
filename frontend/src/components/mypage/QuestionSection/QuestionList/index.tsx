import QuestionItem from "./QuestionItem";

interface ListProps {
  tab: "myList" | "savedList";
}

const QuestionList = ({ tab }: ListProps) => {
  return (
    <div className="my-4 grid grid-cols-2 gap-3">
      {tab === "myList" ? (
        <>
          <QuestionItem type="my" />
          <QuestionItem type="my" />
        </>
      ) : (
        <>
          <QuestionItem type="saved" />
        </>
      )}
    </div>
  );
};

export default QuestionList;
