import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react({ jsxRuntime: "automatic" })],
  envPrefix: ["VITE_", "REACT_APP_"],
  esbuild: {
    jsx: "automatic",
  },
  build: {
    outDir: "build",
  },
});
