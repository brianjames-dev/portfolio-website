import { AnimatePresence, motion, useSpring } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

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
  const cardRef = useRef(null);
  const contentRef = useRef(null); // Ref for inner content
  const scrollTimeoutRef = useRef(null);

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
      let height =
        contentRect.height +
        marginTop +
        marginBottom +
        paddingTop +
        paddingBottom;

      // Ensure minimum height to avoid collapse
      height = Math.max(height, 100); // Prevent collapsing to near-zero
      cardRef.current.style.height = prevHeight; // Restore height
      springHeight.set(height); // Update spring with measured height
      // console.log(`Measured height for ${isExpanded ? "expanded" : "collapsed"}: ${height}px (content: ${contentRect.height}, margins: ${marginTop + marginBottom}, padding: ${paddingTop + paddingBottom})`);
    }
  }, [springHeight]);

  // Measure height after render and on state changes
  useEffect(() => {
    // Snapshot refs & derived lists for this effect instance
    const el = contentRef.current;
    const children = el ? Array.from(el.querySelectorAll("*")) : [];

    // Timers
    const initialTimeout = setTimeout(measureHeight, 100);
    const animationTimeout = setTimeout(
      measureHeight,
      (FADE_DURATION + MORPH_DURATION) * 1000
    );

    // Observe size changes
    const observer = new ResizeObserver(measureHeight);
    if (el) {
      observer.observe(el);
      children.forEach((child) => observer.observe(child));
    }

    // Cleanup uses ONLY the snapshots above
    return () => {
      clearTimeout(initialTimeout);
      clearTimeout(animationTimeout);
      if (el) {
        observer.unobserve(el);
        children.forEach((child) => observer.unobserve(child));
      }
      // (optional) observer.disconnect(); // safe if you’re done with it entirely
    };
  }, [isExpanded, measureHeight]);

  const scrollCardIntoView = useCallback(() => {
    if (typeof window === "undefined") return;
    const cardEl = cardRef.current;
    if (!cardEl) return;
    const rect = cardEl.getBoundingClientRect();
    const doc = document.documentElement;
    const headerVar = getComputedStyle(doc)
      .getPropertyValue("--header-height")
      .trim();
    const headerOffset = parseInt(headerVar || "60", 10) || 60;
    const targetTop = rect.top + window.pageYOffset - headerOffset - 8;
    window.scrollTo({
      top: Math.max(0, targetTop),
      behavior: "smooth",
    });
  }, []);

  const handleToggle = useCallback(
    (options = {}) => {
      if (isAnimating || !canExpand) return; // Prevent toggling if not expandable
      const collapsing = isExpanded;
      const shouldScroll = Boolean(options.scrollToTop && collapsing);
      setIsAnimating(true);
      onToggle();

      if (shouldScroll) {
        if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
        scrollTimeoutRef.current = setTimeout(() => {
          scrollCardIntoView();
        }, 50);
      }

      setTimeout(
        () => {
          setIsAnimating(false);
        },
        (FADE_DURATION + MORPH_DURATION) * 1000
      );
    },
    [canExpand, isAnimating, isExpanded, onToggle, scrollCardIntoView]
  );

  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, []);

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
              {renderCollapsed({ onExpand: handleToggle })}{" "}
              {/* Pass handleToggle explicitly */}
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
              {renderExpanded({
                onClose: handleToggle,
                onCloseAndScroll: () => handleToggle({ scrollToTop: true }),
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
