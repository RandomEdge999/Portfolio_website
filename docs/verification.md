# Portfolio verification

Validated September 5, 2026, Asia/Karachi. The final design uses a black background, animated three-dimensional botanical and project artwork, character-built display lettering, a moving character field, and monospace interface text.

## Build and browser checks

| Check | Result |
| --- | --- |
| `npm run verify` | TypeScript, production build, and 34 desktop/mobile browser tests passed; the suite completed in approximately 1.2 minutes. |
| Animation behavior | Actual garden, heading, background, lab, and project canvas changes were checked. Every project scene moves and freezes correctly; saved preferences and initial/live reduced motion are honored. |
| Navigation | Case URLs, next/back traversal, restored keyboard focus, home sections, mobile menu, filters, malformed hashes, and unknown-case recovery passed. |
| Responsive checks | Home and case views stayed within 320px and 768px viewports; desktop/mobile profiles also passed. |
| Automated accessibility | No serious or critical Axe findings on the tested homepage and RGAN case in either device profile. |
| Dependency audit | `npm audit` reported zero vulnerabilities, including development dependencies. |
| Patch hygiene | `git diff --check` passed. |

The regression suite ran after the living-ASCII revision, including the optimized project geometry and responsive layout fix. Final caption alignment and the matching social image were verified in the subsequent production build and browser captures.

A normal `npm run build` also passed after those final changes. The social image emitted into `dist` has the same SHA-256 as `public/og-image.png`.

## Final production-prefix smoke

The production artifact was rebuilt with `VITE_BASE_PATH=/Portfolio_website/` into `node_modules/.cache/pages-preview` and served through Vite preview on an isolated local port. TypeScript and Vite completed successfully.

- **13 static resources returned HTTP 200 and matched their built files byte for byte:** HTML, JavaScript, CSS, five font files, portrait, favicon, social image, robots, and sitemap.
- Desktop 1440×900 and mobile 390×844 loaded Space Grotesk Variable and JetBrains Mono.
- All four direct case URLs returned the correct page and title beneath `/Portfolio_website/`.
- Next case, back to work, focus restoration, contact, back to top, and unknown-case recovery preserved the repository prefix.
- No JavaScript runtime errors, HTTP error responses, or failed application requests occurred. The final run also completed without canceled favicon requests.
- The final 1200×630 social image is 134,985 bytes. Its SHA-256 is `2cdf76236ed45ea0613b565b05c24f50bb2ba49d7bd95c78c61968f5a691e616`.

The temporary preview server was stopped and port 4180 was confirmed closed. No remote publication or push was performed as part of these checks.

The detailed local resource manifest, hashes, and browser results are in `node_modules/.cache/pages-production-smoke-report.json`; the temporary harness is `node_modules/.cache/pages-production-smoke.mjs`. Both are ignored QA artifacts.

## Screenshot evidence

Screenshots were captured from the final production artifact with reduced motion for a stable frame. The portrait was scrolled into view and confirmed loaded before returning to the top for full-page capture. PNG dimensions use CSS pixels, including the actual 390px mobile width.

| Screenshot | Dimensions |
| --- | --- |
| [Desktop homepage](../artifacts/portfolio-desktop.png) | 1440×900 |
| [Desktop full page](../artifacts/portfolio-desktop-full.png) | 1440×6132 |
| [Mobile homepage](../artifacts/portfolio-mobile.png) | 390×844 |
| [Mobile full page](../artifacts/portfolio-mobile-full.png) | 390×8295 |
| [AgentWarehouse case](../artifacts/portfolio-case.png) | 1440×900 |

Visual review covered the mobile introduction, case composition, desktop page sequence, and corrected social-image scale. Automated checks establish the tested behavior; they do not replace visual judgment or manual assistive-technology testing.


## Motion and performance evidence

The final custom renderers are frame-rate limited and stop when offscreen, paused, or in a hidden document. A local Chrome benchmark of the complete project rendering call at 640×283 CSS pixels, using 12 measured frames after warmup, recorded approximately 4.1 ms for nodes, 8.2 ms for the forecast surface, 2.8 ms for workflow stages, and 5.6 ms for telemetry. These are measurements on this computer, not a universal device-performance guarantee. The forecast renderer previously averaged 23.7 ms in the same probe. Analytical surface normals and scale-aware sampling reduced that work while keeping the character field filled.

The motion recording is [artifacts/ascii-motion.webm](../artifacts/ascii-motion.webm). It shows the live hero, project scenes, and lab at 1440×900 with motion enabled. Additional live screenshots cover desktop, mobile, tablet, work, and lab; production full-page captures use reduced motion for a stable frame.

The repository browser suite has four additional scenarios in `tests/ascii-motion.spec.ts`, run under both device profiles: character headings/background pause and resume; all four moving project scenes; populated animated lab rows with aligned columns; and readable still artwork under reduced motion.
