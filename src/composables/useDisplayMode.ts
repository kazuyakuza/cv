// Stage 9 — URL-synchronised display mode.
//
// The `?mode=` query parameter is the only source of truth (the canonical
// contract lives in src/display-mode.ts). This composable mirrors it into a
// reactive ref and re-reads it on browser back/forward. Because no in-page
// control writes the URL, there is no second mode state that can diverge from
// the URL — resolving it is all that is needed.
import { onBeforeUnmount, onMounted, ref, type Ref } from 'vue'
import { resolveMode, type DisplayMode } from '../display-mode'

export function useDisplayMode(): { mode: Ref<DisplayMode> } {
  const mode = ref<DisplayMode>(resolveMode(window.location.search))

  const sync = () => {
    mode.value = resolveMode(window.location.search)
  }

  // Keep a directly edited / shared URL and browser back/forward in sync
  // without a full reload.
  onMounted(() => window.addEventListener('popstate', sync))
  onBeforeUnmount(() => window.removeEventListener('popstate', sync))

  return { mode }
}
