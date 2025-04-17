import DisplayMediaStream from "./DisplayMediaStream.tsx";
import LoadingIndicator from "@/components/LoadingIndicator.tsx";
import VideoProfileOverlay from "./VideoProfileOverlay.tsx";
import VideoReactionBox from "./VideoReactionBox.tsx";
import { useMediaStore } from "@/pages/channel/stores/useMediaStore.tsx";
import { usePeerStore } from "@/pages/channel/stores/usePeerStore.tsx";
import { BsCameraVideoOff, BsCameraVideo, BsMic, BsMicMute } from "@/components/Icons";
import { useEffect, useMemo, useState } from "react";
import { breakpoints } from "@/utils/breakpoints.ts";

interface VideoContainerProps {
  nickname: string | null;
  isLocal: boolean;
  isSpeaking: boolean;
  reaction: string;
  stream: MediaStream | null;
  isMicOn?: boolean;
  isVideoOn?: boolean;
}

interface LayoutConfig {
  breakpoint: string;
  maxVideoPerRow: Record<number, number>;
}

const layoutConfig: LayoutConfig[] = [{
  breakpoint: "default",
  maxVideoPerRow: {
    1: 1, 2: 1, 3: 1, 4: 1, 5: 1
  }
}, {
  breakpoint: "xs",
  maxVideoPerRow: {
    1: 1, 2: 1, 3: 1, 4: 1, 5: 2
  }
}, {
  breakpoint: "sm",
  maxVideoPerRow: {
    1: 1, 2: 1, 3: 1, 4: 1, 5: 2
  }
}, {
  breakpoint: "md",
  maxVideoPerRow: {
    1: 1, 2: 2, 3: 2, 4: 2, 5: 2
  }
}, {
  breakpoint: "2xl",
  maxVideoPerRow: {
    1: 1, 2: 2, 3: 3, 4: 2, 5: 3
  }
}]

const VideoContainer = ({
  nickname,
  isLocal,
  isSpeaking,
  reaction,
  stream,
  isVideoOn = false,
  isMicOn = false
}: VideoContainerProps) => {
  const [breakpoint, setBreakpoint] = useState("default");
  isMicOn = isLocal ? useMediaStore(state => state.isMicOn) : isMicOn;
  isVideoOn = isLocal ? useMediaStore(state => state.isVideoOn) : isVideoOn;
  const videoLoading = isLocal ? useMediaStore(state => state.videoLoading) : null;
  const peers = usePeerStore(state => state.peers);
  const videoCount = 1 + peers.length;

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;

      if (width >= breakpoints["2xl"]) setBreakpoint("2xl");
      else if (width >= breakpoints["md"]) setBreakpoint("md");
      else if (width >= breakpoints["sm"]) setBreakpoint("sm");
      else if (width >= breakpoints["xs"]) setBreakpoint("xs");
      else setBreakpoint("default");
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getVideoStyle = useMemo(() => {
    const restHeight = 172;
    const gap = 8;
    const config = layoutConfig.find(c => c.breakpoint === breakpoint) || layoutConfig[0];
    const maxVideoPerRow = config.maxVideoPerRow[videoCount];
    const rowCount = Math.ceil(videoCount / maxVideoPerRow);

    const widthPercent = maxVideoPerRow > 1
      ? `calc(${100 / maxVideoPerRow}% - ${gap * (maxVideoPerRow - 1)}px)`
      : "100%";
    const widthByHeight = `calc(((100vh - ${restHeight}px - ${gap * (rowCount - 1)}px) / ${rowCount}) * (4 / 3)) - ${gap * (maxVideoPerRow - 1)}px`;

    return { width: `min(${widthPercent}, ${widthByHeight})`, aspectRatio: '4/3' };
  }, [breakpoint, videoCount]);

  return (
    <div
      className={`relative ${speakingEffect(isSpeaking)} rounded-custom-l`}
      style={getVideoStyle}
    >
      <div className="absolute inset-0 bg-gray-black rounded-custom-l overflow-hidden z-10">
        <DisplayMediaStream mediaStream={stream} isLocal={isLocal} />
        <div className="inline-flex gap-4 absolute bottom-2 w-full justify-between px-2">
          <p className={`bg-grayscale-500 ${localNickName} bg-opacity-70 text-white px-2 py-0.5 rounded`}>
            {isVideoOn && nickname}
          </p>
          <div className="inline-flex gap-4 px-2 items-center">
            {renderMicIcon(isMicOn)}
            {renderVideoIcon(isVideoOn)}
          </div>
        </div>
        {videoLoading && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white animate-pulse text-3xl">
            <LoadingIndicator loadingState={videoLoading} type="spinner" />
          </div>
        )}
      </div>
      <VideoProfileOverlay
        isVideoOn={isVideoOn}
        videoLoading={videoLoading || false}
        nickname={nickname}
      />
      <VideoReactionBox reaction={reaction} />
    </div>
  );
};

const localNickName = (isLocal: boolean) => {
  return isLocal
    ? "text-semibold-r"
    : "text-medium-m";
}

const speakingEffect = (isSpeaking: boolean) => {
  return isSpeaking
    ? "ring-2 ring-green-100 transition-all duration-200"
    : "transition-all duration-200";
}

const renderMicIcon = (isMicOn: boolean) => {
  return isMicOn
    ? <BsMic className="text-white" />
    : <BsMicMute className="text-point-1" />
};

const renderVideoIcon = (isVideoOn: boolean) => {
  return isVideoOn
    ? <BsCameraVideo className="text-white" />
    : <BsCameraVideoOff className="text-point-1" />
};

export default VideoContainer;