import { useParams } from "react-router-dom";
import ChannelToolbar from "./ChannelToolbar";
import ChannelHeader from "./ChannelHeader";
import useToast from "@hooks/useToast";
import ChannelSidebar from "./ChannelSidebar";
import VideoLayout from "./VideoLayout";
import MediaPreviewModal from "./components/MediaPreviewModal";
import useSocket from "@/hooks/useSocket";
import { useMediaStore } from "./stores/useMediaStore";
import { useSessionStore } from "./stores/useSessionStore";
import useModal from "@/hooks/useModal";
import useWebRTCSession from "./hooks/useWebRTCSession";
import { useEffect } from "react";
import useMediaStream from "./hooks/useMediaStream";
import { useStudyRoom } from "./hooks/useStudyRoom";

const ChannelPage = () => {
  const { channelId } = useParams();
  const { socket, disconnect } = useSocket();
  const toast = useToast();
  const selectedVideoDeviceId = useMediaStore(state => state.selectedVideoDeviceId);
  const selectedAudioDeviceId = useMediaStore(state => state.selectedAudioDeviceId);
  const setRoomId = useSessionStore(state => state.setRoomId);

  useWebRTCSession(socket!);
  const { getMedia } = useMediaStream(socket!);
  useStudyRoom(socket!, disconnect);
  const mediaPreviewModal = useModal();

  useEffect(() => {
    mediaPreviewModal.openModal();
    setRoomId(channelId!);
  }, []);

  useEffect(() => {
    if (selectedAudioDeviceId || selectedVideoDeviceId) {
      getMedia();
    }
  }, [selectedAudioDeviceId, selectedVideoDeviceId]);

  if (!channelId) {
    toast.error("유효하지 않은 채널입니다.");
    return null;
  }

  return (
    <section className="w-screen min-h-[500px] h-screen flex flex-col">
      <MediaPreviewModal modal={mediaPreviewModal} />
      <div className="w-full flex flex-1">
        <div className="flex flex-col w-full flex-grow bg-gray-50 items-center">
          <ChannelHeader />
          <VideoLayout socket={socket!} />
          <ChannelToolbar socket={socket!} disconnect={disconnect} />
        </div>
        <ChannelSidebar />
      </div>
    </section>
  );
};
export default ChannelPage;
