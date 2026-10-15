// Stage 10 — custom diorama zoom, independent of browser zoom.
//
// A single toggle: at 1× the diorama keeps its default rendered size and the
// floating button reads "Zoom" (zoom in); at 4× the SVG is scaled to four times
// that size inside a scrollable viewport, and the same button becomes the
// zoom-out control. The factor is relative to the DEFAULT rendered size, so the
// baseline is measured once, on zoom-in, from the still-unscaled SVG.
//
// Resizing the window while zoomed returns to 1×: the measured baseline would
// otherwise be stale, and re-deriving it from CSS would duplicate layout logic.
import { onBeforeUnmount, onMounted, ref, type Ref } from 'vue'

/** Scale relative to the default rendered size (user baseline). */
export const ZOOM_FACTOR = 4

export function useZoom(viewport: Ref<HTMLElement | null>) {
  const zoomed = ref(false)
  // Explicit px width of the enlarged diorama (so the scroll area matches the
  // visual size — a CSS transform alone would not grow the layout box).
  const zoomWidth = ref(0)

  const measureBaseWidth = (): number => {
    const svg = viewport.value?.querySelector('svg')
    return svg ? svg.getBoundingClientRect().width : 0
  }

  const zoomIn = () => {
    const base = measureBaseWidth()
    if (base <= 0) return
    zoomWidth.value = Math.round(base * ZOOM_FACTOR)
    zoomed.value = true
  }

  const zoomOut = () => {
    zoomed.value = false
    zoomWidth.value = 0
  }

  const toggleZoom = () => (zoomed.value ? zoomOut() : zoomIn())

  const onResize = () => {
    if (zoomed.value) zoomOut()
  }

  onMounted(() => window.addEventListener('resize', onResize))
  onBeforeUnmount(() => window.removeEventListener('resize', onResize))

  return { zoomed, zoomWidth, zoomOut, toggleZoom }
}
