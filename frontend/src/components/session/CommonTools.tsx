import {
  MdVideocam,
  MdVideocamOff,
  MdMic,
  MdMicOff,
  MdThumbUp,
  MdLink,
} from "react-icons/md";
import { IoChevronDownSharp } from "react-icons/io5";
import Modal from "../common/Modal";
import { SESSION_EMIT_EVENT } from "@/constants/WebSocket/SessionEvent";
import { useNavigate } from "react-router-dom";
import useToast from "@/hooks/useToast";
import useModal from "@/hooks/useModal";
import useSocket from "@/hooks/useSocket";
import ToolTip from "@components/common/ToolTip";
import { useMediaStore } from "@/pages/SessionPage/stores/useMediaStore";

interface CommonToolsProps {
  handleVideoToggle: () => void;
  handleMicToggle: () => void;
  emitReaction: (reactionType: string) => void;
  isHost: boolean;
  roomId: string;
  setShouldBlock: (shouldBlock: boolean) => void;
}

const CommonTools = ({
  handleVideoToggle,
  handleMicToggle,
  emitReaction,
  isHost,
  roomId,
  setShouldBlock,
}: CommonToolsProps) => {
  const isVideoOn = useMediaStore(state => state.isVideoOn);
  const isMicOn = useMediaStore(state => state.isMicOn);
  const userVideoDevices = useMediaStore(state => state.userVideoDevices);
  const userAudioDevices = useMediaStore(state => state.userVideoDevices);
  const videoLoading = useMediaStore(state => state.videoLoading);
  const setSelectedVideoDeviceId = useMediaStore(state => state.setSelectedVideoDeviceId);
  const setSelectedAudioDeviceId = useMediaStore(state => state.setSelectedAudioDeviceId);

  const navigate = useNavigate();
  const toast = useToast();
  const modal = useModal();
  const { socket } = useSocket();

  const existHandler = () => {
    socket?.emit(SESSION_EMIT_EVENT.LEAVE, { roomId });
    toast.success("메인 화면으로 이동합니다.");
    setShouldBlock(false);
    navigate("/sessions");
  };

  const destroyAndExitHandler = () => {
    socket?.off(SESSION_EMIT_EVENT.FINISH);
    socket?.emit(SESSION_EMIT_EVENT.FINISH, { roomId });
    toast.success("메인 화면으로 이동합니다.");
    setShouldBlock(false);
    navigate("/sessions");
  };

  const shareSessionLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("현재 세션의 링크가 복사되었습니다. 동료에게 공유해보세요!");
  };

  const modalProps = isHost
    ? {
      title: "세션을 종료할까요?",
      subtitle: "호스트 권한을 주지 않으면 방이 종료됩니다.",
      leftButton: "호스트 권한 전달",
      rightButton: "종료하기",
      type: "red" as const,
      onLeftClick: existHandler,
      onRightClick: destroyAndExitHandler,
    }
    : {
      title: "지금 나가면 다시 들어올 수 없어요!",
      subtitle: "정말 종료하시겠어요?",
      leftButton: "취소하기",
      rightButton: "종료하기",
      type: "red" as const,
      onLeftClick: () => { },
      onRightClick: existHandler,
    };

  return (
    <>
      <div className={"inline-flex gap-2"}>
        <ToolTip text="세션 링크 복사">
          <button
            className="aspect-square px-3 bg-green-200 text-white rounded-custom-m border-custom-s  border-green-200 hover:bg-green-100"
            aria-label={"세션 링크 복사"}
            onClick={shareSessionLink}
          >
            <MdLink className="w-6 h-6" />
          </button>
        </ToolTip>
        <div className="relative">
          <select
            className="w-16 bg-white text-white py-3 rounded-custom-m border-custom-s border-gray-200"
            onChange={(e) => setSelectedAudioDeviceId(e.target.value)}
          >
            {userAudioDevices.length > 0 ? (
              userAudioDevices.map((device) => (
                <option key={device.deviceId} value={device.deviceId}>
                  {device.label}
                </option>
              ))
            ) : (
              <option value={""}>발견된 오디오 장치가 없습니다.</option>
            )}
          </select>
          <button
            onClick={handleMicToggle}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            aria-label={isMicOn ? "마이크 끄기" : "마이크 켜기"}
          >
            {isMicOn
              ? <MdMic className="w-6 h-6 hover:text-green-500" />
              : <MdMicOff className="w-6 h-6 text-point-1 hover:text-green-500" />
            }
          </button>
          <span className="absolute top-1/2 -translate-y-1/2 right-2 pointer-events-none">
            <IoChevronDownSharp className="w-3.5 h-3.5 text-gray-500" />
          </span>
        </div>
        <div className="relative">
          <select
            className="w-16 bg-white text-white py-3 rounded-custom-m border-custom-s border-gray-200"
            onChange={(e) => setSelectedVideoDeviceId(e.target.value)}
          >
            {userVideoDevices.length > 0 ? (
              userVideoDevices.map((device) => (
                <option key={device.deviceId} value={device.deviceId}>
                  {device.label}
                </option>
              ))
            ) : (
              <option value={""}>발견된 비디오 장치가 없습니다.</option>
            )}
          </select>
          <button
            disabled={videoLoading}
            onClick={handleVideoToggle}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            aria-label={isVideoOn ? "비디오 끄기" : "비디오 켜기"}
          >
            {isVideoOn
              ? <MdVideocam className="w-6 h-6 hover:text-green-500" />
              : <MdVideocamOff className="w-6 h-6 text-point-1 hover:text-green-500" />
            }
          </button>
          <span className="absolute top-1/2 -translate-y-1/2 right-2 pointer-events-none">
            <IoChevronDownSharp className="w-3.5 h-3.5 text-gray-500" />
          </span>
        </div>
        <button
          onClick={() => emitReaction("thumbs_up")}
          className="aspect-square px-3 bg-white text-gray-600 rounded-custom-m border-custom-s border-gray-200"
          aria-label={"좋아요"}
        >
          <MdThumbUp className="w-5 h-5 hover:text-green-500" />
        </button>
        <button
          className="bg-point-1 rounded-custom-m border-custom-s border-gray-200 text-white text-semibold-r px-4"
          onClick={modal.openModal}
        >
          종료하기
        </button>
        <Modal modal={modal} {...modalProps} />
      </div>
    </>
  );
};

export default CommonTools;
