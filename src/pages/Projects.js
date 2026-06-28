import { lazy, Suspense, useCallback, useRef, useState } from "react";
import Card from "../components/Card";
import CollapsedCard from "../components/CollapsedCard";
import ExpandedCard from "../components/ExpandedCard";
import RevealOnView from "../components/RevealOnView";
import projects from "../data/projects";
import useCardExpansion from "../hooks/useCardExpansion";
import "../styles/Projects.css";
const Gallery = lazy(() => import("../components/Gallery"));

function Projects() {
  const [fullscreenIndex, setFullscreenIndex] = useState(null);
  const [fullscreenImages, setFullscreenImages] = useState([]);
  const galleryReturnTargetRef = useRef(null);
  const { isExpanded, toggle } = useCardExpansion();

  const scrollGalleryTargetIntoView = useCallback(() => {
    const target = galleryReturnTargetRef.current;
    galleryReturnTargetRef.current = null;
    if (!target || !document.body.contains(target)) return;

    const headerVar = getComputedStyle(document.documentElement)
      .getPropertyValue("--header-height")
      .trim();
    const headerOffset = parseInt(headerVar || "60", 10) || 60;
    const targetTop =
      target.getBoundingClientRect().top + window.pageYOffset - headerOffset - 8;

    window.scrollTo({
      top: Math.max(0, targetTop),
      behavior: "smooth",
    });
  }, []);

  const openGallery = (images, sourceElement) => {
    import("../components/Gallery");
    galleryReturnTargetRef.current =
      sourceElement?.closest?.(".project-card") || null;
    setFullscreenImages(images);
    setFullscreenIndex(0);
  };

  const onGalleryClick = (images, sourceElement) => {
    openGallery(images, sourceElement);
  };

  return (
    <section id="projects" className="projects" data-snap-target>
      <div className="container">
        <RevealOnView className="project-header-wrapper">
          <div className="project-header-card">
            <h2>Projects</h2>
          </div>
        </RevealOnView>

        {projects.map((proj) => (
          <Card
            key={proj.id}
            id={proj.id}
            isExpanded={isExpanded(proj.id)}
            onToggle={() => toggle(proj.id)}
            canExpand={!!proj.expanded} // Pass expandability based on expanded content
            renderCollapsed={({ onExpand }) => (
              <CollapsedCard
                project={proj}
                onExpand={onExpand}
                onGalleryClick={(images, sourceElement) =>
                  onGalleryClick(images, sourceElement)
                }
                isGalleryLocked={false}
              />
            )}
            renderExpanded={({ onClose, onCloseAndScroll }) => (
              <ExpandedCard
                project={proj}
                onGalleryClick={(images, sourceElement) =>
                  onGalleryClick(images, sourceElement)
                }
                isGalleryLocked={false}
                handleClose={onClose}
                handleCloseAndScroll={onCloseAndScroll}
              />
            )}
          />
        ))}
      </div>

      {/* Fullscreen Gallery */}
      <Suspense fallback={<div className="fade-loader">Loading…</div>}>
        <Gallery
          images={fullscreenImages}
          index={fullscreenIndex}
          setIndex={setFullscreenIndex}
          onClose={() => {
            setFullscreenImages([]);
            setFullscreenIndex(null);
            window.setTimeout(scrollGalleryTargetIntoView, 80);
          }}
        />
      </Suspense>
    </section>
  );
}

export default Projects;
