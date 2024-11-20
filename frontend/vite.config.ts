import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import removeConsole from "vite-plugin-remove-console";
import { resolve } from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), removeConsole()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
      "@components": resolve(__dirname, "src/components"),
      "@hooks": resolve(__dirname, "src/hooks"),
      "@stores": resolve(__dirname, "src/stores"),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ""), // 필요한 경우 경로 재작성
      },
    },
  },
  assetsInclude: ["**/*.lottie"],
});
