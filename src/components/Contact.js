import React, { useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import GithubIcon from '../images/github_themed.svg';
import LinkedInIcon from '../images/linkedin_themed.svg';
import InstagramIcon from '../images/instagram_themed.svg';
import GithubIconHover from '../images/github_themed_hover.svg';
import LinkedInIconHover from '../images/linkedin_themed_hover.svg';
import InstagramIconHover from '../images/instagram_themed_hover.svg';

function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState({});
  const [captchaToken, setCaptchaToken] = useState(null);

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
    if (!validate() || !captchaToken) {
      alert("Please complete all fields and verify you're not a robot.");
      return;
    }
  
    try {
      const response = await fetch('https://7ohwfvw4b9.execute-api.us-west-1.amazonaws.com/default/contactFormHandler', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...form, captchaToken }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        alert('Message sent!');
        setForm({ name: '', email: '', message: '' });
        setErrors({});
        setCaptchaToken(null);
      } else {
        console.error(data);
        alert('Something went wrong. Please try again later.');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to send. Check your connection.');
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
          <p>Feel free to fill the form below, or contact me directly by email.</p>

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
            <div class="recaptcha-wrapper">
              <div className="recaptcha">
                <ReCAPTCHA
                  sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
                  onChange={(token) => setCaptchaToken(token)}
                />
              </div>
            </div>
              <button type="submit">Send Message</button>
            </div>
          </form>
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
                    <img src={GithubIcon} alt="GitHub" className="default" />
                    <img src={GithubIconHover} alt="GitHub" className="hover" />
                  </span>
                </a>
                <a
                  href="https://www.linkedin.com/in/brianjames-dev/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="contact-icon-wrapper">
                    <img src={LinkedInIcon} alt="LinkedIn" className="default" />
                    <img src={LinkedInIconHover} alt="LinkedIn" className="hover" />
                  </span>
                </a>
                <a
                  href="https://www.instagram.com/brianallenjames"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="contact-icon-wrapper">
                    <img src={InstagramIcon} alt="Instagram" className="default" />
                    <img src={InstagramIconHover} alt="Instagram" className="hover" />
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
