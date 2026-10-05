import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// No hardcoded `base`: the GitHub Pages base path is decided at Stage 10
// from the actual repository, and the app must work locally as-is.
export default defineConfig({
  plugins: [vue()],
  build: {
    // The diorama references its raster assets as hashed files (resolved from
    // `__ASSET__` tokens in src/App.vue); never re-inline them as base64.
    assetsInlineLimit: 0,
  },
})
