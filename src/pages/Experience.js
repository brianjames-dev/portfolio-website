import { lazy, Suspense, useCallback, useRef, useState } from "react";
import Card from "../components/Card";
import CollapsedCard from "../components/CollapsedCard";
import ExpandedCard from "../components/ExpandedCard";
import GalleryLockModal from "../components/GalleryLockModal";
import RevealOnView from "../components/RevealOnView";
import VideoOverlay from "../components/VideoOverlay";
import experiences from "../data/experience";
import useCardExpansion from "../hooks/useCardExpansion";
import useGalleryLock from "../hooks/useGalleryLock";
import "../styles/Projects.css";
const Gallery = lazy(() => import("../components/Gallery"));

function Experience() {
  const [fullscreenIndex, setFullscreenIndex] = useState(null);
  const [fullscreenImages, setFullscreenImages] = useState([]);
  const [pendingImages, setPendingImages] = useState(null);
  const [isGateOpen, setIsGateOpen] = useState(false);
  const [activeDemo, setActiveDemo] = useState(null);
  const galleryReturnTargetRef = useRef(null);
  const pendingSourceRef = useRef(null);

  const { isExpanded, toggle } = useCardExpansion();
  const { isUnlocked, unlock } = useGalleryLock();

  const scrollGalleryTargetIntoView = useCallback(() => {
    const target = galleryReturnTargetRef.current;
    galleryReturnTargetRef.current = null;
    if (!target || !document.body.contains(target)) return;

    const headerVar = getComputedStyle(document.documentElement)
      .getPropertyValue("--header-height")
      .trim();
    const headerOffset = parseInt(headerVar || "60", 10) || 60;
    const targetTop =
      target.getBoundingClientRect().top + window.pageYOffset - headerOffset - 8;

    window.scrollTo({
      top: Math.max(0, targetTop),
      behavior: "smooth",
    });
  }, []);

  const openGallery = (images, sourceElement) => {
    import("../components/Gallery");
    galleryReturnTargetRef.current =
      sourceElement?.closest?.(".project-card") ||
      pendingSourceRef.current ||
      null;
    pendingSourceRef.current = null;
    setFullscreenImages(images);
    setFullscreenIndex(0);
  };

  const openDemo = (video) => {
    if (!video) return;
    setActiveDemo(video);
  };

  const onLockedAction = (action, isLocked, payload, sourceElement) => {
    if (!isLocked) {
      action(payload, sourceElement);
      return;
    }

    if (isUnlocked) {
      action(payload, sourceElement);
      return;
    }

    setPendingImages(payload);
    pendingSourceRef.current =
      sourceElement?.closest?.(".project-card") || null;
    setIsGateOpen(true);
  };

  const handleGateClose = () => {
    setIsGateOpen(false);
    setPendingImages(null);
    pendingSourceRef.current = null;
  };

  const handleUnlock = async (password) => {
    const result = await unlock(password);
    if (!result.ok) return result;

    setIsGateOpen(false);
    if (pendingImages) {
      if (Array.isArray(pendingImages)) {
        openGallery(pendingImages);
      } else {
        openDemo(pendingImages);
      }
    }
    setPendingImages(null);
    return result;
  };

  return (
    <section id="experience" className="projects" data-snap-target>
      <div className="container">
        <RevealOnView className="project-header-wrapper">
          <div className="project-header-card">
            <h2>Experience</h2>
          </div>
        </RevealOnView>
        {experiences.map((exp) => (
          <Card
            key={exp.id}
            id={exp.id}
            isExpanded={isExpanded(exp.id)}
            onToggle={() => toggle(exp.id)}
            canExpand={!!exp.expanded} // Pass expandability based on expanded content
            renderCollapsed={({ onExpand }) => (
              <CollapsedCard
                project={exp}
                onExpand={onExpand}
                onGalleryClick={(images, sourceElement) =>
                  onLockedAction(
                    openGallery,
                    exp.galleryLocked,
                    images,
                    sourceElement
                  )
                }
                isGalleryLocked={exp.galleryLocked && !isUnlocked}
                isLockable={exp.galleryLocked}
                showGalleryButton={exp.showGalleryButton}
                showDemoButton={Boolean(exp.demoVideo)}
                onDemoClick={(video) =>
                  onLockedAction(openDemo, exp.galleryLocked, video)
                }
              />
            )}
            renderExpanded={({ onClose, onCloseAndScroll }) => (
              <ExpandedCard
                project={exp}
                onGalleryClick={(images, sourceElement) =>
                  onLockedAction(
                    openGallery,
                    exp.galleryLocked,
                    images,
                    sourceElement
                  )
                }
                isGalleryLocked={exp.galleryLocked && !isUnlocked}
                isLockable={exp.galleryLocked}
                showGalleryButton={exp.showGalleryButton}
                showDemoButton={Boolean(exp.demoVideo)}
                onDemoClick={(video) =>
                  onLockedAction(openDemo, exp.galleryLocked, video)
                }
                handleClose={onClose}
                handleCloseAndScroll={onCloseAndScroll}
              />
            )}
          />
        ))}
      </div>

      <GalleryLockModal
        isOpen={isGateOpen}
        onClose={handleGateClose}
        onUnlock={handleUnlock}
      />

      <VideoOverlay
        isOpen={Boolean(activeDemo)}
        video={activeDemo}
        onClose={() => setActiveDemo(null)}
      />

      {/* Fullscreen Gallery */}
      <Suspense fallback={<div className="fade-loader">Loading…</div>}>
        <Gallery
          images={fullscreenImages}
          index={fullscreenIndex}
          setIndex={setFullscreenIndex}
          onClose={() => {
            setFullscreenImages([]);
            setFullscreenIndex(null);
            window.setTimeout(scrollGalleryTargetIntoView, 80);
          }}
        />
      </Suspense>
    </section>
  );
}

export default Experience;
