// src/utils/scrollToCollapsedCard.js
export const scrollPositionMap = new Map();

export function scrollToCollapsedCard(cardId, yOffset = -60) {
  const element = document.getElementById(`project-${cardId}`);
  if (element) {
    const y = element.getBoundingClientRect().top + window.scrollY;
    scrollPositionMap.set(cardId, y);

    window.scrollTo({
      top: y + yOffset,
      behavior: 'smooth',
    });
  }
}

export function scrollToYPosition(y, yOffset = -60) {
  window.scrollTo({
    top: y + yOffset,
    behavior: 'smooth',
  });
}
