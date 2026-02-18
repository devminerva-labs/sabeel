import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'apple-touch-icon.png', 'og-image.png', 'fonts/*.woff2', 'icons/*.png'],
      manifest: {
        name: 'Sabeel - Ramadan Companion',
        short_name: 'Sabeel',
        description: 'Track your Quran recitation and Adhkar this Ramadan',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        orientation: 'portrait',
        theme_color: '#1a472a',
        background_color: '#0d1f12',
        lang: 'en',
        dir: 'auto',
        categories: ['lifestyle', 'productivity'],
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: '/icons/icon-192-maskable.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: '/icons/icon-512-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
        shortcuts: [
          { name: 'Quran', short_name: 'Quran', url: '/quran' },
          { name: 'Adhkar', url: '/adhkar' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
        // Exclude auth callback from service worker navigation handling
        // Safari rejects cached redirect responses from service workers
        navigateFallbackDenylist: [/^\/auth\/callback/],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/.*\.supabase\.co\/rest\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'sabeel-api',
              networkTimeoutSeconds: 3,
              expiration: { maxAgeSeconds: 86400 },
            },
          },
          {
            urlPattern: /^https:\/\/api\.quran\.com\/api\/v4\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'quran-api',
              expiration: { maxEntries: 60, maxAgeSeconds: 60 * 60 * 24 * 30 },
            },
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    // fake-indexeddb/auto must be in setupFiles (not just imported in tests)
    // for dexie-react-hooks useLiveQuery to work correctly in test environment
    setupFiles: ['fake-indexeddb/auto'],
  },
})
