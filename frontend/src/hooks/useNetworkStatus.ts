import { useEffect, useState } from "react"

interface NetworkInformation {
  readonly effectiveType: 'slow-2g' | '2g' | '3g' | '4g';
  readonly downlink: number;
  readonly rtt: number;
  readonly saveData: boolean;
  readonly downlinkMax?: number;
  readonly type?: 'bluetooth' | 'cellular' | 'ethernet' | 'none' | 'wifi' | 'wimax' | 'other' | 'unknown';
  onchange?: () => void;
  addEventListener(type: string, listener: EventListenerOrEventListenerObject): void;
  removeEventListener(type: string, listener: EventListenerOrEventListenerObject): void;
}

interface NavigatorWithConnection extends Navigator {
  connection: NetworkInformation;
}

const useNetworkStatus = () => {
  const getInitialConnectionType = () => {
    if ("connection" in navigator) {
      const nav = navigator as NavigatorWithConnection;
      if (nav.connection) {
        return nav.connection.effectiveType;
      }
    }
    return "unknown";
  };

  const [connectionType, setConnectionType] = useState<string>(getInitialConnectionType());

  useEffect(() => {
    if ("connection" in navigator) {
      const nav = navigator as NavigatorWithConnection;

      if (nav.connection) {
        const updateConnectionStatus = () => {
          setConnectionType(nav.connection.effectiveType);
        };

        nav.connection.addEventListener("change", updateConnectionStatus);
        return () => {
          nav.connection.removeEventListener("change", updateConnectionStatus);
        };
      }
    }
  }, []);

  return { connectionType };
}

export default useNetworkStatus;