# Aleem Azhar — Portfolio

A portfolio for Muhammad Aleem Azhar: software engineering, machine-learning research, AI tools, and data products.

Published URL: [randomedge999.github.io/Portfolio_website](https://randomedge999.github.io/Portfolio_website/).

## Design

A black-and-white ASCII environment with character-built display lettering, a moving three-dimensional botanical scene, and four animated project sculptures. The garden turns toward the pointer, leaves sway independently, and pollen characters drift through the composition. Nodes move, a forecast surface ripples, workflow stages turn, and a satellite orbits. Small radial character studies animate the lab rows and experience section.

JetBrains Mono carries the readable prose and interface. Main headings are rendered from printable character cells with a moving light sweep; their source text remains in the document. Navigation and actions briefly decode on entry, focus, and hover. All decorative layers obey the shared pause setting and reduced-motion preference, and suspend work outside the viewport or in hidden tabs.

The page has a finite sequence: identity and artwork, four selected projects, experience and capabilities, a filterable lab, about and recognition, then contact. A disclosed system map provides additional detail about Aleem's approach. Native scrolling, small transitions, and a persistent motion control keep navigation predictable. Reduced-motion preferences produce a complete still composition.

The [design research](docs/design-research.md) records the supplied reference, typography comparison, and implementation rationale. The artwork is original; conceptual project illustrations are labeled and do not represent application screenshots or measured research results.

## Stack

- React 19, TypeScript, and Vite 7
- Locally served Space Grotesk and JetBrains Mono
- Custom canvas character rendering and CSS transitions
- Lucide icons
- Playwright and Axe for browser and accessibility checks
- GitHub Actions and GitHub Pages for static deployment

## Local development

Use Node.js 22.12 or a compatible newer version and install from the lockfile:

```bash
npm ci
npm run dev
```

The development URL is `http://127.0.0.1:5173/` by default.

```bash
npm run build
npm run preview
```

The build runs TypeScript checks and emits the production site into `dist`. Preview serves the compiled output, normally at `http://127.0.0.1:4173/`.

## Verification

```bash
npm run verify
```

This runs the production build and browser suite. The stages can also run separately:

```bash
npm run build
npm run test:e2e
```

The [verification report](docs/verification.md) records the final build, browser, production-hosting, and screenshot evidence.

Local browser tests use installed Google Chrome. CI installs Playwright Chromium and uses it automatically. The suite starts its own development server on port 4174 and checks desktop/mobile navigation, case history and focus restoration, filters, mobile-menu controls, malformed URLs, narrow-screen overflow, actual animation pause/resume, saved motion preferences, reduced motion, and serious/critical Axe findings. Screenshot review is also needed to judge the character art and composition; automated checks do not establish visual quality.

## Static routes and GitHub Pages

Full case stories use query parameters so direct links work on static hosting:

- `?case=agentwarehouse`
- `?case=rgan-research`
- `?case=findmyjob`
- `?case=rhok-sat`

The application preserves browser history, the previous home position, and keyboard focus when moving between cases and the homepage. Unknown case identifiers display a recovery page.

The workflow in `.github/workflows/deploy.yml` runs on pushes to `main` or manual dispatch. It installs dependencies and Chromium, runs browser/accessibility checks, builds, uploads `dist`, and deploys the Pages artifact.

`vite.config.ts` chooses the base path as follows:

| Environment | Base path |
| --- | --- |
| Local development or CI browser-test server | `/` |
| GitHub Actions production build for a repository site | `/<repository-name>/` |
| GitHub Actions production build for `<owner>.github.io` | `/` |
| Explicit `VITE_BASE_PATH` | The supplied path, normalized with leading/trailing slashes |

`VITE_BASE_PATH` can be supplied through the environment or a Vite `.env` file. For a local check of this repository's production path, set the same value for both build and preview. In PowerShell:

```powershell
$env:VITE_BASE_PATH = '/Portfolio_website/'
npm run build
npm run preview
```

Then open `http://127.0.0.1:4173/Portfolio_website/`. Use `VITE_BASE_PATH=/` for a root deployment such as a custom domain, and update canonical, social, robots, and sitemap URLs when the public hostname changes. Clear the local override when returning to ordinary root development.

## Files

- `src/data/site.ts` — curated public facts, projects, experience, capabilities, recognition, and links.
- `src/App.tsx` — homepage, case stories, navigation, filters, and motion controls.
- `src/components/AsciiGarden.tsx` — animated, pointer-responsive botanical artwork.
- `src/components/AsciiText.tsx`, `AsciiSignal.tsx`, and `ScrambleText.tsx` — character typography, radial studies, ambient fields, and decoding interactions.
- `src/components/AsciiMotion.tsx` — shared animation controls, visibility suspension, and bounded rendering.
- `src/components/ProjectVisual.tsx` — four animated conceptual project sculptures.
- `src/components/SystemMap.tsx` — disclosed interactive approach diagram.
- `src/styles.css` — monochrome layout, typography, motion, responsive rules, and focus treatment.
- `tests/portfolio.spec.ts` — browser and accessibility coverage.
- `public/og-image.png`, `public/favicon.svg`, `public/robots.txt`, and `public/sitemap.xml` — public metadata assets.

## Content and privacy

The curated data retains real project maturity: research, beta, release candidate, and internship labels are intentional. Public copy must remain grounded in source material and must not invent product adoption, measured gains, or production deployment.

The master career databank and legacy resume/profile PDFs are private editorial sources. They are ignored by Git, are not imported by the application, and must stay outside `src`, `public`, and the production bundle. Publish only the curated contact information already in `src/data/site.ts`; do not expose private addresses, internal application material, or confidential operational data.
