import {
  BsMic,
  BsMicMute,
  BsCameraVideo,
  BsCameraVideoOff,
} from "react-icons/bs";
import DisplayMediaStream from "./DisplayMediaStream.tsx";
import LoadingIndicator from "@components/common/LoadingIndicator.tsx";

interface VideoContainerProps {
  nickname: string;
  isMicOn: boolean;
  isVideoOn: boolean;
  isLocal: boolean;
  reaction: string;
  stream: MediaStream;
  videoLoading?: boolean;
  videoCount: number;
}

const getVideoLayoutClass = (count: number) => {
  switch (count) {
    case 1:
      return "w-full";
    case 2:
      return "w-full sm:w-1/2";
    case 3:
      return "w-full sm:w-1/2 2xl:w-1/3";
    case 4:
      return "w-full sm:w-1/2";
    case 5:
      return "w-full sm:w-1/2 md:w-1/3";
  }
};

const VideoContainer = ({
  nickname,
  isMicOn,
  isVideoOn,
  isLocal,
  reaction,
  stream,
  videoLoading,
  videoCount,
}: VideoContainerProps) => {
  const renderReaction = (reactionType: string) => {
    switch (reactionType) {
      case "thumbs_up":
        return "👍";
      case "":
      default:
        return "";
    }
  };

  const renderMicIcon = () => {
    return isMicOn ? (
      <BsMic className="text-white" />
    ) : (
      <BsMicMute className="text-point-1" />
    );
  };

  const renderVideoIcon = () => {
    return isVideoOn ? (
      <BsCameraVideo className="text-white" />
    ) : (
      <BsCameraVideoOff className="text-point-1" />
    );
  };

  return (
    <div className={`relative aspect-[4/3] ${getVideoLayoutClass(videoCount)}`}>
      <div className="absolute inset-0 bg-black rounded-custom-l overflow-hidden">
        <DisplayMediaStream mediaStream={stream} isLocal={isLocal} />
        <div className="inline-flex gap-4 absolute bottom-2 w-full justify-between px-2">
          <p className="bg-grayscale-500 bg-opacity-50 text-white px-2 py-0.5 rounded">
            {nickname}
          </p>
          <div className={"inline-flex gap-4 px-2 items-center"}>
            {renderMicIcon()}
            {renderVideoIcon()}
          </div>
        </div>
        {videoLoading && (
          <div
            className={
              "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white animate-pulse text-3xl"
            }
          >
            <LoadingIndicator loadingState={videoLoading} type={"spinner"} />
          </div>
        )}
      </div>
      {
        <div
          className={`
              pointer-events-none
              absolute w-12 h-12 text-xl 
              flex items-center justify-center 
              top-2 right-2 text-white p-2 rounded-xl 
              bg-accent-gray bg-opacity-50
              transition-all duration-300
              animate-fade-in-out
              ${reaction ? "opacity-100" : "opacity-0"}
            `}
        >
          <span className="animate-bounce">{renderReaction(reaction)}</span>
        </div>
      }
    </div>
  );
};

export default VideoContainer;
