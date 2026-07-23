import { motion } from "framer-motion";
import React from "react";
// /utils/renderTag.js
import iconMap from "../data/iconMap";

export function renderTag(
  tech,
  i,
  { layoutId, layoutTransition } = {}
) {
  const iconSrc = iconMap[tech];
  return (
    <motion.span
      key={i}
      className={`tag ${!iconSrc ? "no-icon" : ""}`}
      layout={layoutId ? "position" : undefined}
      layoutId={layoutId}
      transition={
        layoutTransition ? { layout: layoutTransition } : undefined
      }
    >
      {iconSrc && (
        <span className="tag-icon-container">
          <img src={iconSrc} alt={tech} className="tag-icon" />
        </span>
      )}
      {tech}
    </motion.span>
  );
}
