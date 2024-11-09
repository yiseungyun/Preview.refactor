import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import {
  BsCameraVideo,
  BsCameraVideoOff,
  BsMic,
  BsMicMute,
} from "react-icons/bs";

interface Props {
  handleVideoToggle: () => void;
  handleMicToggle: () => void;
  userVideoDevices: MediaDeviceInfo[];
  userAudioDevices: MediaDeviceInfo[];
  setSelectedVideoDeviceId: (deviceId: string) => void;
  setSelectedAudioDeviceId: (deviceId: string) => void;
  isVideoOn: boolean;
  isMicOn: boolean;
}
const SessionToolbar = ({
  handleVideoToggle,
  handleMicToggle,
  userVideoDevices,
  userAudioDevices,
  setSelectedVideoDeviceId,
  setSelectedAudioDeviceId,
  isVideoOn,
  isMicOn,
}: Props) => {
  return (
    <div
      className={
        "session-footer h-16 inline-flex w-full justify-between items-center border-t px-6"
      }
    >
      <button className={"bg-transparent rounded-full border p-3 text-xl"}>
        <FaAngleLeft />
      </button>
      <div className={"center-buttons space-x-2"}>
        <button
          onClick={handleVideoToggle}
          className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-full"
          aria-label={isVideoOn ? `비디오 끄기` : "비디오 켜기"}
        >
          {isVideoOn ? <BsCameraVideo /> : <BsCameraVideoOff />}
        </button>
        <button
          onClick={handleMicToggle}
          className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-full"
          aria-label={isMicOn ? `마이크 끄기` : "마이크 켜기"}
        >
          {isMicOn ? <BsMic /> : <BsMicMute />}
        </button>
        <select
          className={
            "w-32 bg-transparent border border-accent-gray py-2 px-2 rounded-xl hover:bg-gray-200"
          }
          onChange={(e) => setSelectedVideoDeviceId(e.target.value)}
        >
          {userVideoDevices.map((device) => (
            <option key={device.deviceId} value={device.deviceId}>
              {device.label}
            </option>
          ))}
        </select>
        <select
          className={
            "w-32 bg-transparent border border-accent-gray py-2 px-2 rounded-xl hover:bg-gray-200"
          }
          onChange={(e) => setSelectedAudioDeviceId(e.target.value)}
        >
          {userAudioDevices.map((device) => (
            <option key={device.deviceId} value={device.deviceId}>
              {device.label}
            </option>
          ))}
        </select>
      </div>
      <button className={"bg-transparent rounded-full border p-3 text-xl"}>
        <FaAngleRight />
      </button>
    </div>
  );
};

export default SessionToolbar;
