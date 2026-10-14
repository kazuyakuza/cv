// Type declarations for scripts/career-data.mjs — the single, authoritative
// information-layer content source (Stage 7). The Node SVG generator and the
// Vue app (via src/data/career.ts, Stage 9) consume the SAME module; this file
// declares only its shapes, never its data, so no content is duplicated.

export interface Identity {
  name: string
  linkedin: string
  photo: string
}

export interface Section {
  role: string | null
  tech: string[]
}

export interface CurrentIdentity {
  primary: string
  secondary: string
  focus: string
}

export const IDENTITY: Identity
export const SECTIONS: Record<string, Section>
export const CURRENT_IDENTITY: CurrentIdentity
