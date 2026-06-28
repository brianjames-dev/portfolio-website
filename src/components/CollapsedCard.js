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
  const logo = project.logo;

  return (
    <>
      {/* Header */}
      <div className="project-header">
        <div className={`project-title-block ${logo ? "has-logo" : ""}`}>
          {logo && (
            <span
              className={["experience-logo-frame", logo.className]
                .filter(Boolean)
                .join(" ")}
            >
              <img className="experience-logo" src={logo.src} alt={logo.alt} />
            </span>
          )}
          <div className="project-title-copy">
            <h3 className="title">{project.title}</h3>
            <p className="project-subtitle">{project.team}</p>
          </div>
        </div>
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
