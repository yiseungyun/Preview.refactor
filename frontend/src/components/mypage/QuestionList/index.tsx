import QuestionItem from "./QuestionItem";

interface ListProps {
  tab: "myList" | "savedList";
  page: number;
}

const QuestionList = ({ tab, page }: ListProps) => {
  return (
    <div className="my-4 grid grid-cols-2 gap-3">
      {tab === "myList" ? (
        <>
          <QuestionItem questionListId={1} type="my" page={page} />
          <QuestionItem questionListId={2} type="my" page={page} />
        </>
      ) : (
        <>
          <QuestionItem questionListId={3} type="saved" page={page} />
        </>
      )}
    </div>
  );
};

export default QuestionList;
