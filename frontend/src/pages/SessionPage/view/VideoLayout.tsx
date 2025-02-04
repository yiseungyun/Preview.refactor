import VideoContainer from "@/components/session/VideoContainer";
import { PeerConnection } from "@/pages/SessionPage/types/session";
import { useAudioDetector } from "../hooks/useAudioDetector";
import { useMediaStore } from "../stores/useMediaStore";

interface VideoLayoutProps {
  peers: PeerConnection[];
  nickname: string;
  reaction: string;
  peerMediaStatus: Record<string, { audio: boolean; video: boolean }>;
  peerConnections: React.MutableRefObject<{ [key: string]: RTCPeerConnection }>;
}

const VideoLayout = ({
  peers,
  nickname,
  reaction,
  peerMediaStatus,
  peerConnections,
}: VideoLayoutProps) => {
  const stream = useMediaStore(state => state.stream);
  const videoCount = 1 + peers.length;
  const { speakingStates } = useAudioDetector({
    localStream: stream,
    peerConnections,
  });

  return (
    <div className="relative w-full flex-1 min-h-0 overflow-hidden">
      <div className="px-3.5 gap-2 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-wrap w-full justify-center">
        <VideoContainer
          nickname={nickname}
          isLocal={true}
          isSpeaking={speakingStates["local"]}
          reaction={reaction || ""}
          stream={stream!}
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
