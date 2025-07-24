import { FEATURE_FLAGS } from './featureFlags';


let isUserInteracting = false;
let currentAnimation = null;

export function cancelScrollAnimation() {
  if (currentAnimation) {
    cancelAnimationFrame(currentAnimation);
    currentAnimation = null;
  }
  isUserInteracting = true;
}

export function scrollToPosition(targetY, duration = 800) {
  if (!FEATURE_FLAGS.enableScrollToPosition) return;
  
  cancelScrollAnimation(); // cancel any previous animation

  const startY = window.scrollY;
  const distance = targetY - startY;
  const startTime = performance.now();
  isUserInteracting = false;

  function easeInOutQuad(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  }

  function step(currentTime) {
    if (isUserInteracting) return;

    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easeInOutQuad(progress);

    window.scrollTo(0, startY + distance * easedProgress);

    if (elapsed < duration) {
      currentAnimation = requestAnimationFrame(step);
    }
  }

  function cancelOnUserInput() {
    cancelScrollAnimation();
    window.removeEventListener("wheel", cancelOnUserInput);
    window.removeEventListener("touchstart", cancelOnUserInput);
    window.removeEventListener("keydown", cancelOnUserInput);
  }

  window.addEventListener("wheel", cancelOnUserInput, { passive: true });
  window.addEventListener("touchstart", cancelOnUserInput, { passive: true });
  window.addEventListener("keydown", cancelOnUserInput);

  currentAnimation = requestAnimationFrame(step);
}
