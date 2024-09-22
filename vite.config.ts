import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // Set the dev server port to 3000
  },
  preview: {
    port: 3000,
  },
  optimizeDeps: {
    include: ["@tensorflow-models/face-landmarks-detection", "react-webcam"],
  },
});
