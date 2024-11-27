import {
  BsMic,
  BsMicMute,
  BsCameraVideo,
  BsCameraVideoOff,
} from "react-icons/bs";
import DisplayMediaStream from "./DisplayMediaStream.tsx";

interface VideoContainerProps {
  nickname: string;
  isMicOn: boolean;
  isVideoOn: boolean;
  isLocal: boolean;
  reaction: string;
  stream: MediaStream;
}

const VideoContainer = ({
  nickname,
  isMicOn,
  isVideoOn,
  isLocal,
  reaction,
  stream,
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
      <BsMicMute className="text-red-500" />
    );
  };

  const renderVideoIcon = () => {
    return isVideoOn ? (
      <BsCameraVideo className="text-white" />
    ) : (
      <BsCameraVideoOff className="text-red-500" />
    );
  };

  return (
    <div className="relative max-w-6xl h-full">
      <div className="bg-black rounded-2xl overflow-hidden aspect-4-3 h-full">
        <DisplayMediaStream mediaStream={stream} isLocal={isLocal} />
        <div className="inline-flex gap-4 absolute bottom-2 w-full justify-between px-2">
          <p className="bg-grayscale-500 bg-opacity-50 text-white px-2 py-0.5 rounded">
            {isLocal && "Me"} {nickname}
          </p>
          <div className={"inline-flex gap-4 px-2 items-center"}>
            {renderMicIcon()}
            {renderVideoIcon()}
          </div>
        </div>
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
