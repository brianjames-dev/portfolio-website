import React, { useState, useEffect, useLayoutEffect, useRef, useCallback } from 'react';
import ProjectCard from '../components/ProjectCard';
import ProjectGallery from '../components/ProjectGallery';
import projects from '../data/projects';
import '../styles/Projects.css';
import { scrollToProjectCard } from '../utils/scrollToProjectCard.js';

function Projects() {
  const [fullscreenIndex, setFullscreenIndex] = useState(null);
  const [fullscreenImages, setFullscreenImages] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [projectPositions, setProjectPositions] = useState({});
  const [expandedCardHeight, setExpandedCardHeight] = useState(0);
  const expandedRef = useRef();

  const handleExpand = (proj) => {
    // If no card is open, scroll and expand immediately
    if (!selectedProject) {
      scrollToProjectCard(proj.id);
      setSelectedProject(proj);
      return;
    }
  
    // If clicking the same card, do nothing
    if (selectedProject.id === proj.id) return;
  
    // Otherwise: close current, wait for collapse, scroll, then expand
    setSelectedProject(null);
    setTimeout(() => {
      scrollToProjectCard(proj.id); // scroll after layout resets
      setSelectedProject(proj);
    }, 600); // Match animation delay
  };
  
  useEffect(() => {
    if (selectedProject) {
      console.log('Expanded top:', projectPositions[selectedProject.id]);
    }
  }, [selectedProject, projectPositions]);

  const onGalleryClick = (images) => {
    setFullscreenImages(images);
    setFullscreenIndex(0);
  };

  const reportPosition = useCallback(
    (id, { top, height }) => {
      setProjectPositions((prev) => ({ ...prev, [id]: { top, height } }));

      // If this is the selected/expanded project, force re-measure
      if (selectedProject?.id === id && expandedRef.current) {
        const newHeight = expandedRef.current.offsetHeight;
        if (newHeight !== expandedCardHeight) {
          setExpandedCardHeight(newHeight);
        }
      }
    },
    [selectedProject, expandedCardHeight]
  );

  // Re-check height of floating expanded card while it's open
  useEffect(() => {
    if (!selectedProject) return;

    const intervalId = setInterval(() => {
      if (expandedRef.current) {
        const newHeight = expandedRef.current.offsetHeight;
        if (newHeight !== expandedCardHeight) {
          setExpandedCardHeight(newHeight);
        }
      }
    }, 500); // Adjust interval if needed

    return () => clearInterval(intervalId);
  }, [selectedProject, expandedCardHeight]);

  useLayoutEffect(() => {
    if (expandedRef.current && selectedProject) {
      setExpandedCardHeight(expandedRef.current.offsetHeight);
    }
  }, [selectedProject]);

  useEffect(() => {
    if (selectedProject) {
      console.log('Updated expanded card height:', expandedCardHeight);
    }
  }, [expandedCardHeight]);

  useEffect(() => {
    if (!selectedProject) return;
  
    const handleResize = () => {
      const elem = document.getElementById(`project-${selectedProject.id}`);
      if (!elem) return;
  
      const rect = elem.getBoundingClientRect();
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
  
      setProjectPositions((prev) => ({
        ...prev,
        [selectedProject.id]: {
          top: rect.top + scrollTop,
          height: rect.height,
        },
      }));
    };
  
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [selectedProject]);

  return (
    <section id="projects" className="projects" data-snap-target>
      <div className={`container ${selectedProject ? 'container-shifted' : ''}`}>
        <div className="project-header-wrapper">
          <div className="project-header-card">
            <h2>Projects</h2>
          </div>
        </div>

        {/* === Project Cards with Placeholder === */}
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
                onExpand={() => handleExpand(proj)}
                onCollapse={() => setSelectedProject(null)}
                onGalleryClick={() => onGalleryClick(proj.images)}
                isVisible={!selectedProject || selectedProject.id !== proj.id}
                reportPosition={reportPosition}
              />
            </div>
          );
        })}
      </div>

      {/* === Floating Expanded Card === */}
      {selectedProject && projectPositions[selectedProject.id] && (
        <div
          ref={expandedRef}
          className="project-expanded-outside"
          style={{
            top: projectPositions[selectedProject.id].top,
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
