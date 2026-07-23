export const CARD_SPRING = {
  stiffness: 260,
  damping: 44,
  mass: 0.85,
  restDelta: 0.5,
  restSpeed: 10,
};

export const CARD_WIDTH_TRANSITION = {
  type: "spring",
  stiffness: 420,
  damping: 42,
  mass: 0.75,
  restDelta: 0.5,
  restSpeed: 10,
};

export const CARD_LAYOUT_TRANSITION = {
  type: "spring",
  ...CARD_SPRING,
};

export const CARD_PANEL_DURATION = 0.32;
export const CARD_PANEL_EASE = [0.22, 1, 0.36, 1];
