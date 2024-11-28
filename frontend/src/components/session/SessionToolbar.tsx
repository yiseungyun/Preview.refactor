import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import {
  BsCameraVideo,
  BsCameraVideoOff,
  BsMic,
  BsMicMute,
  BsHandThumbsUp,
} from "react-icons/bs";

interface Props {
  requestChangeIndex: (
    type: "next" | "prev" | "current" | "move",
    index?: number
  ) => void;
  handleVideoToggle: () => void;
  handleMicToggle: () => void;
  emitReaction: (reactionType: string) => void;
  userVideoDevices: MediaDeviceInfo[];
  userAudioDevices: MediaDeviceInfo[];
  setSelectedVideoDeviceId: (deviceId: string) => void;
  setSelectedAudioDeviceId: (deviceId: string) => void;
  isVideoOn: boolean;
  isMicOn: boolean;
  videoLoading: boolean;
  isHost: boolean;
  isInProgress: boolean;
  startStudySession: () => void;
  stopStudySession: () => void;
}
const SessionToolbar = ({
  requestChangeIndex,
  handleVideoToggle,
  handleMicToggle,
  emitReaction,
  userVideoDevices,
  userAudioDevices,
  setSelectedVideoDeviceId,
  setSelectedAudioDeviceId,
  isVideoOn,
  isMicOn,
  videoLoading,
  isHost,
  isInProgress,
  startStudySession,
  stopStudySession,
}: Props) => {
  return (
    <div
      className={
        "session-footer h-16 inline-flex w-full justify-center items-center border-t px-6 shrink-0"
      }
    >
      <div className={"inline-flex center-buttons gap-2"}>
        <button
          disabled={videoLoading}
          onClick={handleVideoToggle}
          className="h-full aspect-square bg-green-500 hover:bg-green-600 text-white p-3 rounded-full disabled:opacity-50"
          aria-label={isVideoOn ? `비디오 끄기` : "비디오 켜기"}
        >
          {isVideoOn ? <BsCameraVideo /> : <BsCameraVideoOff />}
        </button>
        <button
          onClick={handleMicToggle}
          className="h-full aspect-square bg-green-500 hover:bg-green-600 text-white p-3 rounded-full"
          aria-label={isMicOn ? `마이크 끄기` : "마이크 켜기"}
        >
          {isMicOn ? <BsMic /> : <BsMicMute />}
        </button>
        <button
          onClick={() => emitReaction("thumbs_up")}
          className="h-full aspect-square bg-white text-green-500 border box-border border-accent-gray-50 hover:bg-grayscale-50 p-3 rounded-full"
          aria-label={"좋아요"}
        >
          {<BsHandThumbsUp />}
        </button>
        <select
          className={
            "max-w-40 bg-transparent text-gray-700 text-medium-xs border border-accent-gray py-2 px-2 rounded-xl hover:bg-gray-200"
          }
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
        <select
          className={
            "max-w-40 bg-transparent text-gray-700 text-medium-xs border border-accent-gray py-2 px-2 rounded-xl hover:bg-gray-200"
          }
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
      </div>
      {isHost && isInProgress ? (
        <div className={"inline-flex gap-4 items-center mx-8"}>
          <button
            className={
              "bg-transparent rounded-xl border h-10 px-3 py-2 text-medium-xs "
            }
            onClick={stopStudySession}
          >
            스터디 종료하기
          </button>
        </div>
      ) : (
        <div className={"inline-flex gap-4 items-center mx-8"}>
          <button
            className={
              "bg-transparent rounded-xl border h-10 px-3 py-2 text-medium-xs "
            }
            onClick={startStudySession}
          >
            스터디 시작하기
          </button>
        </div>
      )}
      {isHost && isInProgress && (
        <div className={"study-toolbar inline-flex gap-4 items-center mx-8"}>
          <button
            onClick={() => requestChangeIndex("prev")}
            className={
              "inline-flex items-center bg-transparent rounded-xl border h-10 px-3 py-2 text-medium-xs "
            }
            aria-label={"이전 질문 버튼"}
          >
            <FaAngleLeft /> 이전 질문
          </button>
          <button
            onClick={() => requestChangeIndex("next")}
            className={
              "inline-flex items-center bg-transparent rounded-xl border h-10 px-3 py-2 text-medium-xs "
            }
            aria-label={"다음 질문 버튼"}
          >
            다음 질문 <FaAngleRight />
          </button>
        </div>
      )}
    </div>
  );
};

export default SessionToolbar;
