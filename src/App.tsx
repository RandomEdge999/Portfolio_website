import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Award,
  BarChart3,
  Database,
  ExternalLink,
  Github,
  Linkedin,
  Mail,
  Pause,
  Play,
  UsersRound,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState, type MouseEvent } from "react";
import ProjectVisual from "./components/ProjectVisual";
import SystemMap from "./components/SystemMap";
import AsciiGarden from "./components/AsciiGarden";
import AsciiText from "./components/AsciiText";
import AsciiSignal from "./components/AsciiSignal";
import ScrambleText from "./components/ScrambleText";
import { AsciiMotionContext } from "./components/AsciiMotion";
import {
  capabilities,
  caseStudies,
  experience,
  identity,
  labProjects,
  navigation,
  proofMetrics,
  recognition,
  socials,
} from "./data/site";
import type { CaseStudy, LabCategory } from "./types";

type TransitionDocument = Document & {
  startViewTransition?: (update: () => void) => { finished: Promise<void> };
};

const metricIcons = [BarChart3, Database, UsersRound, Award];

function scrollToHomeSection(hash: string) {
  const destination = document.getElementById(hash.replace(/^#/, ""));
  if (!destination) return;

  const behavior = document.documentElement.classList.contains("motion-paused")
    ? "auto"
    : "smooth";
  destination.scrollIntoView({ block: "start", behavior });
  window.requestAnimationFrame(() => {
    destination
      .querySelector<HTMLElement>("h1, h2")
      ?.focus({ preventScroll: true });
  });
}

function useReveal(dependency?: string | null) {
  useEffect(() => {
    const items = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]"),
    );
    if (!items.length) return;

    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !("IntersectionObserver" in window)
    ) {
      items.forEach((item) => item.classList.add("is-revealed"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-revealed");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -12%", threshold: 0.12 },
    );

    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, [dependency]);
}

function useScrollProgress() {
  const progressRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
      progressRef.current?.style.setProperty(
        "--scroll-progress",
        String(progress),
      );
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return progressRef;
}

function useMotionControl() {
  const [systemReduced, setSystemReduced] = useState(false);
  const [userPaused, setUserPaused] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setSystemReduced(query.matches);
    update();
    try {
      setUserPaused(
        window.localStorage.getItem("portfolio-motion") === "paused",
      );
    } catch {
      /* Storage may be unavailable in private browsing. */
    }
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  const motionPaused = systemReduced || userPaused;

  useEffect(() => {
    document.documentElement.classList.toggle("motion-paused", motionPaused);
  }, [motionPaused]);

  const toggle = () => {
    if (systemReduced) return;
    setUserPaused((paused) => {
      const next = !paused;
      try {
        window.localStorage.setItem(
          "portfolio-motion",
          next ? "paused" : "enabled",
        );
      } catch {
        /* The in-memory preference still works. */
      }
      return next;
    });
  };

  return { motionPaused, systemReduced, toggle };
}

function SectionTitle({
  index,
  label,
  title,
  copy,
  invert = false,
}: {
  index: string;
  label: string;
  title: string;
  copy: string;
  invert?: boolean;
}) {
  return (
    <header
      className={`section-title ${invert ? "section-title-invert" : ""}`}
      data-reveal
    >
      <div>
        <span>{index}</span>
        <strong>{label}</strong>
      </div>
      <h2 tabIndex={-1}>
        <AsciiText text={title} />
      </h2>
      <p>{copy}</p>
    </header>
  );
}

function Header({
  motionPaused,
  systemReduced,
  onToggleMotion,
  onNavigate,
  caseMode = false,
}: {
  motionPaused: boolean;
  systemReduced: boolean;
  onToggleMotion: () => void;
  onNavigate: (hash: string) => void;
  caseMode?: boolean;
}) {
  const linkTo = (href: string) =>
    caseMode ? `${import.meta.env.BASE_URL}${href}` : href;
  const mobileNavRef = useRef<HTMLDetailsElement>(null);
  const mobileSummaryRef = useRef<HTMLElement>(null);
  const closeMobileNav = () => mobileNavRef.current?.removeAttribute("open");
  const handleNavigate = (
    event: MouseEvent<HTMLAnchorElement>,
    hash: string,
  ) => {
    event.preventDefault();
    closeMobileNav();
    onNavigate(hash);
  };

  return (
    <header className="site-header">
      <a
        className="site-brand"
        href={linkTo("#top")}
        aria-label="Aleem Azhar, back to top"
        onClick={(event) => handleNavigate(event, "#top")}
      >
        <span aria-hidden="true">[a]</span>
        <strong>
          Aleem Azhar<small>ENGINEER / RESEARCHER</small>
        </strong>
      </a>

      <nav className="desktop-nav" aria-label="Primary navigation">
        {navigation.map((link) => (
          <a
            key={link.href}
            href={linkTo(link.href)}
            onClick={(event) => handleNavigate(event, link.href)}
          >
            <ScrambleText text={link.label} />
          </a>
        ))}
      </nav>

      <div className="header-actions">
        <span className="availability">
          <i /> Open to new roles
        </span>
        <button
          className="motion-toggle"
          type="button"
          onClick={onToggleMotion}
          disabled={systemReduced}
          aria-pressed={motionPaused}
          aria-label={
            systemReduced
              ? "Motion reduced"
              : motionPaused
                ? "Motion off"
                : "Motion on"
          }
          title={
            systemReduced
              ? "Motion is reduced by your system preference"
              : motionPaused
                ? "Enable decorative motion"
                : "Pause decorative motion"
          }
        >
          {motionPaused ? <Play size={15} /> : <Pause size={15} />}
          <span>
            {systemReduced
              ? "Motion reduced"
              : motionPaused
                ? "Motion off"
                : "Motion on"}
          </span>
        </button>
      </div>

      <details
        className="mobile-nav"
        ref={mobileNavRef}
        onKeyDown={(event) => {
          if (event.key !== "Escape" || !mobileNavRef.current?.open) return;
          event.preventDefault();
          closeMobileNav();
          mobileSummaryRef.current?.focus();
        }}
      >
        <summary ref={mobileSummaryRef}>Menu</summary>
        <nav aria-label="Mobile navigation">
          {navigation.map((link) => (
            <a
              key={link.href}
              href={linkTo(link.href)}
              onClick={(event) => handleNavigate(event, link.href)}
            >
              <ScrambleText text={link.label} />
              <ArrowRight size={16} />
            </a>
          ))}
          <a
            href={identity.linkedIn}
            target="_blank"
            rel="noreferrer"
            onClick={closeMobileNav}
          >
            Profile
            <Linkedin size={16} />
          </a>
        </nav>
      </details>
    </header>
  );
}

function Hero({
  onNavigate,
  motionPaused,
}: {
  onNavigate: (hash: string) => void;
  motionPaused: boolean;
}) {
  return (
    <section className="hero" id="top">
      <div className="hero-topline">
        <span>PORTFOLIO / 2026</span>
        <span>BASED IN MEMPHIS, TENNESSEE</span>
      </div>
      <figure className="hero-garden">
        <AsciiGarden paused={motionPaused} />
        <figcaption>
          <span>001 / DIGITAL ORGANISM</span>
          <span>{motionPaused ? "[ STILL ]" : "[ LIVE ]"}</span>
        </figcaption>
      </figure>
      <div className="hero-copy">
        <div className="hero-name">
          <p className="hero-eyebrow">SOFTWARE ENGINEER & ML RESEARCHER</p>
          <h1 tabIndex={-1}>
            <AsciiText text="Aleem Azhar." />
          </h1>
        </div>
        <div className="hero-summary">
          <p className="hero-intro">
            I build AI tools, study noisy signals, and turn complicated
            workflows into software people can use.
          </p>
          <div className="hero-actions">
            <a
              className="text-action"
              href="#work"
              onClick={(event) => {
                event.preventDefault();
                onNavigate("#work");
              }}
            >
              <ScrambleText text="Selected work" /> <ArrowDown size={16} />
            </a>
            <a
              className="text-action"
              href={identity.linkedIn}
              target="_blank"
              rel="noreferrer"
            >
              <ScrambleText text="Profile" /> <ArrowUpRight size={15} />
            </a>
          </div>
        </div>
      </div>
      <div className="hero-footnote">
        <span>AI SYSTEMS / MACHINE LEARNING / SOFTWARE</span>
        <span>
          SCROLL TO EXPLORE <ArrowDown size={13} />
        </span>
      </div>
    </section>
  );
}

function ProofRail() {
  return (
    <section className="proof-rail" aria-label="Selected outcomes">
      {proofMetrics.map((metric, index) => {
        const Icon = metricIcons[index];
        return (
          <article key={metric.label} data-reveal>
            <Icon size={24} strokeWidth={1.5} aria-hidden="true" />
            <strong>
              <AsciiText text={metric.value} />
            </strong>
            <div>
              <span>{metric.label}</span>
              <p>{metric.context}</p>
            </div>
          </article>
        );
      })}
    </section>
  );
}

function SelectedWork({ onOpen }: { onOpen: (project: CaseStudy) => void }) {
  return (
    <section className="selected-work" id="work">
      <SectionTitle
        index="01"
        label="Selected work"
        title="Things I’ve built."
        copy="From noisy signals to teams of coding agents. A few things I’ve spent time figuring out."
      />

      <div className="case-list">
        {caseStudies.map((project) => (
          <article
            className="case-study"
            id={project.slug}
            key={project.slug}
            data-reveal
          >
            <div className="case-study-media">
              <ProjectVisual visual={project.visual} />
              <span className="media-caption">SYSTEM / {project.number}</span>
            </div>
            <div className="case-study-copy">
              <div className="case-meta">
                <span>{project.number}</span>
                <strong>{project.kicker}</strong>
                <em>{project.year}</em>
              </div>
              <h3>
                <AsciiText text={project.title} />
              </h3>
              <p>{project.headline}</p>
              <div
                className="case-stack"
                aria-label={`${project.title} technology stack`}
              >
                {project.stack.slice(0, 3).map((tool) => (
                  <span key={tool}>{tool}</span>
                ))}
              </div>
              <button
                className="case-open"
                type="button"
                data-case-trigger={project.slug}
                aria-label={`Open ${project.title} case file`}
                onClick={() => onOpen(project)}
              >
                <ScrambleText text="Explore project" />{" "}
                <ArrowUpRight size={17} />
              </button>
              <span className="project-stage">{project.stage}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function Experience() {
  return (
    <section className="experience-section" id="experience">
      <SectionTitle
        index="02"
        label="Experience & research"
        title="Experience & research."
        copy="Research labs, classrooms, and the everyday work that keeps a college running."
      />

      <div className="experience-layout">
        <div className="experience-statement" data-reveal>
          <div className="experience-study" aria-hidden="true">
            <AsciiSignal seed={5} />
            <span>02 / A STUDY IN MOTION</span>
          </div>
          <span>
            B.S. Computer Science · Statistics minor · Rhodes College · 2026
          </span>
        </div>
        <ol className="timeline">
          {experience.map((entry) => (
            <li
              className={entry.featured ? "is-featured" : ""}
              key={`${entry.period}-${entry.role}`}
              data-reveal
            >
              <time>{entry.period}</time>
              <div>
                <h3>{entry.role}</h3>
                <strong>
                  {entry.organization}
                  {entry.location ? ` · ${entry.location}` : ""}
                </strong>
                <p>{entry.summary}</p>
                <ul>
                  {entry.signals.map((signal) => (
                    <li key={signal}>{signal}</li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <div className="capabilities-grid">
        {capabilities.map((capability) => (
          <article key={capability.number} data-reveal>
            <span>{capability.number}</span>
            <h3>{capability.title}</h3>
            <p>{capability.description}</p>
            <ul>
              {capability.tools.map((tool) => (
                <li key={tool}>{tool}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}

const filters: { label: string; value: "all" | LabCategory }[] = [
  { label: "All", value: "all" },
  { label: "AI tools", value: "ai-tools" },
  { label: "ML & data", value: "ml-data" },
  { label: "Product systems", value: "product-systems" },
];

function Lab() {
  const [filter, setFilter] = useState<"all" | LabCategory>("all");
  const visibleProjects = useMemo(
    () =>
      filter === "all"
        ? labProjects
        : labProjects.filter((project) => project.category === filter),
    [filter],
  );

  return (
    <section className="lab-section" id="lab">
      <SectionTitle
        index="03"
        label="Lab index"
        title="More experiments."
        copy="Smaller tools, ongoing experiments, and ideas I wanted to try for myself."
      />

      <div className="lab-toolbar" data-reveal>
        <div role="group" aria-label="Filter lab projects">
          {filters.map((item) => (
            <button
              className={filter === item.value ? "is-active" : ""}
              key={item.value}
              type="button"
              aria-pressed={filter === item.value}
              onClick={() => setFilter(item.value)}
            >
              {item.label}
            </button>
          ))}
        </div>
        <span>{String(visibleProjects.length).padStart(2, "0")} projects</span>
      </div>

      <div className="lab-list" aria-live="polite">
        {visibleProjects.map((project, index) => (
          <a
            className="lab-row"
            href={project.href}
            key={project.title}
            target="_blank"
            rel="noreferrer"
          >
            <span>{String(index + 1).padStart(2, "0")}</span>
            <div className="lab-row-content">
              <h3>
                <ScrambleText text={project.title} />
              </h3>
              <p>{project.description}</p>
              <div className="lab-row-meta">
                <strong>{project.categoryLabel}</strong>
                <em>
                  {project.stage} · {project.year}
                </em>
                <span>{project.stack.join(" / ")}</span>
              </div>
            </div>
            <div className="lab-row-preview" aria-hidden="true">
              <AsciiSignal seed={labProjects.indexOf(project)} />
              <span>
                [ OPEN <ExternalLink size={11} /> ]
              </span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

function About() {
  return (
    <section className="about-section" id="about">
      <div className="about-image" data-reveal>
        <img
          src={identity.portrait}
          alt="Aleem Azhar presenting noise-resilient forecasting research"
          width="800"
          height="800"
          loading="lazy"
        />
        <span>
          <i /> Research presentation / noise-resilient forecasting
        </span>
      </div>

      <div className="about-copy" data-reveal>
        <span>04 / About</span>
        <h2 tabIndex={-1}>
          <AsciiText text="A person behind the programs." />
        </h2>
        <p className="about-lead">
          I like knowing how things work. I like it even more when I can make
          them useful to someone else.
        </p>
        <p>
          My background is in computer science and statistics, but the work has
          taken me into forecasting research, financial-aid operations,
          satellite telemetry, and teaching Python. The interesting problems
          tend to live between those disciplines.
        </p>
        <p>
          A model needs an honest evaluation. A useful tool needs a clear
          interface. And automation needs a person who can still understand what
          it’s doing. That’s the thread through my work.
        </p>
        <p className="about-education">
          B.S. Computer Science · Statistics minor
          <br />
          Rhodes College, 2026 · Memphis, Tennessee
        </p>
        <a
          className="text-action"
          href={identity.linkedIn}
          target="_blank"
          rel="noreferrer"
        >
          View the full profile <ArrowUpRight size={15} />
        </a>
        <details className="approach-disclosure">
          <summary>
            A closer look at how I build <span aria-hidden="true">+</span>
          </summary>
          <SystemMap />
        </details>
      </div>

      <div className="recognition-list">
        {recognition.map((item, index) => (
          <article key={item.title} data-reveal>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <div>
              <h3>{item.title}</h3>
              <strong>{item.issuer}</strong>
            </div>
            <time>{item.date}</time>
            <p>{item.detail}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function Contact() {
  const iconFor = (label: string) => {
    if (label === "GitHub") return <Github size={19} />;
    if (label === "LinkedIn") return <Linkedin size={19} />;
    return <Mail size={19} />;
  };

  return (
    <section className="contact-section section-dark" id="contact">
      <div className="contact-kicker" data-reveal>
        <span>05</span>
        <strong>Contact</strong>
      </div>
      <div className="contact-grid">
        <div data-reveal>
          <h2 tabIndex={-1}>
            <AsciiText text="Let’s talk." />
          </h2>
          <p>
            I’m interested in applied AI, machine learning, and software
            engineering roles. If you’re building something I could help with,
            send me a note.
          </p>
          <a className="contact-email" href={`mailto:${identity.email}`}>
            {identity.email} <ArrowUpRight size={22} />
          </a>
        </div>
        <ul data-reveal>
          {socials.map((social) => (
            <li key={social.label}>
              <a
                href={social.href}
                target={social.external ? "_blank" : undefined}
                rel={social.external ? "noreferrer" : undefined}
              >
                {iconFor(social.label)}
                <span>{social.label}</span>
                <ArrowUpRight size={17} />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function CaseStudyPage({
  project,
  nextProject,
  onBack,
  onNavigateHome,
  onOpen,
}: {
  project: CaseStudy;
  nextProject: CaseStudy;
  onBack: () => void;
  onNavigateHome: (target: string) => void;
  onOpen: (project: CaseStudy) => void;
}) {
  return (
    <main className="case-page" id="main">
      <section className="case-page-hero">
        <button className="case-back" type="button" onClick={onBack}>
          <ArrowRight size={15} /> Back to selected work
        </button>
        <div className="case-page-heading">
          <div>
            <span>
              {project.number} / {project.kicker}
            </span>
            <strong>
              {project.stage} · {project.year}
            </strong>
          </div>
          <h1 tabIndex={-1}>
            <AsciiText text={project.headline} />
          </h1>
          <p>{project.summary}</p>
        </div>
        <div className="case-page-media">
          <ProjectVisual visual={project.visual} />
          <span>
            Fig. {project.number} / {project.title} — a system study
          </span>
        </div>
        <dl className="case-page-facts">
          <div>
            <dt>System</dt>
            <dd>{project.title}</dd>
          </div>
          <div>
            <dt>Scope</dt>
            <dd>{project.scope}</dd>
          </div>
          <div>
            <dt>Maturity</dt>
            <dd>{project.stage}</dd>
          </div>
          <div>
            <dt>Year</dt>
            <dd>{project.year}</dd>
          </div>
        </dl>
      </section>

      <section className="case-page-narrative">
        <article>
          <span>01 / Context</span>
          <h2>The constraint</h2>
          <p>{project.challenge}</p>
        </article>
        <article>
          <span>02 / System</span>
          <h2>The response</h2>
          <p>{project.approach}</p>
        </article>
        <article>
          <span>03 / Evidence</span>
          <h2>The outcome</h2>
          <p>{project.outcome}</p>
        </article>
      </section>

      <section className="case-page-proof">
        <div>
          <span>Proof points</span>
          <ul>
            {project.proofPoints.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </div>
        <div>
          <span>Technology</span>
          <ul>
            {project.stack.map((tool) => (
              <li key={tool}>{tool}</li>
            ))}
          </ul>
        </div>
        <div className="case-page-links">
          {project.links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noreferrer" : undefined}
              onClick={(event) => {
                if (!link.external) {
                  event.preventDefault();
                  onNavigateHome(link.href);
                }
              }}
            >
              {link.label}
              <ArrowUpRight size={16} />
            </a>
          ))}
        </div>
      </section>

      <section className="next-case section-dark">
        <span>Next case file / {nextProject.number}</span>
        <button type="button" onClick={() => onOpen(nextProject)}>
          <strong>{nextProject.title}</strong>
          <em>{nextProject.headline}</em>
          <ArrowUpRight size={28} />
        </button>
      </section>
    </main>
  );
}

function CaseNotFound({ onBack }: { onBack: () => void }) {
  return (
    <main className="case-not-found" id="main">
      <span>404 / Case file</span>
      <h1>This case file does not exist.</h1>
      <p>The project may have moved or the link may be incomplete.</p>
      <button className="button button-primary" type="button" onClick={onBack}>
        Return home <ArrowRight size={16} />
      </button>
    </main>
  );
}

function HomePage({
  onOpen,
  onNavigate,
  motionPaused,
}: {
  onOpen: (project: CaseStudy) => void;
  onNavigate: (hash: string) => void;
  motionPaused: boolean;
}) {
  return (
    <main id="main">
      <Hero onNavigate={onNavigate} motionPaused={motionPaused} />
      <ProofRail />
      <SelectedWork onOpen={onOpen} />
      <Experience />
      <Lab />
      <About />
      <Contact />
    </main>
  );
}

function Footer({
  caseMode,
  onNavigate,
}: {
  caseMode: boolean;
  onNavigate: (hash: string) => void;
}) {
  return (
    <footer className="site-footer section-dark">
      <strong>
        Aleem Azhar{" "}
        <span className="footer-star" aria-hidden="true">
          ✳
        </span>
      </strong>
      <span>
        Made with care & a few thousand characters. © {new Date().getFullYear()}
      </span>
      <a
        href={caseMode ? `${import.meta.env.BASE_URL}#top` : "#top"}
        onClick={(event) => {
          event.preventDefault();
          onNavigate("#top");
        }}
      >
        Back to top <ArrowUpRight size={14} />
      </a>
    </footer>
  );
}

export default function App() {
  const readCaseSlug = () =>
    new URLSearchParams(window.location.search).get("case");
  const [caseSlug, setCaseSlug] = useState<string | null>(readCaseSlug);
  const pendingHomeTarget = useRef<string | null>(null);
  const pendingHomeFocus = useRef<string | null>(null);
  const { motionPaused, systemReduced, toggle } = useMotionControl();
  const progressRef = useScrollProgress();
  useReveal(caseSlug);
  const activeProject =
    caseStudies.find((project) => project.slug === caseSlug) ?? null;
  const unknownCase = Boolean(caseSlug && !activeProject);

  useEffect(() => {
    const onPopState = (event: PopStateEvent) => {
      const nextSlug = readCaseSlug();
      setCaseSlug(nextSlug);
      if (!nextSlug) {
        const hash = window.location.hash;
        if (hash) {
          if (document.querySelector(".case-page, .case-not-found")) {
            pendingHomeTarget.current = hash;
            pendingHomeFocus.current = null;
          } else {
            window.requestAnimationFrame(() => scrollToHomeSection(hash));
          }
          return;
        }
        const top =
          typeof event.state?.homeScroll === "number"
            ? event.state.homeScroll
            : 0;
        pendingHomeFocus.current = pendingHomeTarget.current
          ? null
          : typeof event.state?.homeFocusSlug === "string"
            ? event.state.homeFocusSlug
            : null;
        window.requestAnimationFrame(() =>
          window.scrollTo({ top, behavior: "auto" }),
        );
      }
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    const meta = document.querySelector<HTMLMetaElement>(
      'meta[name="description"]',
    );
    if (activeProject) {
      document.title = `${activeProject.title} | Aleem Azhar`;
      meta?.setAttribute("content", activeProject.summary);
      window.requestAnimationFrame(() => {
        window.scrollTo({ top: 0, behavior: "auto" });
        document
          .querySelector<HTMLElement>(".case-page h1")
          ?.focus({ preventScroll: true });
      });
    } else if (unknownCase) {
      document.title = "Case file not found | Aleem Azhar";
      meta?.setAttribute(
        "content",
        "The requested Aleem Azhar portfolio case file was not found.",
      );
    } else {
      document.title =
        "Aleem Azhar | AI Systems, ML Research & Product Engineering";
      meta?.setAttribute(
        "content",
        "Aleem Azhar builds inspectable AI systems, noise-resilient machine-learning research, developer tools, and full-stack data products.",
      );
    }
  }, [activeProject, unknownCase]);

  useEffect(() => {
    if (caseSlug) return;
    const target = pendingHomeTarget.current;
    const focusSlug = pendingHomeFocus.current;
    pendingHomeTarget.current = null;
    pendingHomeFocus.current = null;
    if (!target && !focusSlug) return;
    window.requestAnimationFrame(() => {
      if (target) {
        const destination = document.getElementById(target.replace(/^#/, ""));
        destination?.scrollIntoView({ block: "start", behavior: "auto" });
        if (!focusSlug) {
          destination
            ?.querySelector<HTMLElement>("h1, h2")
            ?.focus({ preventScroll: true });
        }
      }
      if (focusSlug) {
        document
          .querySelector<HTMLButtonElement>(
            `[data-case-trigger="${CSS.escape(focusSlug)}"]`,
          )
          ?.focus({ preventScroll: true });
      }
    });
  }, [caseSlug]);

  const navigateToHomeSection = (hash: string) => {
    if (caseSlug) {
      pendingHomeTarget.current = hash;
      pendingHomeFocus.current = null;
      const url = new URL(import.meta.env.BASE_URL, window.location.origin);
      window.history.pushState(
        { homeNavigation: hash },
        "",
        `${url.pathname}${hash}`,
      );
      setCaseSlug(null);
      return;
    }

    const url = new URL(window.location.href);
    if (url.hash !== hash) {
      window.history.pushState(
        { homeNavigation: hash },
        "",
        `${url.pathname}${url.search}${hash}`,
      );
    }
    scrollToHomeSection(hash);
  };

  const openProject = (project: CaseStudy) => {
    const update = () => {
      if (!caseSlug) {
        window.history.replaceState(
          {
            ...window.history.state,
            homeScroll: window.scrollY,
            homeFocusSlug: project.slug,
          },
          "",
        );
      }
      const url = new URL(import.meta.env.BASE_URL, window.location.origin);
      url.searchParams.set("case", project.slug);
      if (caseSlug) {
        window.history.replaceState(
          {
            portfolioCase: true,
            hasHomeEntry: Boolean(window.history.state?.hasHomeEntry),
            slug: project.slug,
          },
          "",
          `${url.pathname}${url.search}`,
        );
      } else {
        window.history.pushState(
          { portfolioCase: true, hasHomeEntry: true, slug: project.slug },
          "",
          `${url.pathname}${url.search}`,
        );
      }
      setCaseSlug(project.slug);
    };
    const transitionDocument = document as TransitionDocument;
    if (!motionPaused && transitionDocument.startViewTransition) {
      transitionDocument.startViewTransition(update);
    } else {
      update();
    }
  };

  const returnHome = (target?: string) => {
    pendingHomeTarget.current = target ?? null;
    if (!target && !window.history.state?.hasHomeEntry && activeProject) {
      pendingHomeTarget.current = `#${activeProject.slug}`;
      pendingHomeFocus.current = activeProject.slug;
    }
    const update = () => {
      if (window.history.state?.hasHomeEntry) {
        window.history.back();
        return;
      }
      const url = new URL(import.meta.env.BASE_URL, window.location.origin);
      window.history.replaceState({ homeScroll: 0 }, "", url.pathname);
      setCaseSlug(null);
      window.scrollTo({ top: 0, behavior: "auto" });
    };
    const transitionDocument = document as TransitionDocument;
    if (!motionPaused && transitionDocument.startViewTransition) {
      transitionDocument.startViewTransition(update);
    } else {
      update();
    }
  };

  const nextProject = activeProject
    ? caseStudies[
        (caseStudies.findIndex(
          (project) => project.slug === activeProject.slug,
        ) +
          1) %
          caseStudies.length
      ]
    : caseStudies[0];

  return (
    <AsciiMotionContext.Provider value={motionPaused}>
      <AsciiSignal atmosphere />
      <a
        className="skip-link"
        href="#main"
        onClick={(event) => {
          event.preventDefault();
          const main = document.getElementById("main");
          main?.setAttribute("tabindex", "-1");
          main?.focus();
        }}
      >
        Skip to content
      </a>
      <span className="scroll-progress" ref={progressRef} aria-hidden="true" />
      <Header
        motionPaused={motionPaused}
        systemReduced={systemReduced}
        onToggleMotion={toggle}
        onNavigate={navigateToHomeSection}
        caseMode={Boolean(caseSlug)}
      />
      {activeProject ? (
        <CaseStudyPage
          project={activeProject}
          nextProject={nextProject}
          onBack={() => returnHome()}
          onNavigateHome={navigateToHomeSection}
          onOpen={openProject}
        />
      ) : unknownCase ? (
        <CaseNotFound onBack={() => returnHome()} />
      ) : (
        <HomePage
          onOpen={openProject}
          onNavigate={navigateToHomeSection}
          motionPaused={motionPaused}
        />
      )}
      <Footer caseMode={Boolean(caseSlug)} onNavigate={navigateToHomeSection} />
    </AsciiMotionContext.Provider>
  );
}
