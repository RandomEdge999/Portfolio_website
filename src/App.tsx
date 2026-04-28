import {
  ArrowUpRight,
  FileText,
  Github,
  Linkedin,
  Mail,
  Menu,
  Twitter,
  X,
} from "lucide-react";
import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import {
  education,
  navigation,
  projects,
  resumeLinks,
  siteHeroAsset,
  siteImagery,
  socials,
} from "./data/portfolio";
import type { PortfolioProject } from "./types";

gsap.registerPlugin(ScrollTrigger);

const featuredProjects = projects.filter((p) => p.tier === "featured");
const systemsProjects = projects.filter((p) => p.tier !== "archive");
const archiveProjects = projects.filter((p) => p.tier === "archive");

// Bucket featured projects into BUILDING / RESEARCHING for the category split.
const buildSlugs = new Set(["findmyjob", "agentwarehouse", "agentclassroom", "rhokpy"]);
const buildProjects = featuredProjects.filter((p) => buildSlugs.has(p.slug));
const researchProjects = featuredProjects.filter((p) => !buildSlugs.has(p.slug));

const heroQuote =
  "It doesn’t matter where you start — it’s how you progress from there.";

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const q = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(q.matches);
    update();
    q.addEventListener("change", update);
    return () => q.removeEventListener("change", update);
  }, []);
  return reduced;
}

/* ------------------------------------------------------------------ Lenis */

function useLenis(reducedMotion: boolean) {
  useEffect(() => {
    if (reducedMotion) return;
    const lenis = new Lenis({
      duration: 0.9,
      easing: (t: number) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
    });
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    lenis.on("scroll", ScrollTrigger.update);
    ScrollTrigger.refresh();
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, [reducedMotion]);
}

/* ------------------------------------------------------------------ Loader */

function EntryLoader({ ready }: { ready: boolean }) {
  return (
    <div className={`entry-loader ${ready ? "is-hidden" : ""}`} aria-hidden={ready}>
      <span className="entry-mark">AA</span>
      <span className="entry-label">LOAD ALEEM</span>
      <span className="entry-bar" />
    </div>
  );
}

/* ------------------------------------------------------------------ Chrome */

function FixedChrome({
  menuOpen,
  setMenuOpen,
  openProject,
}: {
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
  openProject: (project: PortfolioProject) => void;
}) {
  useEffect(() => {
    document.body.classList.toggle("menu-is-open", menuOpen);
    return () => document.body.classList.remove("menu-is-open");
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen, setMenuOpen]);

  return (
    <>
      <header className="chrome" aria-label="Primary">
        <a className="chrome-brand" href="#top">
          <span>Aleem</span>
          <span>Azhar</span>
        </a>
        <a className="chrome-mark" href="#top" aria-label="Home">AA</a>
        <div className="chrome-actions">
          <a className="chrome-cta" href={resumeLinks[0].href} target="_blank" rel="noreferrer">
            <FileText size={13} />
            <span>Resume</span>
          </a>
          <button
            className="chrome-menu"
            type="button"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </header>

      <button
        className={`drawer-backdrop ${menuOpen ? "is-open" : ""}`}
        type="button"
        aria-label="Close menu"
        tabIndex={menuOpen ? 0 : -1}
        onClick={() => setMenuOpen(false)}
      />

      <aside className={`drawer ${menuOpen ? "is-open" : ""}`} aria-hidden={!menuOpen}>
        <div className="drawer-top">
          <span>AA / Index</span>
          <button
            className="drawer-close"
            type="button"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
          >
            <X size={16} />
          </button>
        </div>
        <nav className="drawer-nav" aria-label="Sections">
          {navigation.map((item, i) => (
            <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>
              <em>{String(i + 1).padStart(2, "0")}</em>
              <span>{item.label}</span>
            </a>
          ))}
        </nav>
        <div className="drawer-projects">
          <span className="drawer-label">Featured</span>
          <ul>
            {featuredProjects.map((p) => (
              <li key={p.slug}>
                <button
                  type="button"
                  onClick={() => {
                    openProject(p);
                    setMenuOpen(false);
                  }}
                >
                  <em>{p.year}</em>
                  <strong>{p.title}</strong>
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="drawer-foot">
          <a className="drawer-resume" href={resumeLinks[0].href} target="_blank" rel="noreferrer">
            <FileText size={14} />
            <span>View resume (PDF)</span>
            <ArrowUpRight size={14} />
          </a>
          <a className="drawer-mail" href="mailto:aleemazhar14@gmail.com">aleemazhar14@gmail.com</a>
        </div>
      </aside>
    </>
  );
}

/* -------------------------------------------------------------------- Hero */

function HeroScene({ openProject }: { openProject: (p: PortfolioProject) => void }) {
  const top = featuredProjects[0];
  const selectedSlugs = ["findmyjob", "agentclassroom", "rhok-sat"];
  const selectedProjects = selectedSlugs
    .map((s) => featuredProjects.find((p) => p.slug === s))
    .filter((p): p is PortfolioProject => Boolean(p));
  return (
    <section className="hero" id="top">
      <div className="hero-grid" aria-hidden="true" />
      <div className="hero-eyebrow">
        <span>Portfolio / 2026</span>
        <span>Memphis · Seoul · Remote</span>
      </div>

      <div className="hero-stage">
        <div className="hero-left">
          <h1 className="hero-name">
            <span>Aleem</span>
            <span>Azhar</span>
          </h1>

          <h2 className="hero-subhead">
            <span>2026</span>
            <span>Software · ML · Product Engineer</span>
          </h2>

          <button
            className="hero-widget"
            type="button"
            onClick={() => openProject(top)}
            aria-label={`Currently building: ${top.title}`}
          >
            <span>Currently building</span>
            <strong>{top.title}</strong>
            <em>
              {top.statusLabel}
              <ArrowUpRight size={12} />
            </em>
          </button>
        </div>

        <aside className="hero-side" aria-label="Selected work">
          <div className="hero-portrait">
            <img src={siteHeroAsset} alt="Aleem Azhar" loading="eager" />
          </div>
          <ul className="hero-selected">
            <li className="hero-selected-head">
              <span>Selected work</span>
              <span>2024 — 2026</span>
            </li>
            {selectedProjects.map((p) => (
              <li key={p.slug}>
                <button type="button" onClick={() => openProject(p)}>
                  <span className="hero-selected-title">{p.title}</span>
                  <span className="hero-selected-year">{p.year}</span>
                </button>
              </li>
            ))}
          </ul>
        </aside>
      </div>

      <div className="hero-foot">
        <span className="hero-foot-left">CS @ Rhodes College / Memphis, TN</span>
        <a className="hero-foot-cta" href="#work">
          Scroll to work
          <i />
        </a>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------- Tagline strip */

function TaglineStrip() {
  const phrases = [
    "building since 2020",
    "local-first ai & product systems",
    "aleem azhar",
    "memphis · seoul · remote",
  ];
  // Repeat enough times so the track always exceeds 2× viewport width — the
  // animation translates by exactly -50% so the second half is identical to
  // the first, producing a seamless loop with zero visible seam.
  const half = Array.from({ length: 4 }, () => phrases).flat();
  const items = [...half, ...half];
  return (
    <section className="tagline" aria-label="Tagline">
      <div className="tagline-track">
        {items.map((phrase, i) => (
          <span className="tagline-cell" key={i}>
            <span>{phrase}</span>
            <em aria-hidden="true">✦</em>
          </span>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------- Horizontal pinned gallery */

type GallerySlide =
  | { kind: "project"; project: PortfolioProject; index: number; total: number }
  | { kind: "quote"; index: number; total: number };

function HorizontalProjects({
  openProject,
  reducedMotion,
}: {
  openProject: (p: PortfolioProject) => void;
  reducedMotion: boolean;
}) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);

  const slides: GallerySlide[] = useMemo(() => {
    const arr: GallerySlide[] = [];
    const total = featuredProjects.length + 1;
    featuredProjects.forEach((p, i) => {
      arr.push({ kind: "project", project: p, index: i, total });
      // Inject a quote slide after the third project, like Lando's interspersed quote.
      if (i === 2) arr.push({ kind: "quote", index: i + 1, total });
    });
    return arr;
  }, []);

  useLayoutEffect(() => {
    if (reducedMotion) return;
    const wrap = wrapRef.current;
    const track = trackRef.current;
    if (!wrap || !track) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.matchMedia({
        "(min-width: 861px)": () => {
          const tween = gsap.to(track, {
            x: () => -(track.scrollWidth - window.innerWidth),
            ease: "none",
            scrollTrigger: {
              trigger: wrap,
              start: "top top",
              end: () => "+=" + (track.scrollWidth - window.innerWidth),
              pin: true,
              scrub: 0.6,
              invalidateOnRefresh: true,
              anticipatePin: 1,
            },
          });
          return () => tween.kill();
        },
      });
    }, wrap);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section className="hp" id="work" ref={wrapRef} aria-label="Selected work">
      <div className="hp-head">
        <span>01</span>
        <h2>Selected Work</h2>
      </div>
      <div className="hp-track" ref={trackRef}>
        {slides.map((slide, i) => {
          if (slide.kind === "quote") {
            return (
              <div className="hp-slide hp-slide-quote" key={`quote-${i}`}>
                <p>{heroQuote}</p>
                <span>— Aleem Azhar</span>
              </div>
            );
          }
          const p = slide.project;
          return (
            <button
              className="hp-slide hp-slide-project"
              key={p.slug}
              type="button"
              onClick={() => openProject(p)}
              style={{ "--accent": p.accent } as CSSProperties}
              aria-label={`Open ${p.title}`}
            >
              <span className="hp-index">
                {String(slide.index + 1).padStart(2, "0")}
                <em>/{String(slide.total).padStart(2, "0")}</em>
              </span>
              <div className="hp-art" aria-hidden="true">
                <img src={p.objectVisual} alt="" />
              </div>
              <div className="hp-cap">
                <strong>{p.title}</strong>
                <span>{p.year}</span>
              </div>
              <div className="hp-meta">
                <em>{p.eyebrow}</em>
                <p>{p.short}</p>
                <i>
                  Open <ArrowUpRight size={12} />
                </i>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}

/* ----------------------------------------------------- Category split panel */

function CategoryColumn({
  label,
  caption,
  items,
  openProject,
}: {
  label: string;
  caption: string;
  items: PortfolioProject[];
  openProject: (p: PortfolioProject) => void;
}) {
  return (
    <div className="csplit-col">
      <h3 className="csplit-title">
        {label.split(" ").map((w, i) => (
          <span key={i}>{w}</span>
        ))}
      </h3>
      <p className="csplit-caption">{caption}</p>
      <ul className="csplit-list">
        {items.map((p) => (
          <li key={p.slug}>
            <button type="button" onClick={() => openProject(p)}>
              <img src={p.logoMark} alt="" />
              <strong>{p.title}</strong>
              <em>{p.year}</em>
              <ArrowUpRight size={14} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function CategorySplit({ openProject }: { openProject: (p: PortfolioProject) => void }) {
  return (
    <section className="csplit" id="categories">
      <CategoryColumn
        label="Building"
        caption="Local-first products, agent runtimes, and operator tools that ship."
        items={buildProjects}
        openProject={openProject}
      />
      <CategoryColumn
        label="Researching"
        caption="Models, satellites, urban data, and experiments still in the lab."
        items={researchProjects}
        openProject={openProject}
      />
    </section>
  );
}

/* --------------------------------------------------------- Hall of Fame grid */

function ProjectsHallOfFame({
  openProject,
}: {
  openProject: (p: PortfolioProject) => void;
}) {
  return (
    <section className="hof" id="systems">
      <div className="hof-head">
        <span>02</span>
        <h2>
          <span>Projects</span>
          <span>Hall of Fame</span>
        </h2>
        <p>
          From local AI tools and agent runtimes to research platforms and product prototypes —
          every system, archived or shipping.
        </p>
      </div>

      <div className="hof-grid">
        {systemsProjects.map((p) => {
          const portrait = siteImagery[p.slug];
          return (
            <button
              key={p.slug}
              className={`hof-card hof-card-${p.tier}${portrait ? " hof-card-portrait" : ""}`}
              type="button"
              onClick={() => openProject(p)}
              style={{ "--accent": p.accent } as CSSProperties}
            >
              <div className="hof-art">
                <img className="hof-mark" src={p.logoMark} alt="" />
                <img
                  className="hof-object"
                  src={portrait ?? p.objectVisual}
                  alt=""
                />
              </div>
              <div className="hof-meta">
                <strong>{p.title}</strong>
                <em>{p.year}</em>
              </div>
            </button>
          );
        })}
      </div>

      {archiveProjects.length > 0 && (
        <div className="hof-archive">
          <span>Archive</span>
          <div>
            {archiveProjects.map((p) => (
              <button key={p.slug} type="button" onClick={() => openProject(p)}>
                <img src={p.logoMark} alt="" />
                <em>{p.title}</em>
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

/* ------------------------------------------------------------- Milestone CTA */

function MilestoneCTA() {
  return (
    <section className="cta" id="milestone">
      <div className="cta-eyebrow">
        <span>03 — Recognition</span>
      </div>
      <h2 className="cta-title">
        <span>Rhodes College</span>
        <span>Computer Science 2026</span>
      </h2>
      <p className="cta-body">
        Graduating with a Computer Science degree from Rhodes College after a study-abroad term in
        Computer Vision &amp; AI Systems at Yonsei University. Open to full-time roles in software,
        ML, and product engineering.
      </p>
      <a className="cta-btn" href={resumeLinks[0].href} target="_blank" rel="noreferrer">
        View resume
        <ArrowUpRight size={14} />
      </a>
    </section>
  );
}

/* --------------------------------------------------------------- Tools wall */

function ToolsWall() {
  const tools = useMemo(() => {
    const counts = new Map<string, number>();
    projects.forEach((p) => p.stack.forEach((s) => counts.set(s, (counts.get(s) ?? 0) + 1)));
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 18)
      .map(([name]) => name);
  }, []);

  return (
    <section className="tools" id="tools">
      <div className="tools-head">
        <span>04</span>
        <h2>
          <span>Tools</span>
          <span>&amp; Affiliations</span>
        </h2>
        <p>The stack and institutions behind the work.</p>
      </div>

      <ul className="tools-grid">
        {tools.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>

      <div className="tools-affiliations">
        {education.map((e) => (
          <div key={e.institution} className="tools-aff">
            <img src={e.logo} alt="" />
            <div>
              <strong>{e.institution}</strong>
              <em>{e.period}</em>
              <span>{e.location}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------- Socials strip */

function iconFor(label: string) {
  const l = label.toLowerCase();
  if (l.includes("github")) return <Github size={16} />;
  if (l.includes("linked")) return <Linkedin size={16} />;
  if (l.includes("twitter") || l === "x") return <Twitter size={16} />;
  if (l.includes("mail") || l.includes("email")) return <Mail size={16} />;
  return <ArrowUpRight size={16} />;
}

function SocialsStrip() {
  return (
    <section className="socials" id="contact">
      <div className="socials-head">
        <span>05</span>
        <h2>
          <span>What’s New</span>
          <span>On Socials</span>
        </h2>
      </div>
      <ul className="socials-list">
        {socials.map((s) => (
          <li key={s.label}>
            <a
              href={s.href}
              target={s.external ? "_blank" : undefined}
              rel={s.external ? "noreferrer" : undefined}
            >
              {iconFor(s.label)}
              <span>{s.label}</span>
              <ArrowUpRight size={18} />
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* -------------------------------------------------------------------- Footer */

function FooterAlwaysBuilding() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="footer-inner">
        <h2 className="footer-title">
          <span>Always</span>
          <span>Building.</span>
        </h2>
        <div className="footer-grid">
          <div>
            <span>Pages</span>
            {navigation.map((n) => (
              <a key={n.href} href={n.href}>{n.label}</a>
            ))}
          </div>
          <div>
            <span>Follow</span>
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target={s.external ? "_blank" : undefined}
                rel={s.external ? "noreferrer" : undefined}
              >
                {s.label}
              </a>
            ))}
          </div>
          <div>
            <span>Resume</span>
            <a href={resumeLinks[0].href} target="_blank" rel="noreferrer">
              {resumeLinks[0].label}
            </a>
          </div>
          <div className="footer-cta">
            <span>Business enquiries</span>
            <a href="mailto:aleemazhar14@gmail.com">aleemazhar14@gmail.com</a>
          </div>
        </div>
        <div className="footer-bottom">
          <strong>AA</strong>
          <span>© {year} Muhammad Aleem Azhar. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------- Project sheet */

function ProjectOverlay({
  project,
  onClose,
}: {
  project: PortfolioProject | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!project) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [project, onClose]);

  if (!project) return null;
  return (
    <div className="overlay" role="dialog" aria-modal="true" aria-label={project.title}>
      <button className="overlay-back" type="button" aria-label="Close" onClick={onClose} />
      <article className="overlay-sheet" style={{ "--accent": project.accent } as CSSProperties}>
        <button className="overlay-close" type="button" aria-label="Close" onClick={onClose}>
          <X size={16} />
        </button>
        <div className="overlay-art">
          <img src={project.objectVisual} alt="" />
        </div>
        <div className="overlay-copy">
          <span className="overlay-eyebrow">
            {project.year} — {project.statusLabel} — {project.eyebrow}
          </span>
          <h3>{project.title}</h3>
          <p>{project.detailCopy}</p>
          {project.proofPoints.length > 0 && (
            <ul className="overlay-points">
              {project.proofPoints.map((pt) => (
                <li key={pt}>{pt}</li>
              ))}
            </ul>
          )}
          <div className="overlay-stack">
            {project.stack.map((t) => (
              <span key={t}>{t}</span>
            ))}
          </div>
          <div className="overlay-actions">
            {project.links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                target={l.external ? "_blank" : undefined}
                rel={l.external ? "noreferrer" : undefined}
              >
                {l.label}
                <ArrowUpRight size={14} />
              </a>
            ))}
          </div>
        </div>
      </article>
    </div>
  );
}

/* ----------------------------------------------------------------------- App */

export default function App() {
  const reducedMotion = useReducedMotion();
  const [loaded, setLoaded] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [overlay, setOverlay] = useState<PortfolioProject | null>(null);

  useLenis(reducedMotion);

  useEffect(() => {
    const t = window.setTimeout(() => setLoaded(true), reducedMotion ? 100 : 900);
    return () => window.clearTimeout(t);
  }, [reducedMotion]);

  useEffect(() => {
    document.body.classList.toggle("overlay-is-open", !!overlay);
    return () => document.body.classList.remove("overlay-is-open");
  }, [overlay]);

  // Light scroll-driven flourishes (parallax, fade-ups). Heavy lifting is in HorizontalProjects.
  useEffect(() => {
    if (reducedMotion) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".hero-portrait img",
        { yPercent: 8, scale: 1.04, opacity: 0 },
        { yPercent: 0, scale: 1, opacity: 1, duration: 1.4, ease: "power3.out", delay: 0.1 },
      );
      gsap.to(".hero-portrait", {
        yPercent: -12,
        ease: "none",
        scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
      });

      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        gsap.fromTo(
          el,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 85%" },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>(".hof-card").forEach((el, i) => {
        gsap.fromTo(
          el,
          { y: 28, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            ease: "power2.out",
            delay: (i % 4) * 0.05,
            scrollTrigger: { trigger: el, start: "top 92%" },
          },
        );
      });
    });
    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <>
      <EntryLoader ready={loaded} />
      <FixedChrome menuOpen={menuOpen} setMenuOpen={setMenuOpen} openProject={setOverlay} />
      <main>
        <HeroScene openProject={setOverlay} />
        <TaglineStrip />
        <HorizontalProjects openProject={setOverlay} reducedMotion={reducedMotion} />
        <div data-reveal>
          <CategorySplit openProject={setOverlay} />
        </div>
        <div data-reveal>
          <ProjectsHallOfFame openProject={setOverlay} />
        </div>
        <div data-reveal>
          <MilestoneCTA />
        </div>
        <div data-reveal>
          <ToolsWall />
        </div>
        <div data-reveal>
          <SocialsStrip />
        </div>
      </main>
      <FooterAlwaysBuilding />
      <ProjectOverlay project={overlay} onClose={() => setOverlay(null)} />
    </>
  );
}
