# Aleem Azhar — Portfolio

An evidence-first portfolio for Muhammad Aleem Azhar, focused on inspectable AI systems, machine-learning research, developer tools, and full-stack data products.

Live site: https://randomedge999.github.io/Portfolio_website/

## Design direction

The site uses an editorial, systems-oriented visual language: warm paper, near-black ink, signal orange, cobalt data accents, hard rules, and code-native diagrams. It deliberately avoids faux product screenshots, glass effects, mesh gradients, autoplay carousels, and decorative motion that obscures the work.

The homepage includes:

- A semantic four-layer system map
- Four flagship case studies with explicit maturity and constraints
- A compact experience record
- Evidence-backed capability groups
- A filterable project lab
- An editorial portrait and recognition section
- A direct contact close

Each flagship case is addressable through a durable query URL such as `?case=agentwarehouse`, which remains compatible with GitHub Pages static hosting and browser history.

In the hero system map, the orange path represents human control flowing through the interface, data, model, and approval layers. The blue branch represents system state moving back toward the operator. Both paths are labeled in the interface and collapse to a compact legend on mobile.

## Stack

- React 19 and TypeScript
- Vite 7
- Local Manrope Variable and Instrument Serif font files
- Lucide icons
- Native CSS animation with reduced-motion support
- Playwright and Axe for browser/accessibility verification

## Local development

```bash
npm install
npm run dev
```

Vite serves the project on `http://127.0.0.1:5173/` by default.

## Verification

Run the complete production and browser gate with:

```bash
npm run verify
```

Or run the stages separately:

```bash
npm run build
npm run test:e2e
npm run preview
```

The browser suite checks desktop and mobile layouts, horizontal overflow, query-based case navigation, browser-back restoration, lab filters, reduced-motion behavior, and serious/critical Axe violations.

## Project structure

- `src/data/site.ts` contains the public, curated content model.
- `src/App.tsx` renders the homepage and query-addressable case files.
- `src/components/SystemMap.tsx` renders the semantic hero diagram.
- `src/components/ProjectVisual.tsx` renders clearly labeled code-native system illustrations.
- `src/styles.css` contains the full visual, motion, responsive, and accessibility system.
- `tests/portfolio.spec.ts` contains the end-to-end and accessibility checks.
- `public/og-image.png` and `public/favicon.svg` provide social and browser metadata assets.

## Content and privacy policy

The master profile databank is an editorial source only. It is ignored by Git, is never imported by the application, and must not be copied into `public`, `src`, or the production bundle. Public copy should use only defensible claims and must not expose private contact details, addresses, internal application material, or confidential work data.

Legacy resume/profile PDFs are retained only as ignored local source files. They are not tracked by the current tree, imported by the application, or emitted into the production bundle.

Generated or conceptual diagrams are labeled as illustrations. They are not presented as real application screenshots. Future product recordings should use actual interfaces with synthetic or redacted data.

## Deployment

GitHub Pages deployment runs through `.github/workflows/deploy.yml`. The workflow installs dependencies, runs the desktop/mobile browser and accessibility gate, builds the Vite application, uploads `dist`, and deploys it with the repository base path configured in `vite.config.ts`.
