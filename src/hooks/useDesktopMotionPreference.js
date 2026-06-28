import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

export default function useDesktopMotionPreference() {
  const prefersReducedMotion = useReducedMotion();
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window === "undefined"
      ? false
      : window.matchMedia("(min-width: 601px)").matches
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 601px)");
    const updateViewport = () => {
      setIsDesktop(mediaQuery.matches);
    };

    updateViewport();
    mediaQuery.addEventListener?.("change", updateViewport);

    return () => {
      mediaQuery.removeEventListener?.("change", updateViewport);
    };
  }, []);

  return prefersReducedMotion && !isDesktop;
}
