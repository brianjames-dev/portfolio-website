import React, { useState, useEffect } from 'react';
import menuIcon from '../images/menu.svg';
import closeIcon from '../images/close.svg';

let hasAnimatedIn = false; // Persist across renders

function Header({ activeSection }) {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const nav = document.querySelector('.site-header nav');
    if (!nav) return;

    function handleResize() {
      const isMobile = window.innerWidth <= 600;

      if (isMobile && !hasAnimatedIn) {
        nav.classList.add('hidden-on-load');
        setTimeout(() => {
          nav.classList.remove('hidden-on-load');
          hasAnimatedIn = true;
        }, 1000);
      } else if (!isMobile) {
        nav.classList.remove('hidden-on-load');
      }
    }

    handleResize(); // Run once on mount
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
      const nav = activeLink.closest('nav');

      if (!nav) return;

      const navRect = nav.getBoundingClientRect();
      const paddingX = 16;

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
            onClick={() => setMenuOpen(false)}
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
              onClick={() => setMenuOpen(false)}
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
