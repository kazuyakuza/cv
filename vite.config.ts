import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// Stage 10 — GitHub Pages deployment. The site is published as a project page
// at https://kazuyakuza.github.io/cv/, i.e. under the repository subpath, so
// every generated asset URL is prefixed with `/cv/`. Vite applies this `base`
// to the built HTML, the hashed JS/CSS and its public `favicon.svg`, so nothing
// 404s under the subpath. Locally `npm run dev` / `npm run preview` serve the
// same base (`http://localhost:5173/cv/`), so behaviour matches production.
export default defineConfig({
  base: '/cv/',
  plugins: [vue()],
  build: {
    // The diorama references its raster assets as hashed files (resolved from
    // `__ASSET__` tokens in src/App.vue); never re-inline them as base64.
    assetsInlineLimit: 0,
  },
})
