import DeferredComponent from "@/components/common/Wrapper/DeferredComponent";
import SkeletonQuestionItem from "@/components/mypage/SkeletonQuestionItem";

const SkeletonQuestionList = () => {
  return (
    <div>
      <DeferredComponent>
        <ul className="my-4 w-full grid grid-cols-2 xl:grid-cols-3 gap-4">
          {Array(6).fill(null).map((_, index) => (
            <li key={index}><SkeletonQuestionItem /></li>
          ))}
        </ul>
      </DeferredComponent>
    </div>
  );
};

export default SkeletonQuestionList;
