import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: false, // we already hand-author public/manifest.json
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico}'],
      },
      devOptions: {
        enabled: false, // don't run the SW during `vite dev`
      },
    }),
  ],

  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true
      }
    }
  }
});