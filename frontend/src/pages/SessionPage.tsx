import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import VideoContainer from "../components/session/VideoContainer.tsx";
import { useNavigate } from "react-router-dom";
import SessionSidebar from "../components/session/SessionSidebar.tsx";
import SessionToolbar from "../components/session/SessionToolbar.tsx";
import useMediaDevices from "../hooks/useMediaDevices.ts";
import useToast from "../hooks/useToast.ts";
import usePeerConnection from "../hooks/usePeerConnection.ts";
import useSocketStore from "../stores/useSocketStore.ts";

interface User {
  id: string;
  nickname: string;
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
  const [roomId, setRoomId] = useState<string>("");
  const [nickname, setNickname] = useState<string>("");
  const [reaction, setReaction] = useState("");

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
        // 모든 이벤트 리스너 제거
        pc.ontrack = null;
        pc.onicecandidate = null;
        pc.oniceconnectionstatechange = null;
        pc.onconnectionstatechange = null;
        // 연결 종료
        pc.close();
      });
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    // 미디어 스트림 정리 로직
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
    // socket 이벤트 리스너들 정리
    // 메모리 누수, 중복 실행을 방지하기 위해 정리
    return () => {
      if (socket) {
        if (reactionTimeouts.current) {
          for (const value of Object.values(reactionTimeouts.current)) {
            clearTimeout(value);
          }
        }
        socket.off("room_full");
        socket.off("all_users");
        socket.off("getOffer");
        socket.off("getAnswer");
        socket.off("getCandidate");
        socket.off("user_exit");
        socket.off("reaction");
      }
    };
  }, [socket]);

  const emitReaction = (reactionType: string) => {
    if (socket) {
      socket.emit("reaction", {
        roomId: roomId,
        reaction: reactionType,
      });
    }
  };

  // 방 입장 처리: 사용자가 join room 버튼을 클릭할 때
  const joinRoom = async () => {
    if (!socket || !roomId || !nickname) {
      toast.error("방 번호와 닉네임을 입력해주세요.");
      return;
    }

    const stream = await getMedia();
    if (!stream) {
      toast.error(
        "미디어 스트림을 가져오지 못했습니다. 미디어 장치를 확인 후 다시 시도해주세요."
      );
      navigate("/sessions");
      return;
    }

    socket.emit("join_room", { room: roomId, nickname });

    socket.on("room_full", () => {
      toast.error(
        "해당 세션은 이미 유저가 가득 찼습니다. 세션 페이지로 이동합니다..."
      );
      navigate("/sessions");
      return;
    });
    // 기존 사용자들의 정보 수신: 방에 있던 사용자들과 createPeerConnection 생성
    socket.on("all_users", (users: User[]) => {
      users.forEach((user) => {
        createPeerConnection(user.id, user.nickname, stream, true, {
          nickname,
        });
      });
    });

    // 새로운 Offer 수신: 상대가 통화 요청
    // 발생 시점: 새로운 사용자가 방에 입장했을 때, 기존 사용자가 createOffer를 호출하고 emit했을 때
    socket.on(
      "getOffer",
      async (data: {
        sdp: RTCSessionDescription;
        offerSendID: string;
        offerSendNickname: string;
      }) => {
        // 연결 생성
        const pc = createPeerConnection(
          data.offerSendID,
          data.offerSendNickname,
          stream,
          false,
          { nickname }
        );
        if (!pc) return;

        try {
          // 상대의 설정 확인하기: 상대의 미디어 형식, 코덱, 해상도 확인
          await pc.setRemoteDescription(new RTCSessionDescription(data.sdp));
          // Answer 생성: 수락 응답 만들기 - 내 미디어 설정 정보 생성, 상대 설정과 호환되는 형태로 생성
          const answer = await pc.createAnswer();
          // 로컬 설명 설정: 생성한 Answer 정보를 내 연결에 적용, 실제 통신 준비
          await pc.setLocalDescription(answer);

          // Answer 전송: 생성한 Answer를 상대에게 전송, 실제 연결 수립 시작
          // emit: 서버로 이벤트 전송
          socket.emit("answer", {
            answerReceiveID: data.offerSendID,
            sdp: answer,
            answerSendID: socket.id,
          });
        } catch (error) {
          console.error("Error handling offer:", error);
        }
      }
    );

    // Answer 수신: 상대방이 보낸 응답 수신, 연결 정보 설정, 실제 통신 준비 완료
    socket.on(
      "getAnswer",
      async (data: { sdp: RTCSessionDescription; answerSendID: string }) => {
        // 상대방과의 연결 정보 찾기
        const pc = peerConnections.current[data.answerSendID];
        if (!pc) return;
        try {
          // 상대방의 연결 정보 설정
          await pc.setRemoteDescription(new RTCSessionDescription(data.sdp));
        } catch (error) {
          console.error("Error handling answer:", error);
        }
      }
    );

    // ICE candidate 수신: 새로운 연결 경로 정보 수신, 가능한 연결 경로 목록에 추가, 최적의 경로로 자동 전환
    socket.on(
      "getCandidate",
      async (data: { candidate: RTCIceCandidate; candidateSendID: string }) => {
        // 상대방과의 연결 찾기
        const pc = peerConnections.current[data.candidateSendID];
        if (!pc) return;
        try {
          // 새로운 연결 경로 추가
          await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
        } catch (error) {
          console.error("Error handling ICE candidate:", error);
        }
      }
    );

    // 사용자 퇴장 처리
    socket.on("user_exit", ({ id }: { id: string }) => {
      closePeerConnection(id);
    });

    socket.on(
      "reaction",
      ({ senderId, reaction }: { senderId: string; reaction: string }) => {
        if (reactionTimeouts.current[senderId]) {
          clearTimeout(reactionTimeouts.current[senderId]);
        }

        if (senderId === socket!.id) {
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
      }
    );
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
      <div className="w-screen flex gap-2 mb-4 space-y-2 ">
        <input
          type="text"
          placeholder="Room ID"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          className="border p-2 mr-2"
        />
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
            <h1
              className={
                "text-center text-medium-xl font-bold w-full pt-4 pb-2"
              }
            >
              프론트엔드 초보자 면접 스터디
            </h1>
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
                  // 상대방의 비디오 표시
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
          participants={[nickname, ...peers.map((peer) => peer.peerNickname)]}
          roomId={roomId}
        />
      </div>
    </section>
  );
};

export default SessionPage;
