import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import removeConsole from "vite-plugin-remove-console";
import { resolve } from "path";
import viteCompression from "vite-plugin-compression";

// https://vite.dev/config/

const env = loadEnv("", process.cwd());

export default defineConfig({
  plugins: [
    react(),
    removeConsole(),
    viteCompression({
      algorithm: "gzip",
      ext: ".gz",
      threshold: 10240,  // 10KB
      deleteOriginFile: false,  // 원본 파일 유지
      verbose: true,  // 로그 출력 활성화 (빌드 시 압축 정보 확인)
      disable: false  // 확실히 활성화
    }),
    viteCompression({
      algorithm: "brotliCompress",
      ext: ".br",
      threshold: 10240,
      deleteOriginFile: false,
      verbose: true,
      disable: false
    })
  ],
  resolve: {
    alias: {
      "@components": resolve(__dirname, "src/components"),
      "@hooks": resolve(__dirname, "src/hooks"),
      "@stores": resolve(__dirname, "src/stores"),
      "@": resolve(__dirname, "src"),
    },
  },
  optimizeDeps: {
    include: ["lodash"],
  },
  server: {
    proxy: {
      "/api": {
        target: env.VITE_API_URL,
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
  build: {
    chunkSizeWarningLimit: 300,
    rollupOptions: {
      output: {
        manualChunks: {
          "react-vendor": ["react", "react-dom", "react-router-dom"],
          "utils": ["lodash", "axios"],
          "query": ["@tanstack/react-query"],
        }
      },
    },
    minify: "terser",
    cssCodeSplit: true,
    sourcemap: false,
    terserOptions: {
      compress: {
        drop_console: true,  // 콘솔 로그 제거
        drop_debugger: true  // 디버거 문 제거
      }
    },

  },
  assetsInclude: ["**/*.lottie"],
});
