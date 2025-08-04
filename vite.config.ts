import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { VitePWA } from "vite-plugin-pwa";
import { readFileSync } from "fs";

const https = (() => {
  try {
    return {
      key: readFileSync("./tls/key.pem"),
      cert: readFileSync("./tls/cert.pem"),
    };
  } catch {
    return undefined;
  }
})();

// https://vite.dev/config/
export default defineConfig({
  base: "./",
  server: {
    https,
  },
  plugins: [
    svelte(),
    VitePWA({
      injectRegister: null,
      includeAssets: ["*"],
      registerType: "autoUpdate",
      manifest: {
        name: "Blood Pressure Viewer",
        short_name: "Blood Pressure Viewer",
        lang: "en",
        icons: [
          {
            src: "pwa-64x64.png",
            sizes: "64x64",
            type: "image/png",
          },
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "maskable-icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
    }),
  ],
});
