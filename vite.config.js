// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })


import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'
import webfontDownload from 'vite-plugin-webfont-dl'

export default defineConfig({
  plugins: [
    react(),
    webfontDownload(),
    visualizer({ open: true, gzipSize: true, brotliSize: true }) 
  ],

  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/three')) return 'vendor-three'
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) return 'vendor-react'
          if (id.includes('node_modules')) return 'vendor-misc'
        },
      },
    },
  },

  server: {
    warmup: {
      clientFiles: [
        './src/components/Hero3D.jsx',
        './src/components/Experience3D.jsx',
      ],
    },
  },

  optimizeDeps: {
    include: ['three'],
  },
})