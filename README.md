# Aleem Azhar Portfolio

A personal portfolio built with React, TypeScript, Vite, GSAP, and Lenis. The site is structured as a single polished front-end experience that highlights featured work, systems projects, research, education, and contact links.

## Live Site

GitHub Pages deployment:

https://randomedge999.github.io/Portfolio_website/

## Stack

- React 19
- TypeScript
- Vite
- GSAP + ScrollTrigger
- Lenis
- Lucide React

## Local Development

Install dependencies and start the dev server:

```bash
npm install
npm run dev
```

Vite will print the local URL in the terminal, usually `http://127.0.0.1:5173/` or the next free port.

## Production Build

Create a production build:

```bash
npm run build
```

Preview the built output locally:

```bash
npm run preview
```

## Content and Assets

Most portfolio content is driven from the app source rather than hard-coded HTML.

- `src/App.tsx` controls the main page structure and section flow.
- `src/data/portfolio.ts` contains project data, education entries, navigation, resume links, and social links.
- `src/styles.css` contains the visual system and section styling.
- `scripts/generate-project-visuals.mjs` generates the SVG project marks and object visuals used across the site.

The build runs `generate:visuals` automatically before Vite builds the app.

## Deployment

This repository is configured to deploy through GitHub Actions to GitHub Pages.

- Every push to `main` triggers `.github/workflows/deploy.yml`.
- The workflow installs dependencies with `npm ci`, builds the site, uploads `dist`, and deploys it to GitHub Pages.
- Vite is configured to use the correct GitHub Pages base path during Actions builds.

## Repository Structure

```text
.
├── assets/
├── scripts/
├── src/
├── .github/workflows/
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

## Notes

- The site is designed for GitHub Pages deployment under the repository path, not a root domain build.
- Project visuals and portrait cutouts are bundled as part of the Vite build.
- Resume downloads point to `assets/Muhammad_Aleem_Azhar_CV.pdf`.
