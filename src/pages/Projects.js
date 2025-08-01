import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import ProjectCard from '../components/ProjectCard';
import ProjectGallery from '../components/ProjectGallery';
import projects from '../data/projects';
import '../styles/Projects.css';

function Projects() {
  const [fullscreenIndex, setFullscreenIndex] = useState(null);
  const [fullscreenImages, setFullscreenImages] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [projectPositions, setProjectPositions] = useState({});
  const [expandedCardHeight, setExpandedCardHeight] = useState(0);

  const expandedRef = useRef();

  useEffect(() => {
    if (selectedProject) {
      console.log('Expanded top:', projectPositions[selectedProject.id]);
    }
  }, [selectedProject, projectPositions]);

  const onGalleryClick = (images) => {
    setFullscreenImages(images);
    setFullscreenIndex(0);
  };

  const reportPosition = (id, { top, height }) => {
    setProjectPositions((prev) => ({ ...prev, [id]: { top, height } }));
  };

  useLayoutEffect(() => {
    if (expandedRef.current && selectedProject) {
      setExpandedCardHeight(expandedRef.current.offsetHeight);
    }
  }, [selectedProject]);

  return (
    <section id="projects" className="projects" data-snap-target>
      <div   className={`container ${selectedProject ? 'container-shifted' : ''}`}>
        <div className="project-header-wrapper">
          <div className="project-header-card">
            <h2>Projects</h2>
          </div>
        </div>

        {/* === Project Cards === */}
        {projects.map((proj) => {
          const isThisSelected = selectedProject?.id === proj.id;
          const placeholderHeight = isThisSelected ? expandedCardHeight : undefined;

          return (
            <div
              key={proj.id}
              className={isThisSelected ? 'project-placeholder' : ''}
              style={isThisSelected ? { height: placeholderHeight } : {}}
              id={`project-${proj.id}`}
            >
              <ProjectCard
                key={proj.id}
                project={proj}
                isExpanded={false}
                onExpand={() => setSelectedProject(proj)}
                onCollapse={() => setSelectedProject(null)}
                onGalleryClick={() => onGalleryClick(proj.images)}
                isVisible={!selectedProject || selectedProject.id !== proj.id}
                reportPosition={reportPosition}
              />
            </div>
          );
        })}
      </div>

      {/* === Expanded Card Floating at Y-offset === */}
      {selectedProject && projectPositions[selectedProject.id] && (
        <div
          ref={expandedRef}
          className="project-expanded-outside"
          style={{
            top: projectPositions[selectedProject.id].top
          }}
        >
          <div className="expanded-card-wrapper">
            <ProjectCard
              key={`expanded-${selectedProject.id}`}
              project={selectedProject}
              isExpanded={true}
              onExpand={() => {}}
              onCollapse={() => setSelectedProject(null)}
              onGalleryClick={() => onGalleryClick(selectedProject.images)}
            />
          </div>
        </div>
      )}

      {/* === Fullscreen Gallery === */}
      <ProjectGallery
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
