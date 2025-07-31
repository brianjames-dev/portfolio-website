// /components/ProjectCard.js
import React from 'react';
import githubIcon from '../images/github.svg';
import { renderTag } from '../utils/renderTag.js';
import ProjectDetailPanel from './ProjectDetailPanel';
import '../styles/ProjectCard.css'


function ProjectCard({ project, isExpanded, onExpand, onCollapse, onGalleryClick }) {
  return (
    <div className={`project-card${isExpanded ? ' expanded' : ''}`} id={`project-${project.id}`}>
      {/* -- Header: Title + GitHub Link -- */}
      <div className="project-header">
        <h3 className="title">{project.title}</h3>
        <a
          className="githubIcon"
          href={project.github}
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={githubIcon} alt="GitHub" className="github-link-icon" />
        </a>
      </div>

      {/* -- Subheader: Team info -- */}
      <div className="project-subheader">
        <p>{project.team}</p>
      </div>

      {/* -- Stack / Tech Tags -- */}
      <div className="project-stack">
        {project.stack.map((tech, i) => renderTag(tech, i))}
      </div>

      <hr className="project-divider" />
      <p className="project-description">{project.description}</p>

      {/* -- Gallery Trigger -- */}
      {project.images?.length > 0 && (
        <button onClick={onExpand} className="learn-more-btn">
          Learn More
        </button>
      )}

      {isExpanded && (
        <div className="project-detail-wrapper">
          <ProjectDetailPanel
            project={project}
            onClose={onCollapse}
            onGalleryClick={onGalleryClick}
          />
        </div>
      )}
    </div>
  );
}

export default ProjectCard;
