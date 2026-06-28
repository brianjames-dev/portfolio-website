import IconGlyph from "./IconGlyph";
import iconMap from "../data/iconMap.js";
import "../styles/CollapsedCard.css";
import { renderTag } from "../utils/renderTag.js";

function CollapsedCard({
  project,
  onExpand,
  onGalleryClick,
  isGalleryLocked = false,
  isLockable = false,
  showGalleryButton = false,
  showDemoButton = false,
  onDemoClick,
}) {
  const canExpand = !!project.expanded; // Check if project has expanded content
  const hasGallery = (project.images?.length || 0) > 0 || showGalleryButton;
  const hasDemo = Boolean(showDemoButton);

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
            aria-label="GitHub repository"
          >
            <span className="github-icon-wrapper">
              <img
                src={iconMap["GitHubThemed"]}
                alt=""
                className="default"
                aria-hidden="true"
              />
              <img
                src={iconMap["GitHubHover"]}
                alt=""
                className="hover"
                aria-hidden="true"
              />
            </span>
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
      {(hasGallery || hasDemo || canExpand) && (
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
          {canExpand && (
            <button
              className="learn-more-btn"
              onClick={(e) => {
                e.stopPropagation();
                onExpand();
              }}
            >
              <IconGlyph name="info" className="button-icon" />
              Learn More
            </button>
          )}
        </div>
      )}
    </>
  );
}

export default CollapsedCard;
