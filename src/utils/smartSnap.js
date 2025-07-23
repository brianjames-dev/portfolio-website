import { scrollToPosition } from "./scrollToPosition";

export const smartSnap = (threshold = 100) => {
  const sections = document.querySelectorAll("[data-snap-target]");
  const scrollY = window.scrollY;
  const windowHeight = window.innerHeight;

  for (const section of sections) {
    const rect = section.getBoundingClientRect();
    const sectionTop = scrollY + rect.top;
    const sectionBottom = scrollY + rect.bottom;

    const topDistance = Math.abs(rect.top);
    const bottomDistance = Math.abs(rect.bottom - windowHeight);

    let shouldSnap = false;
    let targetPosition = sectionTop;

    if (topDistance < threshold && bottomDistance < threshold) {
      targetPosition = sectionTop + rect.height / 2 - windowHeight / 2;
      shouldSnap = true;
    } else if (topDistance < threshold && topDistance <= bottomDistance) {
      targetPosition = sectionTop;
      shouldSnap = true;
    } else if (bottomDistance < threshold && bottomDistance < topDistance) {
      targetPosition = sectionBottom - windowHeight;
      shouldSnap = true;
    }

    if (shouldSnap) {
      scrollToPosition(targetPosition, 900); // 👈 Adjust duration here
      break;
    }
  }
};
