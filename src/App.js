import { useEffect, useLayoutEffect, useRef, useState } from "react";
import "./App.css";
import ParticlesBackground from "./ParticlesBackground";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Experience from "./pages/Experience";
import Header from "./pages/Header";
import Home from "./pages/Home";
import Projects from "./pages/Projects";

function App() {
  const [activeSection, setActiveSection] = useState("home");
  const [headerHidden, setHeaderHidden] = useState(false);
  const scrollDragRef = useRef(null);
  const [scrollIndicator, setScrollIndicator] = useState({
    enabled: false,
    visible: false,
    thumbHeight: 48,
    thumbTop: 0,
  });

  useLayoutEffect(() => {
    const initialNavigation = window.__PORTFOLIO_INITIAL_NAVIGATION__ || {};
    const headerVar = getComputedStyle(document.documentElement)
      .getPropertyValue("--header-height")
      .trim();
    const headerOffset = parseInt(headerVar || "60", 10) || 60;

    if (window.location.hash) {
      const target = document.getElementById(window.location.hash.slice(1));
      if (target) {
        const top = target.getBoundingClientRect().top + window.pageYOffset;
        window.scrollTo(0, Math.max(0, top - headerOffset));
      }
      return;
    }

    if (initialNavigation.type === "reload") {
      window.scrollTo(0, 0);
    }
  }, []);

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("header-hidden", headerHidden);

    return () => {
      root.classList.remove("header-hidden");
    };
  }, [headerHidden]);

  useEffect(() => {
    const sectionIds = ["home", "about", "experience", "projects", "contact"];
    const desktopQuery = window.matchMedia("(min-width: 601px)");
    const getSections = () =>
      Array.from(document.querySelectorAll("section[id]"));

    let sections = getSections();
    let rafId = 0;
    let hideTimer = 0;
    let headerHeight = 60;
    let lastScrollY = window.scrollY;
    let scrollDistance = 0;
    let scrollDirection = 0;
    let isHeaderHidden = false;
    let pendingShowScrollbar = false;
    const topThreshold = 12;
    const hideThreshold = 48;
    const showThreshold = 24;

    const getScrollElement = () =>
      document.scrollingElement || document.documentElement;

    const readHeaderHeight = () => {
      const headerVar = getComputedStyle(document.documentElement)
        .getPropertyValue("--header-height")
        .trim();
      headerHeight = parseInt(headerVar || "60", 10) || 60;
    };

    const updateScrollIndicator = (show) => {
      const scrollElement = getScrollElement();
      const maxScroll = Math.max(
        0,
        scrollElement.scrollHeight - window.innerHeight
      );
      const headerOffset = headerHeight + 12;
      const trackHeight = Math.max(80, window.innerHeight - headerOffset - 12);
      const thumbHeight =
        maxScroll > 0
          ? Math.max(
              44,
              Math.round(
                (window.innerHeight / scrollElement.scrollHeight) * trackHeight
              )
            )
          : trackHeight;
      const progress = maxScroll > 0 ? scrollElement.scrollTop / maxScroll : 0;
      const thumbTop = Math.round(
        Math.max(0, Math.min(1, progress)) *
          Math.max(0, trackHeight - thumbHeight)
      );
      const enabled = desktopQuery.matches && maxScroll > 4;

      setScrollIndicator((prev) => ({
        enabled,
        visible: enabled && (show || prev.visible),
        thumbHeight,
        thumbTop,
      }));
    };

    const updateActiveSectionFromViewport = () => {
      if (!sections.length) return;

      const viewportHeight = window.innerHeight || 1;
      const viewportCenter = viewportHeight / 2;
      const bandOffset = viewportHeight * 0.1;
      const originalBandTop = viewportCenter - bandOffset;
      const bandTop = Math.min(originalBandTop, headerHeight);
      const bandBottom = viewportCenter + bandOffset;

      const measurements = sections
        .map((section) => {
          const rect = section.getBoundingClientRect();
          const intersects = rect.bottom > 0 && rect.top < viewportHeight;
          if (!intersects) return null;

          const center = rect.top + rect.height / 2;
          const distance = Math.abs(center - viewportCenter);
          const inBand = center >= bandTop && center <= bandBottom;

          return {
            id: section.id,
            distance,
            inBand,
          };
        })
        .filter(Boolean);

      if (!measurements.length) return;

      const bandCandidates = measurements.filter((m) => m.inBand);
      const candidates = bandCandidates.length ? bandCandidates : measurements;
      const best = candidates.reduce((closest, current) => {
        if (!closest || current.distance < closest.distance) {
          return current;
        }
        return closest;
      }, null);

      if (best) {
        setActiveSection((prev) => (prev === best.id ? prev : best.id));
      }
    };

    const updateHeaderVisibility = () => {
      const root = document.documentElement;
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

      if (currentScrollY <= topThreshold) {
        if (isHeaderHidden) {
          isHeaderHidden = false;
          setHeaderHidden(false);
        }
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

      if (
        !isHeaderHidden &&
        scrollDirection > 0 &&
        scrollDistance >= hideThreshold
      ) {
        isHeaderHidden = true;
        setHeaderHidden(true);
        scrollDistance = 0;
      } else if (
        isHeaderHidden &&
        scrollDirection < 0 &&
        scrollDistance >= showThreshold
      ) {
        isHeaderHidden = false;
        setHeaderHidden(false);
        scrollDistance = 0;
      }

      lastScrollY = currentScrollY;
    };

    const updateFromViewport = (showScrollbar) => {
      updateHeaderVisibility();
      updateActiveSectionFromViewport();
      updateScrollIndicator(showScrollbar);
    };

    const scheduleUpdate = (show = false) => {
      pendingShowScrollbar = pendingShowScrollbar || show;
      if (rafId) return;

      rafId = requestAnimationFrame(() => {
        rafId = 0;
        const shouldShowScrollbar = pendingShowScrollbar;
        pendingShowScrollbar = false;
        updateFromViewport(shouldShowScrollbar);
      });

      if (show) {
        if (hideTimer) window.clearTimeout(hideTimer);
        hideTimer = window.setTimeout(() => {
          setScrollIndicator((prev) => ({ ...prev, visible: false }));
          hideTimer = 0;
        }, 850);
      }
    };

    const handleScroll = () => scheduleUpdate(true);
    const refreshSections = () => {
      sections = getSections();
      scheduleUpdate(false);
      return sectionIds.every((id) => document.getElementById(id));
    };

    const mutationObserver = new MutationObserver(() => {
      if (refreshSections()) {
        mutationObserver.disconnect();
      }
    });

    const main = document.querySelector("main") || document.body;
    mutationObserver.observe(main, {
      childList: true,
      subtree: true,
    });

    const handleResize = () => {
      readHeaderHeight();
      refreshSections();
      scheduleUpdate(false);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);
    desktopQuery.addEventListener?.("change", handleResize);
    readHeaderHeight();
    refreshSections();
    scheduleUpdate(false);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      if (hideTimer) window.clearTimeout(hideTimer);
      mutationObserver.disconnect();
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      desktopQuery.removeEventListener?.("change", handleResize);
    };
  }, []);

  useEffect(() => {
    const desktopQuery = window.matchMedia("(min-width: 601px)");
    let rafId = 0;
    let pendingDeltaY = 0;
    let pendingSmoothWheel = false;
    let wheelIdleTimer = 0;

    const getScrollElement = () =>
      document.scrollingElement || document.documentElement;

    const keepManualScrollModeActive = () => {
      document.documentElement.classList.add("manual-wheel-scroll");

      if (wheelIdleTimer) {
        window.clearTimeout(wheelIdleTimer);
      }

      wheelIdleTimer = window.setTimeout(() => {
        document.documentElement.classList.remove("manual-wheel-scroll");
        wheelIdleTimer = 0;
      }, 120);
    };

    const targetHasScrollableParent = (target, deltaY) => {
      let node = target instanceof Element ? target : target?.parentElement;
      while (
        node &&
        node !== document.body &&
        node !== document.documentElement
      ) {
        const styles = getComputedStyle(node);
        const canScrollY =
          /(auto|scroll)/.test(styles.overflowY) &&
          node.scrollHeight > node.clientHeight;

        if (canScrollY) {
          const atTop = node.scrollTop <= 0;
          const atBottom =
            Math.ceil(node.scrollTop + node.clientHeight) >= node.scrollHeight;
          if ((deltaY < 0 && !atTop) || (deltaY > 0 && !atBottom)) {
            return true;
          }
        }

        node = node.parentElement;
      }

      return false;
    };

    const normalizeWheelDelta = (event) => {
      const modeMultiplier =
        event.deltaMode === WheelEvent.DOM_DELTA_LINE
          ? 16
          : event.deltaMode === WheelEvent.DOM_DELTA_PAGE
            ? window.innerHeight
            : 1;

      return event.deltaY * modeMultiplier;
    };

    const flushWheelScroll = () => {
      rafId = 0;

      const scrollElement = getScrollElement();
      const maxScroll = Math.max(
        0,
        scrollElement.scrollHeight - window.innerHeight
      );
      if (maxScroll <= 0 || pendingDeltaY === 0) {
        pendingDeltaY = 0;
        return;
      }

      const nextTop = Math.max(
        0,
        Math.min(maxScroll, scrollElement.scrollTop + pendingDeltaY)
      );
      const shouldSmooth = pendingSmoothWheel;
      pendingDeltaY = 0;
      pendingSmoothWheel = false;

      if (shouldSmooth) {
        scrollElement.scrollTo({ top: nextTop, behavior: "smooth" });
      } else {
        scrollElement.scrollTop = nextTop;
      }
    };

    const handleDesktopWheel = (event) => {
      const deltaY = normalizeWheelDelta(event);
      const isDiscreteWheel =
        event.deltaMode === WheelEvent.DOM_DELTA_LINE || Math.abs(deltaY) >= 80;

      if (
        !desktopQuery.matches ||
        event.ctrlKey ||
        Math.abs(deltaY) < 0.01 ||
        document.body.classList.contains("no-scroll") ||
        document.documentElement.classList.contains("modal-scroll-lock") ||
        targetHasScrollableParent(event.target, deltaY)
      ) {
        return;
      }

      if (event.cancelable) {
        event.preventDefault();
      }

      keepManualScrollModeActive();
      pendingDeltaY += deltaY;
      pendingSmoothWheel = pendingSmoothWheel || isDiscreteWheel;

      if (!rafId) {
        rafId = requestAnimationFrame(flushWheelScroll);
      }
    };

    window.addEventListener("wheel", handleDesktopWheel, {
      capture: true,
      passive: false,
    });

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      if (wheelIdleTimer) window.clearTimeout(wheelIdleTimer);
      document.documentElement.classList.remove("manual-wheel-scroll");
      window.removeEventListener("wheel", handleDesktopWheel, {
        capture: true,
      });
    };
  }, []);

  const scrollToScrollbarPointer = (clientY) => {
    const dragState = scrollDragRef.current;
    if (!dragState) return;

    const scrollElement =
      document.scrollingElement || document.documentElement;
    const maxScroll = Math.max(
      0,
      scrollElement.scrollHeight - window.innerHeight
    );
    const maxThumbTop = Math.max(
      0,
      dragState.trackHeight - dragState.thumbHeight
    );

    if (maxScroll <= 0 || maxThumbTop <= 0) return;

    const nextThumbTop = Math.max(
      0,
      Math.min(
        maxThumbTop,
        clientY - dragState.trackTop - dragState.pointerOffsetY
      )
    );
    const progress = nextThumbTop / maxThumbTop;
    scrollElement.scrollTop = progress * maxScroll;
  };

  const handleScrollbarPointerDown = (event) => {
    if (event.button !== 0) return;

    event.preventDefault();
    const trackRect = event.currentTarget.getBoundingClientRect();
    const thumbElement = event.currentTarget.querySelector(
      ".desktop-scrollbar-thumb"
    );
    const thumbRect = thumbElement?.getBoundingClientRect();
    const pointerIsOnThumb =
      thumbRect &&
      event.clientY >= thumbRect.top &&
      event.clientY <= thumbRect.bottom;

    scrollDragRef.current = {
      trackTop: trackRect.top,
      trackHeight: trackRect.height,
      thumbHeight: scrollIndicator.thumbHeight,
      pointerOffsetY: pointerIsOnThumb
        ? event.clientY - thumbRect.top
        : scrollIndicator.thumbHeight / 2,
    };

    event.currentTarget.setPointerCapture?.(event.pointerId);
    setScrollIndicator((prev) => ({ ...prev, visible: true }));
    scrollToScrollbarPointer(event.clientY);
  };

  const handleScrollbarPointerMove = (event) => {
    if (!scrollDragRef.current) return;
    event.preventDefault();
    scrollToScrollbarPointer(event.clientY);
  };

  const handleScrollbarPointerEnd = (event) => {
    scrollDragRef.current = null;
    event.currentTarget.releasePointerCapture?.(event.pointerId);
  };

  useEffect(() => {
    const coarsePointerQuery = window.matchMedia(
      "(hover: none), (pointer: coarse)"
    );
    const touchFeedbackSelector = [
      ".home-action-link",
      ".home-social-links a",
      ".contact-social-links a",
      ".learn-more-btn",
      ".expanded-top-button",
      ".stack-more-toggle",
      ".contact-submit-row button",
      ".gallery-lock-submit-row button",
      ".gallery-lock-toggle",
      ".close-button-icon-button",
      ".theme-toggle",
    ].join(",");

    let activeElement = null;
    let activeStartedAt = 0;
    let releaseTimer = 0;
    const minimumPressMs = 180;

    const releaseActiveElement = () => {
      if (!activeElement) return;

      const elementToRelease = activeElement;
      activeElement = null;
      const elapsed = performance.now() - activeStartedAt;
      const remainingDelay = Math.max(0, minimumPressMs - elapsed);

      if (releaseTimer) window.clearTimeout(releaseTimer);
      releaseTimer = window.setTimeout(() => {
        elementToRelease.classList.remove("is-touch-active");
        releaseTimer = 0;
      }, remainingDelay);
    };

    const handlePointerDown = (event) => {
      if (!coarsePointerQuery.matches || event.pointerType === "mouse") return;

      const target = event.target.closest(touchFeedbackSelector);
      if (!target || target.disabled || target.getAttribute("aria-disabled")) {
        return;
      }

      if (releaseTimer) {
        window.clearTimeout(releaseTimer);
        releaseTimer = 0;
      }

      if (activeElement && activeElement !== target) {
        activeElement.classList.remove("is-touch-active");
      }

      activeElement = target;
      activeStartedAt = performance.now();
      activeElement.classList.add("is-touch-active");
    };

    window.addEventListener("pointerdown", handlePointerDown, {
      capture: true,
      passive: true,
    });
    window.addEventListener("pointerup", releaseActiveElement, {
      capture: true,
      passive: true,
    });
    window.addEventListener("pointercancel", releaseActiveElement, {
      capture: true,
      passive: true,
    });
    window.addEventListener("scroll", releaseActiveElement, { passive: true });

    return () => {
      window.removeEventListener("pointerdown", handlePointerDown, {
        capture: true,
      });
      window.removeEventListener("pointerup", releaseActiveElement, {
        capture: true,
      });
      window.removeEventListener("pointercancel", releaseActiveElement, {
        capture: true,
      });
      window.removeEventListener("scroll", releaseActiveElement);
      if (releaseTimer) window.clearTimeout(releaseTimer);
      if (activeElement) activeElement.classList.remove("is-touch-active");
    };
  }, []);

  return (
    <div className="App">
      <Header activeSection={activeSection} isHidden={headerHidden} />
      <ParticlesBackground />
      <main>
        <Home />
        <About />
        <Experience />
        <Projects />
        <Contact />
      </main>
      {scrollIndicator.enabled && (
        <div
          className={`desktop-scrollbar ${
            scrollIndicator.visible ? "is-visible" : ""
          }`}
          aria-hidden="true"
          onPointerDown={handleScrollbarPointerDown}
          onPointerMove={handleScrollbarPointerMove}
          onPointerUp={handleScrollbarPointerEnd}
          onPointerCancel={handleScrollbarPointerEnd}
        >
          <div
            className="desktop-scrollbar-thumb"
            style={{
              height: `${scrollIndicator.thumbHeight}px`,
              transform: `translateY(${scrollIndicator.thumbTop}px)`,
            }}
          />
        </div>
      )}
    </div>
  );
}

export default App;
