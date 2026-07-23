let lockCount = 0;
let unlockFrame = 0;

export function lockPageScroll() {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return () => {};
  }

  if (unlockFrame) {
    window.cancelAnimationFrame(unlockFrame);
    unlockFrame = 0;
  }

  if (lockCount === 0) {
    document.documentElement.classList.add("page-scroll-locked");
    document.body.classList.add("no-scroll");
  }

  lockCount += 1;
  let released = false;

  return () => {
    if (released) return;
    released = true;
    lockCount = Math.max(0, lockCount - 1);
    if (lockCount > 0) return;

    unlockFrame = window.requestAnimationFrame(() => {
      unlockFrame = 0;
      if (lockCount > 0) return;

      document.documentElement.classList.remove("page-scroll-locked");
      document.body.classList.remove("no-scroll");
    });
  };
}
