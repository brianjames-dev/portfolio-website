import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  GALLERY_ACCESS_REQUEST_HINT,
  GALLERY_ACCESS_REQUEST_URL,
  GALLERY_LOCK_HINT,
} from "../config/galleryLock";
import iconMap from "../data/iconMap.js";
import "../styles/GalleryLock.css";

const LazyReCAPTCHA = lazy(() => import("react-google-recaptcha"));

function GalleryLockModal({ isOpen, onClose, onUnlock }) {
  const [password, setPassword] = useState("");
  const [unlockError, setUnlockError] = useState("");
  const [unlockLoading, setUnlockLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeView, setActiveView] = useState("unlock");

  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState({});
  const [captchaToken, setCaptchaToken] = useState(null);
  const [status, setStatus] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [requestLoading, setRequestLoading] = useState(false);
  const [showCaptcha, setShowCaptcha] = useState(false);
  const formRef = useRef(null);

  const prefetchRecaptcha = useCallback(() => {
    import("react-google-recaptcha");
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const root = document.documentElement;
    setIsDarkMode(root.getAttribute("data-theme") === "dark");
    setPassword("");
    setUnlockError("");
    setUnlockLoading(false);
    setActiveView("unlock");
    setForm({ name: "", email: "", message: "" });
    setErrors({});
    setCaptchaToken(null);
    setStatus(null);
    setStatusMessage("");
    setRequestLoading(false);
    setShowCaptcha(false);

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    };

    const observer = new MutationObserver(() => {
      setIsDarkMode(root.getAttribute("data-theme") === "dark");
    });
    observer.observe(root, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    document.addEventListener("keydown", handleKeyDown);
    document.body.classList.add("no-scroll");

    return () => {
      observer.disconnect();
      document.removeEventListener("keydown", handleKeyDown);
      document.body.classList.remove("no-scroll");
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;
    const selector =
      activeView === "request" ? "#access-name" : "#gallery-password";
    const timer = window.setTimeout(() => {
      formRef.current?.querySelector(selector)?.focus();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [isOpen, activeView]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required.";
    if (!form.email.trim()) newErrors.email = "Email is required.";
    if (!form.message.trim()) newErrors.message = "Message is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUnlock = async (event) => {
    event.preventDefault();
    if (unlockLoading) return;
    setUnlockLoading(true);
    const result = await onUnlock(password);
    if (!result?.ok) {
      setUnlockError(result?.message || "Incorrect password. Try again.");
      setUnlockLoading(false);
      return;
    }
    setUnlockError("");
    setUnlockLoading(false);
  };

  const handleRequestSubmit = async (event) => {
    event.preventDefault();
    if (requestLoading) return;

    if (!validate() || !captchaToken) {
      setStatus("error");
      setStatusMessage(
        "Please complete all fields and verify you're not a robot.",
      );
      return;
    }

    if (!GALLERY_ACCESS_REQUEST_URL) {
      setStatus("error");
      setStatusMessage("Access request service is unavailable right now.");
      return;
    }

    setRequestLoading(true);
    try {
      const response = await fetch(GALLERY_ACCESS_REQUEST_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, captchaToken }),
      });
      const data = await response.json();
      if (response.ok) {
        setStatus("success");
        setStatusMessage("Request sent! I'll follow up soon.");
        setForm({ name: "", email: "", message: "" });
        setErrors({});
        setCaptchaToken(null);
      } else {
        setStatus("error");
        setStatusMessage(
          data.error || "Something went wrong. Please try again later.",
        );
      }
    } catch (error) {
      setStatus("error");
      setStatusMessage("Failed to send. Check your internet connection.");
    } finally {
      setRequestLoading(false);
    }
  };

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const onFirstInteract = () => {
    prefetchRecaptcha();
    setShowCaptcha(true);
  };

  const handleRequestAccessClick = () => {
    onFirstInteract();
    setActiveView("request");
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
      <div
        className={`gallery-lock-modal${
          activeView === "unlock" ? " gallery-lock-modal--compact" : ""
        }`}
        ref={formRef}
      >
        <div className="gallery-lock-header">
          <h3 id="gallery-lock-title">
            {activeView === "request"
              ? "Request access"
              : "Private Gallery Access"}
          </h3>
          <button
            type="button"
            className="gallery-lock-close"
            onClick={onClose}
            aria-label="Close"
          >
            <img
              src={iconMap[isDarkMode ? "Close" : "CloseDark"]}
              alt=""
              aria-hidden="true"
            />
          </button>
        </div>
        {activeView === "unlock" ? (
          <>
            <p className="gallery-lock-hint">{GALLERY_LOCK_HINT}</p>
            <form className="gallery-lock-form" onSubmit={handleUnlock}>
              <label className="gallery-lock-label" htmlFor="gallery-password">
                Password
              </label>
              <input
                id="gallery-password"
                className="gallery-lock-input"
                type="password"
                autoComplete="current-password"
                spellCheck={false}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
              <div className="gallery-lock-actions-row">
                <button
                  type="submit"
                  className="learn-more-btn gallery-lock-submit-inline"
                  disabled={unlockLoading}
                >
                  <span
                    className="gallery-lock-button-icon icon-mask gallery-lock-button-icon--small"
                    aria-label="Locked"
                    style={{
                      WebkitMaskImage: `url(${iconMap["Locked"]})`,
                      maskImage: `url(${iconMap["Locked"]})`,
                    }}
                  />
                  {unlockLoading ? "Unlocking..." : "Unlock Gallery"}
                </button>
                <button
                  type="button"
                  className="learn-more-btn gallery-lock-submit-inline"
                  onClick={handleRequestAccessClick}
                >
                  <span
                    className="gallery-lock-button-icon icon-mask gallery-lock-button-icon--small"
                    aria-label="Request access"
                    style={{
                      WebkitMaskImage: `url(${iconMap["Send"]})`,
                      maskImage: `url(${iconMap["Send"]})`,
                    }}
                  />
                  Request Access
                </button>
              </div>
              {unlockError && <p className="gallery-lock-error">{unlockError}</p>}
            </form>
          </>
        ) : (
          <div
            className="gallery-access-request"
            onFocusCapture={onFirstInteract}
            onMouseEnter={onFirstInteract}
          >
            <p className="gallery-lock-hint">
              {GALLERY_ACCESS_REQUEST_HINT}
            </p>
            <form onSubmit={handleRequestSubmit} noValidate>
              <label htmlFor="access-name">
                Name *
                <input
                  id="access-name"
                  type="text"
                  name="name"
                  autoComplete="name"
                  spellCheck={false}
                  value={form.name}
                  onChange={handleChange}
                  className={errors.name ? "input-error" : ""}
                />
                {errors.name && <span className="error">{errors.name}</span>}
              </label>

              <label htmlFor="access-email">
                Email *
                <input
                  id="access-email"
                  type="email"
                  name="email"
                  autoComplete="email"
                  spellCheck={false}
                  value={form.email}
                  onChange={handleChange}
                  className={errors.email ? "input-error" : ""}
                />
                {errors.email && <span className="error">{errors.email}</span>}
              </label>

              <label htmlFor="access-message">
                Message *
                <textarea
                  id="access-message"
                  name="message"
                  rows="4"
                  autoComplete="off"
                  spellCheck={false}
                  value={form.message}
                  onChange={handleChange}
                  className={errors.message ? "input-error" : ""}
                />
                {errors.message && (
                  <span className="error">{errors.message}</span>
                )}
              </label>

              <div className="gallery-lock-submit-row">
                <div className="recaptcha-wrapper">
                  <div className="recaptcha" style={{ minHeight: 78 }}>
                    {showCaptcha ? (
                      <Suspense fallback={<div style={{ height: 78 }} />}>
                        <LazyReCAPTCHA
                          sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
                          onChange={(token) => setCaptchaToken(token)}
                        />
                      </Suspense>
                    ) : (
                      <div style={{ height: 78 }} />
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  className="learn-more-btn gallery-lock-submit-inline"
                  disabled={requestLoading}
                >
                  <img
                    src={iconMap["Send"]}
                    alt=""
                    aria-hidden="true"
                    className="gallery-lock-button-icon"
                  />
                  {requestLoading ? "Sending..." : "Send Request"}
                </button>
              </div>
            </form>

            {status && (
              <div className={`form-feedback ${status}`}>{statusMessage}</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default GalleryLockModal;
