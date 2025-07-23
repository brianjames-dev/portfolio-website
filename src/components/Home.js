import React, { useEffect } from 'react';
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
  useEffect(() => {
    let ticking = false;
  
    function adjustHomeScale() {
      // 1️⃣ Fix iOS viewport height quirks
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
  
      const availableHeight = window.innerHeight;
      const availableWidth = window.innerWidth;
  
      const referenceHeight = 820;
      const scale = Math.min(1, availableHeight / referenceHeight);
  
      document.documentElement.style.setProperty('--home-scale', scale);
  
      const homeCard = document.querySelector('.home-card');
      const homeSection = document.querySelector('section.home');
      if (!homeCard || !homeSection) return;
  
      if (scale < 1 && availableWidth <= 600) {
        homeCard.classList.add('scaled');
        homeSection.classList.add('scaled');
      
        requestAnimationFrame(() => {
          const cardHeight = homeCard.getBoundingClientRect().height;
          const headerHeight =
            parseFloat(
              getComputedStyle(document.documentElement).getPropertyValue(
                '--header-height'
              )
            ) || 60;
      
          const totalHeight = cardHeight + headerHeight;
          const maxHeight = window.innerHeight;
      
          homeSection.style.height = `${Math.max(totalHeight, maxHeight)}px`;
        });
      } else {
        homeCard.classList.remove('scaled');
        homeSection.classList.remove('scaled');
        homeSection.style.height = `calc(var(--vh) * 100)`;
      }      
  
      ticking = false;
    }
  
    function requestTick() {
      if (!ticking) {
        requestAnimationFrame(adjustHomeScale);
        ticking = true;
      }
    }
  
    adjustHomeScale();
  
    window.addEventListener('resize', requestTick);
    window.addEventListener('orientationchange', requestTick);
    window.addEventListener('scroll', requestTick);
  
    return () => {
      window.removeEventListener('resize', requestTick);
      window.removeEventListener('orientationchange', requestTick);
      window.removeEventListener('scroll', requestTick);
    };
  }, []);
  

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
