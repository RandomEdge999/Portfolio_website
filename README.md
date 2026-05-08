# Aleem Azhar Portfolio

Personal portfolio for Muhammad Aleem Azhar: software engineering, applied ML, and product work presented as a fast, focused web experience.

## Live Site

https://randomedge999.github.io/Portfolio_website/

## Stack

- React 19
- TypeScript
- Vite
- Lucide React
- Generated SVG project marks and object visuals

## Local Development

```bash
npm install
npm run dev
```

Vite prints the local URL, usually `http://127.0.0.1:5173/`.

## Production Build

```bash
npm run build
npm run preview
```

The build regenerates project visuals before compiling the site.

## Content Model

Portfolio content is data-driven:

- [src/data/portfolio.ts](src/data/portfolio.ts) stores projects, project media, education, navigation, resume links, and social links.
- [src/App.tsx](src/App.tsx) renders the hero, selected work, approach, background, contact, and project overlay.
- [src/styles.css](src/styles.css) contains the visual system and responsive layouts.
- [scripts/generate-project-visuals.mjs](scripts/generate-project-visuals.mjs) generates the project marks and supporting object visuals.

The main page intentionally promotes only a few representative projects, while the data file still keeps the broader project history available for future sections or overlays.

## Verification

Before publishing changes:

```bash
npm run build
npm run preview
```

Then check desktop, tablet, and phone widths for:

- Hero readability and first-viewport composition
- Selected work rows and project overlay behavior
- Approach and background sections without repeated project inventory
- Menu open/close and Escape close behavior
- Resume, social, GitHub, and live-project links

## Deployment

GitHub Pages deployment runs through [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml). The workflow installs dependencies, builds the Vite app, uploads `dist`, and deploys to Pages with the correct repository base path.