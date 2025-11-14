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
    if (!("IntersectionObserver" in window)) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible.length) {
          const newActive = visible[0].target.id;
          setActiveSection((prev) => (prev === newActive ? prev : newActive));
        }
      },
      {
        threshold: [0.25, 0.5, 0.75],
        rootMargin: "-30% 0px -40% 0px", // bias toward elements centered in the viewport
      }
    );

    const observed = new Set();
    const observeSections = () => {
      document.querySelectorAll("section[id]").forEach((section) => {
        if (!observed.has(section)) {
          observer.observe(section);
          observed.add(section);
        }
      });
    };

    observeSections();

    const mutationObserver = new MutationObserver(() => {
      observeSections();
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
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
