import {
  ArrowUpRight,
  BrainCircuit,
  ChevronLeft,
  ChevronRight,
  Code2,
  FileText,
  Github,
  Linkedin,
  Mail,
  Menu,
  MonitorCog,
  X,
} from "lucide-react";
import { useEffect, useState, type CSSProperties } from "react";
import { education, navigation, projects, resumeLinks, socials } from "./data/portfolio";
import type { PortfolioProject, VisualGroup } from "./types";

const reelProjects = projects;
const AUTO_ADVANCE_MS = 6200;

const groupLabels: Record<VisualGroup, string> = {
  operator: "Product automation",
  agent: "Agent workflow",
  city: "Civic telemetry",
  education: "Institution tooling",
  model: "Applied ML",
  vision: "Vision interface",
  reader: "Reader tooling",
  satellite: "Research ops",
  marketplace: "Marketplace",
  history: "Data story",
  utility: "Developer tooling",
  creative: "Creative product",
  archive: "Archive",
};

const approach = [
  {
    title: "Interface First",
    label: "Product feel",
    icon: <Code2 size={21} />,
    body: "The screen should explain the system: hierarchy, motion, responsive layout, and state that never feels hidden.",
  },
  {
    title: "Human Control",
    label: "AI workflow",
    icon: <BrainCircuit size={21} />,
    body: "Automation is strongest when approvals, traces, confidence, and failure modes are visible before anything important happens.",
  },
  {
    title: "Whole System",
    label: "Build depth",
    icon: <MonitorCog size={21} />,
    body: "I care about the browser, API, database, model, and deployment surface because users feel the gaps between them.",
  },
];

const backgroundNotes = [
  "Computer science student at Rhodes College, graduating 2026.",
  "Work sits between full-stack product engineering, applied ML, and local-first automation.",
  "Most projects are built as operating surfaces: approval flows, dashboards, evaluation loops, and research tools.",
];

function projectMedia(project: PortfolioProject) {
  return project.objectVisual;
}

function groupName(project: PortfolioProject) {
  return groupLabels[project.galleryGroup];
}

function useBodyLock(locked: boolean) {
  useEffect(() => {
    document.documentElement.classList.toggle("is-locked", locked);
    document.body.classList.toggle("is-locked", locked);
    return () => {
      document.documentElement.classList.remove("is-locked");
      document.body.classList.remove("is-locked");
    };
  }, [locked]);
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return reduced;
}

function Chrome({ menuOpen, setMenuOpen }: { menuOpen: boolean; setMenuOpen: (open: boolean) => void }) {
  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen, setMenuOpen]);

  return (
    <>
      <header className="chrome" aria-label="Primary navigation">
        <a className="brand" href="#top" aria-label="Aleem Azhar home">
          <span>AA</span>
          <strong>Aleem Azhar</strong>
        </a>

        <nav className="nav" aria-label="Sections">
          {navigation.map((item) => (
            <a key={item.href} href={item.href}>{item.label}</a>
          ))}
        </nav>

        <div className="chrome-actions">
          <a className="icon-btn" href={resumeLinks[0].href} target="_blank" rel="noreferrer" aria-label="Open resume">
            <FileText size={17} />
          </a>
          <button
            className="icon-btn"
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </header>

      <button
        className={`drawer-shade ${menuOpen ? "is-open" : ""}`}
        type="button"
        aria-label="Close menu"
        aria-hidden={!menuOpen}
        tabIndex={menuOpen ? 0 : -1}
        onClick={() => setMenuOpen(false)}
      />

      <aside className={`drawer ${menuOpen ? "is-open" : ""}`} aria-hidden={!menuOpen}>
        <div className="drawer-top">
          <span>Menu</span>
          <button className="icon-btn" type="button" aria-label="Close menu" onClick={() => setMenuOpen(false)}>
            <X size={18} />
          </button>
        </div>
        <nav className="drawer-nav" aria-label="Mobile sections">
          {navigation.map((item, index) => (
            <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>
              <em>{String(index + 1).padStart(2, "0")}</em>
              {item.label}
            </a>
          ))}
        </nav>
        <div className="drawer-note">
          <span>Focus</span>
          <p>Software engineering, applied ML, and product interfaces built with control and taste.</p>
        </div>
      </aside>
    </>
  );
}

function wrapIndex(index: number, total: number) {
  return (index + total) % total;
}

function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero-copy">
        <p className="eyebrow">Software engineer / applied ML / product interfaces</p>
        <h1>
          <span>Aleem</span>
          <span>Azhar</span>
        </h1>
        <p className="hero-line">
          I design and build interactive software where the interface, the data model, and the AI behavior have to line up.
        </p>
        <div className="hero-actions">
          <a className="primary-link" href="#work">Explore work <ArrowUpRight size={15} /></a>
          <a className="quiet-link" href="#contact">Contact <ArrowUpRight size={14} /></a>
        </div>
      </div>

      <div className="hero-visual" aria-hidden="true">
        <svg className="hero-field" viewBox="0 0 720 620" role="presentation" focusable="false">
          <defs>
            <linearGradient id="heroRibbon" x1="64" x2="660" y1="548" y2="62" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#78d7d0" stopOpacity="0.1" />
              <stop offset="0.38" stopColor="#d8ff2f" stopOpacity="0.72" />
              <stop offset="1" stopColor="#f4b15b" stopOpacity="0.16" />
            </linearGradient>
            <linearGradient id="heroThread" x1="42" x2="690" y1="250" y2="350" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#f5f0e5" stopOpacity="0" />
              <stop offset="0.45" stopColor="#d8ff2f" stopOpacity="0.84" />
              <stop offset="1" stopColor="#78d7d0" stopOpacity="0" />
            </linearGradient>
            <filter id="heroGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="16" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <path className="field-ribbon field-ribbon-back" d="M38 454C126 298 236 242 350 284C462 326 480 158 612 96C676 66 706 76 736 96" />
          <path className="field-ribbon field-ribbon-main" d="M-22 386C90 278 202 244 316 286C434 330 492 244 552 170C596 116 646 86 734 80" />
          <path className="field-ribbon field-ribbon-low" d="M30 536C126 492 198 482 302 506C414 532 474 456 544 382C602 320 664 300 740 326" />

          <g className="field-threads">
            <path d="M22 328C132 264 246 258 358 304C464 348 536 294 690 184" />
            <path d="M84 186C188 160 298 174 406 226C510 276 590 250 704 164" />
            <path d="M54 486C166 448 274 454 374 486C486 522 582 468 702 380" />
            <path d="M142 88C238 132 308 178 404 170C512 162 584 92 710 42" />
          </g>

          <g className="field-contours">
            <path d="M188 426C136 342 158 246 238 194C320 140 438 156 500 232C558 304 536 422 454 480C370 538 244 518 188 426Z" />
            <path d="M248 394C212 336 228 266 284 230C342 192 426 204 470 258C512 312 496 394 436 434C376 474 288 458 248 394Z" />
            <path d="M520 234C486 184 496 122 548 92C604 60 676 82 708 136C738 186 718 254 662 282C610 308 554 284 520 234Z" />
          </g>

          <g className="field-nodes">
            <path d="M150 326l10 6-10 6-10-6z" />
            <path d="M488 214l10 6-10 6-10-6z" />
            <path d="M606 126l10 6-10 6-10-6z" />
            <path d="M382 502l10 6-10 6-10-6z" />
          </g>
        </svg>
      </div>
    </section>
  );
}

function visibleProjects(activeIndex: number) {
  return [-2, -1, 0, 1, 2].map((offset) => {
    const index = wrapIndex(activeIndex + offset, reelProjects.length);
    return { index, offset, project: reelProjects[index] };
  });
}

function Work({ openProject, overlayOpen }: { openProject: (project: PortfolioProject) => void; overlayOpen: boolean }) {
  const reducedMotion = usePrefersReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const activeProject = reelProjects[activeIndex];
  const previousProject = reelProjects[wrapIndex(activeIndex - 1, reelProjects.length)];
  const nextProject = reelProjects[wrapIndex(activeIndex + 1, reelProjects.length)];
  const visible = visibleProjects(activeIndex);
  const goPrevious = () => setActiveIndex((index) => wrapIndex(index - 1, reelProjects.length));
  const goNext = () => setActiveIndex((index) => wrapIndex(index + 1, reelProjects.length));

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const typing = target?.tagName === "INPUT" || target?.tagName === "TEXTAREA" || target?.isContentEditable;
      if (typing || document.querySelector(".overlay") || document.querySelector(".drawer.is-open")) return;
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        setActiveIndex((index) => wrapIndex(index - 1, reelProjects.length));
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        setActiveIndex((index) => wrapIndex(index + 1, reelProjects.length));
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (overlayOpen || reducedMotion) return;
    const timer = window.setTimeout(() => {
      setActiveIndex((index) => wrapIndex(index + 1, reelProjects.length));
    }, AUTO_ADVANCE_MS);
    return () => window.clearTimeout(timer);
  }, [activeIndex, overlayOpen, reducedMotion]);

  useEffect(() => {
    visibleProjects(activeIndex).forEach(({ project }) => {
      const image = new Image();
      image.src = projectMedia(project);
    });
  }, [activeIndex]);

  const reelStyle = {
    "--accent": activeProject.accent,
    "--reel-duration": `${AUTO_ADVANCE_MS}ms`,
  } as CSSProperties;

  return (
    <section className="work" id="work" style={reelStyle}>
      <header className="section-head work-head">
        <span>01 / Work</span>
        <h2>Builds in motion.</h2>
        <p>A focused reel across the full project history: agent tools, automation systems, ML experiments, and product interfaces.</p>
      </header>

      <div className={`work-reel ${overlayOpen || reducedMotion ? "is-paused" : ""}`}>
        <div className="work-visual" aria-hidden="true">
          <img className="work-object work-object-back" src={projectMedia(previousProject)} alt="" loading="lazy" />
          <img key={activeProject.slug} className="work-object work-object-active" src={projectMedia(activeProject)} alt="" loading="eager" />
          <img className="work-object work-object-front" src={projectMedia(nextProject)} alt="" loading="lazy" />
        </div>

        <div className="work-copy" aria-live="polite">
          <span className="work-count">{String(activeIndex + 1).padStart(2, "0")} / {String(reelProjects.length).padStart(2, "0")}</span>
          <span>{groupName(activeProject)} / {activeProject.year}</span>
          <button type="button" onClick={() => openProject(activeProject)} aria-label={`Open ${activeProject.title}`}>
            <strong>{activeProject.title}</strong>
            <ArrowUpRight size={17} />
          </button>
          <p>{activeProject.short}</p>
          <div className="work-stack" aria-label="Project stack">
            {activeProject.stack.slice(0, 4).map((tool) => <span key={tool}>{tool}</span>)}
          </div>
        </div>

        <div className="work-controls" aria-label="Browse projects">
          <button type="button" onClick={goPrevious} aria-label="Previous project">
            <ChevronLeft size={20} />
          </button>
          <span className="work-progress" aria-hidden="true">
            <span key={`${activeProject.slug}-${activeIndex}`} />
          </span>
          <button type="button" onClick={goNext} aria-label="Next project">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="work-strip" aria-label="Project shortcuts">
        {visible.map(({ index, offset, project }) => (
          <button
            key={`${project.slug}-${offset}`}
            className={offset === 0 ? "is-active" : ""}
            type="button"
            onClick={() => setActiveIndex(index)}
            aria-label={`Show ${project.title}`}
          >
            <img src={project.logoMark} alt="" loading="lazy" />
            <span>{project.title}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

function Approach() {
  return (
    <section className="approach" id="approach">
      <header className="section-head section-head-invert">
        <span>02 / Approach</span>
        <h2>Design the system, then the screen.</h2>
        <p>I build around clear hierarchy, visible state, fast interaction, and AI behavior users can inspect.</p>
      </header>

      <div className="approach-grid">
        {approach.map((item, index) => (
          <article key={item.title}>
            <span className="approach-count">{String(index + 1).padStart(2, "0")}</span>
            <div className="approach-icon" aria-hidden="true">{item.icon}</div>
            <em>{item.label}</em>
            <h3>{item.title}</h3>
            <p>{item.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function Background() {
  return (
    <section className="background" id="background">
      <div className="background-copy">
        <span>03 / Background</span>
        <h2>Software depth with product judgment.</h2>
        <ul>
          {backgroundNotes.map((note) => <li key={note}>{note}</li>)}
        </ul>
      </div>

      <div className="education-stack" aria-label="Education">
        {education.map((item) => (
          <article key={item.institution}>
            <img src={item.logo} alt="" />
            <div>
              <strong>{item.institution}</strong>
              <em>{item.period}</em>
              <p>{item.focus}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function iconFor(label: string) {
  const normalized = label.toLowerCase();
  if (normalized.includes("github")) return <Github size={18} />;
  if (normalized.includes("linked")) return <Linkedin size={18} />;
  if (normalized.includes("mail") || normalized.includes("email")) return <Mail size={18} />;
  return <ArrowUpRight size={18} />;
}

function Contact() {
  return (
    <section className="contact" id="contact">
      <div>
        <span>04 / Contact</span>
        <h2>Open to software, ML, and product engineering work.</h2>
      </div>
      <ul>
        {socials.map((social) => (
          <li key={social.label}>
            <a href={social.href} target={social.external ? "_blank" : undefined} rel={social.external ? "noreferrer" : undefined}>
              {iconFor(social.label)}
              <span>{social.label}</span>
              <ArrowUpRight size={18} />
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

function ProjectOverlay({ project, onClose }: { project: PortfolioProject | null; onClose: () => void }) {
  useEffect(() => {
    if (!project) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [project, onClose]);

  if (!project) return null;

  return (
    <div className="overlay" role="dialog" aria-modal="true" aria-label={project.title}>
      <button className="overlay-bg" type="button" aria-label="Close project" onClick={onClose} />
      <article className="sheet" style={{ "--accent": project.accent } as CSSProperties}>
        <button className="sheet-close icon-btn" type="button" aria-label="Close project" onClick={onClose}>
          <X size={18} />
        </button>
        <div className="sheet-media" aria-hidden="true">
          <img src={projectMedia(project)} alt="" />
        </div>
        <div className="sheet-copy">
          <span>{project.year} / {project.statusLabel} / {groupName(project)}</span>
          <h3>{project.title}</h3>
          <p className="sheet-thesis">{project.thesis}</p>
          <p>{project.detailCopy}</p>
          <ul className="proof-points">
            {project.proofPoints.map((point) => <li key={point}>{point}</li>)}
          </ul>
          <div className="stack-list">
            {project.stack.map((tool) => <span key={tool}>{tool}</span>)}
          </div>
          <div className="sheet-actions">
            {project.links.map((link) => (
              <a key={link.href} href={link.href} target={link.external ? "_blank" : undefined} rel={link.external ? "noreferrer" : undefined}>
                {link.label}
                <ArrowUpRight size={14} />
              </a>
            ))}
          </div>
        </div>
      </article>
    </div>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <a href="#top">Aleem Azhar</a>
      <span>Software / ML / Product</span>
      <a href="mailto:aleemazhar14@gmail.com">aleemazhar14@gmail.com</a>
    </footer>
  );
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [overlay, setOverlay] = useState<PortfolioProject | null>(null);

  useBodyLock(menuOpen || Boolean(overlay));

  return (
    <>
      <Chrome menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <main>
        <Hero />
        <Work openProject={setOverlay} overlayOpen={Boolean(overlay)} />
        <Approach />
        <Background />
        <Contact />
      </main>
      <Footer />
      <ProjectOverlay project={overlay} onClose={() => setOverlay(null)} />
    </>
  );
}