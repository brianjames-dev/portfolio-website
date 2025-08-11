let loadPromise = null;

export function loadRecaptcha(params = "render=explicit") {
  if (window.grecaptcha) return Promise.resolve(window.grecaptcha);

  if (!loadPromise) {
    loadPromise = new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = `https://www.google.com/recaptcha/api.js?${params}`;
      s.async = true;
      s.defer = true;
      s.onload = () => resolve(window.grecaptcha);
      s.onerror = reject;
      document.body.appendChild(s);
    });
  }
  return loadPromise;
}
