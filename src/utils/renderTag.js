// /utils/renderTag.js
import iconMap from "../data/iconMap";

export function renderTag(tech, i) {
  const iconSrc = iconMap[tech];
  return (
    <span key={i} className={`tag ${!iconSrc ? "no-icon" : ""}`}>
      {iconSrc && (
        <span className="tag-icon-container">
          <img src={iconSrc} alt={tech} className="tag-icon" />
        </span>
      )}
      {tech}
    </span>
  );
}
