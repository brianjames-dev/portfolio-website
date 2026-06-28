import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useSpring,
} from "framer-motion";
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
  const shouldReduceMotion = useReducedMotion();
  const fadeDuration = shouldReduceMotion ? 0 : FADE_DURATION;
  const morphDuration = shouldReduceMotion ? 0 : MORPH_DURATION;

  const isCardTopVisible = useCallback(() => {
    if (typeof window === "undefined") return true;
    const cardEl = cardRef.current;
    if (!cardEl) return true;
    const rect = cardEl.getBoundingClientRect();
    const doc = document.documentElement;
    const headerVar = getComputedStyle(doc)
      .getPropertyValue("--header-height")
      .trim();
    const headerOffset = parseInt(headerVar || "60", 10) || 60;
    const safeTop = headerOffset + 4; // keep a small buffer under the header
    return rect.top >= safeTop;
  }, []);

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
    const el = contentRef.current;
    let rafId = 0;

    const scheduleMeasure = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(measureHeight);
    };

    const initialTimeout = setTimeout(scheduleMeasure, 100);
    const animationTimeout = setTimeout(
      scheduleMeasure,
      (fadeDuration + morphDuration) * 1000
    );

    const observer = new ResizeObserver(scheduleMeasure);
    if (el) {
      observer.observe(el);
    }

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      clearTimeout(initialTimeout);
      clearTimeout(animationTimeout);
      observer.disconnect();
    };
  }, [isExpanded, measureHeight, fadeDuration, morphDuration]);

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
      behavior: shouldReduceMotion ? "auto" : "smooth",
    });
  }, [shouldReduceMotion]);

  const handleToggle = useCallback(
    (options = {}) => {
      if (isAnimating || !canExpand) return; // Prevent toggling if not expandable
      const collapsing = isExpanded;
      const { scrollToTop, scrollIfOffscreen } = options;
      const shouldScroll = Boolean(collapsing && scrollToTop);
      const shouldScrollIfOffscreen =
        collapsing && scrollIfOffscreen && !isCardTopVisible();
      const willScroll = shouldScroll || shouldScrollIfOffscreen;
      setIsAnimating(true);
      onToggle();

      if (willScroll) {
        if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
        scrollTimeoutRef.current = setTimeout(() => {
          scrollCardIntoView();
        }, 50);
      }

      setTimeout(
        () => {
          setIsAnimating(false);
        },
        (fadeDuration + morphDuration) * 1000
      );
    },
    [
      canExpand,
      isAnimating,
      isExpanded,
      isCardTopVisible,
      fadeDuration,
      morphDuration,
      onToggle,
      scrollCardIntoView,
    ]
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
          duration: morphDuration,
          ease: [0.4, 0, 0.2, 1], // Smoother easing for width/position
        },
      }}
      style={{
        width: isExpanded ? "1000px" : "800px", // Explicit width animation
        maxWidth: "100%", // Ensure responsiveness
        height: shouldReduceMotion ? "auto" : springHeight,
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
                duration: fadeDuration,
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
                duration: fadeDuration,
                ease: "easeInOut",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {renderExpanded({
                onClose: handleToggle,
                onCloseAndScroll: () =>
                  handleToggle({ scrollIfOffscreen: true }),
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
