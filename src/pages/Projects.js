import { useState } from "react";
import Card from "../components/Card";
import CollapsedCard from "../components/CollapsedCard";
import ExpandedCard from "../components/ExpandedCard";
import Gallery from "../components/Gallery";
import projects from "../data/projects";
import useCardExpansion from "../hooks/useCardExpansion";
import "../styles/Projects.css";

function Projects() {
  const [fullscreenIndex, setFullscreenIndex] = useState(null);
  const [fullscreenImages, setFullscreenImages] = useState([]);

  const { isExpanded, toggle } = useCardExpansion();

  const onGalleryClick = (images) => {
    setFullscreenImages(images);
    setFullscreenIndex(0);
  };

  return (
    <section id="projects" className="projects" data-snap-target>
      <div className="container">
        <div className="project-header-wrapper">
          <div className="project-header-card">
            <h2>Projects</h2>
          </div>
        </div>

        {projects.map((proj) => (
          <Card
            key={proj.id}
            id={proj.id}
            isExpanded={isExpanded(proj.id)}
            onToggle={() => toggle(proj.id)}
            canExpand={!!proj.expanded} // Pass expandability based on expanded content
            renderCollapsed={() => (
              <CollapsedCard
                project={proj}
                onExpand={() => toggle(proj.id)}
                onGalleryClick={() => onGalleryClick(proj.images)}
              />
            )}
            renderExpanded={({ onClose }) => (
              <ExpandedCard
                project={proj}
                onGalleryClick={() => onGalleryClick(proj.images)}
                handleClose={onClose}
              />
            )}
          />
        ))}
      </div>

      {/* Fullscreen Gallery */}
      <Gallery
        images={fullscreenImages}
        index={fullscreenIndex}
        setIndex={setFullscreenIndex}
        onClose={() => {
          setFullscreenImages([]);
          setFullscreenIndex(null);
        }}
      />
    </section>
  );
}

export default Projects;
