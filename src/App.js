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
