import React, { useState, useEffect } from 'react';
import menuIcon from '../images/menu.svg';
import closeIcon from '../images/close.svg';

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const nav = document.querySelector('.site-header nav');

    function handleResize() {
      if (window.innerWidth <= 600) {
        nav.classList.add('hidden-on-load');

        setTimeout(() => {
          nav.classList.remove('hidden-on-load');
        }, 1000);
      } else {
        nav.classList.remove('hidden-on-load');
      }
    }

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  
  return (
    <header className="site-header">
      <div className="container">
        <h1 className="logo">
          <a href="#home">brianjames.dev</a>
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
          <a href="#home" onClick={() => setMenuOpen(false)}>Home</a>
          <a href="#about" onClick={() => setMenuOpen(false)}>About</a>
          <a href="#projects" onClick={() => setMenuOpen(false)}>Projects</a>
          <a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a>
        </nav>
      </div>
    </header>
  );
}

export default Header;
