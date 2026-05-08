import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const isGitHubActions = process.env.GITHUB_ACTIONS === "true";
const repoName = process.env.GITHUB_REPOSITORY?.split("/")[1] ?? "Portfolio_website";

export default defineConfig({
  base: isGitHubActions ? `/${repoName}/` : "/",
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1200,
  },
});
