import { fileURLToPath, URL } from "node:url";
import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";

const githubRepositoryName = process.env.GITHUB_REPOSITORY?.split("/")[1];
const base =
  process.env.GITHUB_ACTIONS && githubRepositoryName
    ? `/${githubRepositoryName}/`
    : "/";
const projectRoot = fileURLToPath(new URL(".", import.meta.url));
const sharedUiRoot = fileURLToPath(new URL("../JiaHong_UI", import.meta.url));

export default defineConfig({
  base,
  plugins: [vue()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url))
    }
  },
  server: {
    port: 5174,
    open: false,
    fs: {
      allow: [projectRoot, sharedUiRoot]
    }
  }
});
