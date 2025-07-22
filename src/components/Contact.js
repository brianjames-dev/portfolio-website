import React from 'react';

function Contact() {
  return (
    <section id="contact" className="contact">
      <div className="container contact-content">
        <div>
          <h2>Get In Touch</h2>
          <p>
            Have a project in mind or just want to connect? Feel free to reach out!
          </p>
          <p className="availability">
            📬 Currently open to freelance & full-time opportunities.
          </p>
        </div>
        <div className="contact-links">
          <a href="mailto:brianjames.dev@gmail.com">Email</a>
          <a href="https://www.linkedin.com/in/brianjames-dev" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <a href="https://github.com/brianjames-dev" target="_blank" rel="noopener noreferrer">GitHub</a>
        </div>
      </div>
    </section>
  );
}

export default Contact;
