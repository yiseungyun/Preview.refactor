interface VideoProfileOverlayProps {
  isVideoOn: boolean;
  videoLoading: boolean;
  nickname: string;
  profileImage?: string;
}

const VideoProfileOverlay = ({
  isVideoOn,
  videoLoading,
  nickname,
  profileImage,
}: VideoProfileOverlayProps) => {
  return (
    !isVideoOn &&
    !videoLoading && (
      <div
        className={
          "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-300/20 text-white  p-2 rounded-xl text-3xl overflow-hidden"
        }
      >
        {profileImage ? (
          <img
            className={"object-fill w-full h-full"}
            src={profileImage}
            alt={nickname + "프로필 이미지"}
          />
        ) : (
          <span className={"w-full text-center"}>{nickname}</span>
        )}
      </div>
    )
  );
};
export default VideoProfileOverlay;
