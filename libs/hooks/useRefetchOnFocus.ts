import { useEffect } from "react";

export const useRefetchOnFocus = (
  refetch: () => unknown,
  enabled: boolean,
): void => {
  useEffect(() => {
    if (!enabled) return;

    const sync = () => {
      if (document.visibilityState === "visible") void refetch();
    };
    window.addEventListener("focus", sync);
    document.addEventListener("visibilitychange", sync);
    return () => {
      window.removeEventListener("focus", sync);
      document.removeEventListener("visibilitychange", sync);
    };
  }, [enabled, refetch]);
};
