import React, { useState, useEffect, useRef } from 'react';
import menuIcon from '../images/menu.svg';
import closeIcon from '../images/close.svg';
import '../styles/Header.css'

let hasAnimatedIn = false;

function Header({ activeSection }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef(null);
  const bubbleRef = useRef(null);

  // Handle header hide/show on scroll
  useEffect(() => {
    const header = document.querySelector('.site-header');
    if (!header) return;
  
    let lastScrollY = window.scrollY;
    const threshold = 10;
  
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollDelta = currentScrollY - lastScrollY;
  
      if (Math.abs(scrollDelta) < threshold) return;
  
      if (scrollDelta > 0) {
        // Scrolling down
        header.classList.add('hidden');
        setMenuOpen(false);
      } else {
        // Scrolling up
        header.classList.remove('hidden');
      }
  
      lastScrollY = currentScrollY;
    };
  
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  

  // Handle mobile menu animation
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
  
    function handleResize() {
      const isMobile = window.innerWidth <= 600;
      if (isMobile && !hasAnimatedIn) {
        nav.classList.add('hidden-on-load');
        setTimeout(() => {
          nav.classList.remove('hidden-on-load');
          hasAnimatedIn = true;
        }, 1000);
      } else {
        nav.classList.remove('hidden-on-load');
        // Remove this line: setMenuOpen(false); // Close menu on resize to desktop
      }
    }
  
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Update bubble position
  useEffect(() => {
    const bubble = bubbleRef.current;
    const nav = navRef.current;
    if (!bubble || !nav) return;

    const updateBubblePosition = () => {
      const activeLink = nav.querySelector(`a[href="#${activeSection}"]`);
      if (!activeLink) {
        bubble.style.width = '0';
        bubble.style.opacity = '0';
        return;
      }

      const linkRect = activeLink.getBoundingClientRect();
      const navRect = nav.getBoundingClientRect();
      const isMobile = window.innerWidth <= 600;

      if (!isMobile) {
        // Desktop: Position bubble horizontally
        const paddingX = 16;
        const width = linkRect.width + paddingX * 2;
        const left = linkRect.left - navRect.left - paddingX;
        bubble.style.width = `${width}px`;
        bubble.style.left = `${left}px`;
        bubble.style.height = '32px';
        bubble.style.top = '50%';
        bubble.style.transform = 'translateY(-50%)';
        bubble.style.opacity = '1';
      } else if (isMobile && menuOpen) {
        // Mobile: Position bubble as an underline when menu is open
        const top = linkRect.top - navRect.top;
        bubble.style.width = '100%';
        bubble.style.height = '42px';
        bubble.style.top = `${top}px`;
        bubble.style.left = '0';
        bubble.style.transform = 'none';
        bubble.style.opacity = '1';
      } else {
        // Mobile: Hide bubble when menu is closed
        bubble.style.width = '0';
        bubble.style.opacity = '0';
      }
    };

    updateBubblePosition();

    // Update on resize, scroll, or menu toggle
    window.addEventListener('resize', updateBubblePosition);
    window.addEventListener('scroll', updateBubblePosition);
    return () => {
      window.removeEventListener('resize', updateBubblePosition);
      window.removeEventListener('scroll', updateBubblePosition);
    };
  }, [activeSection, menuOpen]); // Add menuOpen as a dependency

  return (
    <header className="site-header">
      <div className="container">
        <h1 className="logo">
          <a href="#home" onClick={() => setMenuOpen(false)}>
            brianjames.dev
          </a>
        </h1>

        <div className="menu-button" onClick={() => setMenuOpen(!menuOpen)}>
          <img
            src={menuOpen ? closeIcon : menuIcon}
            alt={menuOpen ? 'Close menu' : 'Open menu'}
          />
        </div>

        <nav ref={navRef} className={menuOpen ? 'active' : ''}>
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
          <div ref={bubbleRef} className="bubble-indicator" data-section={activeSection}></div>
        </nav>
      </div>
    </header>
  );
}

export default Header;