import iconMap from "../data/iconMap.js";
import "../styles/Home.css";

function Home() {
  return (
    <section id="home" className="home" data-snap-target>
      <div className="container home-card">
        {/* Row 1: Image + Intro */}
        <div className="home-content">
          <div className="home-left">
            <picture>
              <source srcSet="/img/alpha_headshot.avif" type="image/avif" />
              <source srcSet="/img/alpha_headshot.webp" type="image/webp" />
              <img
                src="/img/alpha_headshot.jpg"
                width="200"
                height="261"
                alt="Brian avatar"
                fetchpriority="high"
                decoding="async"
                className="avatar"
              />
            </picture>
          </div>

          <div className="home-right">
            <p className="greeting">Hey! I'm</p>
            <h2 className="name">Brian James</h2>
            <p className="subtitle">Full Stack Developer</p>
            <p className="description">
              From touring musician to upcoming CS graduate, I thrive on solving
              tough problems, providing clean designs, and creating scalable
              architecture in all of my coding endeavors.
            </p>
          </div>
        </div>

        {/* Row 2: Divider */}
        <hr className="home-divider" />

        {/* Row 3: Links */}
        <div className="home-under-line">
          {/* Resume & Email buttons aligned under avatar */}
          <div className="home-action-buttons">
            <a href="/resume.pdf" download>
              <button>
                <img src={iconMap["Download"]} alt="Download icon" />
                Résumé
              </button>
            </a>

            <a href="mailto:brianjames.dev@gmail.com">
              <button>
                <img src={iconMap["Send"]} alt="Email Send icon" />
                Email Me
              </button>
            </a>
          </div>

          {/* Social media links */}
          <div className="home-social-links">
            <a
              href="https://github.com/brianjames-dev"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="icon-wrapper">
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
              <span className="icon-wrapper">
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
              <span className="icon-wrapper">
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
    </section>
  );
}

export default Home;
