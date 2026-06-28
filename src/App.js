import { Suspense, lazy, useEffect, useState } from "react";
import "./App.css";
import ParticlesBackground from "./ParticlesBackground";
import Header from "./pages/Header";
import Home from "./pages/Home";
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Experience = lazy(() => import("./pages/Experience"));
const Projects = lazy(() => import("./pages/Projects"));

function App() {
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    let rafId = 0;
    const saveScrollPosition = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        rafId = 0;
        try {
          sessionStorage.setItem(
            "portfolio:lastScrollY",
            String(window.scrollY || 0)
          );
        } catch (e) {
          /* no-op */
        }
      });
    };

    window.addEventListener("scroll", saveScrollPosition, { passive: true });
    window.addEventListener("pagehide", saveScrollPosition);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", saveScrollPosition);
      window.removeEventListener("pagehide", saveScrollPosition);
    };
  }, []);

  useEffect(() => {
    const initialNavigation = window.__PORTFOLIO_INITIAL_NAVIGATION__ || {};
    if (initialNavigation.type === "back_forward") return undefined;

    const sectionIds = ["home", "about", "experience", "projects", "contact"];
    const getMaxScroll = () =>
      Math.max(0, document.documentElement.scrollHeight - window.innerHeight);

    const getTargetScrollY = () => {
      if (initialNavigation.type === "reload") {
        return Math.min(
          Math.max(0, Number(initialNavigation.savedScrollY) || 0),
          getMaxScroll()
        );
      }

      if (window.location.hash) {
        const target = document.getElementById(window.location.hash.slice(1));
        if (target) {
          const headerVar = getComputedStyle(document.documentElement)
            .getPropertyValue("--header-height")
            .trim();
          const headerOffset = parseInt(headerVar || "60", 10) || 60;
          return Math.min(
            Math.max(
              0,
              target.getBoundingClientRect().top +
                window.pageYOffset -
                headerOffset
            ),
            getMaxScroll()
          );
        }
      }

      return 0;
    };

    let cancelled = false;
    const restoreScroll = () => {
      if (cancelled) return;
      window.scrollTo(0, getTargetScrollY());
    };

    const restoreDelays = [0, 80, 180, 360, 720, 1200];
    const timers = restoreDelays.map((delay) =>
      window.setTimeout(restoreScroll, delay)
    );

    const observer = new MutationObserver(() => {
      if (
        sectionIds.every((id) => document.getElementById(id)) &&
        !cancelled
      ) {
        restoreScroll();
      }
    });

    observer.observe(document.querySelector("main") || document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      cancelled = true;
      timers.forEach((timer) => window.clearTimeout(timer));
      observer.disconnect();
    };
  }, []);

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
        <Suspense fallback={null}>
          <About />
          <Experience />
          <Projects />
          <Contact />
        </Suspense>
      </main>
    </div>
  );
}

export default App;
