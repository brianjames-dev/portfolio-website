import { useCallback, useEffect, useState } from "react";
import {
  GALLERY_AUTH_URL,
  GALLERY_UNLOCK_STORAGE_KEY,
} from "../config/galleryLock";

const LOCK_EVENT_NAME = "gallery-lock-change";

const readStoredToken = () => {
  if (typeof window === "undefined") return "";
  try {
    return window.localStorage.getItem(GALLERY_UNLOCK_STORAGE_KEY) || "";
  } catch (error) {
    return "";
  }
};

const dispatchLockChange = (isUnlocked) => {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent(LOCK_EVENT_NAME, { detail: { isUnlocked } })
  );
};

const persistToken = (token) => {
  if (typeof window === "undefined") return;
  try {
    if (token) {
      window.localStorage.setItem(GALLERY_UNLOCK_STORAGE_KEY, token);
    } else {
      window.localStorage.removeItem(GALLERY_UNLOCK_STORAGE_KEY);
    }
    dispatchLockChange(Boolean(token));
  } catch (error) {
    // Ignore storage errors (private mode, blocked storage, etc.)
  }
};

const normalizePassword = (value) => value.trim();

function useGalleryLock() {
  const [token, setToken] = useState(() => readStoredToken());
  const [isUnlocked, setIsUnlocked] = useState(false);

  const verifyToken = useCallback(async (candidateToken) => {
    if (!candidateToken || !GALLERY_AUTH_URL) return false;

    try {
      const response = await fetch(GALLERY_AUTH_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: candidateToken }),
      });
      const data = await response.json();
      return Boolean(response.ok && data?.valid);
    } catch (error) {
      return false;
    }
  }, []);

  useEffect(() => {
    if (!token) return;

    let isMounted = true;
    verifyToken(token).then((valid) => {
      if (!isMounted) return;
      if (valid) {
        setIsUnlocked(true);
        dispatchLockChange(true);
      } else {
        setIsUnlocked(false);
        setToken("");
        persistToken("");
      }
    });

    return () => {
      isMounted = false;
    };
  }, [token, verifyToken]);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const handleEvent = (event) => {
      if (event?.detail && typeof event.detail.isUnlocked === "boolean") {
        setIsUnlocked(event.detail.isUnlocked);
        return;
      }
      setIsUnlocked(Boolean(readStoredToken()));
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

  const unlock = useCallback(async (password) => {
    const normalized = normalizePassword(password || "");

    if (!normalized) {
      return { ok: false, message: "Enter the gallery password." };
    }

    if (!GALLERY_AUTH_URL) {
      return {
        ok: false,
        message: "Unlock service is unavailable. Please request access.",
      };
    }

    try {
      const response = await fetch(GALLERY_AUTH_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: normalized }),
      });
      const data = await response.json();
      if (!response.ok || !data?.token) {
        return {
          ok: false,
          message: data?.error || "Incorrect password. Try again.",
        };
      }

      setToken(data.token);
      setIsUnlocked(true);
      persistToken(data.token);
      return { ok: true };
    } catch (error) {
      return { ok: false, message: "Unable to unlock right now." };
    }
  }, []);

  const reset = useCallback(() => {
    setIsUnlocked(false);
    setToken("");
    persistToken("");
  }, []);

  return { isUnlocked, unlock, reset };
}

export default useGalleryLock;
