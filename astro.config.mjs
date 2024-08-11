import { defineConfig } from 'astro/config';
import icon from "astro-icon";
import playformCompress from "@playform/compress";

import netlify from "@astrojs/netlify";

// https://astro.build/config
export default defineConfig({
  output: "static",
  integrations: [icon(), playformCompress()],
  adapter: netlify()
});