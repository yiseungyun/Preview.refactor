import { useEffect, useState } from "react";

const useTemporarylock = (initialState = false, delay = 1000) => {
  const [buttonLocked, setButtonLocked] = useState<boolean>(initialState);

  useEffect(() => {
    if (!buttonLocked) return;

    const timer = setTimeout(() => setButtonLocked(false), delay);
    return () => clearTimeout(timer);
  }, [buttonLocked, delay]);

  return [buttonLocked, setButtonLocked] as const;
}

export default useTemporarylock;