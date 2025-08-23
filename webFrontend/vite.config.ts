// import { sentryVitePlugin } from "@sentry/vite-plugin";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr(),
    // 빌드 에러로 주석처리함
    // sentryVitePlugin({
    //   org: "gazinow",
    //   project: "web",
    // }),
  ],

  resolve: {
    alias: [
      { find: "@global", replacement: "/src/global" },
      { find: "@assets", replacement: "/src/assets" },
      { find: "@pages", replacement: "/src/pages" },
    ],
  },

  server: {
    proxy: {
      "/api": "https://gazinow.com",
    },
  },

  build: {
    sourcemap: true,
  },
});
