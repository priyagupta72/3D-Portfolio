// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })


import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  build: {
    // Raise the chunk size warning limit a bit for 3D apps (Three.js is large)
    chunkSizeWarningLimit: 600,

    rollupOptions: {
      output: {
        manualChunks(id) {
          // ── Three.js gets its own cached chunk ──
          // All 5 of your 3D sections import 'three' — without this,
          // Vite may duplicate it across chunks. Now it downloads once,
          // lives in browser cache, and every lazy section reuses it.
          if (id.includes('node_modules/three')) {
            return 'vendor-three'
          }

          // ── React core in its own chunk ──
          // Stable across deploys = long cache TTL
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
            return 'vendor-react'
          }

          // ── Everything else in node_modules → vendor chunk ──
          // Framer, router, etc. if you add them later
          if (id.includes('node_modules')) {
            return 'vendor-misc'
          }
        },
      },
    },
  },

  // Dev server tweaks
  server: {
    // Warm up frequently used files so first load is faster in dev
    warmup: {
      clientFiles: [
        './src/components/Hero3D.jsx',
        './src/components/Experience3D.jsx',
      ],
    },
  },

  // Optimize deps — pre-bundle Three.js so dev server doesn't re-transform it
  optimizeDeps: {
    include: ['three'],
  },
})