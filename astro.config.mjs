import { defineConfig } from "astro/config";
import icon from "astro-icon";
import playformCompress from "@playform/compress";
import db from "@astrojs/db";
import node from "@astrojs/node";

// https://astro.build/config
export default defineConfig({
  site: "https://evjvx5ac8giyfg4012134.cleavr.one",
  output: "server",
  integrations: [icon(), playformCompress(), db()],
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
});
