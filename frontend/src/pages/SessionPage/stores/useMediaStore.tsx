import { create } from "zustand";

type SetState<T> = (value: T | ((prev: T) => T)) => void;

interface MediaState {
  stream: MediaStream | null;
  isVideoOn: boolean;
  isMicOn: boolean;
  videoLoading: boolean;

  userVideoDevices: MediaDeviceInfo[];
  userAudioDevices: MediaDeviceInfo[];
  selectedVideoDeviceId: string | null;
  selectedAudioDeviceId: string | null;

  setStream: (stream: MediaStream | null) => void;
  setIsVideoOn: SetState<boolean>;
  setIsMicOn: SetState<boolean>;
  setVideoLoading: (loading: boolean) => void;

  setUserVideoDevices: (devices: MediaDeviceInfo[]) => void;
  setUserAudioDevices: (devices: MediaDeviceInfo[]) => void;
  setSelectedVideoDeviceId: (id: string) => void;
  setSelectedAudioDeviceId: (id: string) => void;
}

export const useMediaStore = create<MediaState>((set) => ({
  stream: null,
  isVideoOn: true,
  isMicOn: true,
  videoLoading: false,

  userVideoDevices: [],
  userAudioDevices: [],
  selectedVideoDeviceId: null,
  selectedAudioDeviceId: null,

  setStream: (stream) => set({ stream }),
  setIsVideoOn: (value) => set((state) => ({
    isVideoOn: typeof value === 'function'
      ? (value as (prev: boolean) => boolean)(state.isVideoOn)
      : value
  })),
  setIsMicOn: (value) => set((state) => ({
    isMicOn: typeof value === 'function'
      ? (value as (prev: boolean) => boolean)(state.isMicOn)
      : value
  })),
  setVideoLoading: (loading) => set({ videoLoading: loading }),

  setUserVideoDevices: (devices) => set({ userVideoDevices: devices }),
  setUserAudioDevices: (devices) => set({ userAudioDevices: devices }),
  setSelectedVideoDeviceId: (id) => set({ selectedVideoDeviceId: id }),
  setSelectedAudioDeviceId: (id) => set({ selectedAudioDeviceId: id }),
}));