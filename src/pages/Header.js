import { useEffect, useRef, useState } from "react";
import iconMap from "../data/iconMap.js";
import ThemeToggle from "../components/ThemeToggle";
import "../styles/Header.css";

let hasAnimatedIn = false;

function Header({ activeSection }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef(null);
  const bubbleRef = useRef(null);

  // Preload the lazy chunk for react-google-recaptcha
  const preloadRecaptcha = () => {
    import("react-google-recaptcha");
  };

  // Handle header hide/show on scroll
  useEffect(() => {
    const header = document.querySelector(".site-header");
    if (!header) return;

    let lastScrollY = window.scrollY;
    const threshold = 10;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollDelta = currentScrollY - lastScrollY;

      if (Math.abs(scrollDelta) < threshold) return;

      if (scrollDelta > 0) {
        // Scrolling down
        header.classList.add("hidden");
        setMenuOpen(false);
      } else {
        // Scrolling up
        header.classList.remove("hidden");
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle mobile menu animation
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    function handleResize() {
      // Prevent nav transform animation during responsive breakpoint changes
      nav.classList.add("no-animate");
      setTimeout(() => nav.classList.remove("no-animate"), 300);

      const isMobile = window.innerWidth <= 600;
      if (isMobile && !hasAnimatedIn) {
        nav.classList.add("hidden-on-load");
        setTimeout(() => {
          nav.classList.remove("hidden-on-load");
          hasAnimatedIn = true;
        }, 1000);
      } else {
        nav.classList.remove("hidden-on-load");
        // Remove this line: setMenuOpen(false); // Close menu on resize to desktop
      }
    }

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Update bubble position
  useEffect(() => {
    const bubble = bubbleRef.current;
    const nav = navRef.current;
    if (!bubble || !nav) return;

    const updateBubblePosition = () => {
      const activeLink = nav.querySelector(`a[href="#${activeSection}"]`);
      if (!activeLink) {
        bubble.style.width = "0";
        bubble.style.opacity = "0";
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
        bubble.style.height = "32px";
        bubble.style.top = "50%";
        bubble.style.transform = "translateY(-50%)";
        bubble.style.opacity = "1";
      } else if (isMobile && menuOpen) {
        // Mobile: Position bubble as an underline when menu is open
        const top = linkRect.top - navRect.top;
        bubble.style.width = "100%";
        bubble.style.height = "42px";
        bubble.style.top = `${top}px`;
        bubble.style.left = "0";
        bubble.style.transform = "none";
        bubble.style.opacity = "1";
      } else {
        // Mobile: Hide bubble when menu is closed
        bubble.style.width = "0";
        bubble.style.opacity = "0";
      }
    };

    updateBubblePosition();

    // Update on resize, scroll, or menu toggle
    window.addEventListener("resize", updateBubblePosition);
    window.addEventListener("scroll", updateBubblePosition);
    return () => {
      window.removeEventListener("resize", updateBubblePosition);
      window.removeEventListener("scroll", updateBubblePosition);
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
            src={menuOpen ? iconMap["Close"] : iconMap["Menu"]}
            alt={menuOpen ? "Close menu" : "Open menu"}
          />
        </div>

        {/* Theme toggle (visible on all viewports) */}
        <ThemeToggle />

        <nav ref={navRef} className={menuOpen ? "active" : ""}>
          {["home", "about", "experience", "projects", "contact"].map(
            (section) => (
              <a
                key={section}
                className={activeSection === section ? "active" : ""}
                href={`#${section}`}
                onClick={(e) => {
                  // Always close the menu on click
                  setMenuOpen(false);

                  // Prefetch captcha when going to contact
                  if (section === "contact") preloadRecaptcha();

                  // Mobile-only custom scroll offset: subtract 60px only
                  // when the target is below current position (scrolling down).
                  const isMobile = window.innerWidth <= 600;
                  if (isMobile) {
                    e.preventDefault();
                    const el = document.getElementById(section);
                    if (el) {
                      const root = document.documentElement;
                      const headerVar = getComputedStyle(root)
                        .getPropertyValue("--header-height")
                        .trim();
                      const headerPx = parseInt(headerVar || "60", 10) || 60;
                      const targetTop =
                        el.getBoundingClientRect().top + window.pageYOffset;
                      const isScrollingDown = targetTop > window.pageYOffset;
                      const extra = isScrollingDown ? 60 : 0; // only subtract when scrolling down
                      const offset = Math.max(0, headerPx - extra);
                      const top = targetTop - offset;
                      window.scrollTo({ top, behavior: "smooth" });
                    }
                  }
                }}
                onMouseEnter={
                  section === "contact" ? preloadRecaptcha : undefined
                }
                onFocus={section === "contact" ? preloadRecaptcha : undefined}
                onTouchStart={
                  section === "contact" ? preloadRecaptcha : undefined
                }
              >
                {section.charAt(0).toUpperCase() + section.slice(1)}
              </a>
            )
          )}
          <div
            ref={bubbleRef}
            className="bubble-indicator"
            data-section={activeSection}
          ></div>
        </nav>
      </div>
    </header>
  );
}

export default Header;
