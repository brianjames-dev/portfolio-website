// ProjectExpandedView.js
import React from 'react';
import { motion } from 'framer-motion';
import iconMap from '../data/iconMap.js';
import { renderTechStackItem } from '../utils/renderTechStackItem';

const CONTENT_FADE_DURATION = 0.5;

function ProjectExpandedView({ project, onGalleryClick, handleClose, showExpandedContent }) {
  return (
    <motion.div
      key="expanded-block"
      className="expanded-block"
      initial={false}
      animate={{ opacity: showExpandedContent ? 1 : 0 }}
      transition={{ duration: CONTENT_FADE_DURATION }}
    >
      {/* Expanded Title / Subtitle / GitHub */}
      <div className="expanded-header">
        <div className="expanded-title-row">
          <h3>{project.expanded?.title}</h3>
          {project.expanded?.github && (
            <img
              src={iconMap['CloseDark']}
              alt="Close"
              className="close-button-icon"
              onClick={handleClose}
            />
          )}
        </div>
        <p className="expanded-subtitle">{project.expanded?.subtitle}</p>

        <div className="expanded-buttons-row">
          {project.images?.length > 0 && (
            <button className="expanded-top-button" onClick={() => onGalleryClick(project.images)}>
              <img src={iconMap['Gallery']} alt="Gallery" className="button-icon" />
              Show Gallery
            </button>
          )}
          {project.expanded?.github && (
            <button
              className="expanded-top-button"
              onClick={() => window.open(project.expanded.github, '_blank')}
            >
              <img src={iconMap['GitLight']} alt="GitHub" className="button-icon" />
              GitHub
            </button>
          )}
        </div>
      </div>

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
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: CONTENT_FADE_DURATION, delay: idx * 0.2 }}
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
            ) : label === 'Architecture & Design' ? (
              <>
                {content
                  .split('\n')
                  .map((line, i) => line.trim())
                  .filter(Boolean)
                  .map((line, i) => (
                    <p key={`arch-p-${i}`} dangerouslySetInnerHTML={{ __html: line }} />
                  ))}
                <div className="tech-timeline">
                  {project.stack.map((tech, i) => renderTechStackItem(tech, i))}
                </div>
              </>
            ) : (
              (() => {
                const lines = content.split('\n').map(line => line.trim()).filter(Boolean);
                const bulletLines = lines.filter(line => line.startsWith('-'));
                const normalLines = lines.filter(line => !line.startsWith('-'));
                return (
                  <>
                    {normalLines.map((line, i) => (
                      <p key={`p-${i}`} dangerouslySetInnerHTML={{ __html: line }} />
                    ))}
                    {bulletLines.length > 0 && (
                      <ul className="custom-bullet-list">
                        {bulletLines.map((line, i) => (
                          <li key={`b-${i}`} dangerouslySetInnerHTML={{ __html: line.replace(/^-/, '').trim() }} />
                        ))}
                      </ul>
                    )}
                  </>
                );
              })()
            )}
          </motion.div>
        );
      })}

      <div className="project-actions">
        {project.images?.length > 0 && (
          <button className="learn-more-btn" onClick={() => onGalleryClick(project.images)}>
            <img src={iconMap['Gallery']} alt="Gallery" className="button-icon" />
            Show Gallery
          </button>
        )}
        <button className="learn-more-btn" onClick={handleClose}>
          Close
        </button>
      </div>
    </motion.div>
  );
}

export default ProjectExpandedView;
