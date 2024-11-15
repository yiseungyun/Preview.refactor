import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import VideoContainer from "@/components/session/VideoContainer.tsx";
import { useNavigate, useParams } from "react-router-dom";
import SessionSidebar from "@/components/session/SessionSidebar.tsx";
import SessionToolbar from "@/components/session/SessionToolbar.tsx";
import useMediaDevices from "@/hooks/useMediaDevices.ts";
import useToast from "@/hooks/useToast.ts";
import usePeerConnection from "@/hooks/usePeerConnection.ts";
import useSocketStore from "@/stores/useSocketStore";
import SessionHeader from "@components/session/SessionHeader.tsx";

type RoomStatus = "PUBLIC" | "PRIVATE";
interface RoomMetadata {
  title: string;
  status: RoomStatus;
  maxParticipants: number;
  createdAt: number;
  host: string;
}

interface AllUsersResponse {
  roomMetadata: RoomMetadata;
  users: {
    [socketId: string]: {
      joinTime: number;
      nickname: string;
      isHost: boolean;
    };
  };
}

interface ResponseMasterChanged {
  masterNickname: string;
  masterSocketId: string;
}

const SessionPage = () => {
  const { socket, connect } = useSocketStore();
  const {
    createPeerConnection,
    closePeerConnection,
    peers,
    setPeers,
    peerConnections,
  } = usePeerConnection(socket!);
  const { sessionId } = useParams();
  const [nickname, setNickname] = useState<string>("");
  const [reaction, setReaction] = useState("");
  const [roomMetadata, setRoomMetadata] = useState<RoomMetadata | null>(null);
  const [isHost, setIsHost] = useState<boolean>(false);

  const {
    userVideoDevices,
    userAudioDevices,
    selectedAudioDeviceId,
    selectedVideoDeviceId,
    stream,
    isVideoOn,
    isMicOn,
    handleMicToggle,
    handleVideoToggle,
    setSelectedAudioDeviceId,
    setSelectedVideoDeviceId,
    getMedia,
  } = useMediaDevices();

  const reactionTimeouts = useRef<{
    [key: string]: ReturnType<typeof setTimeout>;
  }>({});
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    if (!socket) connect(import.meta.env.VITE_SIGNALING_SERVER_URL);
    const connections = peerConnections;

    return () => {
      Object.values(connections.current).forEach((pc) => {
        pc.ontrack = null;
        pc.onicecandidate = null;
        pc.oniceconnectionstatechange = null;
        pc.onconnectionstatechange = null;
        pc.close();
      });
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream]);

  useEffect(() => {
    if (selectedAudioDeviceId || selectedVideoDeviceId) {
      getMedia();
    }
  }, [selectedAudioDeviceId, selectedVideoDeviceId]);

  useEffect(() => {
    if (!socket || !stream) return;

    console.log("Setting up socket event listeners");

    const handleAllUsers = ({ roomMetadata, users }: AllUsersResponse) => {
      console.log("Received roomMetadata:", roomMetadata);
      console.log("Received all_users:", users);
      setRoomMetadata(roomMetadata);
      setIsHost(roomMetadata.host === socket.id);
      Object.entries(users).forEach(([socketId, userInfo]) => {
        console.log("Creating peer connection for:", {
          socketId,
          nickname: userInfo.nickname,
        });

        createPeerConnection(socketId, userInfo.nickname, stream, true, {
          nickname,
          isHost: userInfo.isHost,
        });
      });
    };

    const handleGetOffer = async (data: {
      sdp: RTCSessionDescription;
      offerSendID: string;
      offerSendNickname: string;
    }) => {
      console.log("Received offer from:", data.offerSendID);
      const pc = createPeerConnection(
        data.offerSendID,
        data.offerSendNickname,
        stream,
        false,
        { nickname }
      );
      if (!pc) return;

      try {
        await pc.setRemoteDescription(new RTCSessionDescription(data.sdp));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);

        socket.emit("answer", {
          answerReceiveID: data.offerSendID,
          sdp: answer,
          answerSendID: socket.id,
        });
      } catch (error) {
        console.error("Error handling offer:", error);
      }
    };

    const handleGetAnswer = async (data: {
      sdp: RTCSessionDescription;
      answerSendID: string;
    }) => {
      console.log("Received answer from:", data.answerSendID);
      const pc = peerConnections.current[data.answerSendID];
      if (!pc) return;
      try {
        await pc.setRemoteDescription(new RTCSessionDescription(data.sdp));
      } catch (error) {
        console.error("Error handling answer:", error);
      }
    };

    const handleGetCandidate = async (data: {
      candidate: RTCIceCandidate;
      candidateSendID: string;
    }) => {
      const pc = peerConnections.current[data.candidateSendID];
      if (!pc) return;
      try {
        await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
      } catch (error) {
        console.error("Error handling ICE candidate:", error);
      }
    };

    const handleHostChange = (data: ResponseMasterChanged) => {
      console.log("Host Changed", data);
      if (data.masterSocketId === socket.id) {
        // 내가 호스트가 된 경우
        setIsHost(true);
        toast.success("당신이 호스트가 되었습니다.");
      } else {
        setPeers((prev) => {
          return prev.map((peer) => {
            if (peer.peerId === data.masterSocketId) {
              return {
                ...peer,
                isHost: true,
              };
            } else {
              return peer;
            }
          });
        });
        toast.success(`${data.masterNickname}님이 호스트가 되었습니다.`);
      }
    };

    const handleReaction = ({
      senderId,
      reaction,
    }: {
      senderId: string;
      reaction: string;
    }) => {
      if (reactionTimeouts.current[senderId]) {
        clearTimeout(reactionTimeouts.current[senderId]);
      }

      if (senderId === socket.id) {
        setReaction(reaction);
        reactionTimeouts.current[senderId] = setTimeout(() => {
          setReaction("");
          delete reactionTimeouts.current[senderId];
        }, 3000);
      } else {
        addReaction(senderId, reaction);
        reactionTimeouts.current[senderId] = setTimeout(() => {
          addReaction(senderId, "");
          delete reactionTimeouts.current[senderId];
        }, 3000);
      }
    };

    const handleRoomFinished = () => {
      toast.error("방장이 세션을 종료했습니다.");
      navigate("/sessions");
    };

    const handleUserExit = ({ socketId }: { socketId: string }) => {
      toast.error("유저가 나갔습니다.");
      closePeerConnection(socketId);
    };

    socket.on("all_users", handleAllUsers);
    socket.on("getOffer", handleGetOffer);
    socket.on("getAnswer", handleGetAnswer);
    socket.on("getCandidate", handleGetCandidate);
    socket.on("user_exit", handleUserExit);
    socket.on("room_full", () => {
      toast.error("해당 세션은 이미 유저가 가득 찼습니다.");
      navigate("/sessions");
    });
    socket.on("master_changed", handleHostChange);
    socket.on("reaction", handleReaction);
    socket.on("room_finished", handleRoomFinished);

    return () => {
      console.log("Cleaning up socket event listeners");
      socket.off("all_users", handleAllUsers);
      socket.off("getOffer", handleGetOffer);
      socket.off("getAnswer", handleGetAnswer);
      socket.off("getCandidate", handleGetCandidate);
      socket.off("user_exit");
      socket.off("room_full");
      socket.off("master_changed", handleHostChange);
      socket.off("room_finished", handleRoomFinished);
      socket.off("reaction", handleReaction);

      if (reactionTimeouts.current) {
        Object.values(reactionTimeouts.current).forEach((timeout) => {
          clearTimeout(timeout);
        });
      }
    };
  }, [
    socket,
    stream,
    nickname,
    createPeerConnection,
    closePeerConnection,
    peerConnections,
    navigate,
    toast,
  ]);

  const emitReaction = (reactionType: string) => {
    if (socket) {
      socket.emit("reaction", {
        roomId: sessionId,
        reaction: reactionType,
      });
    }
  };

  const joinRoom = async () => {
    if (!socket || !sessionId || !nickname) {
      toast.error("닉네임을 입력해주세요.");
      return;
    }

    const mediaStream = await getMedia();
    if (!mediaStream) {
      toast.error(
        "미디어 스트림을 가져오지 못했습니다. 미디어 장치를 확인 후 다시 시도해주세요."
      );
      navigate("/sessions");
      return;
    }

    console.log("Joining room:", sessionId);
    socket.emit("join_room", { roomId: sessionId, nickname });
  };

  const addReaction = useCallback((senderId: string, reactionType: string) => {
    setPeers((prev) =>
      prev.map((peer) =>
        peer.peerId === senderId ? { ...peer, reaction: reactionType } : peer
      )
    );
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
              {useMemo(
                () =>
                  peers.map((peer) => (
                    <VideoContainer
                      key={peer.peerId}
                      nickname={peer.peerNickname}
                      isMicOn={true}
                      isVideoOn={true}
                      isLocal={false}
                      reaction={peer.reaction || ""}
                      stream={peer.stream}
                    />
                  )),
                [peers]
              )}
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
          participants={[
            { nickname, isHost },
            ...peers.map((peer) => ({
              nickname: peer.peerNickname,
              isHost: peer.isHost || false,
            })),
          ]}
          roomId={sessionId}
          isHost={isHost}
        />
      </div>
    </section>
  );
};

export default SessionPage;
