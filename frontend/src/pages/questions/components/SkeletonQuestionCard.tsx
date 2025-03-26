const SkeletonQuestionCard = () => {
  return <div className="relative h-40 bg-white rounded-custom-m px-5 py-6 duration-200 border-custom-s border-gray-200">
    <div className="flex-grow flex flex-col items-start">
      <div className="animate-pulse bg-gray-200 rounded h-5 w-16 py-px px-2" />
    </div>
    <div className="animate-pulse bg-gray-200 rounded h-7 w-44 mt-2.5 mb-0.5"></div>
    <div className="absolute bottom-5 left-5 right-5 flex justify-between">
      <div className="animate-pulse bg-gray-200 rounded w-12 h-5" />
      <div className="animate-pulse bg-gray-200 rounded w-10 h-5" />
    </div>
  </div>;
};
export default SkeletonQuestionCard;