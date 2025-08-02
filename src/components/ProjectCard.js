import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { renderTag } from '../utils/renderTag.js';
import {
  scrollToProjectCard,
  scrollToYPosition,
  scrollPositionMap,
} from '../utils/scrollToProjectCard.js';
import githubIcon from '../images/github.svg';
import '../styles/ProjectCard.css';

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
    if (isExpanded) return; // Don't report when expanded
  
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
      timeout = setTimeout(report, 200); // Debounce to avoid spamming
    };
  
    report(); // Initial position
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
      setTimeout(() => {
        unlockScroll();
      }, CARD_ANIMATION_DURATION * 1000);
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
      {/* === Header === */}
      <motion.div layout="position" className="project-header" layoutId={`header-${project.id}`}>
        <motion.h3 layout="position" className="title" layoutId={`title-${project.id}`}>
          {project.title}
        </motion.h3>
        <a className="githubIcon" href={project.github} target="_blank" rel="noopener noreferrer">
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

      {/* === Collapsed Content === */}
      <AnimatePresence mode="wait">
        {!isExpanded && collapsedShouldRender && (
          <motion.div
            key="collapsed-block"
            className="collapsed-block"
            initial={{ opacity: 0 }}
            animate={{ opacity: showCollapsedContent ? 1 : 0 }}
            exit={{ opacity: 0 }}
            transition={{ 
              duration: CONTENT_FADE_DURATION,
              delay: CARD_ANIMATION_DURATION,
            }}
          >
            <motion.p
              layout="position"
              className="project-description fade-transition"
              layoutId={`desc-${project.id}`}
            >
              {project.description}
            </motion.p>

            {project.images?.length > 0 && (
              <div className="project-actions">
                <button
                  className="learn-more-btn"
                  onClick={() => {
                    lockScroll();
                    scrollToProjectCard(project.id);
                    onExpand();
                    setTimeout(unlockScroll, CARD_ANIMATION_DURATION * 1000);
                  }}
                >
                  Learn More
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* === Expanded Content === */}
      {isExpanded && (
        <motion.div
          key="expanded-block"
          className="expanded-block"
          initial={false}
          animate={{ opacity: showExpandedContent ? 1 : 0 }}
          transition={{ duration: CONTENT_FADE_DURATION }}
        >
          {[
            ['Short Description', project.expanded?.description],
            ['Background', project.expanded?.background],
            ['The Problem', project.expanded?.challenge],
            ['Goal', project.expanded?.goal],
            ['Research & Approach', project.expanded?.research],
            ['Architecture & Design', project.expanded?.architecture],
            ['Key Features', project.expanded?.features],
            ['Impact', project.expanded?.impact],
            ['Reflection & Learnings', project.expanded?.reflection],
            ['What’s Next', project.expanded?.future],
          ].map(([label, content], idx) => {
            if (!content) return null;
            const key = `section-${label}`;

            return (
              <motion.div
                key={key}
                layout
                className="project-section"
                initial={{ opacity: 0, y: 80 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50}}
                transition={{ 
                  duration: CONTENT_FADE_DURATION,
                  delay: idx * 0.2, //cascading effect
                }}
              >
                <h4>{label}</h4>
                {label === 'Key Features' ? (
                  <ul className="feature-list">
                    {content.map((feat, i) => (
                      <li key={i}>
                        <strong>{feat.title}</strong>: {feat.content}
                      </li>
                    ))}
                  </ul>
                ) : (() => {
                  const lines = content.split('\n').map(line => line.trim()).filter(Boolean);
                  const bulletLines = lines.filter(line => line.startsWith('-'));
                  const normalLines = lines.filter(line => !line.startsWith('-'));
                  return (
                    <>
                      {normalLines.map((line, i) => (
                        <p key={`p-${i}`}>{line}</p>
                      ))}
                      {bulletLines.length > 0 && (
                        <ul className="custom-bullet-list">
                          {bulletLines.map((line, i) => (
                            <li key={`b-${i}`}>{line.replace(/^-/, '').trim()}</li>
                          ))}
                        </ul>
                      )}
                    </>
                  );
                })()}
              </motion.div>
            );
          })}

          {/* === Expanded Buttons === */}
          <div className="project-actions">
            {project.images?.length > 0 && (
              <button className="learn-more-btn" onClick={() => onGalleryClick(project.images)}>
                Show Gallery
              </button>
            )}
            <button className="learn-more-btn" onClick={handleClose}>
              Close
            </button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

export default ProjectCard;
