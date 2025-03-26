import { useSessionStore } from "./stores/useSessionStore";

const ChannelHeader = () => {
  const roomMetadata = useSessionStore(state => state.roomMetadata);

  return (
    <div className="h-18 text-medium-xl w-full flex justify-center items-center">
      {roomMetadata.title ? (
        <div className="flex flex-col mt-2">
          <h1 className="flex justify-center text-semibold-xl text-gray-black">
            {roomMetadata.title}
          </h1>
          <span className="text-medium-l text-gray-500">
          </span>
          {roomMetadata.inProgress ? (
            <div className="items-center justify-center w-full my-4 mx-8">
              <span className="text-bold-s">
                Q{roomMetadata.questionListContents[roomMetadata.currentIndex].index + 1}.{" "}
              </span>
              {roomMetadata.questionListContents[roomMetadata.currentIndex].content}
            </div>
          ) : (
            <div className="items-center flex justify-center">
              <span className="inline-block mr-2 rounded-full w-3 h-3 bg-gray-600 animate-pulse shadow-point-1" />
              <span className="text-medium-m">스터디 시작 전</span>
            </div>
          )}
        </div>
      ) : (
        <h1>아직 채널에 참가하지 않았습니다.</h1>
      )}
    </div>
  );
};

export default ChannelHeader;
