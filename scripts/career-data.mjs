// Stage 7 — information-layer content source (single source of truth).
//
// Professional information is kept OUT of the architectural geometry: this
// module holds the verified career facts, and `generate-geometry.mjs` renders
// them into the dedicated `information` SVG fragment (section role labels +
// technology logo plates) and the projecting sign. Changing a role or a
// technology means editing this file only — no geometry changes. Stage 9 (Vue
// integration) can import the same data.
//
// Content rules (PROJECT_BRIEF.md §9–§16, AGENTS.md core principle 6):
//   - Only verified facts. Roles/technologies come from the brief.
//   - Indelve and Pacer have known dates but unverified role/technology
//     details — they are intentionally absent here until the user supplies
//     them (see the stage spec: do not invent).
//   - No achievements, metrics or certifications.

// Identity used by the exterior projecting sign (PROJECT_BRIEF.md §8).
// `photo` is a master in src/assets/ (served via the __ASSET__ pipeline);
// swap the file and re-run optimize-assets.py to replace the portrait.
export const IDENTITY = {
  name: 'J. E. Barrocal',
  linkedin: 'https://www.linkedin.com/in/jebarrocal/',
  photo: 'photo2_2.jpg',
}

// Per-section role label and technology logos (keys into scripts/tech-logos.mjs).
// `role: null` renders no role text. Placement (floor vs wall, position) is
// geometry and lives in generate-geometry.mjs.
export const SECTIONS = {
  puelo: { role: 'Unity Dev', tech: ['unity', 'csharp'] },
  ba: { role: 'Jr. Developer', tech: ['php', 'mysql', 'jquery'] },
  freelancer: { role: null, tech: ['unity', 'csharp'] },
  nextcode: { role: 'Co-Founder', tech: ['nodedotjs', 'mongodb', 'angular'] },
  health: { role: 'DBA', tech: ['mysql', 'aws', 'salesforce'] },
  interactica2right: { role: 'Dev', tech: ['nestjs', 'mongodb', 'angular'] },
  interactica2left: { role: 'Tech Lead', tech: ['aws', 'aframe', 'unity'] },
  interactica3right: {
    role: 'Software Architect',
    tech: ['flutter', 'postgresql', 'angularMfe', 'microservices'],
  },
  // Pacer (floor 4): no verified role label; the user supplied the technology
  // list (r222). Group A = GitHub Actions / NestJS / PostgreSQL, group B =
  // AWS / Docker / OpenTelemetry (logging & traceability). Placement (two floor
  // rows) is geometry and lives in generate-geometry.mjs.
  pacer: {
    role: 'Software Architect',
    tech: ['githubactions', 'nestjs', 'postgresql', 'aws', 'docker', 'opentelemetry'],
  },
}

// Current professional identity (PROJECT_BRIEF.md §16, §20): placed in the
// upper/main building area on the fifth (current-work) floor's rear wall —
// never on the exterior sign. Verified terms only.
export const CURRENT_IDENTITY = {
  primary: 'Software Architect',
  secondary: 'Technical Lead',
  focus: 'AI-driven development · autonomous coding agents',
}
