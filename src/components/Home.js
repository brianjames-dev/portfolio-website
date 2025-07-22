import React from 'react';
import alphaHeadshot from '../images/alpha_headshot.png';
import DownloadIcon from '../images/download.svg';
import GithubIcon from '../images/github.svg';
import LinkedInIcon from '../images/linkedin.svg';
import InstagramIcon from '../images/instagram.svg';

function Home() {
  return (
    <section id="home" className="home">
      <div className="container home-card">

        {/* Row 1: Image + Intro */}
        <div className="home-content">
          <div className="home-left">
            <img
              src={alphaHeadshot}
              alt="Brian avatar"
              className="avatar"
            />
          </div>

          <div className="home-right">
            <p className="greeting">Hey! I'm</p>
            <h2 className="name">Brian James</h2>
            <p className="subtitle">Full Stack Developer</p>
            <p className="description">
              Former touring musician and upcoming CS graduate from OSU (Winter 2025).
              I enjoy solving problems, building creative tech, and learning for life.
            </p>
          </div>
        </div>

        {/* Row 2: Divider */}
        <hr className="home-divider" />

        {/* Row 3: Links */}
        <div className="home-under-line">

        {/* Resume button aligned under avatar */}
        <div className="home-resume-button">
            <a href="/resume.pdf" download>
            <button>
                <img src={DownloadIcon} alt="" />
                Resume
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
            <img src={GithubIcon} alt="GitHub" />
          </a>
          <a
            href="https://www.linkedin.com/in/brianjames-dev/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={LinkedInIcon} alt="LinkedIn" />
          </a>
          <a
            href="https://www.instagram.com/brianallenjames"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={InstagramIcon} alt="Instagram" />
          </a>
        </div>
      </div>
    </div>
    </section>
);
}

export default Home;
