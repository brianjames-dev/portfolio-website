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
    const handleScroll = () => {
      const scrollPos = window.scrollY; // Using top of viewport for simplicity
      const sections = document.querySelectorAll("section");
      let newActive = activeSection;

      sections.forEach((section) => {
        const top = section.offsetTop;
        const bottom = top + section.offsetHeight;
        const id = section.getAttribute("id");
        // console.log(`Section: ${id}, Top: ${top}, Bottom: ${bottom}, ScrollPos: ${scrollPos}`); // Log each section's bounds
        if (scrollPos >= top - 100 && scrollPos < bottom) {
          // Buffer for tolerance
          newActive = id;
        }
      });

      // console.log('ScrollPos:', scrollPos, 'NewActive:', newActive, 'CurrentActive:', activeSection); // Debug log

      if (newActive !== activeSection) {
        setActiveSection(newActive);
      }
    };

    // console.log('Adding scroll listener'); // Debug: Confirm listener is added
    window.addEventListener("scroll", handleScroll, { passive: true }); // Use passive for performance
    window.addEventListener("resize", handleScroll, { passive: true });
    window.addEventListener("load", handleScroll);

    handleScroll(); // Trigger once on load

    return () => {
      // console.log('Removing scroll listener'); // Debug: Confirm listener is removed
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      window.removeEventListener("load", handleScroll);
    };
  }, [activeSection]); // Dependency array

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
