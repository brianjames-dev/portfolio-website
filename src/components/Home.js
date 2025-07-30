import React from 'react';
import alphaHeadshot from '../images/alpha_headshot.png';
import DownloadIcon from '../images/download.svg';
import SendIcon from '../images/send.svg'
import GithubIcon from '../images/github_themed.svg';
import LinkedInIcon from '../images/linkedin_themed.svg';
import InstagramIcon from '../images/instagram_themed.svg';
import GithubIconHover from '../images/github_themed_hover.svg';
import LinkedInIconHover from '../images/linkedin_themed_hover.svg';
import InstagramIconHover from '../images/instagram_themed_hover.svg';

function Home() {
  return (
    <section id="home" className="home" data-snap-target>
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
              From touring musician to upcoming CS graduate, 
              I thrive on solving tough problems, providing clean designs, 
              and creating scalable architecture in all of my coding endeavors.
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
              <img src={DownloadIcon} alt="Download icon" />
              Résumé
            </button>
          </a>

          <a href="mailto:brianjames.dev@gmail.com">
            <button>
              <img src={SendIcon} alt="Email icon" />
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
              <img src={GithubIcon} alt="GitHub" className="default" />
              <img src={GithubIconHover} alt="GitHub" className="hover" />
            </span>
          </a>
          <a
            href="https://www.linkedin.com/in/brianjames-dev/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="icon-wrapper">
              <img src={LinkedInIcon} alt="LinkedIn" className="default" />
              <img src={LinkedInIconHover} alt="LinkedIn" className="hover" />
            </span>
          </a>
          <a
            href="https://www.instagram.com/brianallenjames"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="icon-wrapper">
              <img src={InstagramIcon} alt="Instagram" className="default" />
              <img src={InstagramIconHover} alt="Instagram" className="hover" />
            </span>
          </a>
        </div>
      </div>
    </div>
    </section>
);
}

export default Home;
