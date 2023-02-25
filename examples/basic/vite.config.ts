import prpc from "prpc";
import vercel from "solid-start-vercel";
import solid from "solid-start/vite";
import { defineConfig } from "vite";

export default defineConfig(() => {
  return {
    plugins: [
      prpc(),
      solid({
        ssr: true,
        adapter: vercel({ edge: false }),
      }),
    ],
  };
});
