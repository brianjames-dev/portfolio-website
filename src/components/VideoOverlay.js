import { useEffect } from "react";
import iconMap from "../data/iconMap.js";
import "../styles/VideoOverlay.css";

function VideoOverlay({ isOpen, video, onClose }) {
  useEffect(() => {
    if (!isOpen) return undefined;

    const y = window.scrollY;
    document.body.classList.add("no-scroll");
    document.body.style.top = `-${y}px`;

    return () => {
      const prevY = parseInt(document.body.style.top || "0", 10) * -1;
      document.body.classList.remove("no-scroll");
      document.body.style.top = "";
      window.scrollTo(0, prevY);
    };
  }, [isOpen]);

  if (!isOpen || !video) return null;

  const videoId = video?.id || "";
  const title = video?.title || "Demo video";
  const embedSrc = `https://www.youtube.com/embed/${videoId}?rel=0`;

  return (
    <div
      className="video-overlay"
      onClick={() => {
        onClose();
      }}
    >
      <div
        className="video-overlay-card"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          className="video-overlay-close"
          type="button"
          onClick={onClose}
          aria-label="Close demo"
        >
          <img src={iconMap["Close"]} alt="" aria-hidden="true" />
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
