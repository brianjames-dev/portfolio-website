// src/components/ExpandedCard.js
import React from "react";
import iconMap from "../data/iconMap.js";
import "../styles/BookieBot.css";
import "../styles/CollapsedCard.css"; // for shared section styles
import { renderContentBlock } from "../utils/renderContentBlock.js";
import { renderTechStackItem } from "../utils/renderTechStackItem.js";
import MotionDiv from "./MotionDiv";

const CONTENT_FADE_DURATION = 0.5;

function ExpandedCard({ project, onGalleryClick, handleClose }) {
  const prewarmGallery = () => {
    import("../components/Gallery");
  };

  return (
    <div className="expanded-block">
      {/* Expanded Title / Subtitle / Close */}
      <div className="expanded-header">
        <div className="expanded-title-row">
          <h3>{project.expanded?.title}</h3>
          <img
            src={iconMap["CloseDark"]}
            alt="Close"
            className="close-button-icon"
            onClick={(e) => {
              e.stopPropagation();
              handleClose();
            }}
          />
        </div>
        <p className="expanded-subtitle">{project.expanded?.subtitle}</p>

        <div className="expanded-buttons-row">
          {project.images?.length > 0 && (
            <button
              className="expanded-top-button"
              onMouseEnter={prewarmGallery}
              onFocus={prewarmGallery}
              onClick={(e) => {
                e.stopPropagation();
                onGalleryClick(project.images);
              }}
            >
              <img
                src={iconMap["Gallery"]}
                alt="Gallery"
                className="button-icon"
              />
              Gallery
            </button>
          )}
          {project.expanded?.github && (
            <button
              className="expanded-top-button"
              onClick={(e) => {
                e.stopPropagation();
                window.open(project.expanded.github, "_blank");
              }}
            >
              <img
                src={iconMap["GitLight"]}
                alt="GitHub"
                className="button-icon"
              />
              GitHub
            </button>
          )}
        </div>
      </div>

      {/* Sections */}
      {[
        ["Short Description", project.expanded?.description],
        ["Background", project.expanded?.background],
        ["The Problem", project.expanded?.challenge],
        ["Goal", project.expanded?.goal],
        ["Research & Approach", project.expanded?.research],
        ["Tech Stack", project.expanded?.techStack],
        ["Features", project.expanded?.features],
        ["Impact", project.expanded?.impact],
        ["Reflection & Learnings", project.expanded?.reflection],
        ["What’s Next?", project.expanded?.future],
      ].map(([label, content], idx) => {
        if (!content) return null;

        return (
          <React.Fragment key={label}>
            {label !== "Short Description" && (
              <div className="section-divider" />
            )}
            <MotionDiv
              className="project-section"
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: CONTENT_FADE_DURATION,
                delay: idx * 0.2,
              }}
            >
              <h4>{label}</h4>
              {label === "Tech Stack" ? (
                <>
                  <div className="tech-timeline">
                    {project.stack.map((tech, i) =>
                      renderTechStackItem(tech, i)
                    )}
                  </div>
                  {project.expanded?.techStack?.map?.((block, i) =>
                    renderContentBlock(block, i)
                  )}
                </>
              ) : Array.isArray(content) ? (
                content.map((block, i) => renderContentBlock(block, i))
              ) : (
                (() => {
                  const lines = content
                    .split("\n")
                    .map((line) => line.trim())
                    .filter(Boolean);
                  const bulletLines = lines.filter((line) =>
                    line.startsWith("-")
                  );
                  const normalLines = lines.filter(
                    (line) => !line.startsWith("-")
                  );
                  return (
                    <>
                      {normalLines.map((line, i) => (
                        <p
                          key={`p-${i}`}
                          dangerouslySetInnerHTML={{ __html: line }}
                        />
                      ))}
                      {bulletLines.length > 0 && (
                        <ul className="custom-bullet-list">
                          {bulletLines.map((line, i) => (
                            <li
                              key={`b-${i}`}
                              dangerouslySetInnerHTML={{
                                __html: line.replace(/^-/, "").trim(),
                              }}
                            />
                          ))}
                        </ul>
                      )}
                    </>
                  );
                })()
              )}
            </MotionDiv>
          </React.Fragment>
        );
      })}

      {/* Bottom Actions */}
      <div className="project-actions">
        {project.images?.length > 0 && (
          <button
            className="learn-more-btn"
            onMouseEnter={prewarmGallery}
            onFocus={prewarmGallery}
            onClick={(e) => {
              e.stopPropagation();
              onGalleryClick(project.images);
            }}
          >
            <img
              src={iconMap["Gallery"]}
              alt="Gallery"
              className="button-icon"
            />
            Gallery
          </button>
        )}
        <button
          className="learn-more-btn"
          onClick={(e) => {
            e.stopPropagation();
            handleClose();
          }}
        >
          <img
            src={iconMap["Collapse"]}
            alt="Collapse"
            className="button-icon"
          />
          Close
        </button>
      </div>
    </div>
  );
}

export default ExpandedCard;
