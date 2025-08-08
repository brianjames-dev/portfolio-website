import React, { useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import iconMap from '../data/iconMap.js';
import '../styles/Contact.css'

function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState({});
  const [captchaToken, setCaptchaToken] = useState(null);
  const [status, setStatus] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Name is required.';
    if (!form.email.trim()) newErrors.email = 'Email is required.';
    if (!form.message.trim()) newErrors.message = 'Message is required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (loading) return; // Prevent double-clicks
  
    if (!validate() || !captchaToken) {
      setStatus("error");
      setMessage("Please complete all fields and verify you're not a robot.");
      return;
    }
  
    setLoading(true); // Start spinner
  
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
        setMessage(data.error || "Something went wrong. Please try again later.");
      }
    } catch (err) {
      console.error(err);
      setStatus("error");
      setMessage("Failed to send. Check your internet connection.");
    } finally {
      setLoading(false); // Stop spinner
    }
  };
  

  
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <section id="contact" className="contact-section" data-snap-target>
      <div className="contact-card">
        <div className="contact-left">
          <h2>Get In Touch</h2>
          <p>Feel free to fill out the form below, <br></br> or contact me directly by email.</p>

          <form onSubmit={handleSubmit} noValidate>
            <label>
              Name *
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className={errors.name ? 'input-error' : ''}
              />
              {errors.name && <span className="error">{errors.name}</span>}
            </label>

            <label>
              Email *
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className={errors.email ? 'input-error' : ''}
              />
              {errors.email && <span className="error">{errors.email}</span>}
            </label>

            <label>
              Message *
              <textarea
                name="message"
                rows="5"
                value={form.message}
                onChange={handleChange}
                className={errors.message ? 'input-error' : ''}
              />
              {errors.message && <span className="error">{errors.message}</span>}
            </label>

            <div className="contact-submit-row">
            <div className="recaptcha-wrapper">
              <div className="recaptcha">
                <ReCAPTCHA
                  sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
                  onChange={(token) => setCaptchaToken(token)}
                />
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

          {status && (
            <div className={`form-feedback ${status}`}>
              {message}
            </div>
          )}
        </div>

        <div className="contact-right">
          <p className="contact-email">
            <strong>Email</strong><br />
            <a href="mailto:brianjames.dev@gmail.com">brianjames.dev@gmail.com</a>
          </p>
          <p><strong>Address</strong><br />Somewhere in Sacramento, CA</p>

          <div className="contact-links-row">
            <p><strong>Links</strong></p>
            <div className="contact-social-links">
                <a
                  href="https://github.com/brianjames-dev"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="contact-icon-wrapper">
                    <img src={iconMap['GitHubThemed']} alt="GitHub" className="default" />
                    <img src={iconMap['GitHubHover']} alt="GitHub" className="hover" />
                  </span>
                </a>
                <a
                  href="https://www.linkedin.com/in/brianjames-dev/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="contact-icon-wrapper">
                    <img src={iconMap['LinkedInThemed']} alt="LinkedIn" className="default" />
                    <img src={iconMap['LinkedInHover']} alt="LinkedIn" className="hover" />
                  </span>
                </a>
                <a
                  href="https://www.instagram.com/brianallenjames"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="contact-icon-wrapper">
                    <img src={iconMap['InstagramThemed']} alt="Instagram" className="default" />
                    <img src={iconMap['InstagramHover']} alt="Instagram" className="hover" />
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
