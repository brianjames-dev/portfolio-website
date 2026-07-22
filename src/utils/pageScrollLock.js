let lockCount = 0;
let lockedScrollY = 0;
let restoreFrame = 0;

export function lockPageScroll() {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return () => {};
  }

  if (restoreFrame) {
    window.cancelAnimationFrame(restoreFrame);
    restoreFrame = 0;
  }

  if (lockCount === 0) {
    const existingTop = Number.parseFloat(document.body.style.top);
    lockedScrollY =
      document.body.classList.contains("no-scroll") &&
      Number.isFinite(existingTop)
        ? Math.max(0, -existingTop)
        : window.scrollY;

    document.body.classList.add("no-scroll");
    document.body.style.top = `-${lockedScrollY}px`;
  }

  lockCount += 1;
  let released = false;

  return () => {
    if (released) return;
    released = true;
    lockCount = Math.max(0, lockCount - 1);
    if (lockCount > 0) return;

    restoreFrame = window.requestAnimationFrame(() => {
      restoreFrame = 0;
      if (lockCount > 0) return;

      document.body.classList.remove("no-scroll");
      document.body.style.top = "";
      window.scrollTo(0, lockedScrollY);
      lockedScrollY = 0;
    });
  };
}
