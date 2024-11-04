import { defineConfig } from "astro/config";
import icon from "astro-icon";
import db from "@astrojs/db";
import node from "@astrojs/node";

import compressor from "astro-compressor";

import playformCompress from "@playform/compress";

// https://astro.build/config
export default defineConfig({
  site: "https://melody-mind.de",
  output: "server",
  integrations: [
    icon(),
    db(),
    compressor(),
    playformCompress(),
  ],
  adapter: node({
    mode: "standalone",
  }),
  security: {
    checkOrigin: true,
  },
  server: {
    host: "0.0.0.0",
    port: import.meta.env.PORT,
  },
  routes: [
    {
      src: "/api/health",
      dest: "src/pages/api/health.ts",
    },
  ],
});