// src/hooks/useCardExpansion.js
import { useState } from "react";

export default function useCardExpansion() {
  const [expandedId, setExpandedId] = useState(null);

  const isExpanded = (id) => expandedId === id;
  const toggle = (id) => setExpandedId((prev) => (prev === id ? null : id));
  const close = () => setExpandedId(null);

  return { expandedId, isExpanded, toggle, close };
}
