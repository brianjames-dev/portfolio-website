import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import iconMap from "../data/iconMap.js";
import "../styles/Contact.css";

// Lazy-load the library so it doesn't bloat your main bundle
const LazyReCAPTCHA = lazy(() => import("react-google-recaptcha"));

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState({});
  const [captchaToken, setCaptchaToken] = useState(null);
  const [status, setStatus] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Control when we actually mount the ReCAPTCHA component
  const [showCaptcha, setShowCaptcha] = useState(false);
  const sectionRef = useRef(null);

  // Prefetch the recaptcha chunk on user intent (hover/focus)
  const prefetchRecaptcha = useCallback(() => {
    // Starts loading the lazy chunk before we render it
    import("react-google-recaptcha");
  }, []);

  // When the section approaches, mount the ReCAPTCHA (not just prefetch)
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || showCaptcha) return; // already mounted
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          prefetchRecaptcha();
          setShowCaptcha(true); // ensure it mounts as we approach
          io.disconnect();
        }
      },
      { rootMargin: "200px 0px" } // start a bit before entering viewport
    );
    io.observe(el);
    return () => io.disconnect();
  }, [prefetchRecaptcha, showCaptcha]);

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required.";
    if (!form.email.trim()) newErrors.email = "Email is required.";
    if (!form.message.trim()) newErrors.message = "Message is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (!validate() || !captchaToken) {
      setStatus("error");
      setMessage("Please complete all fields and verify you're not a robot.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        "https://7ohwfvw4b9.execute-api.us-west-1.amazonaws.com/default/contactFormHandler",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...form, captchaToken }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        setStatus("success");
        setMessage("Message sent! I'll get back to you soon.");
        setForm({ name: "", email: "", message: "" });
        setErrors({});
        setCaptchaToken(null);
      } else {
        setStatus("error");
        setMessage(
          data.error || "Something went wrong. Please try again later."
        );
      }
    } catch (err) {
      console.error(err);
      setStatus("error");
      setMessage("Failed to send. Check your internet connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // If user interacts with the form before IntersectionObserver fires,
  // show the captcha immediately and prefetch its chunk.
  const onFirstInteract = () => {
    prefetchRecaptcha();
    setShowCaptcha(true);
  };

  return (
    <section
      id="contact"
      className="contact-section"
      data-snap-target
      ref={sectionRef}
      onFocusCapture={onFirstInteract}
      onMouseEnter={onFirstInteract}
    >
      <div className="contact-card">
        <div className="availability-badge">
          <span
            className="availability-icon icon-mask-info"
            aria-hidden="true"
          />
          <div className="availability-text">
            <strong>Open to Opportunities</strong>
            <span>Full-time • Contract • Remote</span>
          </div>
        </div>
        <div className="contact-left">
          <h2>Get In Touch</h2>
          <p>
            Feel free to fill out the form below to send me a message, or
            contact me directly by email.
          </p>

          <form onSubmit={handleSubmit} noValidate>
            <label htmlFor="name">
              Name *
              <input
                id="name"
                type="text"
                name="name"
                autoComplete="name"
                value={form.name}
                onChange={handleChange}
                className={errors.name ? "input-error" : ""}
              />
              {errors.name && <span className="error">{errors.name}</span>}
            </label>

            <label htmlFor="email">
              Email *
              <input
                id="email"
                type="email"
                name="email"
                autoComplete="email"
                value={form.email}
                onChange={handleChange}
                className={errors.email ? "input-error" : ""}
              />
              {errors.email && <span className="error">{errors.email}</span>}
            </label>

            <label htmlFor="message">
              Message *
              <textarea
                id="message"
                name="message"
                rows="5"
                autoComplete="off"
                value={form.message}
                onChange={handleChange}
                className={errors.message ? "input-error" : ""}
              />
              {errors.message && (
                <span className="error">{errors.message}</span>
              )}
            </label>

            <div className="contact-submit-row">
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
                    // Reserve space to avoid layout shift before we mount it
                    <div style={{ height: 78 }} />
                  )}
                </div>
              </div>

              <button type="submit" disabled={loading}>
                {loading ? (
                  <svg
                    className="loading-spinner"
                    viewBox="0 0 50 50"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      cx="25"
                      cy="25"
                      r="20"
                      fill="none"
                      stroke="#F8F3D9"
                      strokeWidth="5"
                      strokeLinecap="round"
                      strokeDasharray="90 150"
                      strokeDashoffset="0"
                    />
                  </svg>
                ) : (
                  "Send Message"
                )}
              </button>
            </div>
          </form>

          {status && <div className={`form-feedback ${status}`}>{message}</div>}
        </div>

        <div className="contact-right">
          <p className="contact-email">
            <strong>Email</strong>
            <br />
            <a href="mailto:brianjames.dev@gmail.com">
              brianjames.dev@gmail.com
            </a>
          </p>
          <p>
            <strong>Address</strong>
            <br />
            Somewhere in Sacramento, CA
          </p>

          <div className="contact-links-row">
            <p>
              <strong>Links</strong>
            </p>
            <div className="contact-social-links">
              {/* ... your icon links unchanged ... */}
              <a
                href="https://github.com/brianjames-dev"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="contact-icon-wrapper">
                  <img
                    src={iconMap["GitHubThemed"]}
                    alt="GitHub"
                    className="default"
                  />
                  <img
                    src={iconMap["GitHubHover"]}
                    alt="GitHub"
                    className="hover"
                  />
                </span>
              </a>
              <a
                href="https://www.linkedin.com/in/brianjames-dev/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="contact-icon-wrapper">
                  <img
                    src={iconMap["LinkedInThemed"]}
                    alt="LinkedIn"
                    className="default"
                  />
                  <img
                    src={iconMap["LinkedInHover"]}
                    alt="LinkedIn"
                    className="hover"
                  />
                </span>
              </a>
              <a
                href="https://www.instagram.com/brianallenjames"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="contact-icon-wrapper">
                  <img
                    src={iconMap["InstagramThemed"]}
                    alt="Instagram"
                    className="default"
                  />
                  <img
                    src={iconMap["InstagramHover"]}
                    alt="Instagram"
                    className="hover"
                  />
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;
