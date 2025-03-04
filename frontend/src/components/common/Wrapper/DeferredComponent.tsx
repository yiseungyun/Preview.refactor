import useNetworkStatus from "@/hooks/useNetworkStatus";
import { ReactNode, useEffect, useState } from "react";

interface AdaptiveDeferredProps {
  children: ReactNode;
}

const DELAY_MS = 200;

const isSlowNetwork = (type: string) => {
  return ["slow-2g", "2g", "3g"].includes(type);
}

const DeferredComponent = ({
  children
}: AdaptiveDeferredProps) => {
  const { connectionType } = useNetworkStatus();
  const [isDeferred, setIsDeferred] = useState(false);

  useEffect(() => {
    if (isSlowNetwork(connectionType)) {
      setIsDeferred(true);
      return;
    }

    const timeoutId = setTimeout(() => {
      setIsDeferred(true);
    }, DELAY_MS);

    return () => clearTimeout(timeoutId);
  }, []);

  if (!isDeferred) return null;
  return <>{children}</>;
}

export default DeferredComponent;