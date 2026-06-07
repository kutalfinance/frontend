import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    tailwindcss(),
    reactRouter(),
    tsconfigPaths(),
    VitePWA({
      strategies: "injectManifest",
      srcDir: "app",
      filename: "sw.ts",
      registerType: "autoUpdate",
      injectRegister: null,
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,svg,woff,woff2}"],
      },
      includeManifestIcons: false,
      manifest: {
        name: "KSS",
        short_name: "KSS",
        description: "KSS Agent & Admin App",
        theme_color: "#16a34a",
        background_color: "#ffffff",
        display: "standalone",
        start_url: "/agent",
        icons: [
          { src: "/favicon.ico", sizes: "48x48", type: "image/x-icon" },
          {
            src: "https://res.cloudinary.com/dweh5irid/image/upload/w_192,h_192,c_fill,f_png/v1780326041/kss-logo.jpg",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "https://res.cloudinary.com/dweh5irid/image/upload/w_512,h_512,c_fill,f_png/v1780326041/kss-logo.jpg",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
    }),
  ],
  server: { port: 5500 },
});
