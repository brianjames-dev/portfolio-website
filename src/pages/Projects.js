// /pages/Projects.js
import React, { useState, useEffect } from 'react';
import ProjectCard from '../components/ProjectCard';
import ProjectGallery from '../components/ProjectGallery';
import ProjectDetailPanel from '../components/ProjectDetailPanel';
import projects from '../data/projects';
import '../styles/Projects.css'

function Projects() {
  const [fullscreenIndex, setFullscreenIndex] = useState(null);
  const [fullscreenImages, setFullscreenImages] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    if (selectedProject) {
      document
        .getElementById(`project-${selectedProject.id}`)
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [selectedProject]);

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

        {/* === Project Cards === */}
        {projects.map((proj) => (
          <ProjectCard
            key={proj.id}
            project={proj}
            isExpanded={selectedProject?.id === proj.id}
            onExpand={() => setSelectedProject(proj)}
            onCollapse={() => setSelectedProject(null)}
            onGalleryClick={onGalleryClick}
          />
        ))}
      </div>

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
