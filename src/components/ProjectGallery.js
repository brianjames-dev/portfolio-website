// /components/ProjectGallery.js
import React, { useEffect, useRef, useState } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import closeIcon from '../images/close.svg';
import swipeIcon from '../images/swipe.svg';

function ProjectGallery({ images, index, setIndex, onClose }) {
  const [isSuperZoomed, setIsSuperZoomed] = useState(false);
  const [showSwipeHint, setShowSwipeHint] = useState(false);
  const [mouseDownTime, setMouseDownTime] = useState(null);
  const [mouseDownPos, setMouseDownPos] = useState({ x: 0, y: 0 });
  const mouseWasDraggedRef = useRef(false);
  const thumbnailRefs = useRef([]);
  const hasShownSwipeHintRef = useRef(false);
  const hintTimeoutRef = useRef(null);


  const scrollToThumbnail = (i, smooth = true) => {
    const el = thumbnailRefs.current[i];
    const strip = document.querySelector('.thumbnail-strip');
    if (!el || !strip) return;
    const elLeft = el.offsetLeft;
    const elWidth = el.offsetWidth;
    const stripWidth = strip.offsetWidth;
    const scrollX = elLeft - (stripWidth / 2) + (elWidth / 2);
    strip.scrollTo({ left: scrollX, behavior: smooth ? 'smooth' : 'auto' });
  };

  // Re-centering thumbnail scroll logic
  useEffect(() => {
    const strip = document.querySelector('.thumbnail-strip');
    if (!strip || index === null) return;
  
    let scrollTimeout;
  
    const handleScroll = () => {
      if (scrollTimeout) clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        scrollToThumbnail(index, true); // Recenter after 1s of no activity
      }, 1000);
    };
  
    strip.addEventListener('scroll', handleScroll);
  
    return () => {
      strip.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, [index]);

  
  // Thumbnail row drag-scroll
  useEffect(() => {
    const strip = document.querySelector('.thumbnail-strip');
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
  
    strip.addEventListener('mousedown', startDrag);
    strip.addEventListener('mousemove', drag);
    strip.addEventListener('mouseup', stopDrag);
    strip.addEventListener('mouseleave', stopDrag);
  
    strip.addEventListener('touchstart', startDrag);
    strip.addEventListener('touchmove', drag);
    strip.addEventListener('touchend', stopDrag);
  
    return () => {
      strip.removeEventListener('mousedown', startDrag);
      strip.removeEventListener('mousemove', drag);
      strip.removeEventListener('mouseup', stopDrag);
      strip.removeEventListener('mouseleave', stopDrag);
  
      strip.removeEventListener('touchstart', startDrag);
      strip.removeEventListener('touchmove', drag);
      strip.removeEventListener('touchend', stopDrag);
    };
  }, []);  

  // Preload adjacent images
  useEffect(() => {
    if (index !== null) {
      const preload = (i) => {
        if (images[i]) {
          const img = new Image();
          img.src = images[i].src;
        }
      };
      preload(index + 1);
      preload(index - 1);
    }
  }, [index, images]);
  

  // Prevent background touchmove scroll
  useEffect(() => {
    const preventScroll = (e) => {
      const inThumbnailStrip = e.target.closest('.thumbnail-strip');
      if (!inThumbnailStrip) {
        e.preventDefault();
      }
    };
  
    if (index !== null) {
      document.body.addEventListener('touchmove', preventScroll, { passive: false });
    }
  
    return () => {
      document.body.removeEventListener('touchmove', preventScroll);
    };
  }, [index]);  

  // Scroll lock when overlay is open
  useEffect(() => {
    const entering = index !== null;
    if (entering) {
      const y = window.scrollY;
      document.body.classList.add('no-scroll');
      document.body.style.top = `-${y}px`;
    }
  
    return () => {
      if (entering) {
        const y = parseInt(document.body.style.top || '0') * -1;
        document.body.classList.remove('no-scroll');
        document.body.style.top = '';
        window.scrollTo(0, y);
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
  }, [index, images]);

  // Keyboard escape
  useEffect(() => {
    const handleEsc = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  // Mobile swipe
  useEffect(() => {
    const overlay = document.querySelector('.fullscreen-overlay');
    if (!overlay) return;

    let lastTouchX = null;
    const handleTouchStart = (e) => {
      if (e.touches.length !== 1) return;
      if (e.target.closest('.thumbnail-strip')) return;
      lastTouchX = e.touches[0].clientX;
    };

    const handleTouchMove = (e) => {
      if (lastTouchX === null) return;
      const deltaX = e.touches[0].clientX - lastTouchX;
      if (deltaX > 80 && index > 0) {
        setIndex(index - 1);
        lastTouchX = null;
      } else if (deltaX < -80 && index < images.length - 1) {
        setIndex(index + 1);
        lastTouchX = null;
      }
    };

    const resetTouch = () => (lastTouchX = null);

    overlay.addEventListener('touchstart', handleTouchStart, { passive: false });
    overlay.addEventListener('touchmove', handleTouchMove, { passive: false });
    overlay.addEventListener('touchend', resetTouch);

    return () => {
      overlay.removeEventListener('touchstart', handleTouchStart);
      overlay.removeEventListener('touchmove', handleTouchMove);
      overlay.removeEventListener('touchend', resetTouch);
    };
  }, [index, images.length, setIndex]);

  if (index === null || !images.length) return null;

  const image = images[index];

  return (
    <div
      className="fullscreen-overlay visible"
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
        <img src={swipeIcon} alt="Swipe hint" className="swipe-hint" />
      )}

      {/* Centered Image */}
      <div className="fullscreen-center-area">
        <div
          className={`fullscreen-image-wrapper ${isSuperZoomed ? 'superzoom-mode' : ''}`}
          onClick={(e) => {
            const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
            if (isTouch || mouseWasDraggedRef.current) e.stopPropagation();
          }}
        >
          {isSuperZoomed ? (
            <TransformWrapper
              doubleClick={{ disabled: true }}
              pinch={{ disabled: false }}
              panning={{ velocityDisabled: false }}
              wheel={{ disabled: true }}
              initialScale={2.3}
              minScale={2.3}
              maxScale={2.3}
              centerOnInit
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
                    const duration = Date.now() - mouseDownTime;
                    const distX = Math.abs(e.clientX - mouseDownPos.x);
                    const distY = Math.abs(e.clientY - mouseDownPos.y);
                    const movement = Math.sqrt(distX ** 2 + distY ** 2);
                    if (duration < 200 && movement < 5) {
                      e.stopPropagation();
                      setIsSuperZoomed(false);
                    } else {
                      mouseWasDraggedRef.current = true;
                    }
                  }}
                >
                  <img
                    src={image?.src}
                    alt={image?.caption || "Fullscreen"}
                    className="fullscreen-image superzoomed"
                    style={{ touchAction: 'none' }}
                  />
                </div>
              </TransformComponent>
            </TransformWrapper>
          ) : (
            <img
              src={image?.src}
              alt={image?.caption || "Fullscreen"}
              className="fullscreen-image"
              style={{ transform: 'scale(1)', cursor: 'zoom-in' }}
              onClick={(e) => {
                e.stopPropagation();
                setIsSuperZoomed(true);
              }}
            />
          )}
        </div>

        {image?.caption && !isSuperZoomed && (
          <p className="fullscreen-caption">{image.caption}</p>
        )}
      </div>

      {/* Thumbnails */}
      <div className={`thumbnail-strip ${isSuperZoomed ? 'hidden' : ''}`}>
        {images.map((img, i) => (
          <div
            key={i}
            className={`thumbnail-container ${i === index ? 'active' : ''}`}
            ref={(el) => (thumbnailRefs.current[i] = el)}
            onClick={(e) => {
              e.stopPropagation();
              setIndex(i);
              setIsSuperZoomed(false);
            }}
          >
            <img
              src={img.src}
              alt={img.caption || `Thumbnail ${i + 1}`}
              className="thumbnail-image"
            />
          </div>
        ))}
      </div>

      {/* Close Button */}
      <button
        className="fullscreen-close-btn"
        onClick={(e) => {
          e.stopPropagation();
          setIsSuperZoomed(false);
          onClose();
        }}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <img src={closeIcon} alt="Close" />
      </button>

      {/* Arrows */}
      <button 
        className={`carousel-arrow left ${(index > 0 && !isSuperZoomed) ? '' : 'hidden'}`}
        onClick={(e) => {
            e.stopPropagation();
            setIndex(index - 1);
        }}
        >
        <span className="arrow-inner">‹</span>
        </button>

        <button 
        className={`carousel-arrow right ${(index < images.length - 1 && !isSuperZoomed) ? '' : 'hidden'}`}
        onClick={(e) => {
            e.stopPropagation();
            setIndex(index + 1);
        }}
        >
        <span className="arrow-inner">›</span>
        </button>
    </div>
  );
}

export default ProjectGallery;
