import React, { lazy, Suspense, useState } from "react";
import Card from "../components/Card.jsx";
import CollapsedCard from "../components/CollapsedCard.jsx";
import ExpandedCard from "../components/ExpandedCard.jsx";
import RevealOnView from "../components/RevealOnView.jsx";
import projects from "../data/projects";
import useCardExpansion from "../hooks/useCardExpansion";
import "../styles/Projects.css";
const Gallery = lazy(() => import("../components/Gallery.jsx"));

function Projects() {
  const [fullscreenIndex, setFullscreenIndex] = useState(null);
  const [fullscreenImages, setFullscreenImages] = useState([]);
  const { isExpanded, toggle } = useCardExpansion();

  const openGallery = (images) => {
    import("../components/Gallery.jsx");
    setFullscreenImages(images);
    setFullscreenIndex(0);
  };

  const onGalleryClick = (images) => {
    openGallery(images);
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
          }}
        />
      </Suspense>
    </section>
  );
}

export default Projects;
