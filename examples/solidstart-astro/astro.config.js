import node from "@astrojs/node";
import tailwind from "@astrojs/tailwind";
import { defineConfig } from "astro/config";
import start from "solid-start/astro";
import { astroPRPC } from "@prpc/vite";

// https://astro.build/config
export default defineConfig({
  output: "server",
  adapter: node({
    mode: "standalone",
  }),
  integrations: [astroPRPC(), start(), tailwind()],
});
