import React from "react";
import { motion } from "framer-motion";
import { renderTag } from "../utils/renderTag.js";
import iconMap from "../data/iconMap.js";
import "../styles/CollapsedCard.css";

function CollapsedCard({ project, onExpand, onGalleryClick }) {
  const canExpand = !!project.expanded; // Check if project has expanded content

  return (
    <>
      {/* Header */}
      <div className="project-header">
        <h3 className="title">{project.title}</h3>
        {project.github && (
          <a
            className="githubIcon"
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={iconMap["GitHub"]}
              alt="GitHub"
              className="github-link-icon"
            />
          </a>
        )}
      </div>

      {/* Subheader */}
      <div className="project-subheader">
        <p>{project.team}</p>
      </div>

      {/* Stack tags */}
      <div className="project-stack">
        {project.stack.map((tech, i) => renderTag(tech, i))}
      </div>

      <hr className="project-divider" />

      {/* Description */}
      <p className="project-description">{project.description}</p>

      {/* Actions */}
      {(project.images?.length > 0 || canExpand) && (
        <div className="project-actions">
          {project.images?.length > 0 && (
            <button
              className="learn-more-btn"
              onClick={(e) => {
                e.stopPropagation();
                onGalleryClick(project.images);
              }}
            >
              <img src={iconMap["Gallery"]} alt="Gallery" className="button-icon" />
              Gallery
            </button>
          )}
          {canExpand && (
            <button
              className="learn-more-btn"
              onClick={(e) => {
                e.stopPropagation();
                onExpand();
              }}
            >
              <img src={iconMap["Info"]} alt="Info" className="button-icon" />
              Learn More
            </button>
          )}
        </div>
      )}
    </>
  );
}

export default CollapsedCard;