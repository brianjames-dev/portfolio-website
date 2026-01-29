import { useEffect, useRef, useState } from "react";
import "../styles/GalleryLock.css";
import { GALLERY_LOCK_HINT } from "../config/galleryLock";

function GalleryLockModal({ isOpen, onClose, onUnlock }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    setPassword("");
    setError("");
    const timer = window.setTimeout(() => {
      inputRef.current?.focus();
    }, 0);

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.classList.add("no-scroll");

    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("keydown", handleKeyDown);
      document.body.classList.remove("no-scroll");
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (event) => {
    event.preventDefault();
    const result = onUnlock(password);
    if (!result?.ok) {
      setError(result?.message || "Incorrect password. Try again.");
      return;
    }
    setError("");
  };

  return (
    <div
      className="gallery-lock-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="gallery-lock-title"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="gallery-lock-modal">
        <div className="gallery-lock-header">
          <h3 id="gallery-lock-title">Gallery locked</h3>
          <button
            type="button"
            className="gallery-lock-close"
            onClick={onClose}
          >
            Close
          </button>
        </div>
        <p className="gallery-lock-hint">{GALLERY_LOCK_HINT}</p>
        <form className="gallery-lock-form" onSubmit={handleSubmit}>
          <label className="gallery-lock-label" htmlFor="gallery-password">
            Password
          </label>
          <input
            id="gallery-password"
            ref={inputRef}
            className="gallery-lock-input"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          {error && <p className="gallery-lock-error">{error}</p>}
          <div className="gallery-lock-actions">
            <button type="submit" className="gallery-lock-submit">
              Unlock gallery
            </button>
            <button
              type="button"
              className="gallery-lock-cancel"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default GalleryLockModal;
