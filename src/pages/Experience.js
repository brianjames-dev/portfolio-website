import { lazy, Suspense, useState } from "react";
import Card from "../components/Card";
import CollapsedCard from "../components/CollapsedCard";
import ExpandedCard from "../components/ExpandedCard";
import GalleryLockModal from "../components/GalleryLockModal";
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

  const { isExpanded, toggle } = useCardExpansion();
  const { isUnlocked, unlock } = useGalleryLock();

  const openGallery = (images) => {
    import("../components/Gallery");
    setFullscreenImages(images);
    setFullscreenIndex(0);
  };

  const openDemo = (video) => {
    if (!video) return;
    setActiveDemo(video);
  };

  const onLockedAction = (action, isLocked, payload) => {
    if (!isLocked) {
      action(payload);
      return;
    }

    if (isUnlocked) {
      action(payload);
      return;
    }

    setPendingImages(payload);
    setIsGateOpen(true);
  };

  const handleGateClose = () => {
    setIsGateOpen(false);
    setPendingImages(null);
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
        <div className="project-header-wrapper">
          <div className="project-header-card">
            <h2>Experience</h2>
          </div>
        </div>
        {experiences.map((exp) => (
          <Card
            key={exp.id}
            id={exp.id}
            isExpanded={isExpanded(exp.id)}
            onToggle={() => toggle(exp.id)}
            canExpand={!!exp.expanded} // Pass expandability based on expanded content
            renderCollapsed={() => (
              <CollapsedCard
                project={exp}
                onExpand={() => toggle(exp.id)}
                onGalleryClick={() =>
                  onLockedAction(openGallery, exp.galleryLocked, exp.images)
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
                onGalleryClick={() =>
                  onLockedAction(openGallery, exp.galleryLocked, exp.images)
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
          }}
        />
      </Suspense>
    </section>
  );
}

export default Experience;
