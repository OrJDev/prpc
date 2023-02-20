import solid from "solid-start/vite";
import { defineConfig } from "vite";
import query from "./query";

export default defineConfig(() => {
  return {
    plugins: [solid({ ssr: true }), query()],
  };
});
