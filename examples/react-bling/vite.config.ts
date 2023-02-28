import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { bling } from "@tanstack/bling/vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), bling()],
});
