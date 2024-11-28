import { useRef, useState } from "react";
import { Socket } from "socket.io-client";
import { PeerConnection } from "../type/session";
import { SIGNAL_EMIT_EVENT } from "@/constants/WebSocket/SignalingEvent.ts";

interface User {
  id?: string;
  nickname: string;
  isHost?: boolean;
}

// 피어 간 연결 수립 역할을 하는 커스텀 훅
const usePeerConnection = (socket: Socket) => {
  const [peers, setPeers] = useState<PeerConnection[]>([]); // 연결 관리
  const peerConnections = useRef<{ [key: string]: RTCPeerConnection }>({});

  // STUN 서버 설정
  const pcConfig = {
    iceServers: [
      {
        urls: import.meta.env.VITE_STUN_SERVER_URL,
        username: import.meta.env.VITE_STUN_USER_NAME,
        credential: import.meta.env.VITE_STUN_CREDENTIAL,
      },
    ],
  };

  // Peer Connection 생성
  const createPeerConnection = async (
    peerSocketId: string,
    peerNickname: string,
    stream: MediaStream,
    isOffer: boolean,
    localUser: User
  ) => {
    try {
      console.log("새로운 Peer Connection 생성:", {
        peerSocketId,
        peerNickname,
        isOffer,
        localUser,
      });

      if (peerConnections.current[peerSocketId]) {
        console.log("이미 존재하는 Peer Connection:", peerSocketId);
        return peerConnections.current[peerSocketId];
      }

      // 유저 사이의 통신 선로를 생성
      // STUN: 공개 주소를 알려주는 서버
      // ICE: 두 피어 간의 최적의 경로를 찾아줌
      const pc = new RTCPeerConnection(pcConfig);

      // 로컬 스트림 추가: 내 카메라/마이크를 통신 선로(pc)에 연결
      // 상대방에게 나의 비디오/오디오를 전송할 준비
      stream.getTracks().forEach((track) => {
        pc.addTrack(track, stream);
      });

      // ICE candidate 이벤트 처리
      // 가능한 연결 경로를 찾을 때마다 상대에게 알려줌
      pc.onicecandidate = (e: RTCPeerConnectionIceEvent) => {
        if (e.candidate && socket) {
          socket.emit(SIGNAL_EMIT_EVENT.CANDIDATE, {
            candidateReceiveID: peerSocketId,
            candidate: e.candidate,
            candidateSendID: socket.id,
          });
        }
      };

      // 연결 상태 모니터링
      // 새로운 연결/연결 시도/연결 완료/연결 끊김/연결 실패/연결 종료
      pc.onconnectionstatechange = () => {
        console.log("연결 상태 변경:", pc.connectionState);
      };
      // ICE 연결 상태 모니터링
      pc.oniceconnectionstatechange = () => {
        console.log("ICE 연결 상태 변경:", pc.iceConnectionState);
      };

      // 원격 스트림 처리(상대가 addTrack을 호출할 때)
      // 상대의 비디오/오디오 신호를 받아 연결하는 과정
      // 상대방 스트림 수신 -> 기존 연결인지 확인 -> 스트림 정보 업데이트/추가
      pc.ontrack = (e) => {
        console.log("Received remote track:", e.streams[0]);
        console.log("변경된 peers", peers);
        setPeers((prev) => {
          // 이미 존재하는 피어인지 확인
          const exists = prev.find((p) => p.peerId === peerSocketId);
          if (exists) {
            // 기존 피어의 스트림 업데이트
            return prev.map((p) =>
              p.peerId === peerSocketId ? { ...p, stream: e.streams[0] } : p
            );
          }
          // 새로운 피어 추가
          return [
            ...prev,
            {
              peerId: peerSocketId,
              peerNickname,
              isHost: localUser.isHost,
              stream: e.streams[0],
            },
          ];
        });
      };

      if (isOffer) {
        try {
          const offer = await pc.createOffer();
          console.log("Created offer for:", peerSocketId);

          await pc.setLocalDescription(offer);
          console.log("Set local description for:", peerSocketId);

          if (socket && pc.localDescription) {
            socket.emit(SIGNAL_EMIT_EVENT.OFFER, {
              offerReceiveID: peerSocketId,
              sdp: pc.localDescription,
              offerSendID: socket.id,
              offerSendNickname: localUser.nickname,
            });
          }
        } catch (error) {
          console.error("Error in offer creation:", error);
        }
      }

      peerConnections.current[peerSocketId] = pc;
      return pc;
    } catch (error) {
      console.error("Error creating peer connection:", error);
      return null;
    }
  };

  const closePeerConnection = (peerSocketId: string) => {
    if (peerConnections.current[peerSocketId]) {
      // 연결 종료
      console.log("Closing peer connection:", peerSocketId);
      peerConnections.current[peerSocketId].close();
      // 연결 객체 제거
      delete peerConnections.current[peerSocketId];
      // UI에서 사용자 제거
      setPeers((prev) => prev.filter((peer) => peer.peerId !== peerSocketId));
    }
  };

  return {
    peers,
    setPeers,
    peerConnections,
    createPeerConnection,
    closePeerConnection,
  };
};

export default usePeerConnection;
