import { svelte } from "@sveltejs/vite-plugin-svelte";
import tailwindcss from "@tailwindcss/vite";
import { readFileSync } from "fs";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

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
    tailwindcss(),
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
        file_handlers: [
          {
            action: ".",
            accept: {
              "application/json": [".bpv"],
            },
          },
        ],
      },
    }),
  ],
});
