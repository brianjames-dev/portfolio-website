import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { renderTag } from '../utils/renderTag.js';
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

  // Report position for scroll restoration after collapse
  useEffect(() => {
    if (!isExpanded && ref.current && reportPosition) {
      const rect = ref.current.getBoundingClientRect();
      const scrollTop = window.scrollY || document.documentElement.scrollTop;

      reportPosition(project.id, {
        top: rect.top + scrollTop,
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
      style={{
        willChange: 'transform',
      }}
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

      {/* === Shared Body === */}
      {isExpanded ? (
        <motion.div
          layout="position"
          className="project-description fade-transition"
          layoutId={`desc-${project.id}`}
        >
          <p>
            <strong>Problem:</strong>{' '}
            {project.problem || 'This project was built to solve a real-world issue.'}
          </p>
          <p>
            <strong>Design Goals:</strong> Deliver a user-first, responsive solution leveraging
            modern tools.
          </p>
          <p>
            <strong>My Process:</strong> Worked full-stack from schema to frontend. Overcame
            performance and API integration challenges.
          </p>
          <p>
            <strong>Results:</strong> Improved user engagement and streamlined interaction.
          </p>
        </motion.div>
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
            <button className="learn-more-btn" onClick={onCollapse}>
              Close
            </button>
          </>
        ) : (
          project.images?.length > 0 && (
            <button onClick={onExpand} className="learn-more-btn">
              Learn More
            </button>
          )
        )}
      </motion.div>
    </motion.div>
  );
}

export default ProjectCard;
