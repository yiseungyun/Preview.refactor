import VideoContainer from "@/components/session/VideoContainer.tsx";
import { useParams } from "react-router-dom";
import SessionSidebar from "@/components/session/SessionSidebar.tsx";
import SessionToolbar from "@/components/session/SessionToolbar.tsx";
import { useSession } from "@/hooks/session/useSession";
import useSocket from "@/hooks/useSocket";
import SessionHeader from "@/components/session/SessionHeader";

const SessionPage = () => {
  const { sessionId } = useParams();
  const { socket } = useSocket();
  const {
    nickname,
    setNickname,
    reaction,
    peers,
    userVideoDevices,
    userAudioDevices,
    isVideoOn,
    isMicOn,
    stream,
    roomMetadata,
    isHost,
    participants,
    handleMicToggle,
    handleVideoToggle,
    setSelectedAudioDeviceId,
    setSelectedVideoDeviceId,
    joinRoom,
    emitReaction,
  } = useSession(sessionId);

  return (
    <section className="w-screen h-screen flex flex-col max-w-[1440px]">
      <div className="w-full flex gap-2 p-1 bg-white">
        <input
          type="text"
          placeholder="Nickname"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          className="border p-2 mr-2"
        />
        <button
          onClick={joinRoom}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Join Room
        </button>
      </div>
      <div className={"w-screen flex flex-grow"}>
        <div
          className={
            "camera-area flex flex-col flex-grow justify-between bg-gray-50 border-r border-t items-center"
          }
        >
          <div
            className={
              "flex flex-col gap-4 justify-between items-center w-full"
            }
          >
            <SessionHeader
              roomMetadata={roomMetadata}
              participantsCount={peers.length + 1}
            />
            <div className={"speaker max-w-4xl px-6 flex w-full"}>
              <VideoContainer
                nickname={nickname}
                isMicOn={isMicOn}
                isVideoOn={isVideoOn}
                isLocal={true}
                reaction={reaction || ""}
                stream={stream!}
              />
            </div>
            <div className={"listeners w-full flex gap-2 px-6"}>
              {peers.map((peer) => (
                <VideoContainer
                  key={peer.peerId}
                  nickname={peer.peerNickname}
                  isMicOn={true}
                  isVideoOn={true}
                  isLocal={false}
                  reaction={peer.reaction || ""}
                  stream={peer.stream}
                />
              ))}
            </div>
          </div>
          <SessionToolbar
            handleVideoToggle={handleVideoToggle}
            handleMicToggle={handleMicToggle}
            handleReaction={emitReaction}
            userVideoDevices={userVideoDevices}
            userAudioDevices={userAudioDevices}
            setSelectedVideoDeviceId={setSelectedVideoDeviceId}
            setSelectedAudioDeviceId={setSelectedAudioDeviceId}
            isVideoOn={isVideoOn}
            isMicOn={isMicOn}
          />
        </div>
        <SessionSidebar
          socket={socket}
          question={"Restful API에 대해서 설명해주세요."}
          participants={participants}
          roomId={sessionId}
          isHost={isHost}
        />
      </div>
    </section>
  );
};
export default SessionPage;
