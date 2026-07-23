const viteEnv = import.meta.env || {};

const readEnv = (key) => viteEnv[key] || "";

export const CONTACT_FORM_URL =
  readEnv("VITE_CONTACT_FORM_URL") ||
  readEnv("REACT_APP_CONTACT_FORM_URL") ||
  "https://7ohwfvw4b9.execute-api.us-west-1.amazonaws.com/default/contactFormHandler";

export const GALLERY_AUTH_URL =
  readEnv("VITE_GALLERY_AUTH_URL") || readEnv("REACT_APP_GALLERY_AUTH_URL");

export const GALLERY_ACCESS_REQUEST_URL =
  readEnv("VITE_GALLERY_ACCESS_REQUEST_URL") ||
  readEnv("REACT_APP_GALLERY_ACCESS_REQUEST_URL");

export const RECAPTCHA_SITE_KEY =
  readEnv("VITE_RECAPTCHA_SITE_KEY") ||
  readEnv("REACT_APP_RECAPTCHA_SITE_KEY");
