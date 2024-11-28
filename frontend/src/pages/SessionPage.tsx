import VideoContainer from "@components/session/VideoContainer.tsx";
import { useParams } from "react-router-dom";
import SessionSidebar from "@components/session/SessionSidebar.tsx";
import SessionToolbar from "@components/session/SessionToolbar.tsx";
import { useSession } from "@hooks/session/useSession";
import useSocket from "@hooks/useSocket";
import SessionHeader from "@components/session/SessionHeader";
import { useEffect } from "react";
import useToast from "@hooks/useToast.ts";

const SessionPage = () => {
  const { sessionId } = useParams();
  const toast = useToast();

  useEffect(() => {
    if (!sessionId) {
      toast.error("유효하지 않은 세션 아이디입니다.");
    }
  }, [sessionId, toast]);

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
    videoLoading,
    peerMediaStatus,
  } = useSession(sessionId!);

  return (
    <section className="w-screen h-screen flex flex-col overflow-y-hidden">
      <div className="w-full flex gap-2 p-1 bg-white shrink-0">
        {/*{!username && (*/}
        <input
          type="text"
          placeholder="Nickname"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          className="border p-2 mr-2"
        />
        {/*)}*/}
        <button
          onClick={joinRoom}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Join Room
        </button>
      </div>

      <div className={"w-full flex flex-grow"}>
        <div
          className={
            "camera-area flex flex-col h-full flex-grow justify-between bg-gray-50 border-r border-t items-center overflow-hidden"
          }
        >
          <SessionHeader
            roomMetadata={roomMetadata}
            participantsCount={peers.length + 1}
          />
          <div
            className={
              "w-full flex flex-col gap-4 justify-between items-center flex-grow transition-all py-4"
            }
          >
            <div
              className={
                "speaker  w-full flex gap-4 px-6 h-1/2 justify-center items-center"
              }
            >
              <VideoContainer
                nickname={nickname}
                isMicOn={isMicOn}
                isVideoOn={isVideoOn}
                isLocal={true}
                reaction={reaction || ""}
                stream={stream!}
                videoLoading={videoLoading}
              />
            </div>
            <div
              className={
                "listeners w-full flex gap-4 px-6 h-1/2 justify-center items-center  "
              }
            >
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
                  reaction={peer.reaction || ""}
                  stream={peer.stream}
                />
              ))}
            </div>
          </div>
          <SessionToolbar
            handleVideoToggle={handleVideoToggle}
            handleMicToggle={handleMicToggle}
            emitReaction={emitReaction}
            userVideoDevices={userVideoDevices}
            userAudioDevices={userAudioDevices}
            setSelectedVideoDeviceId={setSelectedVideoDeviceId}
            setSelectedAudioDeviceId={setSelectedAudioDeviceId}
            isVideoOn={isVideoOn}
            isMicOn={isMicOn}
            videoLoading={videoLoading}
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
