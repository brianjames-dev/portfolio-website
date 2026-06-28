import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv, transformWithEsbuild } from "vite";

const jsAsJsx = {
  name: "js-as-jsx",
  async transform(code, id) {
    if (!id.includes("/src/") || !id.endsWith(".js")) return null;

    return transformWithEsbuild(code, id, {
      loader: "jsx",
      jsx: "automatic",
    });
  },
};

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [jsAsJsx, react()],
    optimizeDeps: {
      esbuildOptions: {
        loader: {
          ".js": "jsx",
        },
      },
    },
    build: {
      outDir: "build",
    },
    define: {
      "process.env": JSON.stringify({
        REACT_APP_CONTACT_FORM_URL: env.REACT_APP_CONTACT_FORM_URL || "",
        REACT_APP_GALLERY_ACCESS_REQUEST_URL:
          env.REACT_APP_GALLERY_ACCESS_REQUEST_URL || "",
        REACT_APP_GALLERY_AUTH_URL: env.REACT_APP_GALLERY_AUTH_URL || "",
        REACT_APP_RECAPTCHA_SITE_KEY: env.REACT_APP_RECAPTCHA_SITE_KEY || "",
      }),
    },
  };
});
