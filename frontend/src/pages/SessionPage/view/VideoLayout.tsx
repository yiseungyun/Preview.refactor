import VideoContainer from "@/components/session/VideoContainer";
import { useAudioDetector } from "../hooks/useAudioDetector";
import { useMediaStore } from "../stores/useMediaStore";
import { usePeerStore } from "../stores/usePeerStore";
import { useSessionStore } from "../stores/useSessionStore";
import { useReaction } from "../hooks/useReaction";
import { Socket } from "socket.io-client";

interface VideoLayoutProps {
  peerConnections: React.MutableRefObject<{ [key: string]: RTCPeerConnection }>;
  socket: Socket;
}

const VideoLayout = ({
  peerConnections,
  socket
}: VideoLayoutProps) => {
  const stream = useMediaStore(state => state.stream);
  const peers = usePeerStore(state => state.peers);
  const peerMediaStatus = usePeerStore(state => state.peerMediaStatus);
  const nickname = useSessionStore(state => state.nickname);

  const { reaction } = useReaction(socket);
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
          reaction={reaction}
          stream={stream}
        />
        {peers.map((peer) => (
          <VideoContainer
            key={peer.peerId}
            nickname={peer.peerNickname}
            isMicOn={peerMediaStatus[peer.peerId].audio}
            isVideoOn={peerMediaStatus[peer.peerId].video}
            isLocal={false}
            isSpeaking={speakingStates[peer.peerId]}
            reaction={peer.reaction}
            stream={peer.stream}
          />
        ))}
      </div>
    </div>
  );
};

export default VideoLayout;
