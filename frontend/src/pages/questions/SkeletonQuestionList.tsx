import DeferredComponent from "@/components/Wrapper/DeferredComponent"
import SkeletonQuestionCard from "./components/SkeletonQuestionCard";

const SkeletonQuestionList = () => {
  return (
    <DeferredComponent>
      <ul className="w-full grid grid-cols-2 lg:grid-cols-3 gap-4">
        {Array(12).fill(null).map((_, index) => (
          <li key={index}><SkeletonQuestionCard /></li>
        ))}
      </ul>
    </DeferredComponent>
  )
}

export default SkeletonQuestionList;