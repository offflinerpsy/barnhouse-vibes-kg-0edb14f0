import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Минимизация и оптимизация
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    // Разбивка на чанки для лучшего кэширования
    rollupOptions: {
      output: {
        manualChunks: {
          // Выносим React в отдельный чанк
          "vendor-react": ["react", "react-dom"],
          // PDF библиотека в отдельный чанк (большая)
          "vendor-pdf": ["react-pdf", "pdfjs-dist"],
          // UI библиотеки
          "vendor-ui": ["framer-motion", "lucide-react"],
          // Radix UI компоненты
          "vendor-radix": [
            "@radix-ui/react-accordion",
            "@radix-ui/react-dialog",
            "@radix-ui/react-dropdown-menu",
            "@radix-ui/react-scroll-area",
            "@radix-ui/react-tabs",
          ],
        },
      },
    },
    // Оптимизация размеров
    chunkSizeWarningLimit: 600,
    // Увеличиваем порог для инлайна
    assetsInlineLimit: 4096,
    // Source maps только для production debug
    sourcemap: false,
  },
}));
