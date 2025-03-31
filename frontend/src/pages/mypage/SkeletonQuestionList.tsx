import DeferredComponent from "@/components/Wrapper/DeferredComponent";
import SkeletonQuestionItem from "./components/SkeletonQuestionItem";

const SkeletonQuestionList = () => {
  return (
    <DeferredComponent>
      <ul className="my-4 w-full grid grid-cols-2 xl:grid-cols-3 gap-4">
        {Array(6).fill(null).map((_, index) => (
          <li key={index}><SkeletonQuestionItem /></li>
        ))}
      </ul>
    </DeferredComponent>
  );
};

export default SkeletonQuestionList;
