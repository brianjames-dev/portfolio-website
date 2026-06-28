// /components/ProjectGallery.js
import { useCallback, useEffect, useRef, useState } from "react";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import IconGlyph from "./IconGlyph";
import iconMap from "../data/iconMap.js";

const PRELOAD_RADIUS = 2;
const SWIPE_ANIMATION_MS = 320;
const SUPERZOOM_INITIAL_SCALE = 2.3;
const SUPERZOOM_MIN_SCALE = 1;
const SUPERZOOM_MAX_SCALE = 12;
const TAP_EXIT_MAX_MS = 260;
const TAP_EXIT_MAX_MOVEMENT = 8;
const PAN_EXIT_SUPPRESSION_MS = 220;
const ZOOM_BOUNDS_EPSILON = 0.5;

const getDefaultZoomGesture = () => ({
  moved: false,
  panning: false,
  pinching: false,
  suppressTapExitUntil: 0,
});

const getContainedImageRect = (imageNode) => {
  const imageRect = imageNode.getBoundingClientRect();
  const naturalWidth = imageNode.naturalWidth || imageNode.videoWidth;
  const naturalHeight = imageNode.naturalHeight || imageNode.videoHeight;

  if (!imageRect.width || !imageRect.height || !naturalWidth || !naturalHeight) {
    return imageRect;
  }

  const naturalRatio = naturalWidth / naturalHeight;
  const boxRatio = imageRect.width / imageRect.height;

  if (naturalRatio > boxRatio) {
    const renderedHeight = imageRect.width / naturalRatio;
    const verticalInset = (imageRect.height - renderedHeight) / 2;

    return {
      left: imageRect.left,
      right: imageRect.right,
      top: imageRect.top + verticalInset,
      bottom: imageRect.bottom - verticalInset,
      width: imageRect.width,
      height: renderedHeight,
    };
  }

  const renderedWidth = imageRect.height * naturalRatio;
  const horizontalInset = (imageRect.width - renderedWidth) / 2;

  return {
    left: imageRect.left + horizontalInset,
    right: imageRect.right - horizontalInset,
    top: imageRect.top,
    bottom: imageRect.bottom,
    width: renderedWidth,
    height: imageRect.height,
  };
};

function ProjectGallery({ images, index, setIndex, onClose }) {
  const [isSuperZoomed, setIsSuperZoomed] = useState(false);
  const [isSwipeEnabled, setIsSwipeEnabled] = useState(false);
  const [showSwipeHint, setShowSwipeHint] = useState(false);
  const [mouseDownTime, setMouseDownTime] = useState(null);
  const [mouseDownPos, setMouseDownPos] = useState({ x: 0, y: 0 });
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isSwipeDragging, setIsSwipeDragging] = useState(false);
  const [isSwipeAnimating, setIsSwipeAnimating] = useState(false);
  const [isSwipeTransitionSuppressed, setIsSwipeTransitionSuppressed] =
    useState(false);
  const mouseWasDraggedRef = useRef(false);
  const mousePointerStartRef = useRef(null);
  const swipeWasDraggedRef = useRef(false);
  const swipeStartRef = useRef(null);
  const swipeAnimationTimeoutRef = useRef(null);
  const wheelSwipeRef = useRef({ delta: 0, lastActivatedAt: 0 });
  const stageRef = useRef(null);
  const zoomTapStartRef = useRef(null);
  const zoomGestureRef = useRef(getDefaultZoomGesture());
  const isApplyingZoomBoundsRef = useRef(false);
  const thumbnailRefs = useRef([]);
  const overlayRef = useRef(null);
  const closeButtonRef = useRef(null);
  const previouslyFocusedRef = useRef(null);
  const preloadedImagesRef = useRef(new Map());
  const currentStateRef = useRef({
    imageIndex: index,
    isSuperZoomed,
    imagesLength: images.length,
  });
  const hasShownSwipeHintRef = useRef(false);
  const hintTimeoutRef = useRef(null);

  const stripRef = useRef(null);
  const isOpen = index !== null;

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const mediaQuery = window.matchMedia(
      "(hover: none), (pointer: coarse), (max-width: 600px)"
    );
    const updateSwipeMode = () => {
      setIsSwipeEnabled(mediaQuery.matches);
    };

    updateSwipeMode();
    mediaQuery.addEventListener?.("change", updateSwipeMode);

    return () => {
      mediaQuery.removeEventListener?.("change", updateSwipeMode);
    };
  }, []);

  const clearSwipeAnimationTimeout = useCallback(() => {
    if (swipeAnimationTimeoutRef.current) {
      clearTimeout(swipeAnimationTimeoutRef.current);
      swipeAnimationTimeoutRef.current = null;
    }
  }, []);

  const getSwipeWidth = useCallback(() => {
    return (
      stageRef.current?.getBoundingClientRect().width ||
      overlayRef.current?.getBoundingClientRect().width ||
      window.innerWidth ||
      1
    );
  }, []);

  const resetSwipePosition = useCallback(() => {
    clearSwipeAnimationTimeout();
    setIsSwipeTransitionSuppressed(true);
    setSwipeOffset(0);
    setIsSwipeDragging(false);
    setIsSwipeAnimating(false);
    swipeWasDraggedRef.current = false;
    swipeStartRef.current = null;

    requestAnimationFrame(() => {
      setIsSwipeTransitionSuppressed(false);
    });
  }, [clearSwipeAnimationTimeout]);

  useEffect(() => {
    if (isSwipeEnabled) return;
    setShowSwipeHint(false);
    resetSwipePosition();
  }, [isSwipeEnabled, resetSwipePosition]);

  const completeSwipeToIndex = useCallback(
    (targetIndex, startingOffset) => {
      if (
        index === null ||
        targetIndex < 0 ||
        targetIndex >= images.length ||
        targetIndex === index
      ) {
        setSwipeOffset(0);
        setIsSwipeDragging(false);
        setIsSwipeAnimating(true);
        clearSwipeAnimationTimeout();
        swipeAnimationTimeoutRef.current = setTimeout(() => {
          setIsSwipeAnimating(false);
          swipeWasDraggedRef.current = false;
        }, SWIPE_ANIMATION_MS);
        return;
      }

      setIsSwipeTransitionSuppressed(true);
      setIsSwipeDragging(false);
      setIsSwipeAnimating(true);
      setSwipeOffset(startingOffset);
      setIndex(targetIndex);
      clearSwipeAnimationTimeout();

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsSwipeTransitionSuppressed(false);
          setSwipeOffset(0);
        });
      });

      swipeAnimationTimeoutRef.current = setTimeout(() => {
        setIsSwipeAnimating(false);
        swipeStartRef.current = null;
        swipeWasDraggedRef.current = false;
      }, SWIPE_ANIMATION_MS);
    },
    [clearSwipeAnimationTimeout, images.length, index, setIndex]
  );

  const animateToIndex = useCallback(
    (targetIndex) => {
      if (
        index === null ||
        targetIndex < 0 ||
        targetIndex >= images.length ||
        targetIndex === index ||
        isSuperZoomed ||
        isSwipeAnimating
      ) {
        return;
      }

      const direction = targetIndex > index ? 1 : -1;
      completeSwipeToIndex(targetIndex, direction * getSwipeWidth());
    },
    [
      completeSwipeToIndex,
      getSwipeWidth,
      images.length,
      index,
      isSuperZoomed,
      isSwipeAnimating,
    ]
  );

  useEffect(() => {
    currentStateRef.current = {
      imageIndex: index,
      isSuperZoomed,
      imagesLength: images.length,
    };
  }, [images.length, index, isSuperZoomed]);

  const scrollToThumbnail = (i, smooth = true) => {
    const el = thumbnailRefs.current[i];
    const strip = stripRef.current;
    if (!el || !strip) return;
    const elLeft = el.offsetLeft;
    const elWidth = el.offsetWidth;
    const stripWidth = strip.offsetWidth;
    const scrollX = elLeft - stripWidth / 2 + elWidth / 2;
    strip.scrollTo({ left: scrollX, behavior: smooth ? "smooth" : "auto" });
  };

  // Re-centering thumbnail scroll logic
  useEffect(() => {
    const strip = stripRef.current;
    if (!strip || index === null) return;

    let scrollTimeout;

    const handleScroll = () => {
      if (scrollTimeout) clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        scrollToThumbnail(index, true); // Recenter after 1s of no activity
      }, 1000);
    };

    strip.addEventListener("scroll", handleScroll);

    return () => {
      strip.removeEventListener("scroll", handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, [index]);

  // Thumbnail row drag-scroll
  useEffect(() => {
    if (!isSwipeEnabled) return undefined;

    const strip = stripRef.current;
    if (!strip) return;

    let isDragging = false;
    let startX;
    let scrollLeft;

    const startDrag = (e) => {
      isDragging = true;
      startX = e.pageX || e.touches[0].pageX;
      scrollLeft = strip.scrollLeft;
    };

    const drag = (e) => {
      if (!isDragging) return;
      const x = e.pageX || e.touches[0].pageX;
      strip.scrollLeft = scrollLeft - (x - startX);
    };

    const stopDrag = () => (isDragging = false);

    strip.addEventListener("mousedown", startDrag);
    strip.addEventListener("mousemove", drag);
    strip.addEventListener("mouseup", stopDrag);
    strip.addEventListener("mouseleave", stopDrag);

    strip.addEventListener("touchstart", startDrag);
    strip.addEventListener("touchmove", drag);
    strip.addEventListener("touchend", stopDrag);

    return () => {
      strip.removeEventListener("mousedown", startDrag);
      strip.removeEventListener("mousemove", drag);
      strip.removeEventListener("mouseup", stopDrag);
      strip.removeEventListener("mouseleave", stopDrag);

      strip.removeEventListener("touchstart", startDrag);
      strip.removeEventListener("touchmove", drag);
      strip.removeEventListener("touchend", stopDrag);
    };
  }, [isSwipeEnabled]);

  // Keep a small decoded image window around the current image.
  useEffect(() => {
    if (index === null) return;

    const lowerBound = Math.max(0, index - PRELOAD_RADIUS);
    const upperBound = Math.min(images.length - 1, index + PRELOAD_RADIUS);
    const wantedSources = new Set();

    for (let i = lowerBound; i <= upperBound; i += 1) {
      const src = images[i]?.src;
      if (!src) continue;
      wantedSources.add(src);

      if (!preloadedImagesRef.current.has(src)) {
        const img = new Image();
        img.decoding = "async";
        img.src = src;
        preloadedImagesRef.current.set(src, img);
        img.decode?.().catch(() => {});
      }
    }

    preloadedImagesRef.current.forEach((img, src) => {
      if (wantedSources.has(src)) return;
      img.onload = null;
      img.onerror = null;
      preloadedImagesRef.current.delete(src);
    });
  }, [index, images]);

  // Prevent background touchmove scroll
  useEffect(() => {
    const preventScroll = (e) => {
      const inThumbnailStrip = e.target.closest(".thumbnail-strip");
      if (!inThumbnailStrip) {
        e.preventDefault();
      }
    };

    if (index !== null) {
      document.body.addEventListener("touchmove", preventScroll, {
        passive: false,
      });
    }

    return () => {
      document.body.removeEventListener("touchmove", preventScroll);
    };
  }, [index]);

  // Scroll lock when overlay is open
  useEffect(() => {
    const entering = index !== null;
    if (entering) {
      const y = window.scrollY;
      document.body.classList.add("no-scroll");
      document.body.classList.add("gallery-overlay-open");
      document.body.style.top = `-${y}px`;
    }

    return () => {
      if (entering) {
        const y = parseInt(document.body.style.top || "0") * -1;
        document.body.classList.remove("no-scroll");
        document.body.classList.remove("gallery-overlay-open");
        document.body.style.top = "";
        window.requestAnimationFrame(() => {
          window.scrollTo(0, y);
        });
      }
    };
  }, [index]);

  // Reset thumbnailRefs on image change
  useEffect(() => {
    thumbnailRefs.current = [];
  }, [images]);

  // Center active thumbnail
  useEffect(() => {
    scrollToThumbnail(index, true);
  }, [index]);

  // Show swipe hint once
  useEffect(() => {
    // Show the hint only once per full page load (session)
    if (
      isSwipeEnabled &&
      index !== null &&
      images.length > 0 &&
      !hasShownSwipeHintRef.current
    ) {
      hasShownSwipeHintRef.current = true;
      setShowSwipeHint(true);

      hintTimeoutRef.current = setTimeout(() => {
        setShowSwipeHint(false);
      }, 2000);
    }

    return () => {
      clearTimeout(hintTimeoutRef.current);
    };
  }, [index, images, isSwipeEnabled]);

  useEffect(() => {
    const preloadedImages = preloadedImagesRef.current;

    return () => {
      clearSwipeAnimationTimeout();
      preloadedImages.clear();
    };
  }, [clearSwipeAnimationTimeout]);

  // Keyboard controls and modal focus
  useEffect(() => {
    if (!isOpen) return undefined;

    previouslyFocusedRef.current = document.activeElement;
    const focusTimer = window.setTimeout(() => {
      try {
        closeButtonRef.current?.focus({ preventScroll: true });
      } catch (error) {
        closeButtonRef.current?.focus();
      }
    }, 0);

    const handleKeyDown = (event) => {
      const {
        imageIndex,
        isSuperZoomed: zoomed,
        imagesLength,
      } = currentStateRef.current;

      if (event.key === "Escape") {
        event.preventDefault();
        if (zoomed) {
          setIsSuperZoomed(false);
        } else {
          onClose();
        }
        return;
      }

      if (!zoomed && event.key === "ArrowLeft" && imageIndex > 0) {
        event.preventDefault();
        animateToIndex(imageIndex - 1);
        return;
      }

      if (!zoomed && event.key === "ArrowRight" && imageIndex < imagesLength - 1) {
        event.preventDefault();
        animateToIndex(imageIndex + 1);
        return;
      }

      if (event.key !== "Tab") return;

      const focusable = overlayRef.current?.querySelectorAll(
        'button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      const elements = Array.from(focusable || []);
      if (!elements.length) return;

      const first = elements[0];
      const last = elements[elements.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener("keydown", handleKeyDown);
      try {
        previouslyFocusedRef.current?.focus?.({ preventScroll: true });
      } catch (error) {
        previouslyFocusedRef.current?.focus?.();
      }
    };
  }, [animateToIndex, isOpen, onClose]);

  const handleSwipeStart = (event) => {
    if (
      !isSwipeEnabled ||
      isSuperZoomed ||
      isSwipeAnimating ||
      (event.pointerType === "mouse" && event.button !== 0)
    ) {
      return;
    }

    event.currentTarget.setPointerCapture?.(event.pointerId);
    clearSwipeAnimationTimeout();
    setShowSwipeHint(false);
    setIsSwipeTransitionSuppressed(false);
    setIsSwipeDragging(true);
    setSwipeOffset(0);
    swipeWasDraggedRef.current = false;
    swipeStartRef.current = {
      x: event.clientX,
      y: event.clientY,
      axis: null,
    };
  };

  const handleSwipeMove = (event) => {
    if (!isSwipeEnabled) return;
    const swipeStart = swipeStartRef.current;
    if (!swipeStart || isSuperZoomed) return;

    const deltaX = event.clientX - swipeStart.x;
    const deltaY = event.clientY - swipeStart.y;
    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);

    if (!swipeStart.axis && (absX > 8 || absY > 8)) {
      swipeStart.axis = absX > absY ? "x" : "y";
    }

    if (swipeStart.axis !== "x") return;

    event.preventDefault();
    swipeWasDraggedRef.current = absX > 10;

    const atFirstImage = index <= 0;
    const atLastImage = index >= images.length - 1;
    const isPullingPastFirst = deltaX > 0 && atFirstImage;
    const isPullingPastLast = deltaX < 0 && atLastImage;
    const nextOffset =
      isPullingPastFirst || isPullingPastLast ? deltaX * 0.28 : deltaX;

    setSwipeOffset(nextOffset);
  };

  const handleSwipeEnd = (event) => {
    if (!isSwipeEnabled) return;
    event.currentTarget.releasePointerCapture?.(event.pointerId);
    const swipeStart = swipeStartRef.current;
    if (!swipeStart || isSuperZoomed) {
      swipeStartRef.current = null;
      setIsSwipeDragging(false);
      return;
    }

    const width = getSwipeWidth();
    const threshold = Math.min(110, width * 0.22);
    const targetIndex =
      swipeOffset < -threshold
        ? index + 1
        : swipeOffset > threshold
          ? index - 1
          : index;

    if (targetIndex !== index && targetIndex >= 0 && targetIndex < images.length) {
      const startingOffset =
        targetIndex > index ? width + swipeOffset : swipeOffset - width;
      completeSwipeToIndex(targetIndex, startingOffset);
      return;
    }

    setSwipeOffset(0);
    setIsSwipeDragging(false);
    setIsSwipeAnimating(true);
    clearSwipeAnimationTimeout();
    swipeAnimationTimeoutRef.current = setTimeout(() => {
      setIsSwipeAnimating(false);
      swipeWasDraggedRef.current = false;
      swipeStartRef.current = null;
    }, SWIPE_ANIMATION_MS);
  };

  const handleTrackpadWheel = (event) => {
    if (isSwipeEnabled || isSuperZoomed || isSwipeAnimating) return;

    const absX = Math.abs(event.deltaX);
    const absY = Math.abs(event.deltaY);
    const isHorizontalGesture = absX > 8 && absX > absY * 1.2;
    if (!isHorizontalGesture) return;

    event.preventDefault();
    event.stopPropagation();

    const now = Date.now();
    const wheelState = wheelSwipeRef.current;
    if (now - wheelState.lastActivatedAt < SWIPE_ANIMATION_MS + 120) return;

    wheelState.delta += event.deltaX;
    const threshold = 70;
    if (Math.abs(wheelState.delta) < threshold) return;

    wheelState.lastActivatedAt = now;
    const direction = wheelState.delta > 0 ? 1 : -1;
    wheelState.delta = 0;
    animateToIndex(index + direction);
  };

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || isSwipeEnabled || !isOpen) return undefined;

    const handleNativeWheel = (event) => {
      handleTrackpadWheel(event);
    };

    stage.addEventListener("wheel", handleNativeWheel, { passive: false });

    return () => {
      stage.removeEventListener("wheel", handleNativeWheel);
    };
  }, [handleTrackpadWheel, isOpen, isSwipeEnabled]);

  const handleDesktopMouseImagePointerDown = (event) => {
    if (isSwipeEnabled || event.pointerType !== "mouse" || event.button !== 0) {
      return;
    }

    mouseWasDraggedRef.current = false;
    mousePointerStartRef.current = {
      x: event.clientX,
      y: event.clientY,
    };
  };

  const handleDesktopMouseImagePointerMove = (event) => {
    if (isSwipeEnabled || event.pointerType !== "mouse") return;

    const start = mousePointerStartRef.current;
    if (!start) return;

    const movement = Math.hypot(event.clientX - start.x, event.clientY - start.y);
    if (movement > TAP_EXIT_MAX_MOVEMENT) {
      mouseWasDraggedRef.current = true;
    }
  };

  const handleDesktopMouseImagePointerUp = (event) => {
    if (isSwipeEnabled || event.pointerType !== "mouse") return;
    mousePointerStartRef.current = null;
  };

  const resetZoomTapTracking = () => {
    zoomTapStartRef.current = null;
    zoomGestureRef.current = getDefaultZoomGesture();
  };

  const markZoomPanGesture = () => {
    zoomTapStartRef.current = null;
    zoomGestureRef.current = {
      ...zoomGestureRef.current,
      moved: true,
      panning: true,
      suppressTapExitUntil: Date.now() + PAN_EXIT_SUPPRESSION_MS,
    };
    mouseWasDraggedRef.current = true;
  };

  const stopZoomPanGesture = () => {
    if (!zoomGestureRef.current.moved) return;

    zoomGestureRef.current = {
      ...zoomGestureRef.current,
      moved: true,
      panning: false,
      suppressTapExitUntil: Date.now() + PAN_EXIT_SUPPRESSION_MS,
    };
    mouseWasDraggedRef.current = true;
  };

  const handleZoomTouchStart = (event) => {
    if (event.touches.length > 1) {
      zoomGestureRef.current.pinching = true;
      zoomTapStartRef.current = null;
      return;
    }

    const touch = event.touches[0];
    zoomTapStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now(),
    };
    zoomGestureRef.current = getDefaultZoomGesture();
  };

  const handleZoomTouchMove = (event) => {
    if (event.touches.length > 1) {
      zoomGestureRef.current.pinching = true;
      return;
    }

    const touch = event.touches[0];
    const start = zoomTapStartRef.current;
    if (!touch || !start) return;

    const movement = Math.hypot(touch.clientX - start.x, touch.clientY - start.y);
    if (movement > TAP_EXIT_MAX_MOVEMENT) {
      zoomGestureRef.current.moved = true;
    }
  };

  const handleZoomTouchEnd = (event) => {
    if (event.touches.length > 0) return;

    const start = zoomTapStartRef.current;
    const { moved, panning, pinching, suppressTapExitUntil } =
      zoomGestureRef.current;
    if (
      !start ||
      moved ||
      panning ||
      pinching ||
      Date.now() < suppressTapExitUntil
    ) {
      resetZoomTapTracking();
      return;
    }

    if (Date.now() - start.time <= TAP_EXIT_MAX_MS) {
      event.stopPropagation();
      setIsSuperZoomed(false);
    }
    resetZoomTapTracking();
  };

  const handleZoomMouseStart = (event) => {
    if (event.button !== 0) return;

    zoomTapStartRef.current = {
      x: event.clientX,
      y: event.clientY,
      time: Date.now(),
    };
    zoomGestureRef.current = getDefaultZoomGesture();
    mouseWasDraggedRef.current = false;
  };

  const handleZoomMouseMove = (event) => {
    const start = zoomTapStartRef.current;
    if (!start) return;

    const movement = Math.hypot(event.clientX - start.x, event.clientY - start.y);
    if (movement > TAP_EXIT_MAX_MOVEMENT) {
      zoomGestureRef.current = {
        ...zoomGestureRef.current,
        moved: true,
      };
      mouseWasDraggedRef.current = true;
    }
  };

  const handleZoomMouseEnd = (event) => {
    const start = zoomTapStartRef.current;
    const { moved, panning, pinching, suppressTapExitUntil } =
      zoomGestureRef.current;

    if (
      start &&
      !moved &&
      !panning &&
      !pinching &&
      Date.now() >= suppressTapExitUntil &&
      Date.now() - start.time <= TAP_EXIT_MAX_MS
    ) {
      event.stopPropagation();
      setIsSuperZoomed(false);
    }

    resetZoomTapTracking();
  };

  const enforceZoomViewportBounds = useCallback((transformRef, transformState) => {
    if (isApplyingZoomBoundsRef.current) return;

    const state =
      transformState?.positionX === undefined
        ? transformRef?.instance?.transformState
        : transformState;
    if (!state) return;

    const root = overlayRef.current;
    const imageNode = root?.querySelector(".fullscreen-image.superzoomed");
    const viewportNode = root?.querySelector(
      ".fullscreen-image-wrapper.superzoom-mode"
    );
    if (!imageNode || !viewportNode) return;

    const imageRect = getContainedImageRect(imageNode);
    const viewportRect = viewportNode.getBoundingClientRect();
    if (!imageRect.width || !imageRect.height || !viewportRect.width) return;

    const centerX = viewportRect.left + viewportRect.width / 2;
    const centerY = viewportRect.top + viewportRect.height / 2;
    let correctionX = 0;
    let correctionY = 0;

    if (imageRect.left > centerX) {
      correctionX = centerX - imageRect.left;
    } else if (imageRect.right < centerX) {
      correctionX = centerX - imageRect.right;
    }

    if (imageRect.top > centerY) {
      correctionY = centerY - imageRect.top;
    } else if (imageRect.bottom < centerY) {
      correctionY = centerY - imageRect.bottom;
    }

    if (
      Math.abs(correctionX) <= ZOOM_BOUNDS_EPSILON &&
      Math.abs(correctionY) <= ZOOM_BOUNDS_EPSILON
    ) {
      return;
    }

    isApplyingZoomBoundsRef.current = true;
    transformRef.setTransform(
      state.positionX + correctionX,
      state.positionY + correctionY,
      state.scale,
      0
    );
    requestAnimationFrame(() => {
      isApplyingZoomBoundsRef.current = false;
    });
  }, []);

  if (index === null || !images.length) return null;

  const image = images[index];
  const visibleSlides = [-1, 0, 1].map((offset) => ({
    offset,
    image: images[index + offset],
    imageIndex: index + offset,
  }));
  const shouldAnimateSwipeTrack =
    isSwipeAnimating && !isSwipeDragging && !isSwipeTransitionSuppressed;

  return (
    <div
      ref={overlayRef}
      className="fullscreen-overlay visible"
      role="dialog"
      aria-modal="true"
      aria-label={image?.caption || `Image ${index + 1} of ${images.length}`}
      onClick={() => {
        if (isSuperZoomed) {
          setIsSuperZoomed(false);
        } else {
          onClose();
        }
      }}
    >
      {/* Swipe Hint */}
      {showSwipeHint && (
        <img
          src={iconMap["Swipe"]}
          alt=""
          aria-hidden="true"
          className="swipe-hint"
        />
      )}

      {/* Centered Image */}
      <div
        ref={stageRef}
        className="fullscreen-center-area"
        onPointerDown={isSwipeEnabled ? handleSwipeStart : undefined}
        onPointerMove={isSwipeEnabled ? handleSwipeMove : undefined}
        onPointerUp={isSwipeEnabled ? handleSwipeEnd : undefined}
        onPointerCancel={isSwipeEnabled ? resetSwipePosition : undefined}
        onWheel={handleTrackpadWheel}
        onClick={(e) => {
          if (
            isSwipeEnabled &&
            (swipeWasDraggedRef.current || isSwipeAnimating)
          ) {
            e.stopPropagation();
            if (!isSwipeAnimating) {
              swipeWasDraggedRef.current = false;
            }
          }
        }}
      >
        <div
          className={`fullscreen-image-wrapper ${
            isSuperZoomed ? "superzoom-mode" : ""
          }`}
          onTouchStartCapture={(e) => {
            if (isSuperZoomed) handleZoomTouchStart(e);
          }}
          onTouchMoveCapture={(e) => {
            if (isSuperZoomed) handleZoomTouchMove(e);
          }}
          onTouchEndCapture={(e) => {
            if (isSuperZoomed) handleZoomTouchEnd(e);
          }}
          onTouchCancelCapture={() => {
            if (isSuperZoomed) resetZoomTapTracking();
          }}
          onMouseDownCapture={(e) => {
            if (isSuperZoomed) handleZoomMouseStart(e);
          }}
          onMouseMoveCapture={(e) => {
            if (isSuperZoomed) handleZoomMouseMove(e);
          }}
          onMouseUpCapture={(e) => {
            if (isSuperZoomed) handleZoomMouseEnd(e);
          }}
          onClick={(e) => {
            const isTouch =
              "ontouchstart" in window || navigator.maxTouchPoints > 0;
            const recentlyPanned =
              Date.now() < zoomGestureRef.current.suppressTapExitUntil;

            if (isSuperZoomed) {
              e.stopPropagation();

              if (isTouch || recentlyPanned) {
                return;
              }

              mouseWasDraggedRef.current = false;
              setIsSuperZoomed(false);
              return;
            }

            if (mouseWasDraggedRef.current) {
              e.stopPropagation();
              mouseWasDraggedRef.current = false;
            }
          }}
        >
          {isSuperZoomed ? (
            <TransformWrapper
              doubleClick={{ disabled: true }}
              pinch={{ disabled: false, step: 8 }}
              panning={{ velocityDisabled: false }}
              wheel={{ disabled: true }}
              initialScale={SUPERZOOM_INITIAL_SCALE}
              minScale={SUPERZOOM_MIN_SCALE}
              maxScale={SUPERZOOM_MAX_SCALE}
              limitToBounds
              centerZoomedOut
              centerOnInit
              onPanning={markZoomPanGesture}
              onPanningStop={stopZoomPanGesture}
              onPinching={enforceZoomViewportBounds}
              onPinchingStop={enforceZoomViewportBounds}
              onZoom={enforceZoomViewportBounds}
              onZoomStop={enforceZoomViewportBounds}
              onTransformed={enforceZoomViewportBounds}
            >
              <TransformComponent>
                <div
                  className="superzoomed"
                  onMouseDown={(e) => {
                    setMouseDownTime(Date.now());
                    setMouseDownPos({ x: e.clientX, y: e.clientY });
                    mouseWasDraggedRef.current = false;
                  }}
                  onMouseUp={(e) => {
                    const { panning, suppressTapExitUntil } =
                      zoomGestureRef.current;
                    const duration = Date.now() - mouseDownTime;
                    const distX = Math.abs(e.clientX - mouseDownPos.x);
                    const distY = Math.abs(e.clientY - mouseDownPos.y);
                    const movement = Math.sqrt(distX ** 2 + distY ** 2);
                    if (
                      duration < 200 &&
                      movement < 5 &&
                      !panning &&
                      Date.now() >= suppressTapExitUntil
                    ) {
                      e.stopPropagation();
                      setIsSuperZoomed(false);
                    } else {
                      mouseWasDraggedRef.current = true;
                    }
                  }}
                  onClick={(e) => {
                    if (mouseWasDraggedRef.current) {
                      e.stopPropagation();
                      mouseWasDraggedRef.current = false;
                    }
                  }}
                >
                  <img
                    src={image?.src}
                    alt={image?.caption || "Fullscreen"}
                    className="fullscreen-image superzoomed"
                    style={{ touchAction: "none" }}
                  />
                </div>
              </TransformComponent>
            </TransformWrapper>
          ) : (
            <div
              className="fullscreen-swipe-stage"
            >
              <div
                className={`fullscreen-swipe-track ${
                  isSwipeDragging ? "is-dragging" : ""
                } ${shouldAnimateSwipeTrack ? "is-animating" : ""}`}
                style={{ "--swipe-offset": `${swipeOffset}px` }}
              >
                {visibleSlides.map((slide) => (
                  <div
                    className={`fullscreen-slide ${
                      slide.image ? "" : "is-empty"
                    }`}
                    key={`${slide.offset}-${slide.image?.src || "empty"}`}
                    aria-hidden={slide.offset === 0 ? undefined : "true"}
                  >
                    {slide.image && (
                      <button
                        type="button"
                        className="fullscreen-image-button"
                        aria-label={
                          slide.offset === 0
                            ? "Zoom image"
                            : `Preview image ${slide.imageIndex + 1}`
                        }
                        tabIndex={slide.offset === 0 ? undefined : -1}
                        onPointerDown={handleDesktopMouseImagePointerDown}
                        onPointerMove={handleDesktopMouseImagePointerMove}
                        onPointerUp={handleDesktopMouseImagePointerUp}
                        onPointerCancel={handleDesktopMouseImagePointerUp}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (
                            slide.offset !== 0 ||
                            (isSwipeEnabled && swipeWasDraggedRef.current) ||
                            mouseWasDraggedRef.current
                          ) {
                            swipeWasDraggedRef.current = false;
                            mouseWasDraggedRef.current = false;
                            return;
                          }
                          setIsSuperZoomed(true);
                        }}
                      >
                        <img
                          src={slide.image.src}
                          alt={slide.image.caption || "Fullscreen"}
                          className="fullscreen-image"
                        />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {image?.caption && !isSuperZoomed && (
          <p className="fullscreen-caption">{image.caption}</p>
        )}
      </div>

      {/* Thumbnails */}
      <div
        className={`thumbnail-strip ${isSuperZoomed ? "hidden" : ""}`}
        ref={stripRef}
        aria-hidden={isSuperZoomed ? "true" : undefined}
      >
        {images.map((img, i) => (
          <button
            type="button"
            key={i}
            className={`thumbnail-container ${i === index ? "active" : ""}`}
            ref={(el) => (thumbnailRefs.current[i] = el)}
            aria-label={`Show image ${i + 1}`}
            aria-current={i === index ? "true" : undefined}
            tabIndex={isSuperZoomed ? -1 : undefined}
            onClick={(e) => {
              e.stopPropagation();
              resetSwipePosition();
              if (i !== index) {
                animateToIndex(i);
              }
              setIsSuperZoomed(false);
            }}
          >
            <img
              src={img.thumbnailSrc || img.src}
              alt={img.caption || `Thumbnail ${i + 1}`}
              className="thumbnail-image"
              loading="lazy"
              decoding="async"
            />
          </button>
        ))}
      </div>

      {/* Close Button */}
      <button
        ref={closeButtonRef}
        className={`fullscreen-close-btn ${
          isSuperZoomed ? "is-superzoomed" : ""
        }`}
        type="button"
        aria-label="Close gallery"
        onClick={(e) => {
          e.stopPropagation();
          setIsSuperZoomed(false);
          onClose();
        }}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <IconGlyph name="close" className="fullscreen-close-icon" />
      </button>

      {/* Arrows */}
      <button
        className={`carousel-arrow left ${
          index > 0 && !isSuperZoomed ? "" : "hidden"
        }`}
        aria-label="Previous image"
        aria-hidden={index > 0 && !isSuperZoomed ? undefined : "true"}
        disabled={index <= 0 || isSuperZoomed}
        onClick={(e) => {
          e.stopPropagation();
          animateToIndex(index - 1);
        }}
      >
        <span className="arrow-inner">‹</span>
      </button>

      <button
        className={`carousel-arrow right ${
          index < images.length - 1 && !isSuperZoomed ? "" : "hidden"
        }`}
        aria-label="Next image"
        aria-hidden={
          index < images.length - 1 && !isSuperZoomed ? undefined : "true"
        }
        disabled={index >= images.length - 1 || isSuperZoomed}
        onClick={(e) => {
          e.stopPropagation();
          animateToIndex(index + 1);
        }}
      >
        <span className="arrow-inner">›</span>
      </button>
    </div>
  );
}

export default ProjectGallery;
