// src/components/ExpandedCard.js
import { motion } from "framer-motion";
import React from "react";
import IconGlyph from "./IconGlyph";
import "../styles/BookieBot.css";
import "../styles/CollapsedCard.css"; // for shared section styles
import { renderContentBlock } from "../utils/renderContentBlock.js";
import { renderTechStackItem } from "../utils/renderTechStackItem.js";

const CONTENT_FADE_DURATION = 0.5;

function ExpandedCard({
  project,
  onGalleryClick,
  isGalleryLocked = false,
  isLockable = false,
  showGalleryButton = false,
  showDemoButton = false,
  onDemoClick,
  handleClose,
  handleCloseAndScroll,
}) {
  const hasGallery =
    (project.images?.length || 0) > 0 || Boolean(showGalleryButton);
  const hasDemo = Boolean(showDemoButton);
  const hasGithub = Boolean(project.expanded?.github);
  const hasTopButtons = hasGallery || hasDemo || hasGithub;
  const videoEmbed = project.expanded?.video;
  const rawVideoId = videoEmbed?.id;
  const videoEmbedId =
    typeof rawVideoId === "string" ? rawVideoId.trim() : "";
  const hasVideoEmbed =
    videoEmbed?.provider === "youtube" && Boolean(videoEmbedId);
  const logo = project.logo;

  return (
    <div className="expanded-block">
      {/* Expanded Title / Subtitle / Close */}
      <div className="expanded-header">
        <div className="expanded-title-row">
          <div className={`expanded-title-block ${logo ? "has-logo" : ""}`}>
            {logo && (
              <span
                className={["experience-logo-frame", logo.className]
                  .filter(Boolean)
                  .join(" ")}
              >
                <img
                  className="experience-logo"
                  src={logo.src}
                  alt={logo.alt}
                />
              </span>
            )}
            <div className="expanded-title-copy">
              <h3>{project.expanded?.title}</h3>
              <p className="expanded-subtitle">{project.expanded?.subtitle}</p>
            </div>
          </div>
          <button
            type="button"
            className="close-button-icon-button"
            aria-label="Close details"
            onClick={(e) => {
              e.stopPropagation();
              handleClose();
            }}
          >
            <IconGlyph name="close" className="close-button-icon" />
          </button>
        </div>

        {hasTopButtons && (
          <div className="expanded-buttons-row">
            {hasGallery && (
              <button
                className="expanded-top-button"
                data-locked={isGalleryLocked}
                onMouseEnter={() => import("../components/Gallery")}
                onFocus={() => import("../components/Gallery")}
                onClick={(e) => {
                  e.stopPropagation();
                  onGalleryClick(project.images);
                }}
              >
                <IconGlyph name="gallery" className="button-icon" />
                Gallery
                {isLockable &&
                  (isGalleryLocked ? (
                    <IconGlyph
                      name="locked"
                      className="lock-state-icon"
                      label="Locked"
                    />
                  ) : (
                    <IconGlyph
                      name="unlocked"
                      className="lock-state-icon"
                      label="Unlocked"
                    />
                  ))}
              </button>
            )}
            {hasDemo && (
              <button
                className="expanded-top-button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDemoClick?.(project.demoVideo);
                }}
              >
                <IconGlyph name="video" className="button-icon" />
                Demo
                {isLockable &&
                  (isGalleryLocked ? (
                    <IconGlyph
                      name="locked"
                      className="lock-state-icon"
                      label="Locked"
                    />
                  ) : (
                    <IconGlyph
                      name="unlocked"
                      className="lock-state-icon"
                      label="Unlocked"
                    />
                  ))}
              </button>
            )}
            {hasGithub && (
              <button
                className="expanded-top-button"
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(project.expanded.github, "_blank");
                }}
              >
                <IconGlyph name="github" className="button-icon" />
                GitHub
              </button>
            )}
          </div>
        )}
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
        const shouldRenderSection =
          Boolean(content) ||
          (label === "Short Description" && hasVideoEmbed);
        if (!shouldRenderSection) return null;

        return (
          <React.Fragment key={label}>
            {label !== "Short Description" && (
              <div className="section-divider" />
            )}
            <motion.div
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
                      renderTechStackItem(tech, i, project.id)
                    )}
                  </div>
                  {project.expanded?.techStack?.map?.((block, i) =>
                    renderContentBlock(block, i)
                  )}
                </>
              ) : Array.isArray(content) ? (
                content.map((block, i) => renderContentBlock(block, i))
              ) : typeof content === "string" ? (
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
              ) : null}
              {label === "Short Description" && hasVideoEmbed && (
                <div className="embedded-video">
                  <iframe
                    src={`https://www.youtube.com/embed/${videoEmbedId}?rel=0`}
                    title={videoEmbed.title || project.expanded?.title || "Demo video"}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
              )}
            </motion.div>
          </React.Fragment>
        );
      })}

      {/* Bottom Actions */}
      <div className="project-actions">
        {hasGallery && (
          <button
            className="learn-more-btn"
            data-locked={isGalleryLocked}
            onMouseEnter={() => import("../components/Gallery")}
            onFocus={() => import("../components/Gallery")}
            onClick={(e) => {
              e.stopPropagation();
              onGalleryClick(project.images);
            }}
          >
            <IconGlyph name="gallery" className="button-icon" />
            Gallery
            {isLockable &&
              (isGalleryLocked ? (
                <IconGlyph
                  name="locked"
                  className="lock-state-icon"
                  label="Locked"
                />
              ) : (
                <IconGlyph
                  name="unlocked"
                  className="lock-state-icon"
                  label="Unlocked"
                />
              ))}
          </button>
        )}
        {hasDemo && (
          <button
            className="learn-more-btn"
            onClick={(e) => {
              e.stopPropagation();
              onDemoClick?.(project.demoVideo);
            }}
          >
            <IconGlyph name="video" className="button-icon" />
            Demo
            {isLockable &&
              (isGalleryLocked ? (
                <IconGlyph
                  name="locked"
                  className="lock-state-icon"
                  label="Locked"
                />
              ) : (
                <IconGlyph
                  name="unlocked"
                  className="lock-state-icon"
                  label="Unlocked"
                />
              ))}
          </button>
        )}
        <button
          className="learn-more-btn"
          onClick={(e) => {
            e.stopPropagation();
            (handleCloseAndScroll || handleClose)();
          }}
        >
          <IconGlyph name="collapse" className="button-icon" />
          Close
        </button>
      </div>
    </div>
  );
}

export default ExpandedCard;
