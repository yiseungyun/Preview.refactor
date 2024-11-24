export type MockSocket = Partial<Socket> & {
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

export interface MockPeerConnections {
  current: {
    [key: string]: MockPeerConnection;
  };
}
