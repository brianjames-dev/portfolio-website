import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useSpring } from "framer-motion";

const FADE_DURATION = 0.5; // Content fade duration
const MORPH_DURATION = 0.5; // Card container morph duration

export default function Card({
  id,
  isExpanded,
  onToggle,
  renderCollapsed,
  renderExpanded,
  canExpand = true, // New prop to control expandability
}) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [targetHeight, setTargetHeight] = useState("auto");
  const cardRef = useRef(null);
  const contentRef = useRef(null); // Ref for inner content

  // Spring animation for height
  const springHeight = useSpring(0, {
    stiffness: 200,
    damping: 20,
    mass: 0.5,
  });

  // Measure height of the card content, including margins and padding
  const measureHeight = useCallback(() => {
    if (contentRef.current && cardRef.current) {
      // Temporarily remove height constraint to measure natural height
      const prevHeight = cardRef.current.style.height;
      cardRef.current.style.height = "auto";
      
      // Get bounding rect and compute margins for content
      const contentStyle = window.getComputedStyle(contentRef.current);
      const contentRect = contentRef.current.getBoundingClientRect();
      const marginTop = parseFloat(contentStyle.marginTop) || 0;
      const marginBottom = parseFloat(contentStyle.marginBottom) || 0;

      // Get padding from card container
      const cardStyle = window.getComputedStyle(cardRef.current);
      const paddingTop = parseFloat(cardStyle.paddingTop) || 0;
      const paddingBottom = parseFloat(cardStyle.paddingBottom) || 0;

      // Calculate total height: content height + margins + card padding
      let height = contentRect.height + marginTop + marginBottom + paddingTop + paddingBottom;

      // Ensure minimum height to avoid collapse
      height = Math.max(height, 100); // Prevent collapsing to near-zero
      cardRef.current.style.height = prevHeight; // Restore height
      springHeight.set(height); // Update spring with measured height
      setTargetHeight(height); // Store for reference
      // console.log(`Measured height for ${isExpanded ? "expanded" : "collapsed"}: ${height}px (content: ${contentRect.height}, margins: ${marginTop + marginBottom}, padding: ${paddingTop + paddingBottom})`);
    }
  }, [isExpanded, springHeight]);

  // Measure height after render and on state changes
  useEffect(() => {
    // Initial measurement with delay to ensure content is rendered
    const initialTimeout = setTimeout(measureHeight, 100);

    // Re-measure after animation completes to catch late-rendering content
    const animationTimeout = setTimeout(measureHeight, (FADE_DURATION + MORPH_DURATION) * 1000);

    // Set up ResizeObserver for dynamic content changes
    const observer = new ResizeObserver(measureHeight);
    if (contentRef.current) {
      observer.observe(contentRef.current);
      // Observe child elements to catch margin changes
      const children = contentRef.current.querySelectorAll("*");
      children.forEach((child) => observer.observe(child));
    }

    return () => {
      clearTimeout(initialTimeout);
      clearTimeout(animationTimeout);
      if (contentRef.current) {
        observer.unobserve(contentRef.current);
        const children = contentRef.current.querySelectorAll("*");
        children.forEach((child) => observer.unobserve(child));
      }
    };
  }, [isExpanded, measureHeight]);

  const handleToggle = async () => {
    if (isAnimating || !canExpand) return; // Prevent toggling if not expandable
    setIsAnimating(true);
    onToggle();
    setTimeout(() => {
      setIsAnimating(false);
    }, (FADE_DURATION + MORPH_DURATION) * 1000);
  };

  return (
    <motion.div
      layout
      layoutId={`card-${id}`}
      className={`project-card ${isExpanded ? "expanded-card" : ""}`}
      ref={cardRef}
      transition={{
        layout: {
          duration: MORPH_DURATION,
          ease: [0.4, 0, 0.2, 1], // Smoother easing for width/position
        },
      }}
      style={{
        width: isExpanded ? "1000px" : "800px", // Explicit width animation
        maxWidth: "100%", // Ensure responsiveness
        height: springHeight, // Use spring for height animation
        margin: "20px auto",
      }}
    >
      <div ref={contentRef}>
        <AnimatePresence mode="wait" initial={false}>
          {!isExpanded && (
            <motion.div
              key="collapsed-content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: FADE_DURATION,
                ease: "easeInOut",
              }}
            >
              {renderCollapsed({ onExpand: handleToggle })} {/* Pass handleToggle explicitly */}
            </motion.div>
          )}
          {isExpanded && (
            <motion.div
              key="expanded-content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: FADE_DURATION,
                ease: "easeInOut",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {renderExpanded({ onClose: handleToggle })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}