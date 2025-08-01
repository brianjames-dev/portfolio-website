import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { renderTag } from '../utils/renderTag.js';
import { scrollToProjectCard, scrollToYPosition, scrollPositionMap } from '../utils/scrollToProjectCard.js';
import githubIcon from '../images/github.svg';
import '../styles/ProjectCard.css';

function ProjectCard({
  project,
  isExpanded,
  onExpand,
  onCollapse,
  onGalleryClick,
  reportPosition,
  isVisible = true,
}) {
  const ref = useRef();
  const previousY = useRef(null);

  useEffect(() => {
    if (!isExpanded && ref.current && reportPosition) {
      const rect = ref.current.getBoundingClientRect();
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const top = rect.top + scrollTop;
  
      previousY.current = top; // Store previous position
      reportPosition(project.id, {
        top,
        height: rect.height,
      });
    }
  }, [isExpanded, reportPosition]);

  if (!isVisible) return null;

  return (
    <motion.div
      ref={ref}
      layoutId={`project-${project.id}`}
      layout
      className={`project-card${isExpanded ? ' expanded' : ''}`}
      id={`project-${project.id}`}
      style={{ willChange: 'transform' }}
      transition={{
        layout: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1],
      }}
    >
      {/* === Shared Header === */}
      <motion.div layout="position" className="project-header" layoutId={`header-${project.id}`}>
        <motion.h3 layout="position" className="title" layoutId={`title-${project.id}`}>
          {project.title}
        </motion.h3>
        <a
          className="githubIcon"
          href={project.github}
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={githubIcon} alt="GitHub" className="github-link-icon" />
        </a>
      </motion.div>

      <motion.div layout="position" className="project-subheader" layoutId={`subheader-${project.id}`}>
        <p>{project.team}</p>
      </motion.div>

      <motion.div layout="position" className="project-stack" layoutId={`stack-${project.id}`}>
        {project.stack.map((tech, i) => renderTag(tech, i))}
      </motion.div>

      <motion.hr layout="position" className="project-divider" layoutId={`divider-${project.id}`} />

      {/* === Description Section === */}
      {isExpanded ? (
        <>
          <motion.div
            layout="position"
            className="project-description fade-transition"
            layoutId={`desc-${project.id}`}
          >
            <p><strong>Subtitle:</strong> {project.expanded?.subtitle || 'Expanded project view.'}</p>
          </motion.div>

          {/* === Expanded Sections (No Gallery Images Here) === */}
          <motion.div layout className="project-section">
            <h4>Problem & Motivation</h4>
            <p>{project.expanded?.problem}</p>
          </motion.div>

          <motion.div layout className="project-section">
            <h4>Tools & Stack</h4>
            <ul className="tools-list">
              {project.expanded?.tools?.map((tool, i) => <li key={i}>{tool}</li>)}
            </ul>
          </motion.div>

          <motion.div layout className="project-section">
            <h4>Key Features</h4>
            {project.expanded?.features?.map((feat, i) => (
              <div key={i} className="feature-item">
                <strong>{feat.title}</strong>
                <p>{feat.content}</p>
              </div>
            ))}
          </motion.div>

          <motion.div layout className="project-section">
            <h4>Final Polish</h4>
            <p>{project.expanded?.polish}</p>
          </motion.div>

          <motion.div layout className="project-section">
            <h4>Reflection & Learnings</h4>
            <p>{project.expanded?.reflection}</p>
          </motion.div>
        </>
      ) : (
        <motion.p
          layout="position"
          className="project-description fade-transition"
          layoutId={`desc-${project.id}`}
        >
          {project.description}
        </motion.p>
      )}

      {/* === Action Buttons === */}
      <motion.div layout="position" className="project-actions" layoutId={`actions-${project.id}`}>
        {isExpanded ? (
          <>
            {project.images?.length > 0 && (
              <button className="learn-more-btn" onClick={() => onGalleryClick(project.images)}>
                Show Gallery
              </button>
            )}
            <button
              className="learn-more-btn"
              onClick={() => {
                onCollapse();
                const y = scrollPositionMap.get(project.id);
                if (y !== undefined) {
                  setTimeout(() => scrollToYPosition(y), 300); // delay until collapse finishes
                }
              }}
            >
              Close
            </button>
          </>
        ) : (
          project.images?.length > 0 && (
            <button
              onClick={() => {
                scrollToProjectCard(project.id);
                onExpand();
              }}
              className="learn-more-btn"
            >
              Learn More
            </button>
          )
        )}
      </motion.div>
    </motion.div>
  );
}

export default ProjectCard;
