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
    const desktopQuery = window.matchMedia("(min-width: 601px)");
    let rafId = 0;
    let hideTimer = 0;

    const readHeaderOffset = () => {
      const headerVar = getComputedStyle(document.documentElement)
        .getPropertyValue("--header-height")
        .trim();
      const headerHeight = parseInt(headerVar || "60", 10) || 60;
      return headerHeight + 12;
    };

    const updateScrollIndicator = (show) => {
      const doc = document.documentElement;
      const maxScroll = Math.max(0, doc.scrollHeight - window.innerHeight);
      const headerOffset = readHeaderOffset();
      const trackHeight = Math.max(80, window.innerHeight - headerOffset - 12);
      const thumbHeight =
        maxScroll > 0
          ? Math.max(
              44,
              Math.round((window.innerHeight / doc.scrollHeight) * trackHeight)
            )
          : trackHeight;
      const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
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

    const scheduleUpdate = (show = false) => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        rafId = 0;
        updateScrollIndicator(show);
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
    const handleResize = () => scheduleUpdate(false);

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);
    desktopQuery.addEventListener?.("change", handleResize);
    scheduleUpdate(false);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      if (hideTimer) window.clearTimeout(hideTimer);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      desktopQuery.removeEventListener?.("change", handleResize);
    };
  }, []);

  useEffect(() => {
    const desktopQuery = window.matchMedia("(min-width: 601px)");
    let wheelRemainder = 0;

    const targetHasScrollableParent = (target, deltaY) => {
      let node = target instanceof Element ? target : target?.parentElement;
      while (node && node !== document.body && node !== document.documentElement) {
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

    const handleDesktopWheel = (event) => {
      const deltaY = normalizeWheelDelta(event);

      if (
        !desktopQuery.matches ||
        event.defaultPrevented ||
        event.ctrlKey ||
        Math.abs(deltaY) < 0.01 ||
        document.body.classList.contains("no-scroll") ||
        document.documentElement.classList.contains("modal-scroll-lock") ||
        targetHasScrollableParent(event.target, deltaY)
      ) {
        return;
      }

      const beforeY = window.scrollY;
      requestAnimationFrame(() => {
        if (Math.abs(window.scrollY - beforeY) > 0.25) {
          wheelRemainder = 0;
          return;
        }

        wheelRemainder += deltaY;
        const scrollDelta = Math.trunc(wheelRemainder);
        if (scrollDelta === 0) return;

        wheelRemainder -= scrollDelta;
        window.scrollBy({ top: scrollDelta, left: 0, behavior: "auto" });
      });
    };

    window.addEventListener("wheel", handleDesktopWheel, {
      capture: true,
      passive: true,
    });

    return () => {
      window.removeEventListener("wheel", handleDesktopWheel, {
        capture: true,
      });
    };
  }, []);

  const scrollToScrollbarPointer = (clientY) => {
    const dragState = scrollDragRef.current;
    if (!dragState) return;

    const doc = document.documentElement;
    const maxScroll = Math.max(0, doc.scrollHeight - window.innerHeight);
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
    window.scrollTo({ top: progress * maxScroll, left: 0, behavior: "auto" });
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

  useEffect(() => {
    const sectionIds = ["home", "about", "experience", "projects", "contact"];
    const getSections = () =>
      Array.from(document.querySelectorAll("section[id]"));

    let sections = getSections();
    let rafId = 0;
    let headerHeight = 60;

    const readHeaderHeight = () => {
      const headerVar = getComputedStyle(document.documentElement)
        .getPropertyValue("--header-height")
        .trim();
      headerHeight = parseInt(headerVar || "60", 10) || 60;
    };

    const updateActiveSectionFromViewport = () => {
      if (!sections.length) return;

      const viewportHeight = window.innerHeight || 1;
      const viewportCenter = viewportHeight / 2;
      const bandOffset = viewportHeight * 0.1; // 20% band around center
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

    const scheduleUpdate = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        rafId = 0;
        updateActiveSectionFromViewport();
      });
    };

    const refreshSections = () => {
      sections = getSections();
      scheduleUpdate();
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
      scheduleUpdate();
    };

    window.addEventListener("scroll", scheduleUpdate, {
      passive: true,
    });
    window.addEventListener("resize", handleResize);

    readHeaderHeight();
    refreshSections();

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      mutationObserver.disconnect();
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="App">
      <Header activeSection={activeSection} />
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
