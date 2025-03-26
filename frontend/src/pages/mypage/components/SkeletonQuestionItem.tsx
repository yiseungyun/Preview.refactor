const SkeletonQuestionItem = () => {
  return (
    <div className="relative h-40 bg-white rounded-custom-m px-5 py-6 border-custom-s border-gray-200">
      <div className="relative flex flex-col w-full gap-1">
        <div className="flex flex-row gap-1 mb-2">
          <span className="animate-pulse bg-gray-200 rounded h-5 w-14 py-px px-2" />
        </div>
        <p className="animate-pulse bg-gray-200 rounded h-7 w-44" />
      </div>
      <span className="animate-pulse bg-gray-200 rounded absolute bottom-4 w-24 h-6" />
    </div>
  );
};
export default SkeletonQuestionItem;