import VideoContainer from "./VideoContainer";
import { useCallback, useEffect, useState } from "react";
import useToast from "@hooks/useToast.ts";
import { useMediaStore } from "@/pages/channel/stores/useMediaStore";
import { useSessionStore } from "@/pages/channel/stores/useSessionStore";
import { mediaManager } from "@/pages/channel/services/MediaManager";
import useAuth from "@/hooks/useAuth";
import { useNavigate, useParams } from "react-router-dom";
import { SESSION_EMIT_EVENT } from "@/constants/WebSocket/SessionEvent";
import useSocket from "@/hooks/useSocket";
import { Socket } from "socket.io-client";
import useMediaStream from "../hooks/useMediaStream";

interface MediaPreviewModalProps {
  modal: UseModalReturn;
}

interface UseModalReturn {
  dialogRef: React.RefObject<HTMLDialogElement>;
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

const MediaPreviewModal = ({
  modal
}: MediaPreviewModalProps) => {
  const [preview, setPreview] = useState<MediaStream | null>(null);
  const toast = useToast();
  const navigate = useNavigate();
  const { socket } = useSocket();
  const { nickname: username } = useAuth();
  const { channelId } = useParams();

  const isVideoOn = useMediaStore(state => state.isVideoOn);
  const setIsVideoOn = useMediaStore(state => state.setIsVideoOn);
  const { nickname, setNickname, setReady } = useSessionStore();
  const [tempNickname, setTempNickname] = useState("");
  const { getMedia } = useMediaStream(socket!);

  useEffect(() => {
    if (username) {
      setTempNickname(username);
    }
  }, [username]);

  const getMediaPreview = useCallback(async () => {
    const mediaStream = await mediaManager.getMediaStream("video", null);
    if (!mediaStream) {
      toast.error("비디오 장치를 찾을 수 없습니다.");
      return;
    }
    setPreview(mediaStream);
  }, []);

  useEffect(() => {
    getMediaPreview();

    return () => {
      preview?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  useEffect(() => {
    if (modal.dialogRef.current) {
      const dialog = modal.dialogRef.current;
      const handleEscape = (event: globalThis.KeyboardEvent) => {
        if (event.key === "Escape") {
          event.preventDefault();
          modal.closeModal();
          navigate("/channels");
          setReady(false);
        }
      };
      dialog.addEventListener("keydown", (event) => handleEscape(event));
    }
  }, [modal.dialogRef.current]);

  const isValidUser = (
    socket: Socket | null,
    nickname: string
  ): socket is Socket => {
    if (!socket) {
      toast.error("소켓 연결이 필요합니다.");
      return false;
    }
    if (!nickname) {
      toast.error("닉네임을 입력해주세요.");
      return false;
    }

    return true;
  };

  const joinRoom = async (nickname: string) => {
    if (!isValidUser(socket, nickname)) return;

    const mediaStream = await getMedia();
    if (!mediaStream) {
      toast.error("미디어 스트림을 가져오지 못했습니다. 미디어 장치를 확인 후 다시 시도해주세요.");
      return;
    } else if (isVideoOn && mediaStream.getVideoTracks().length === 0) {
      toast.error("비디오 장치를 찾을 수 없습니다. 비디오 장치 없이 채널에 참가합니다.");
    } else if (mediaStream.getAudioTracks().length === 0) {
      toast.error("오디오 장치를 찾을 수 없습니다. 오디오 장치 없이 채널에 참가합니다.");
    }

    socket.emit(SESSION_EMIT_EVENT.JOIN, { roomId: channelId, nickname });
  };

  const handleReject = () => {
    modal.closeModal();
    navigate("/channels");
    setReady(false);
    preview?.getTracks().forEach((track) => track.stop());
  }

  const handleConfirm = async () => {
    setNickname(tempNickname);
    setReady(true);
    await joinRoom(tempNickname);
    modal.closeModal();
    preview?.getTracks().forEach((track) => track.stop());
  }

  return (
    modal.isOpen && (
      <dialog
        ref={modal.dialogRef}
        className="flex flex-col items-center rounded-custom-l px-10 py-6 w-[640px] shadow-lg"
      >
        <h3 className="text-bold-m">비디오 미리보기</h3>
        <div className="w-[400px] p-4">
          <VideoContainer
            nickname={nickname}
            isLocal={true}
            isSpeaking={false}
            reaction={""}
            stream={isVideoOn ? preview : null}
            isVideoOn={isVideoOn}
          />
        </div>
        <div className="text-medium-r mt-4 flex w-full justify-center gap-4">
          <label
            className="inline-flex gap-2 items-center rounded-custom-m px-4 py-2 bg-transparent"
            id="checkbox"
          >
            <input
              defaultChecked={!isVideoOn || false}
              className="w-6 h-6"
              type="checkbox"
              onChange={() => setIsVideoOn(!isVideoOn)}
            />
            <span>내 비디오 끄고 참가하기</span>
          </label>
          <input
            className="rounded-custom-m px-4 py-2 bg-gray-50 hover:bg-gray-100"
            type="text"
            value={tempNickname}
            placeholder="닉네임 변경"
            onChange={(e) => setTempNickname(e.target.value)}
          />
        </div>
        <div className="text-semibold-r mt-4 flex w-full justify-center gap-4">
          <button
            onClick={handleReject}
            className="rounded-custom-m px-16 py-4 bg-gray-50 hover:bg-gray-100"
          >
            나가기
          </button>
          <button
            onClick={handleConfirm}
            className="rounded-custom-m px-16 py-4 bg-green-500 text-white hover:bg-green-600"
          >
            참가하기
          </button>
        </div>
      </dialog>
    )
  );
};

export default MediaPreviewModal;
