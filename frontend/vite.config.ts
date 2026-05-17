import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import inspect from "vite-plugin-inspect";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8081,
    proxy: {
      '/api': {
        target: process.env.VITE_ABDM_API_BASE_URL || 'http://localhost:8000',
        changeOrigin: true,
      }
    }
  },
  plugins: [
    react(),
    // Add inspection capabilities in development
    mode === 'development' && inspect(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
