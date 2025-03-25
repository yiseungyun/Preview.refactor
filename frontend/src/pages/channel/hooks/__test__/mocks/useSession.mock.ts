import { Socket } from "socket.io-client";

type MockSocket = Partial<Socket> & {
  emit: jest.Mock;
  on: jest.Mock;
  off: jest.Mock;
  id: string;
};

interface MockPeerConnection {
  ontrack: null | ((event: any) => void);
  onicecandidate: null | ((event: any) => void);
  oniceconnectionstatechange: null | (() => void);
  onconnectionstatechange: null | (() => void);
  close: jest.Mock;
}

interface MockPeerConnections {
  current: {
    [key: string]: MockPeerConnection;
  };
}

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
