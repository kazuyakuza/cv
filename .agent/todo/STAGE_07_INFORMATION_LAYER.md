# Stage 7 — Information Design

## Objective

Implement the professional information layer that turns the existing career diorama into an informative portfolio.

The architecture, company-specific scenes, project representations, and exterior blade sign are already established. This stage must build on that work rather than redesign it.

The information layer must communicate the actual professional trajectory through carefully positioned text and visual information, including roles, technologies, skills, project descriptions, current professional identity, and personal identification on the exterior sign.

The result should remain an illustrated architectural diorama, not become a conventional résumé pasted over a building.

## Status — IMPLEMENTED (2026-10-11, iterating with user review)

First pass reviewed by the user and revised (removed the all-in-one experience
plaques; reworked to per-section role labels + technology logo plates).
Renders `generated/dev/r206.png` (full), `r206-f2left.png`, `r205-sign.png`
(sign). `npm run lint`, `type-check`, `build` clean.

1. **Approach / files.** Content is data-driven from `scripts/career-data.mjs`
   (section roles + identity) and `scripts/tech-logos.mjs` (brand logo paths).
   `generate-geometry.mjs` emits the generated `information` fragment (section
   role labels + floor/wall logo plates + the fifth-floor identity block) and
   the rewritten `projecting-sign`; `assemble-svg.mjs` stacks `information`
   above `tags`; `style.mjs` adds the role/logo/sign/QR classes;
   `optimize-assets.py` also scans `career-data.mjs` for identity assets. A new
   dev-dependency `qrcode` builds the QR at generation time.
2. **Content added.** Per section — role label + tech logos: Puelo Games
   ("Unity Dev"; unity, c#), BA Technology ("Jr. Developer"; php, mysql),
   Freelancer (unity, c#), Nextcode (node.js, mongodb, angular), Health
   Platforms ("DBA" on the left wall; mysql, aws, salesforce), Interactica
   floor 2 right ("Dev" by the elevator; nestjs, mongodb, angular), floor 2
   left ("Tech Lead" on the floor; aws, a-frame, unity), floor 3 right
   ("Soft Arch" on the wall; flutter, postgresql). Current identity block on
   the fifth-floor rear wall.
3. **Omitted (source missing/ambiguous).** No role/technology content for
   Indelve or Pacer (unverified — nothing invented); Nextcode role left for the
   user to place. Logos without a brand mark dropped: AWS DMS, "SQL",
   "angular micro-frontends", "microservices".
4. **Identity assets / QR.** Profile photo `src/assets/photo2_2.jpg` (served as
   `__ASSET__photo2_2.jpg__`, replaceable via `IDENTITY.photo`); name
   "J. E. Barrocal"; QR encodes `https://www.linkedin.com/in/jebarrocal/`
   (ECC-H) with a centered LinkedIn mark and verified byte-for-byte against the
   encoder output; the full URL is printed on the sign. Blade widened 25% and
   the photo-ring fill bug fixed (dedicated `dw-photo-ring` class).
5. **Existing signs/plaques preserved.** `tags.svg`, `elevator.svg` (year
   plaques) and `entrance.svg` (2013 sign) are byte-identical to Stage 6 — no
   duplicate labels, no size changes.
6. **No Stage 8 logic.** No display modes, query parameters, mode-specific
   visibility, or alternate sign sizes were introduced.
7. **Rendered output inspected.** `generated/dev/r206.png` (full),
   `r206-f2left.png`, `r205-sign.png`.

Recorded for review: Freelancer (jul 2013–jul 2018), Nextcode
(may 2017–may 2019) and Health Platforms (jul 2017–ago 2019) periods overlap
concurrently — this is expected, not a conflict; the architectural year plaques
were left unchanged.

## Read First

Before implementation, inspect:

- `.agent/project-info/PROJECT_BRIEF.md`
- `.agent/project-info/IMPLEMENTATION_PLAN.md`
- `AGENTS.md`
- `src/svg/README.md`
- `src/svg/diorama.svg`
- `src/svg/fragments/projecting-sign.svg`
- `src/svg/fragments/tags.svg`
- The completed Stage 6 specification and its verification renders.

Inspect the actual SVG and current project structure before choosing how to implement the information layer. Follow the existing generation and assembly workflow; do not edit generated output in a way that will be lost on regeneration.

## Scope A — Establish the Information Layer

### Separation from architectural geometry

Keep professional information logically separate from the building's structural geometry and decorative objects.

- Prefer a dedicated, clearly organized information layer.
- Use SVG text and groups where they fit the existing standalone-diagram architecture.
- Use HTML/CSS overlays where they provide a clear advantage, provided the current project architecture supports them without prematurely implementing the Vue integration stage.
- Preserve the existing architecture, perspective, floor layout, props, and company-specific scenes.
- Use stable, meaningful IDs for information groups and elements.
- Keep content maintainable: changing a role, date, or technology should not require editing architectural geometry.
- Avoid creating a complex content-management system or introducing unnecessary dependencies.

The implementation should fit the current project architecture and leave the future Vue integration possible.

### Information hierarchy

Use three levels of information:

1. **Primary identification:** company or professional identity.
2. **Secondary identification:** role and period.
3. **Supporting detail:** selected technologies, skills, projects, and concise descriptions.

Not every section needs every type of information at the same visual prominence. Allocate space according to the amount and importance of verified content.

Use concise wording, readable typography, restrained contrast, and visual grouping. Text should appear anchored to the relevant floor or professional scene rather than floating arbitrarily over the building.

## Scope B — Existing Company Signs and Year Plaques

The company-name signs and elevator year plaques already exist in the SVG. Do not recreate them or add duplicate labels.

- Preserve their current wording, locations, and visual treatment.
- Do not increase their size specifically for a screenshot or Overview presentation.
- Do not create hidden duplicates, alternate sizes, or mode-specific visibility rules.
- Avoid displaying the same company name or date redundantly in nearby information elements unless a specific layout requirement justifies it.
- Where the existing signs already communicate the company and period, use the new information layer to add the missing role and supporting details rather than repeating those fields.

If the existing signs need to be referenced by the information layer, use stable IDs or another maintainable association instead of duplicating their content.

## Scope C — Professional Roles and Periods

Add role information to the relevant professional sections, using the project brief and verified source CV/profile information as the authoritative references.

The following are the established career allocations:

| Section | Company / experience |
|---|---|
| Ground floor | Puelo Games |
| Ground floor | BA Technology |
| Ground floor | Freelancer Game Developer |
| First floor | Nextcode |
| First floor | Health Platforms |
| Second and third floors | Interactica |
| Third floor | Indelve |
| Fourth floor | Pacer |
| Fifth floor | Current AI-driven development work |

### Placement

- Associate each role with the correct company area.
- Keep role labels close enough to their corresponding company signs and scenes to establish an unambiguous relationship.
- For Interactica, which spans multiple floors, avoid repeating the complete role and period unnecessarily on every section. Use a clear hierarchy that communicates the continuity across both floors.
- For the ground floor, ensure the three distinct experiences remain distinguishable despite sharing the same architectural level.
- Use the upper portion of the building for the current professional identity, not the exterior sign.

### Content accuracy

- Use verified dates and roles from the project brief or source profile.
- Do not invent role titles, date ranges, achievements, or responsibilities.
- Indelve and Pacer have known date ranges in the project brief, but their detailed role and technology content remains to be verified. Do not infer that content.
- Do not silently resolve conflicting source information. Record discrepancies for review.

## Scope D — Technologies and Skills

Introduce a compact technology/skills layer where it helps explain the work represented by each professional scene.

The goal is not to display every technology from the CV. Select information that improves comprehension of the work and the evolution of the user's responsibilities.

### Selection rules

- Use the project brief and verified source CV/profile as the content source.
- Prefer a small, relevant set of technologies per experience over exhaustive technology lists.
- Avoid duplicating the same technology repeatedly when a single, well-positioned reference can communicate its relevance.
- Distinguish technologies from broader skills and responsibilities where useful.
- Do not add a technology merely because it is popular or visually recognizable.
- Do not introduce logos for technologies whose relevance to the specific experience is not established.
- Do not invent technologies for Indelve or Pacer.
- Current AI-related information should reflect the user's actual workflow and responsibilities, not generic AI marketing language.

### Visual treatment

Choose a consistent but flexible visual vocabulary that fits the diorama. Possible treatments include compact text labels, small technology logos, grouped skill markers, or restrained annotation panels.

Do not assume every technology must use a logo. Use text when a logo would be unclear, too small, stylistically inconsistent, or unnecessarily decorative.

Technology references must be legible at a useful viewing scale without overwhelming the architectural scenes.

## Scope E — Concise Project Descriptions

Add project descriptions selectively where they clarify an important contribution that the existing scene does not communicate on its own.

The strongest candidates are projects or responsibilities that materially explain the professional narrative, rather than every project mentioned in the CV.

Examples already documented in the project brief include:

- **BA Technology:** the Petroplastic engineering-calculation platform, translating complex spreadsheet logic into validated software with detailed calculation traceability.
- **Health Platforms:** database operations, Salesforce data reconciliation, and the MySQL-to-Redshift migration.
- **Nextcode:** the e-commerce platform, including its storefront, administration, product management, and payment integration.
- **Puelo Games / Freelancer Game Developer:** selected 2D/3D game-development work.
- **Interactica:** the progression into architecture and technical leadership, ownership of technical decisions, and responsibility for engineering practices.

These are content candidates, not a requirement to place all of them on the building simultaneously. Inspect the available space and choose a concise representation that fits the relevant scene.

Descriptions should communicate the problem, contribution, or responsibility in a few words. Avoid long paragraphs over the illustration.

Do not invent additional project details, metrics, outcomes, or achievements. Do not create detailed descriptions for Indelve or Pacer until their source information is available.

## Scope F — Current Professional Identity

Add the current professional identity to the upper/main area of the building, associated with the fifth-floor/current-work region.

The project brief identifies:

- **Software Architect**
- **Technical Lead** as a related professional descriptor.

Use these established terms as the starting point. The final arrangement should give the identity sufficient prominence without competing with the building itself or obscuring the unfinished-floor metaphor.

The accompanying description should reflect the documented focus on AI-driven software-development workflows and autonomous coding agents, emphasizing architectural ownership, code quality, and technical decision-making.

Do not place these titles on the exterior sign.

## Scope G — Exterior Blade Sign Content

The existing ground-standing sign was removed in Stage 6 and replaced with a vertical projecting sign. Stage 7 now supplies its actual personal-identification content.

### Required content

The sign must contain:

- A circular profile photograph.
- The user's first and last name.
- A QR code pointing to the user's LinkedIn profile.
- A clear LinkedIn label.

### Implementation requirements

- Inspect the existing `projecting-sign` fragment and reuse its physical casing, mounting, perspective, and placement.
- Replace the current placeholder motif with the actual sign content.
- Preserve the sign's vertical layout and physical integration with the building.
- Keep the photograph circular and appropriately cropped.
- Generate a valid QR code from the verified LinkedIn profile URL. Verify that the encoded destination is correct.
- Ensure the QR code has sufficient contrast, a proper quiet zone, and adequate size to be scanned from a useful display or printed scale.
- Keep the name and LinkedIn label legible.
- Do not add current job titles, company lists, technology lists, or a résumé summary to the sign.
- Do not redesign the sign's physical structure unless a minor adjustment is necessary to accommodate the required content.

### Missing assets or identity data

Do not fabricate the user's name, profile photograph, or LinkedIn URL.

First inspect the repository and available project assets for authoritative existing values. If any required personal asset or value is missing or ambiguous, stop and request it rather than generating a fake identity or QR destination.

## Scope H — Dates and Information Consistency

The year plaques currently exist as part of the architecture. Preserve their visual appearance in this stage.

Use them as the visible temporal anchor for the corresponding experience. If exact month/year ranges are added in the information layer, ensure they agree with the verified career chronology.

Check for:

- Correct company-to-floor mapping.
- Correct role-to-company mapping.
- Correct chronology.
- Consistent spelling and capitalization of company names.
- Consistent technology names.
- No duplicate labels caused by overlap between the existing plaques and the new information layer.

Do not change the architectural year plaques simply to accommodate a future mode.

## Explicitly Out of Scope

- Implementing Detailed and Overview modes or query-parameter handling. This is Stage 8.
- Creating alternate company-sign sizes or hiding/showing elements based on a future mode.
- Building the Vue application integration, mode-selection logic, or final responsive behavior. These belong to later stages.
- Redesigning architectural geometry, company scenes, floor divisions, elevator, stairs, or the exterior sign's physical structure.
- Adding decorative objects simply to create room for text.
- Inventing details for Indelve or Pacer.
- Replacing the existing career narrative with a generic résumé template.
- Adding unsupported metrics, achievements, certifications, or claims.

## Acceptance Criteria

- [ ] The information layer is logically separated from architectural geometry and remains maintainable.
- [ ] Existing company signs and year plaques are preserved without duplicate labels or mode-specific variants.
- [ ] Each defined professional experience has an appropriately positioned role label based on verified information.
- [ ] Technologies and skills are selected for relevance and accuracy rather than exhaustive coverage.
- [ ] Project descriptions are concise, selective, and supported by the project brief or verified source material.
- [ ] Interactica's progression across two floors is communicated without unnecessary duplication.
- [ ] The current Software Architect / Technical Lead identity is placed in the upper/main building area.
- [ ] The exterior sign contains the actual profile photograph, first and last name, valid LinkedIn QR code, and LinkedIn label.
- [ ] The exterior sign does not contain current professional titles.
- [ ] Missing identity data or assets are requested rather than fabricated.
- [ ] No responsibilities, technologies, projects, or achievements have been invented for Indelve or Pacer.
- [ ] Text and supporting visual information remain legible and do not obscure important scenes.
- [ ] No Detailed/Overview mode logic, mode-specific visibility, or alternate company-sign sizes have been implemented.
- [ ] The SVG generation/assembly workflow remains functional, and the resulting information layer is visible in a fresh render.

## Verification

After implementation:

1. Render the complete diorama and inspect it at full-composition scale.
2. Inspect close crops of each floor to check the association between companies, roles, and supporting information.
3. Inspect the exterior sign at a close scale and verify the QR destination.
4. Check that labels do not overlap important scene elements, architectural edges, or each other.
5. Run the repository's relevant lint, type-check, and build commands.
6. Verify that regenerating and assembling the SVG preserves the information layer.

## Completion Report

Report:

1. The information-layer implementation approach and files changed.
2. The roles, technology references, and project descriptions added to each section.
3. Any content that was omitted because its source information was missing or ambiguous.
4. The identity assets used on the exterior sign and the verified QR destination.
5. Confirmation that existing company signs and year plaques were preserved.
6. Confirmation that no Stage 8 mode logic or mode-specific variants were introduced.
7. The rendered output inspected for final verification.
