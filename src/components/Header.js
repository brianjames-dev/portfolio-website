import React, { useState, useEffect } from 'react';
import { scrollToId } from "../utils/scrollToId";
import { cancelScrollAnimation } from "../utils/scrollToPosition";
import menuIcon from '../images/menu.svg';
import closeIcon from '../images/close.svg';

function Header({ activeSection }) {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const nav = document.querySelector('.site-header nav');
    if (!nav) return;
  
    let hasAnimatedIn = false;
  
    function handleResize() {
      const isMobile = window.innerWidth <= 600;
  
      if (isMobile && !hasAnimatedIn) {
        nav.classList.add('hidden-on-load');
        setTimeout(() => {
          nav.classList.remove('hidden-on-load');
          hasAnimatedIn = true; // Mark as done
        }, 1000);
      } else if (!isMobile) {
        nav.classList.remove('hidden-on-load');
      }
    }
  
    handleResize(); // run on mount
    window.addEventListener('resize', handleResize);
  
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const bubble = document.querySelector('.bubble-indicator');
    const activeLink = document.querySelector(
      `.site-header nav a[href="#${activeSection}"]`
    );
  
    if (bubble && activeLink) {
      const linkRect = activeLink.getBoundingClientRect();
      const navRect = activeLink.closest('nav').getBoundingClientRect();
  
      const paddingX = 16; // Horizontal padding on each side
  
      const width = linkRect.width + paddingX * 2;
      const left = linkRect.left - navRect.left - paddingX;
  
      bubble.style.width = `${width}px`;
      bubble.style.left = `${left}px`;
    }
  }, [activeSection]);
   
  
  return (
    <header className="site-header">
      <div className="container">
        <h1 className="logo">
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              cancelScrollAnimation();
              scrollToId('home');
            }}
          >
            brianjames.dev
          </a>
        </h1>

        {/* Menu button for mobile */}
        <div
          className="menu-button"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <img
            src={menuOpen ? closeIcon : menuIcon}
            alt={menuOpen ? 'Close menu' : 'Open menu'}
          />
        </div>

        <nav className={menuOpen ? 'active' : ''}>
        {['home', 'about', 'projects', 'contact'].map((section) => (
          <a
            key={section}
            className={activeSection === section ? 'active' : ''}
            href={`#${section}`}
            onClick={(e) => {
              e.preventDefault();
              cancelScrollAnimation();
              scrollToId(section);
              setMenuOpen(false);
            }}
          >
            {section.charAt(0).toUpperCase() + section.slice(1)}
          </a>
        ))}


          {/* Bubble indicator */}
          <div className="bubble-indicator" data-section={activeSection}></div>
        </nav>
      </div>
    </header>
  );
}

export default Header;
