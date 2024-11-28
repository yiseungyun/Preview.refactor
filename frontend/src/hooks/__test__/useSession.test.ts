import { renderHook } from "@testing-library/react";
import { useSession } from "@hooks/session/useSession";
import useSocketStore from "@stores/useSocketStore";
import useMediaDevices from "@hooks/session/useMediaDevices";
import usePeerConnection from "@hooks/session/usePeerConnection";
import { useNavigate } from "react-router-dom";
import { act } from "react";
import {
  mockMediaStream,
  mockNavigate,
  mockPeerConnections,
  mockSocket,
  mockSocketStore,
  mockToast,
} from "@hooks/__test__/mocks/useSession.mock";
import {
  SESSION_EMIT_EVENT,
  SESSION_LISTEN_EVENT,
} from "@/constants/WebSocket/SessionEvent";
import { SIGNAL_LISTEN_EVENT } from "@/constants/WebSocket/SignalingEvent";

const REACTION_DURATION = 3000;

// jest.mock: 실제 모듈대신 mock 모듈을 사용하도록 설정
jest.mock("@hooks/session/useMediaDevices");

jest.mock("@hooks/session/usePeerConnection", () => ({
  __esModule: true,
  default: jest.fn().mockReturnValue({
    createPeerConnection: jest.fn(),
    closePeerConnection: jest.fn(),
    peers: [],
    setPeers: jest.fn(),
    peerConnections: { current: {} },
  }),
}));

jest.mock("@hooks/useToast", () => ({
  __esModule: true,
  default: () => mockToast,
}));

jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
}));

jest.mock("@stores/useSocketStore", () => ({
  __esModule: true,
  default: jest.fn(() => mockSocketStore),
}));

jest.mock("@hooks/useSocket", () => ({
  __esModule: true,
  default: () => {
    const store = useSocketStore();
    if (!store.socket) {
      store.connect("test-url");
    }
    return { socket: store.socket };
  },
}));

describe("useSession Hook 테스트", () => {
  const mockGetMedia = jest.fn().mockResolvedValue(mockMediaStream);

  beforeEach(() => {
    jest.clearAllMocks();

    (useMediaDevices as jest.Mock).mockReturnValue({
      userAudioDevices: [],
      userVideoDevices: [],
      selectedAudioDeviceId: "",
      selectedVideoDeviceId: "",
      stream: mockMediaStream,
      isVideoOn: true,
      isMicOn: true,
      videoLoading: false,
      handleMicToggle: jest.fn(),
      handleVideoToggle: jest.fn(),
      setSelectedAudioDeviceId: jest.fn(),
      setSelectedVideoDeviceId: jest.fn(),
      getMedia: mockGetMedia,
    });

    (usePeerConnection as jest.Mock).mockReturnValue({
      createPeerConnection: jest.fn(),
      closePeerConnection: jest.fn(),
      peers: [],
      setPeers: jest.fn(),
      peerConnections: mockPeerConnections,
    });

    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
  });

  describe("초기화 및 기본 동작 테스트", () => {
    it("초기 상태 설정", () => {
      const { result } = renderHook(() => useSession("test-session"));

      expect(result.current.nickname).toBe("");
      expect(result.current.reaction).toBe("");
      expect(result.current.isVideoOn).toBe(true);
      expect(result.current.isMicOn).toBe(true);
      expect(result.current.roomMetadata).toBeNull();
      expect(result.current.isHost).toBe(false);
      expect(result.current.participants).toEqual([
        { nickname: "", isHost: false },
      ]);
    });

    it("소켓이 없는 경우: 연결 시도", () => {
      renderHook(() => useSession("test-session"));

      expect(mockSocketStore.connect).toHaveBeenCalled();
    });

    it("이미 소켓이 있는 경우: 연결 시도 X", () => {
      mockSocketStore.socket = mockSocket;

      renderHook(() => useSession("test-session"));
      expect(mockSocketStore.connect).not.toHaveBeenCalled();
    });
  });

  describe("스터디룸 입장 테스트", () => {
    beforeEach(() => {
      mockSocketStore.socket = mockSocket;
    });

    it("스터디룸 입장 성공", async () => {
      const { result } = renderHook(() => useSession("test-session"));

      // 1. 닉네임 설정
      act(() => {
        result.current.setNickname("test-user");
      });

      // 2. 방 입장 시도
      await act(async () => {
        await result.current.joinRoom();
      });

      // 3. 미디어 스트림 요청 확인
      expect(mockGetMedia).toHaveBeenCalled();

      // 4. 소켓 이벤트 발생 확인
      expect(mockSocket.emit).toHaveBeenCalledWith(SESSION_EMIT_EVENT.JOIN, {
        roomId: "test-session",
        nickname: "test-user",
      });
    });

    it("닉네임 없이 스터디룸 입장", async () => {
      const { result } = renderHook(() => useSession("test-session"));

      await act(async () => {
        await result.current.joinRoom();
      });

      expect(mockToast.error).toHaveBeenCalledWith("닉네임을 입력해주세요.");
      expect(mockSocket.emit).not.toHaveBeenCalled();
    });

    /*it("미디어 스트림 획득 실패 시 에러 처리", async () => {
      (useMediaDevices as jest.Mock).mockReturnValue({
        ...useMediaDevices(),
        getMedia: jest.fn().mockResolvedValue(null),
      });

      const { result } = renderHook(() => useSession("test-session"));
      act(() => {
        result.current.setNickname("test-user");
      });

      await act(async () => {
        await result.current.joinRoom();
      });

      expect(mockToast.error).toHaveBeenCalledWith(
        "미디어 스트림을 가져오지 못했습니다. 미디어 장치를 확인 후 다시 시도해주세요."
      );
      expect(mockNavigate).toHaveBeenCalledWith("/sessions");
    });*/
  });

  describe("리액션 기능 테스트", () => {
    beforeEach(() => {
      jest.useFakeTimers();
      mockSocketStore.socket = mockSocket;
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it("리액션 이벤트 발생 및 타이머 동작", () => {
      const { result } = renderHook(() => useSession("test-session"));

      act(() => {
        result.current.emitReaction("👍");
      });

      expect(mockSocket.emit).toHaveBeenCalledWith(
        SESSION_EMIT_EVENT.REACTION,
        {
          roomId: "test-session",
          reactionType: "👍",
        }
      );

      act(() => {
        jest.advanceTimersByTime(REACTION_DURATION);
      });
      expect(result.current.reaction).toBe("");
    });
  });

  describe("소켓 이벤트 리스너 테스트", () => {
    beforeEach(() => {
      mockSocketStore.socket = mockSocket;
      renderHook(() => useSession("test-session"));
    });

    it("모든 소켓 이벤트 리스너 등록", () => {
      const expectedEvents = [
        SIGNAL_LISTEN_EVENT.OFFER,
        SIGNAL_LISTEN_EVENT.ANSWER,
        SIGNAL_LISTEN_EVENT.CANDIDATE,
        SESSION_LISTEN_EVENT.FULL,
        SESSION_LISTEN_EVENT.QUIT,
        SESSION_LISTEN_EVENT.JOIN,
        SESSION_LISTEN_EVENT.CHANGE_HOST,
        SESSION_LISTEN_EVENT.FINISH,
        SESSION_LISTEN_EVENT.REACTION,
      ];

      expectedEvents.forEach((event) => {
        expect(mockSocket.on).toHaveBeenCalledWith(event, expect.any(Function));
      });
    });

    it("방이 가득찬 FULL 이벤트 발생", () => {
      const roomFullHandler = mockSocket.on.mock.calls.find(
        ([event]: [string]) => event === SESSION_LISTEN_EVENT.FULL
      )[1];

      roomFullHandler();

      expect(mockToast.error).toHaveBeenCalledWith(
        "해당 세션은 이미 유저가 가득 찼습니다."
      );
      expect(mockNavigate).toHaveBeenCalledWith("/sessions");
    });
  });

  describe("정리(Clean up) 테스트", () => {
    it("언마운트 시 모든 리소스 정리", () => {
      mockSocketStore.socket = mockSocket;
      const { unmount } = renderHook(() => useSession("test-session"));

      unmount();

      // 1. 소켓 이벤트 리스너 제거
      expect(mockSocket.off).toHaveBeenCalledWith(
        SIGNAL_LISTEN_EVENT.OFFER,
        expect.any(Function)
      );
      expect(mockSocket.off).toHaveBeenCalledWith(
        SIGNAL_LISTEN_EVENT.ANSWER,
        expect.any(Function)
      );
      expect(mockSocket.off).toHaveBeenCalledWith(
        SIGNAL_LISTEN_EVENT.CANDIDATE,
        expect.any(Function)
      );
      expect(mockSocket.off).toHaveBeenCalledWith(
        SESSION_LISTEN_EVENT.JOIN,
        expect.any(Function)
      );
      expect(mockSocket.off).toHaveBeenCalledWith(
        SESSION_LISTEN_EVENT.QUIT,
        expect.any(Function)
      );
      expect(mockSocket.off).toHaveBeenCalledWith(
        SESSION_LISTEN_EVENT.FULL,
        expect.any(Function)
      );
      expect(mockSocket.off).toHaveBeenCalledWith(
        SESSION_LISTEN_EVENT.CHANGE_HOST,
        expect.any(Function)
      );
      expect(mockSocket.off).toHaveBeenCalledWith(
        SESSION_LISTEN_EVENT.REACTION,
        expect.any(Function)
      );
      expect(mockSocket.off).toHaveBeenCalledWith(
        SESSION_LISTEN_EVENT.FINISH,
        expect.any(Function)
      );

      // 2. 미디어 트랙 정리
      expect(mockMediaStream.getTracks).toHaveBeenCalled();
      expect(mockMediaStream.getTracks()[0].stop).toHaveBeenCalled();

      // 3. Peer Connection 정리
      expect(mockPeerConnections.current["peer-1"].close).toHaveBeenCalled();
    });
  });
});
