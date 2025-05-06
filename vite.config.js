import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  base: "./",
  plugins: [react()],
  build: {
    outDir: "dist", // Or your preferred output directory
    // You might need to configure other options depending on your assets
  },
});
