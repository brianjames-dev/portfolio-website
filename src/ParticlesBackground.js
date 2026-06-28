import { lazy, memo, Suspense, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";

let engineReadyPromise;

const loadParticlesEngine = async () => {
  if (!engineReadyPromise) {
    engineReadyPromise = Promise.all([
      import("@tsparticles/react"),
      import("@tsparticles/slim"),
    ]).then(([particlesReact, particlesSlim]) =>
      particlesReact.initParticlesEngine(async (engine) => {
        await particlesSlim.loadSlim(engine);
      })
    );
  }

  return engineReadyPromise;
};

const LazyParticles = lazy(() =>
  import("@tsparticles/react").then((m) => ({ default: m.Particles }))
);

function ParticlesBackground() {
  const initialDarkMode =
    typeof document !== "undefined" &&
    document.documentElement.getAttribute("data-theme") === "dark";
  const [engineReady, setEngineReady] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [visible, setVisible] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState(
    initialDarkMode ? "#0f1711" : "#f5f8f4"
  );
  const [isDarkMode, setIsDarkMode] = useState(initialDarkMode);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (media?.matches) {
      setPrefersReducedMotion(true);
      return undefined;
    }

    const idleId = window.requestIdleCallback
      ? window.requestIdleCallback(() => {
          loadParticlesEngine().then(() => setEngineReady(true));
        })
      : window.setTimeout(() => {
          loadParticlesEngine().then(() => setEngineReady(true));
        }, 700);

    const raf = requestAnimationFrame(() => setMounted(true));
    return () => {
      cancelAnimationFrame(raf);
      if (window.cancelIdleCallback && typeof idleId === "number") {
        window.cancelIdleCallback(idleId);
      } else {
        window.clearTimeout(idleId);
      }
    };
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
    const particleColor = isDarkMode ? "#8FC89D" : "#1F5137";

    const dpr =
      typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
    const small =
      typeof window !== "undefined" &&
      window.matchMedia?.("(max-width: 600px)")?.matches;

    const count = Math.round((small ? 22 : 56) * (dpr > 1.5 ? 0.75 : 1));
    const fps = small ? 24 : 45;
    const linkDist = small ? 0 : 170;
    const repulseDist = small ? 0 : 90;
    const repulseDuration = 0.2;

    return {
      fullScreen: { enable: true, zIndex: 0 },
      background: { color: backgroundColor },
      detectRetina: !small,
      fpsLimit: fps,
      pauseOnBlur: true,
      pauseOnOutsideViewport: true,
      particles: {
        number: { value: count, density: { enable: true, area: 800 } },
        color: { value: particleColor },
        shape: { type: "circle" },
        opacity: { value: isDarkMode ? 0.28 : 0.22 },
        size: { value: { min: 1, max: small ? 2.4 : 3.2 } },
        links: {
          enable: !small,
          distance: linkDist,
          color: particleColor,
          opacity: isDarkMode ? 0.2 : 0.16,
          width: 1,
        },
        move: {
          enable: true,
          speed: small ? 0.12 : 0.32,
          outModes: { default: "bounce" },
        },
      },
      interactivity: {
        detectsOn: "window",
        events: {
          onHover: { enable: !small, mode: "repulse" },
          onClick: { enable: false },
          resize: false,
        },
        modes: {
          repulse: { distance: repulseDist, duration: repulseDuration },
        },
      },
    };
  }, [backgroundColor, isDarkMode]);

  if (prefersReducedMotion || !engineReady || !mounted) return null;

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
