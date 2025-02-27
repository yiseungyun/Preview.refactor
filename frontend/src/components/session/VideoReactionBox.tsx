interface VideoReactionBoxProps {
  reaction: string;
}

const renderReaction = (reactionType: string) => {
  switch (reactionType) {
    case "thumbs_up":
      return "👍";
    case "":
    default:
      return "";
  }
};

const VideoReactionBox = ({
  reaction,
}: VideoReactionBoxProps) => {
  return (
    <div
      className={`z-20
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
  );
};

export default VideoReactionBox;
