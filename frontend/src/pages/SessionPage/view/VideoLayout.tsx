import VideoContainer from "@/components/session/VideoContainer";
import { PeerConnection } from "@/hooks/type/session";
import { useAudioDetector } from "../hooks/useAudioDetector";

interface VideoLayoutProps {
  peers: PeerConnection[];
  nickname: string;
  isMicOn: boolean;
  isVideoOn: boolean;
  stream: MediaStream | null;
  reaction: string;
  videoLoading: boolean;
  peerMediaStatus: Record<string, { audio: boolean; video: boolean }>;
  peerConnections: React.MutableRefObject<{ [key: string]: RTCPeerConnection }>;
}

const VideoLayout = ({
  peers,
  nickname,
  isMicOn,
  isVideoOn,
  stream,
  reaction,
  videoLoading,
  peerMediaStatus,
  peerConnections,
}: VideoLayoutProps) => {
  const videoCount = 1 + peers.length;
  const { speakingStates } = useAudioDetector({
    localStream: stream,
    peerConnections,
  });

  return (
    <div className="relative w-full flex-1 min-h-0 overflow-hidden">
      <div className="gap-1.5 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-wrap w-full justify-center">
        <VideoContainer
          nickname={nickname}
          isMicOn={isMicOn}
          isVideoOn={isVideoOn}
          isLocal={true}
          isSpeaking={speakingStates["local"]}
          reaction={reaction || ""}
          stream={stream!}
          videoLoading={videoLoading}
          videoCount={videoCount}
        />
        {peers.map((peer) => (
          <VideoContainer
            key={peer.peerId}
            nickname={peer.peerNickname}
            isMicOn={
              peerMediaStatus[peer.peerId]
                ? peerMediaStatus[peer.peerId].audio
                : true
            }
            isVideoOn={
              peerMediaStatus[peer.peerId]
                ? peerMediaStatus[peer.peerId].video
                : true
            }
            isLocal={false}
            isSpeaking={speakingStates[peer.peerId]}
            reaction={peer.reaction || ""}
            stream={peer.stream}
            videoCount={videoCount}
          />
        ))}
      </div>
    </div>
  );
};

export default VideoLayout;
