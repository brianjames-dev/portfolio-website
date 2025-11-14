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
  const [expandedProjectIndex, setExpandedProjectIndex] = useState(null); // Updated to include setter

  useEffect(() => {
    const getSections = () =>
      Array.from(document.querySelectorAll("section[id]"));

    let sections = getSections();

    const updateActiveSectionFromViewport = () => {
      if (!sections.length) return;

      const viewportHeight = window.innerHeight || 1;
      const viewportCenter = viewportHeight / 2;
      const bandOffset = viewportHeight * 0.1; // 20% band centered in viewport

      const measurements = sections
        .map((section) => {
          const rect = section.getBoundingClientRect();
          const intersects = rect.bottom > 0 && rect.top < viewportHeight;
          if (!intersects) return null;

          const center = rect.top + rect.height / 2;
          const distance = Math.abs(center - viewportCenter);
          const inBand = distance <= bandOffset;

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

    const mutationObserver = new MutationObserver(() => {
      sections = getSections();
      updateActiveSectionFromViewport();
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    window.addEventListener("scroll", updateActiveSectionFromViewport, {
      passive: true,
    });
    window.addEventListener("resize", updateActiveSectionFromViewport);

    updateActiveSectionFromViewport();

    return () => {
      mutationObserver.disconnect();
      window.removeEventListener("scroll", updateActiveSectionFromViewport);
      window.removeEventListener("resize", updateActiveSectionFromViewport);
    };
  }, []);

  return (
    <div className="App">
      <Header
        activeSection={activeSection}
        expandedProjectIndex={expandedProjectIndex}
      />
      <ParticlesBackground />
      <main>
        <Home />
        <Suspense fallback={null}>
          <About />
          <Experience />
          <Projects
            expandedProjectIndex={expandedProjectIndex}
            setExpandedProjectIndex={setExpandedProjectIndex} // Added setter prop
          />
          <Contact />
        </Suspense>
      </main>
    </div>
  );
}

export default App;
