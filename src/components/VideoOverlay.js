import { useEffect, useRef } from "react";
import IconGlyph from "./IconGlyph";
import "../styles/VideoOverlay.css";

function VideoOverlay({ isOpen, video, onClose }) {
  const cardRef = useRef(null);
  const closeButtonRef = useRef(null);
  const previouslyFocusedRef = useRef(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return undefined;

    previouslyFocusedRef.current = document.activeElement;
    const y = window.scrollY;
    let isRestoringScroll = false;
    const keepScrollPinned = () => {
      if (isRestoringScroll || Math.abs(window.scrollY - y) < 1) return;
      isRestoringScroll = true;
      window.scrollTo(0, y);
      window.requestAnimationFrame(() => {
        isRestoringScroll = false;
      });
    };

    const preventBackgroundTouch = (event) => {
      event.preventDefault();
    };

    document.documentElement.classList.add("modal-scroll-lock");
    document.body.classList.add("no-scroll");
    document.body.classList.add("video-overlay-open");

    const setViewportVars = () => {
      const viewport = window.visualViewport;
      const width = viewport?.width || window.innerWidth;
      const height = viewport?.height || window.innerHeight;
      const offsetTop = viewport?.offsetTop || 0;
      const offsetLeft = viewport?.offsetLeft || 0;

      document.documentElement.style.setProperty(
        "--video-viewport-width",
        `${width}px`
      );
      document.documentElement.style.setProperty(
        "--video-viewport-height",
        `${height}px`
      );
      document.documentElement.style.setProperty(
        "--video-viewport-top",
        `${offsetTop}px`
      );
      document.documentElement.style.setProperty(
        "--video-viewport-left",
        `${offsetLeft}px`
      );
    };

    setViewportVars();
    const refreshViewportLock = () => {
      setViewportVars();
      window.requestAnimationFrame(keepScrollPinned);
    };

    window.visualViewport?.addEventListener("resize", refreshViewportLock);
    window.visualViewport?.addEventListener("scroll", refreshViewportLock);
    window.addEventListener("resize", refreshViewportLock);
    window.addEventListener("orientationchange", refreshViewportLock);
    window.addEventListener("scroll", keepScrollPinned, { passive: true });
    document.addEventListener("touchmove", preventBackgroundTouch, {
      passive: false,
    });

    const focusTimer = window.setTimeout(() => {
      try {
        closeButtonRef.current?.focus({ preventScroll: true });
      } catch (error) {
        closeButtonRef.current?.focus();
      }
    }, 0);

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onCloseRef.current();
        return;
      }

      if (event.key !== "Tab") return;

      const focusable = cardRef.current?.querySelectorAll(
        'a[href], button:not([disabled]), iframe, [tabindex]:not([tabindex="-1"])'
      );
      const elements = Array.from(focusable || []);
      if (!elements.length) return;

      const first = elements[0];
      const last = elements[elements.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener("keydown", handleKeyDown);
      const prevY = y;
      window.visualViewport?.removeEventListener("resize", refreshViewportLock);
      window.visualViewport?.removeEventListener("scroll", refreshViewportLock);
      window.removeEventListener("resize", refreshViewportLock);
      window.removeEventListener("orientationchange", refreshViewportLock);
      window.removeEventListener("scroll", keepScrollPinned);
      document.removeEventListener("touchmove", preventBackgroundTouch);
      document.documentElement.style.removeProperty("--video-viewport-width");
      document.documentElement.style.removeProperty("--video-viewport-height");
      document.documentElement.style.removeProperty("--video-viewport-top");
      document.documentElement.style.removeProperty("--video-viewport-left");
      document.documentElement.classList.remove("modal-scroll-lock");
      document.body.classList.remove("no-scroll");
      document.body.classList.remove("video-overlay-open");
      window.requestAnimationFrame(() => {
        window.scrollTo(0, prevY || y);
        try {
          previouslyFocusedRef.current?.focus?.({ preventScroll: true });
        } catch (error) {
          previouslyFocusedRef.current?.focus?.();
        }
      });
    };
  }, [isOpen]);

  if (!isOpen || !video) return null;

  const videoId = video?.id || "";
  const title = video?.title || "Demo video";
  const embedSrc = `https://www.youtube.com/embed/${videoId}?rel=0`;

  return (
    <div
      className="video-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={() => {
        onClose();
      }}
    >
      <div
        className="video-overlay-card"
        ref={cardRef}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          ref={closeButtonRef}
          className="video-overlay-close"
          type="button"
          onClick={onClose}
          aria-label="Close demo"
        >
          <IconGlyph name="close" className="video-overlay-close-icon" />
        </button>
        <div className="video-embed">
          <iframe
            src={embedSrc}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
}

export default VideoOverlay;
