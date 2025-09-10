import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr({
      svgrOptions: {
        icon: true,
        // This will transform your SVG to a React component
        exportType: "named",
        namedExport: "ReactComponent",
      },
    }),
  ],
  css: {
    postcss: './postcss.config.js',
  },
  build: {
    chunkSizeWarningLimit: 2000, // Increase the chunk size warning limit
    cssMinify: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react')) {
              return 'vendor-react';
            }
            return 'vendor';
          }
          if (id.includes('src/components/')) {
            return 'components';
          }
        },
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name ?? '';
          if (info.endsWith('.css')) {
            return 'assets/css/[name]-[hash][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        },
      }
    }
  }
});
