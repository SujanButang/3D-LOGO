import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  base: "/3D-LOGO/",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
