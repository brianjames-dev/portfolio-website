import { useCallback, useEffect, useState } from "react";
import {
  GALLERY_PASSWORD,
  GALLERY_UNLOCK_STORAGE_KEY,
} from "../config/galleryLock";

const LOCK_EVENT_NAME = "gallery-lock-change";

const readUnlockState = () => {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(GALLERY_UNLOCK_STORAGE_KEY) === "true";
  } catch (error) {
    return false;
  }
};

const dispatchLockChange = (isUnlocked) => {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent(LOCK_EVENT_NAME, { detail: { isUnlocked } })
  );
};

const persistUnlockState = (isUnlocked) => {
  if (typeof window === "undefined") return;
  try {
    if (isUnlocked) {
      window.localStorage.setItem(GALLERY_UNLOCK_STORAGE_KEY, "true");
    } else {
      window.localStorage.removeItem(GALLERY_UNLOCK_STORAGE_KEY);
    }
    dispatchLockChange(isUnlocked);
  } catch (error) {
    // Ignore storage errors (private mode, blocked storage, etc.)
  }
};

const normalizePassword = (value) => value.trim();

function useGalleryLock() {
  const [isUnlocked, setIsUnlocked] = useState(readUnlockState);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const handleEvent = (event) => {
      if (event?.detail && typeof event.detail.isUnlocked === "boolean") {
        setIsUnlocked(event.detail.isUnlocked);
        return;
      }
      setIsUnlocked(readUnlockState());
    };

    const handleStorage = (event) => {
      if (event.key === GALLERY_UNLOCK_STORAGE_KEY) {
        handleEvent({});
      }
    };

    window.addEventListener(LOCK_EVENT_NAME, handleEvent);
    window.addEventListener("storage", handleStorage);
    return () => {
      window.removeEventListener(LOCK_EVENT_NAME, handleEvent);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  const unlock = useCallback((password) => {
    const normalized = normalizePassword(password || "");

    if (!normalized) {
      return { ok: false, message: "Enter the gallery password." };
    }

    if (normalized === GALLERY_PASSWORD) {
      setIsUnlocked(true);
      persistUnlockState(true);
      return { ok: true };
    }

    return { ok: false, message: "Incorrect password. Try again." };
  }, []);

  const reset = useCallback(() => {
    setIsUnlocked(false);
    persistUnlockState(false);
  }, []);

  return { isUnlocked, unlock, reset };
}

export default useGalleryLock;
