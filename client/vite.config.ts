import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import viteTsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    viteTsconfigPaths(),
    VitePWA({
      registerType: "autoUpdate",
      devOptions: {
        enabled: true,
      },

      manifest: {
        short_name: "Access code map",
        name: "Access code map",
        description: "Displays access codes for locations on a map",
        icons: [
          {
            src: "favicon.ico",
            sizes: "256x256 128x128 96x96 64x64 32x32 24x24 16x16",
            type: "image/x-icon",
          },
          {
            src: "appicon.png",
            type: "image/png",
            sizes: "512x512",
          },
          {
            src: "appicon@0.5x.png",
            type: "image/png",
            sizes: "256x256",
          },
          {
            src: "appicon@0.25.png",
            type: "image/png",
            sizes: "128x128",
          },
          {
            src: "appicon@0.75.png",
            type: "image/png",
            sizes: "384x384",
          },
        ],
        display: "standalone",
        theme_color: "#000000",
        background_color: "#ffffff",
      },
    }),
  ],
  server: {
    port: 3000,
  },
});
