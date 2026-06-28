import { useEffect, useRef, useState } from "react";
import ThemeToggle from "../components/ThemeToggle";
import "../styles/Header.css";

let hasAnimatedIn = false;
const MENU_TAP_GATE_MS = 100;

function Header({ activeSection }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth <= 600 : false
  );
  const navRef = useRef(null);
  const bubbleRef = useRef(null);
  const lastMenuToggleRef = useRef(0);
  const menuLockTimeoutRef = useRef(null);

  // Preload the lazy chunk for react-google-recaptcha
  const preloadRecaptcha = () => {
    import("react-google-recaptcha");
  };

  // Handle header hide/show on scroll
  useEffect(() => {
    const header = document.querySelector(".site-header");
    if (!header) return;
    const root = document.documentElement;

    let lastScrollY = window.scrollY;
    let scrollDistance = 0;
    let scrollDirection = 0;
    let isHidden = header.classList.contains("hidden");
    const topThreshold = 12;
    const hideThreshold = 48;
    const showThreshold = 24;

    const showHeader = () => {
      header.classList.remove("hidden");
      root.classList.remove("header-hidden");
      isHidden = false;
    };

    const hideHeader = () => {
      header.classList.add("hidden");
      root.classList.add("header-hidden");
      isHidden = true;
      setMenuOpen(false);
    };

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollDelta = currentScrollY - lastScrollY;

      if (
        root.classList.contains("modal-scroll-lock") ||
        document.body.classList.contains("video-overlay-open")
      ) {
        lastScrollY = currentScrollY;
        scrollDistance = 0;
        return;
      }

      // Always show header when near the very top (mobile bounce, refreshed page, etc.)
      if (currentScrollY <= topThreshold) {
        showHeader();
        lastScrollY = currentScrollY;
        scrollDistance = 0;
        return;
      }

      if (Math.abs(scrollDelta) < 2) return;

      const nextDirection = scrollDelta > 0 ? 1 : -1;
      if (nextDirection !== scrollDirection) {
        scrollDirection = nextDirection;
        scrollDistance = 0;
      }

      scrollDistance += Math.abs(scrollDelta);

      if (!isHidden && scrollDirection > 0 && scrollDistance >= hideThreshold) {
        hideHeader();
        scrollDistance = 0;
      } else if (
        isHidden &&
        scrollDirection < 0 &&
        scrollDistance >= showThreshold
      ) {
        showHeader();
        scrollDistance = 0;
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      root.classList.remove("header-hidden");
    };
  }, []);

  // Handle mobile menu animation
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    function handleResize() {
      // Prevent nav transform animation during responsive breakpoint changes
      nav.classList.add("no-animate");
      setTimeout(() => nav.classList.remove("no-animate"), 300);

      const nextIsMobile = window.innerWidth <= 600;
      setIsMobile(nextIsMobile);
      if (nextIsMobile && !hasAnimatedIn) {
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

  useEffect(() => {
    return () => {
      if (menuLockTimeoutRef.current) {
        clearTimeout(menuLockTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!menuOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };

    const handlePointerDown = (event) => {
      const nav = navRef.current;
      if (
        nav &&
        !nav.contains(event.target) &&
        !event.target.closest(".menu-button")
      ) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("pointerdown", handlePointerDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [menuOpen]);

  // Update bubble position
  useEffect(() => {
    const bubble = bubbleRef.current;
    const nav = navRef.current;
    if (!bubble || !nav) return;

    let rafId = 0;

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

    const scheduleBubblePosition = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        rafId = 0;
        updateBubblePosition();
      });
    };

    scheduleBubblePosition();

    // Update on resize, scroll, or menu toggle
    window.addEventListener("resize", scheduleBubblePosition);
    window.addEventListener("scroll", scheduleBubblePosition, {
      passive: true,
    });
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener("resize", scheduleBubblePosition);
      window.removeEventListener("scroll", scheduleBubblePosition);
    };
  }, [activeSection, menuOpen]); // Add menuOpen as a dependency

  const toggleMenuWithGate = () => {
    const now = Date.now();
    if (now - lastMenuToggleRef.current < MENU_TAP_GATE_MS) return;

    lastMenuToggleRef.current = now;
    setMenuOpen((current) => !current);

    if (menuLockTimeoutRef.current) clearTimeout(menuLockTimeoutRef.current);
    menuLockTimeoutRef.current = setTimeout(() => {
      menuLockTimeoutRef.current = null;
    }, MENU_TAP_GATE_MS);
  };

  return (
    <header className="site-header">
      <div className="container">
        <h1 className="logo">
          <a href="#home" onClick={() => setMenuOpen(false)}>
            brianjames.dev
          </a>
        </h1>

        <button
          type="button"
          className={`menu-button ${menuOpen ? "is-open" : ""}`}
          onPointerDown={(event) => {
            if (event.button !== 0) return;
            event.preventDefault();
            event.stopPropagation();
            toggleMenuWithGate();
          }}
          onClick={(event) => {
            event.stopPropagation();
            if (event.detail !== 0) {
              event.preventDefault();
              return;
            }
            toggleMenuWithGate();
          }}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="site-navigation"
        >
          <span className="menu-button-icon" aria-hidden="true">
            <span className="menu-button-line" />
            <span className="menu-button-line" />
            <span className="menu-button-line" />
          </span>
        </button>

        {/* Theme toggle (visible on all viewports) */}
        <ThemeToggle />

        <nav
          id="site-navigation"
          ref={navRef}
          className={menuOpen ? "active" : ""}
          aria-hidden={isMobile && !menuOpen ? "true" : undefined}
        >
          {["home", "about", "experience", "projects", "contact"].map(
            (section) => (
              <a
                key={section}
                className={activeSection === section ? "active" : ""}
                href={`#${section}`}
                tabIndex={isMobile && !menuOpen ? -1 : undefined}
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
