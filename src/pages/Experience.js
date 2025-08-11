import { useState } from "react";
import Card from "../components/Card";
import CollapsedCard from "../components/CollapsedCard";
import ExpandedCard from "../components/ExpandedCard";
import Gallery from "../components/Gallery";
import experiences from "../data/experience";
import useCardExpansion from "../hooks/useCardExpansion";
import "../styles/Projects.css";

function Experience() {
  const [fullscreenIndex, setFullscreenIndex] = useState(null);
  const [fullscreenImages, setFullscreenImages] = useState([]);

  const { isExpanded, toggle } = useCardExpansion();

  const onGalleryClick = (images) => {
    setFullscreenImages(images);
    setFullscreenIndex(0);
  };

  return (
    <section id="experience" className="projects" data-snap-target>
      <div className="container">
        <div className="project-header-wrapper">
          <div className="project-header-card">
            <h2>Experience</h2>
          </div>
        </div>

        {experiences.map((exp) => (
          <Card
            key={exp.id}
            id={exp.id}
            isExpanded={isExpanded(exp.id)}
            onToggle={() => toggle(exp.id)}
            canExpand={!!exp.expanded} // Pass expandability based on expanded content
            renderCollapsed={() => (
              <CollapsedCard
                project={exp}
                onExpand={() => toggle(exp.id)}
                onGalleryClick={() => onGalleryClick(exp.images)}
              />
            )}
            renderExpanded={({ onClose }) => (
              <ExpandedCard
                project={exp}
                onGalleryClick={() => onGalleryClick(exp.images)}
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

export default Experience;
