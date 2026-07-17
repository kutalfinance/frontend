import { useEffect, useState } from "react";

import { OFFLINE_MODE_EVENT, type OfflineModeChangedDetail, isOfflineMode } from "@/lib/offline-mode";

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(() => !isOfflineMode());

  useEffect(() => {
    const handler = (e: Event) => {
      const { offline } = (e as CustomEvent<OfflineModeChangedDetail>).detail;
      setIsOnline(!offline);
    };
    window.addEventListener(OFFLINE_MODE_EVENT, handler);
    return () => window.removeEventListener(OFFLINE_MODE_EVENT, handler);
  }, []);

  return isOnline;
}
