// ProjectDetailPanel.js
import React from 'react';
import { renderTag } from '../utils/renderTag.js';
import '../styles/ProjectDetailPanel.css';

function ProjectDetailPanel({ project, onClose, onGalleryClick }) {
  return (
    <div className="project-detail-panel">
      <button className="close-btn" onClick={onClose}>×</button>
      <h3 className="project-title">{project.title}</h3>
      <p>{project.description}</p>

      {/* Tech stack */}
      <div className="stack-row">
        {project.stack.map((tech, i) => (
          <span key={i} className="tech-tag">{tech}</span>
        ))}
      </div>

      {/* Show Gallery Button */}
      {project.images?.length > 0 && (
        <button
          className="show-gallery-btn"
          onClick={() => onGalleryClick(project.images)}
        >
          Show Gallery
        </button>
      )}

      {/* Links, roles, responsibilities, etc. can go here */}
    </div>
  );
}

export default ProjectDetailPanel;
