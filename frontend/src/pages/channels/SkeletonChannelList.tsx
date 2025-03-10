import DeferredComponent from "@/components/common/Wrapper/DeferredComponent"
import SkeletonChannelCard from "./SkeletonChannelCard"

const SkeletonChannelList = () => {
  return (
    <DeferredComponent>
      <ul className="w-full grid grid-cols-2 lg:grid-cols-3 gap-4">
        {Array(6).fill(null).map((_, index) => (
          <li key={index}><SkeletonChannelCard /></li>
        ))}
      </ul>
    </DeferredComponent>
  )
}

export default SkeletonChannelList;