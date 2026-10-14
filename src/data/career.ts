// Stage 9 — application-facing, typed view of the authoritative career data.
//
// scripts/career-data.mjs stays the single source of truth: the SVG generator
// renders it into the `information` fragments and the exterior sign, and the
// app imports it here for the small amount of information the interface
// actually uses (the LinkedIn destination of the accessible link). No career
// content is transcribed or duplicated — only the consumed field is
// re-exported with an explicit type. Indelve/Pacer content rules still live in
// the source module.
import { IDENTITY as RAW_IDENTITY, type Identity } from '../../scripts/career-data.mjs'

export type { Identity }

/** Verified personal identity (Stage 7). */
export const IDENTITY: Identity = RAW_IDENTITY
