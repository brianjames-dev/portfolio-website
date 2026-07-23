import { AnimatePresence, motion, useSpring } from "framer-motion";
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import {
  CARD_PANEL_DURATION,
  CARD_PANEL_EASE,
  CARD_SPRING,
  CARD_WIDTH_TRANSITION,
} from "../config/cardMotion.js";
import useDesktopMotionPreference from "../hooks/useDesktopMotionPreference";

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
  const contentRef = useRef(null);
  const heightInitializedRef = useRef(false);
  const scrollTimeoutRef = useRef(null);
  const animationTimeoutRef = useRef(null);
  const shouldReduceMotion = useDesktopMotionPreference();
  const panelDuration = shouldReduceMotion ? 0 : CARD_PANEL_DURATION;

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

  const springHeight = useSpring(0, CARD_SPRING);

  const measureHeight = useCallback(() => {
    const content = contentRef.current;
    const card = cardRef.current;
    if (!content || !card) return;

    const cardStyle = window.getComputedStyle(card);
    const paddingTop = parseFloat(cardStyle.paddingTop) || 0;
    const paddingBottom = parseFloat(cardStyle.paddingBottom) || 0;
    const borderTop = parseFloat(cardStyle.borderTopWidth) || 0;
    const borderBottom = parseFloat(cardStyle.borderBottomWidth) || 0;
    const nextHeight = Math.max(
      100,
      Math.ceil(
        content.offsetHeight +
          paddingTop +
          paddingBottom +
          borderTop +
          borderBottom
      )
    );

    if (!heightInitializedRef.current || shouldReduceMotion) {
      springHeight.jump(nextHeight);
      heightInitializedRef.current = true;
      return;
    }

    springHeight.set(nextHeight);
  }, [shouldReduceMotion, springHeight]);

  useLayoutEffect(() => {
    measureHeight();
  }, [measureHeight]);

  useLayoutEffect(() => {
    const el = contentRef.current;
    if (!el) return undefined;

    let rafId = 0;

    const scheduleMeasure = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(measureHeight);
    };

    const observer = new ResizeObserver(scheduleMeasure);
    observer.observe(el);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      observer.disconnect();
    };
  }, [measureHeight]);

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

      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
      animationTimeoutRef.current = setTimeout(() => {
        setIsAnimating(false);
      }, shouldReduceMotion ? 0 : 800);
    },
    [
      canExpand,
      isAnimating,
      isExpanded,
      isCardTopVisible,
      onToggle,
      scrollCardIntoView,
      shouldReduceMotion,
    ]
  );

  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
    };
  }, []);

  return (
    <motion.div
      className={`project-card ${isExpanded ? "expanded-card" : ""}`}
      data-card-id={id}
      ref={cardRef}
      initial={shouldReduceMotion ? false : { opacity: 0, y: 28 }}
      animate={{ maxWidth: isExpanded ? 1000 : 800 }}
      whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{
        maxWidth: shouldReduceMotion
          ? { duration: 0 }
          : CARD_WIDTH_TRANSITION,
        opacity: {
          duration: 0.42,
          ease: CARD_PANEL_EASE,
        },
        y: {
          duration: 0.42,
          ease: CARD_PANEL_EASE,
        },
      }}
      style={{
        width: "100%",
        height: shouldReduceMotion ? "auto" : springHeight,
        margin: "var(--card-block-gap, 20px) auto",
      }}
    >
      <div className="card-content-shell" ref={contentRef}>
        <AnimatePresence mode="popLayout" initial={false}>
          {!isExpanded && (
            <motion.div
              className="card-content-panel"
              key="collapsed-content"
              initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
              transition={{
                duration: panelDuration,
                ease: CARD_PANEL_EASE,
              }}
            >
              {renderCollapsed({ onExpand: handleToggle })}
            </motion.div>
          )}
          {isExpanded && (
            <motion.div
              className="card-content-panel"
              key="expanded-content"
              initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
              transition={{
                duration: panelDuration,
                ease: CARD_PANEL_EASE,
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
