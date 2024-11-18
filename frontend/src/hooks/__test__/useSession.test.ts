import { renderHook } from "@testing-library/react";
import { useSession } from "../useSession";
import useSocketStore from "@/stores/useSocketStore";
import useMediaDevices from "@/hooks/useMediaDevices";
import usePeerConnection from "@/hooks/usePeerConnection";
import { useNavigate } from "react-router-dom";
import { Socket } from "socket.io-client";

type MockSocket = Partial<Socket> & {
  emit: jest.Mock;
  on: jest.Mock;
  off: jest.Mock;
  id: string;
};

const mockSocket: MockSocket = {
  emit: jest.fn(),
  on: jest.fn(),
  off: jest.fn(),
  id: "mock-socket-id",
};

const mockSocketStore = {
  socket: null as MockSocket | null,
  connect: jest.fn(),
  disconnect: jest.fn()
};

const mockMediaStream = {
  getTracks: jest.fn().mockReturnValue([{ stop: jest.fn(), enabled: true }]),
};

const mockNavigate = jest.fn();
let mockPeerConnections = { current: {} };

// jest.mock: 실제 모듈대신 mock 모듈을 사용하도록 설정
jest.mock("@/hooks/useMediaDevices");

jest.mock("@/hooks/usePeerConnection", () => ({
  __esModule: true,
  default: jest.fn().mockReturnValue({
    createPeerConnection: jest.fn(),
    closePeerConnection: jest.fn(),
    peers: [],
    setPeers: jest.fn(),
    peerConnections: { current: {} }
  })
}));

jest.mock("@/hooks/useToast", () => ({
  __esModule: true,
  default: () => ({
    error: jest.fn(),
    success: jest.fn(),
  })
}));

jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
}));

jest.mock("@/stores/useSocketStore", () => ({
  __esModule: true,
  default: jest.fn(() => mockSocketStore)
}));

jest.mock("@/hooks/useSocket", () => ({
  __esModule: true,
  default: () => {
    const store = useSocketStore();
    if (!store.socket) {
      store.connect('test-url');
    }
    return { socket: store.socket };
  }
}));

describe("useSession Hook 테스트", () => {

  beforeEach(() => {
    jest.clearAllMocks();
    mockSocketStore.socket = null;
    mockSocketStore.connect = jest.fn();

    mockPeerConnections = {
      current: {
        "peer-1": {
          ontrack: null,
          onicecandidate: null,
          oniceconnectionstatechange: null,
          onconnectionstatechange: null,
          close: jest.fn(),
        },
      },
    };

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
      getMedia: jest.fn().mockResolvedValue(mockMediaStream),
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

  /*describe("스터디룸 입장 테스트", () => {
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
      expect(useMediaDevices().getMedia).toHaveBeenCalled();

      // 4. 소켓 이벤트 발생 확인
      expect(mockSocket.emit).toHaveBeenCalledWith("join_room", {
        roomId: "test-session",
        nickname: "test-user",
      });

      // 5. 성공 메시지 표시
      expect(mockToast.success).toHaveBeenCalled();
    });

    it("닉네임 없이 스터디룸 입장", async () => {
      const { result } = renderHook(() => useSession("test-session"));

      await act(async () => {
        await result.current.joinRoom();
      });

      expect(mockToast.error).toHaveBeenCalledWith("닉네임을 입력해주세요.");
      expect(mockSocket.emit).not.toHaveBeenCalled();
    });

    it("미디어 스트림 획득 실패 시 에러 처리", async () => {
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
    });
  });

  describe("리액션 기능 테스트", () => {
    it("리액션 이벤트 발생", () => {
      const { result } = renderHook(() => useSession("test-session"));

      act(() => {
        result.current.emitReaction("👍");
      });

      expect(mockSocket.emit).toHaveBeenCalledWith("reaction", {
        roomId: "test-session",
        reaction: "👍",
      });
    });
  });

  describe("소켓 이벤트 리스너 테스트", () => {
    it("모든 소켓 이벤트 리스너가 등록", () => {
      renderHook(() => useSession("test-session"));

      const expectedEvents = [
        "all_users",
        "getOffer",
        "getAnswer",
        "getCandidate",
        "user_exit",
        "room_full",
        "reaction",
      ];

      expectedEvents.forEach((event) => {
        expect(mockSocket.on).toHaveBeenCalledWith(event, expect.any(Function));
      });
    });

    it("room_full 이벤트 발생", () => {
      renderHook(() => useSession("test-session"));

      // room_full 이벤트 핸들러 찾기
      const roomFullHandler = mockSocket.on.mock.calls.find(
        ([event]) => event === "room_full"
      )[1];

      // 이벤트 핸들러 실행
      roomFullHandler();

      expect(mockToast.error).toHaveBeenCalledWith(
        "해당 세션은 이미 유저가 가득 찼습니다."
      );
      expect(mockNavigate).toHaveBeenCalledWith("/sessions");
    });
  });

  describe("정리(Cleanup) 테스트", () => {
    it("언마운트 시 모든 리소스 정리", () => {
      const { unmount } = renderHook(() => useSession("test-session"));

      unmount();

      // 1. 소켓 이벤트 리스너 제거
      expect(mockSocket.off).toHaveBeenCalledWith(
        "all_users",
        expect.any(Function)
      );
      expect(mockSocket.off).toHaveBeenCalledWith(
        "getOffer",
        expect.any(Function)
      );
      expect(mockSocket.off).toHaveBeenCalledWith(
        "getAnswer",
        expect.any(Function)
      );
      expect(mockSocket.off).toHaveBeenCalledWith(
        "getCandidate",
        expect.any(Function)
      );
      expect(mockSocket.off).toHaveBeenCalledWith("user_exit");
      expect(mockSocket.off).toHaveBeenCalledWith("room_full");
      expect(mockSocket.off).toHaveBeenCalledWith(
        "reaction",
        expect.any(Function)
      );

      // 2. 미디어 트랙 정리
      expect(mockMediaStream.getTracks).toHaveBeenCalled();
      expect(mockMediaStream.getTracks()[0].stop).toHaveBeenCalled();

      // 3. Peer Connection 정리
      expect(mockPeerConnections.current["peer-1"].close).toHaveBeenCalled();
    });

    it("스트림이 없는 경우에도 정리 동작", () => {
      (useMediaDevices as jest.Mock).mockReturnValue({
        ...useMediaDevices(),
        stream: null,
      });

      const { unmount } = renderHook(() => useSession("test-session"));
      unmount();

      expect(mockSocket.off).toHaveBeenCalled();
    });
  });*/
});
