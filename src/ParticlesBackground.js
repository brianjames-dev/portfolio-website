// ParticlesBackground.js
import { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { lazy, memo, Suspense, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";

const engineReadyPromise = initParticlesEngine(async (engine) => {
  await loadSlim(engine);
});

const LazyParticles = lazy(() =>
  import("@tsparticles/react").then((m) => ({ default: m.Particles }))
);

function ParticlesBackground() {
  const [engineReady, setEngineReady] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [visible, setVisible] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState("#f8f3d9");
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    import("@tsparticles/react");
    engineReadyPromise.then(() => setEngineReady(true));
    const raf = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const { document, MutationObserver: Observer } = window;
    if (!document?.documentElement || !Observer) return undefined;

    const root = document.documentElement;

    const readColor = () => {
      const value = getComputedStyle(root)
        .getPropertyValue("--color-bg")
        .trim();

      if (value) {
        setBackgroundColor(value);
      }
      setIsDarkMode(root.getAttribute("data-theme") === "dark");
    };

    readColor();

    const observer = new Observer(readColor);
    observer.observe(root, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (engineReady && mounted && loaded) {
      const raf = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(raf);
    } else {
      setVisible(false);
    }
  }, [engineReady, mounted, loaded]);

  const options = useMemo(() => {
    const particleColor = isDarkMode ? "#F8F3D9" : "#504B38";

    const dpr =
      typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
    const small =
      typeof window !== "undefined" &&
      window.matchMedia?.("(max-width: 600px)")?.matches;

    const count = Math.round(120 * (dpr > 1.5 ? 0.7 : 1)); // scale on hi-DPR
    const fps = 120;
    const linkDist = small ? 150 : 200;
    const repulseDist = small ? 70 : 100;
    const repulseDuration = 0.25;

    return {
      fullScreen: { enable: true, zIndex: 0 },
      background: { color: backgroundColor },
      detectRetina: true,
      fpsLimit: fps,
      pauseOnBlur: true,
      pauseOnOutsideViewport: true,
      particles: {
        number: { value: count, density: { enable: true, area: 800 } },
        color: { value: particleColor },
        shape: { type: "circle" },
        opacity: { value: 0.7 },
        size: { value: { min: 1, max: 4 } },
        links: {
          enable: true,
          distance: linkDist,
          color: particleColor,
          opacity: 0.5,
          width: 1,
        },
        move: { enable: true, speed: 0.5, outModes: { default: "bounce" } },
      },
      interactivity: {
        // listen on window so the layer can keep pointer-events: none
        detectsOn: "window",
        events: {
          onHover: { enable: true, mode: "repulse" },
          onClick: { enable: true, mode: "push" },
          resize: false,
        },
        modes: {
          repulse: { distance: repulseDist, duration: repulseDuration },
          push: { quantity: 4 },
        },
      },
    };
  }, [backgroundColor, isDarkMode]);

  if (!engineReady || !mounted) return null;

  const layer = (
    <div
      className={`particles-layer ${visible ? "is-visible" : ""}`}
      aria-hidden
      role="presentation"
    >
      <Suspense fallback={null}>
        <LazyParticles
          id="tsparticles"
          options={options}
          particlesLoaded={() => setLoaded(true)}
        />
      </Suspense>
    </div>
  );

  return createPortal(layer, document.body);
}

export default memo(ParticlesBackground);
