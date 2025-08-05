// ProjectCard.js
import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { renderTag } from '../utils/renderTag.js';
import { renderTechStackItem } from '../utils/renderTechStackItem';
import {
  scrollToProjectCard,
  scrollToYPosition,
  scrollPositionMap,
} from '../utils/scrollToProjectCard.js';
import '../styles/ProjectCard.css';
import ProjectExpandedView from './ProjectExpandedView';
import iconMap from '../data/iconMap.js';


const CARD_ANIMATION_DURATION = 0.5;
const CONTENT_FADE_DURATION = 0.5;

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
  const hasReportedRef = useRef(false);
  const preventTouch = (e) => e.preventDefault();

  const [showExpandedContent, setShowExpandedContent] = useState(false);
  const [showCollapsedContent, setShowCollapsedContent] = useState(true);
  const [collapsedShouldRender, setCollapsedShouldRender] = useState(true);

  useEffect(() => {
    let timeout;
    if (isExpanded) {
      setShowCollapsedContent(false);
      timeout = setTimeout(() => setCollapsedShouldRender(false), CONTENT_FADE_DURATION * 1000);
      setShowExpandedContent(false);
      timeout = setTimeout(() => setShowExpandedContent(true), CARD_ANIMATION_DURATION * 1000);
    } else {
      setCollapsedShouldRender(true);
      setShowExpandedContent(false);
      timeout = setTimeout(() => setShowCollapsedContent(true), CARD_ANIMATION_DURATION * 1000);
    }
    return () => clearTimeout(timeout);
  }, [isExpanded]);

  useEffect(() => {
    if (isExpanded) return;
    let timeout;
    const report = () => {
      if (ref.current && reportPosition) {
        const rect = ref.current.getBoundingClientRect();
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        reportPosition(project.id, {
          top: rect.top + scrollTop,
          height: rect.height,
        });
      }
    };
    const handleResize = () => {
      clearTimeout(timeout);
      timeout = setTimeout(report, 200);
    };
    report();
    window.addEventListener('resize', handleResize);
    return () => {
      clearTimeout(timeout);
      window.removeEventListener('resize', handleResize);
    };
  }, [isExpanded, reportPosition, project.id]);

  const lockScroll = () => {
    document.body.classList.add('no-scroll');
    document.addEventListener('touchmove', preventTouch, { passive: false });
  };

  const unlockScroll = () => {
    document.body.classList.remove('no-scroll');
    document.removeEventListener('touchmove', preventTouch);
  };

  const handleClose = () => {
    lockScroll();
    const y = scrollPositionMap.get(project.id);
    if (y !== undefined) scrollToYPosition(y);
    setShowExpandedContent(false);
    setTimeout(() => {
      onCollapse();
      setTimeout(() => unlockScroll(), CARD_ANIMATION_DURATION * 1000);
    }, CONTENT_FADE_DURATION * 1000);
  };

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
        layout: { duration: CARD_ANIMATION_DURATION, ease: [0.4, 0, 0.2, 1] },
        duration: CARD_ANIMATION_DURATION,
        ease: [0.4, 0, 0.2, 1],
      }}
    >
      {/* Collapsed Header */}
      {!isExpanded && (
        <>
          <motion.div layout="position" className="project-header" layoutId={`header-${project.id}`}>
            <motion.h3 layout="position" className="title" layoutId={`title-${project.id}`}>
              {project.title}
            </motion.h3>
            <a className="githubIcon" href={project.github} target="_blank" rel="noopener noreferrer">
              <img src={iconMap['GitHub']} alt="GitHub" className="github-link-icon" />
            </a>
          </motion.div>

          <motion.div layout="position" className="project-subheader" layoutId={`subheader-${project.id}`}>
            <p>{project.team}</p>
          </motion.div>

          <motion.div layout="position" className="project-stack" layoutId={`stack-${project.id}`}>
            {project.stack.map((tech, i) => renderTag(tech, i))}
          </motion.div>

          <motion.hr layout="position" className="project-divider" layoutId={`divider-${project.id}`} />
        </>
      )}

      {/* Collapsed Content */}
      <AnimatePresence mode="wait">
        {!isExpanded && collapsedShouldRender && (
          <motion.div
            key="collapsed-block"
            className="collapsed-block"
            initial={{ opacity: 0 }}
            animate={{ opacity: showCollapsedContent ? 1 : 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: CONTENT_FADE_DURATION, delay: CARD_ANIMATION_DURATION }}
          >
            <motion.p layout="position" className="project-description fade-transition" layoutId={`desc-${project.id}`}>
              {project.description}
            </motion.p>
            {project.images?.length > 0 && (
              <div className="project-actions">
                <button
                  className="learn-more-btn"
                  onClick={() => onGalleryClick(project.images)}
                >
                  <img src={iconMap['Gallery']} alt="Gallery" className="button-icon" />
                  Gallery
                </button>

                <button
                  className="learn-more-btn"
                  onClick={() => {
                    lockScroll();
                    scrollToProjectCard(project.id);
                    onExpand();
                    setTimeout(unlockScroll, CARD_ANIMATION_DURATION * 1000);
                  }}
                >
                  <img src={iconMap['Info']} alt="Info" className="button-icon" />
                  Learn More
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Expanded Content */}
      {isExpanded && (
        <ProjectExpandedView
          project={project}
          onGalleryClick={onGalleryClick}
          handleClose={handleClose}
          showExpandedContent={showExpandedContent}
        />
      )}
    </motion.div>
  );
}

export default ProjectCard;
