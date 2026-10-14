// Stage 8 — canonical display-mode contract (single source of truth).
//
// The diorama has exactly two presentation states, selected by ONE query
// parameter. This module is the only place that defines the parameter name,
// the supported values and the fallback; Stage 9 (Vue integration / routing)
// must import this rather than re-implementing the rules.
//
//   - Default (no parameter):        detailed
//   - `?mode=overview`:              overview
//   - `?mode=detailed`:              detailed
//   - empty / unknown value:         detailed
//
// Matching is case-insensitive and whitespace-trimmed. There are deliberately
// no secondary flags: a single value decides the mode so two inputs can never
// disagree.

export type DisplayMode = 'detailed' | 'overview'

/** The single query parameter that selects a mode. */
export const MODE_PARAM = 'mode'

/** Class carried by the root <svg> for each mode (see scripts/style.mjs). */
export const MODE_CLASS: Record<DisplayMode, string> = {
  detailed: 'dw-mode-detailed',
  overview: 'dw-mode-overview',
}

/**
 * Resolve the display mode from a URL search string (e.g. `location.search`).
 * Unknown, empty or missing values fall back to `detailed`.
 */
export function resolveMode(search: string): DisplayMode {
  const value = new URLSearchParams(search).get(MODE_PARAM)?.trim().toLowerCase()
  return value === 'overview' ? 'overview' : 'detailed'
}
