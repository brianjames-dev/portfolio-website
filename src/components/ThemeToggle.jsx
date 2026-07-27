import React, { useEffect, useState } from "react";
import IconGlyph from "./IconGlyph.jsx";

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  document.documentElement.style.colorScheme = theme;

  const currentFavicon = document.querySelector("link[data-theme-favicon]");
  const nextHref = `/favicon_io/favicon-baj-${theme}.png`;
  if (currentFavicon?.getAttribute("href") !== nextHref) {
    const nextFavicon = document.createElement("link");
    nextFavicon.rel = "icon";
    nextFavicon.type = "image/png";
    nextFavicon.href = nextHref;
    nextFavicon.setAttribute("data-theme-favicon", "");

    if (currentFavicon) {
      currentFavicon.replaceWith(nextFavicon);
    } else {
      document.head.appendChild(nextFavicon);
    }
  }

  try {
    localStorage.setItem("theme", theme);
  } catch (e) {
    /* no-op */
  }
}

function getInitialTheme() {
  const currentTheme = document.documentElement.getAttribute("data-theme");
  if (currentTheme === "light" || currentTheme === "dark") return currentTheme;

  try {
    const stored = localStorage.getItem("theme");
    if (stored === "light" || stored === "dark") return stored;
  } catch (e) {
    /* no-op */
  }
  const prefersDark =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;
  return prefersDark ? "dark" : "light";
}

export default function ThemeToggle({ className = "" }) {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const toggle = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";

    // Update browser chrome in the activation event instead of waiting for
    // React's post-render effect. Both favicon files are preloaded in <head>.
    applyTheme(nextTheme);
    setTheme(nextTheme);
  };

  return (
    <button
      type="button"
      className={`theme-toggle ${className}`}
      aria-label={
        theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
      }
      onClick={toggle}
    >
      <IconGlyph
        name={theme === "dark" ? "sun" : "moon"}
        className="theme-toggle-icon"
      />
    </button>
  );
}
