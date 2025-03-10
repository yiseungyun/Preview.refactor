const SkeletonChannelCard = () => {
  return <li className="relative h-52 bg-white rounded-custom-m px-5 py-6 duration-200 border-custom-s border-gray-200">
    <div className="w-full h-full">
      <div className="flex flex-col justify-between">
        <div className="flex-grow flex flex-col items-start px-0.5">
          <div className="animate-pulse bg-gray-200 rounded w-16 h-5 text-semibold-s text-green-600 py-px px-2"></div>
          <div className="animate-pulse bg-gray-200 rounded w-28 h-6 mt-3 mb-0.5"></div>
          <div className="animate-pulse bg-gray-200 rounded w-36 h-5"></div>
          <div className="absolute bottom-5 left-6 text-medium-r flex flex-col gap-1">
            <div className="animate-pulse bg-gray-200 rounded w-24 h-4"></div>
            <div className="animate-pulse bg-gray-200 rounded w-16 h-4 flex items-center"></div>
          </div>
        </div>
      </div>
    </div>
  </li>;
};

export default SkeletonChannelCard;    