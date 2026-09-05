import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ command, mode, isPreview }) => {
  const env = loadEnv(mode, process.cwd(), "VITE_BASE_PATH");
  const baseOverride = (
    process.env.VITE_BASE_PATH ?? env.VITE_BASE_PATH
  )?.trim();
  const [owner = "", repoName = "Portfolio_website"] = (
    process.env.GITHUB_REPOSITORY ?? ""
  ).split("/");
  const isUserSite =
    repoName.toLowerCase() === `${owner}.github.io`.toLowerCase();
  const isPagesBuild =
    process.env.GITHUB_ACTIONS === "true" && (command === "build" || isPreview);
  // CI browser tests use the root dev URL. Only production receives the Pages prefix.
  const defaultBase = isPagesBuild && !isUserSite ? `/${repoName}/` : "/";
  const base = baseOverride
    ? `/${baseOverride.replace(/^\/+|\/+$/g, "")}/`.replace(/^\/\/$/, "/")
    : defaultBase;

  return {
    base,
    plugins: [react()],
    build: {
      chunkSizeWarningLimit: 1200,
    },
  };
});
