import { useEffect, useRef } from "react";
import IconGlyph from "./IconGlyph";
import "../styles/VideoOverlay.css";

function VideoOverlay({ isOpen, video, onClose }) {
  const cardRef = useRef(null);
  const closeButtonRef = useRef(null);
  const previouslyFocusedRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return undefined;

    previouslyFocusedRef.current = document.activeElement;
    const y = window.scrollY;
    document.body.classList.add("no-scroll");
    document.body.classList.add("video-overlay-open");
    document.body.style.top = `-${y}px`;

    const focusTimer = window.setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 0);

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
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
      const prevY = parseInt(document.body.style.top || "0", 10) * -1;
      document.body.classList.remove("no-scroll");
      document.body.classList.remove("video-overlay-open");
      document.body.style.top = "";
      window.scrollTo(0, prevY);
      previouslyFocusedRef.current?.focus?.();
    };
  }, [isOpen, onClose]);

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
