import { MockPeerConnections, MockSocket } from "../../type/session.test";

export const mockSocket: MockSocket = {
  emit: jest.fn(),
  on: jest.fn(),
  off: jest.fn(),
  id: "mock-socket-id",
};

export const mockSocketStore = {
  socket: null as MockSocket | null,
  connect: jest.fn(),
  disconnect: jest.fn(),
};

export const mockMediaStream = {
  getTracks: jest.fn().mockReturnValue([{ stop: jest.fn(), enabled: true }]),
};

export const mockToast = { success: jest.fn(), error: jest.fn() };

export const mockNavigate = jest.fn();

export const mockPeerConnections: MockPeerConnections = {
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
