import type {
  Capability,
  CaseStudy,
  ExperienceEntry,
  LabProject,
  ProofMetric,
  Recognition,
  SiteLink,
  SystemLayer,
} from "../types";

const assets = {
  portrait: new URL("../../assets/my_image.png", import.meta.url).href,
};

const linkedInProfile = "https://linkedin.com/in/m-aleem-azhar";

export const identity = {
  name: "Aleem Azhar",
  fullName: "Muhammad Aleem Azhar",
  location: "Memphis, Tennessee",
  email: "aleemazhar14@gmail.com",
  portrait: assets.portrait,
  linkedIn: linkedInProfile,
};

export const navigation: SiteLink[] = [
  { label: "Work", href: "#work" },
  { label: "Experience", href: "#experience" },
  { label: "Lab", href: "#lab" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export const socials: SiteLink[] = [
  { label: "GitHub", href: "https://github.com/RandomEdge999", external: true },
  { label: "LinkedIn", href: linkedInProfile, external: true },
  { label: "Email", href: "mailto:aleemazhar14@gmail.com" },
];

export const systemLayers: SystemLayer[] = [
  {
    id: "interface",
    index: "01",
    label: "Interface",
    title: "Make the state legible.",
    description: "The screen should expose hierarchy, progress, confidence, and failure—not hide them behind magic.",
  },
  {
    id: "data",
    index: "02",
    label: "Data",
    title: "Make the inputs defensible.",
    description: "Validation, lineage, exceptions, and useful structure turn messy source material into something reliable.",
  },
  {
    id: "model",
    index: "03",
    label: "Model",
    title: "Evaluate behavior, not hype.",
    description: "Benchmarks, error analysis, assumptions, and failure cases matter as much as the model architecture.",
  },
  {
    id: "approval",
    index: "04",
    label: "Human approval",
    title: "Keep consequence under control.",
    description: "Important actions stay previewable, interruptible, and attributable to the person responsible for them.",
  },
];

export const proofMetrics: ProofMetric[] = [
  {
    value: "3",
    label: "adversarial variants",
    context: "Standard GAN, Wasserstein, and gradient-penalty training",
  },
  {
    value: "6",
    label: "dataset families",
    context: "Markets, power, air quality, compressors, and sensors",
  },
  {
    value: "30+",
    label: "students supported",
    context: "Computer science teaching with Johns Hopkins CTY",
  },
  {
    value: "2026",
    label: "Best Data Visualization",
    context: "Team recognition at Tennessee DataFest",
  },
];

export const caseStudies: CaseStudy[] = [
  {
    slug: "agentwarehouse",
    number: "01",
    title: "AgentWarehouse",
    headline: "Keeping humans in control of multi-agent work.",
    kicker: "AI developer tools",
    stage: "Release candidate",
    year: "2026",
    summary:
      "A local desktop runtime for coordinating coding agents through session-owned terminals, approval queues, structured traces, and secure credential storage.",
    challenge:
      "Parallel agents increase throughput, but they also multiply hidden state, terminal ownership problems, approval bottlenecks, and recovery ambiguity.",
    approach:
      "The runtime makes each cycle inspectable through agent-scoped terminals, approval-aware pause and resume, structured traces, usage totals, and explicit next actions.",
    outcome:
      "A release-candidate Tauri application with OS-backed secret storage and verification across TypeScript, renderer tests, Rust tests, cargo check, and clippy.",
    scope: "Agents / approvals / terminals / traces",
    stack: ["Tauri 2", "Rust", "React", "TypeScript", "SQLite", "Vitest"],
    proofPoints: [
      "Session-owned terminal management",
      "Per-agent approval pause and resume",
      "Structured trace and cycle history",
      "OS credential storage for provider keys",
    ],
    visual: "agents",
    links: [{ label: "Discuss the system", href: "#contact" }],
  },
  {
    slug: "rgan-research",
    number: "02",
    title: "RGAN Research",
    headline: "Forecasting when noise is part of the problem.",
    kicker: "Machine learning research",
    stage: "Active research",
    year: "2025—26",
    summary:
      "An LSTM-based generative-adversarial forecasting project evaluating whether adversarial training can improve robustness under real-world noise.",
    challenge:
      "A forecasting model can fit the central pattern and still fail when sensor drift, spikes, market noise, or other real-world corruption changes the signal.",
    approach:
      "The codebase trains LSTM generator/discriminator variants—standard GAN, WGAN, and WGAN-GP—and compares them with supervised neural, linear, transformer, generative, and classical baselines under controlled noise sweeps.",
    outcome:
      "An active research codebase with resumable training, structured experiment outputs, robustness sweeps, augmentation experiments, and six documented real-world dataset families.",
    scope: "3 GAN variants / 6 dataset families / noise sweeps",
    stack: ["Python", "PyTorch", "LSTM", "WGAN-GP", "PatchTST", "ARIMA"],
    proofPoints: [
      "Binance, household-power, air-quality, compressor, and sensor datasets",
      "Noise-level sweeps with per-model RMSE outputs",
      "Checkpointed and resumable experiment runs",
      "Explicit classical, neural, transformer, and GAN baselines",
    ],
    visual: "forecast",
    links: [
      {
        label: "View research repository",
        href: "https://github.com/RandomEdge999/RGAN-Research-Project",
        external: true,
      },
    ],
  },
  {
    slug: "findmyjob",
    number: "03",
    title: "FindMyJob",
    headline: "Automation with the operator still in the loop.",
    kicker: "Applied AI · local-first",
    stage: "Greenhouse-first beta",
    year: "2025—26",
    summary:
      "A local-first application operator that discovers roles, screens fit with a local model, drafts materials, and supervises supported ATS form filling.",
    challenge:
      "Job automation becomes dangerous when screening, blocker detection, generated materials, and browser actions disappear into a black box.",
    approach:
      "Discovery, local-model screening, drafting, preview, browser actions, blockers, and exports remain visible while runtime state stays on the user’s machine.",
    outcome:
      "A cross-platform beta with preview-first controls, local ledgers, CSV/XLSX exports, and explicit human approval before supported browser actions.",
    scope: "Discover / screen / draft / review / act",
    stack: ["Python 3.12", "FastAPI", "React", "Playwright", "LM Studio", "SQLAlchemy"],
    proofPoints: [
      "Local model screening through LM Studio",
      "Visible Playwright browser workflow",
      "Preview-first approval controls",
      "Cross-platform launch and local ledgers",
    ],
    visual: "operator",
    links: [
      {
        label: "View GitHub",
        href: "https://github.com/RandomEdge999/FindMyJob",
        external: true,
      },
    ],
  },
  {
    slug: "rhok-sat",
    number: "04",
    title: "RHOK-SAT",
    headline: "Turning raw satellite packets into an operational picture.",
    kicker: "Scientific data · telemetry",
    stage: "Research internship",
    year: "2023",
    summary:
      "Python telemetry workflows and Plotly/Dash interfaces for ingesting, decoding, validating, and visualizing CubeSat packet data.",
    challenge:
      "Raw telemetry only becomes useful when missing packets, corruption, signal loss, and transformation errors are visible to the research team.",
    approach:
      "Local processing scripts captured and decoded packets while operational dashboards exposed trends, exceptions, and satellite-tracking context.",
    outcome:
      "Reduced repetitive analysis work and improved visibility into data quality and telemetry behavior for research review.",
    scope: "Packets / validation / tracking / trends",
    stack: ["Python", "Plotly", "Dash", "Telemetry", "TLE", "Gpredict"],
    proofPoints: [
      "Packet capture, decoding, and storage",
      "Missing and corrupted record audits",
      "Signal-loss and transformation checks",
      "TLE and Gpredict tracking context",
    ],
    visual: "telemetry",
    links: [{ label: "Ask about the research", href: "#contact" }],
  },
];

export const experience: ExperienceEntry[] = [
  {
    period: "2025—26",
    role: "Machine Learning Researcher",
    organization: "Rhodes College",
    location: "Memphis, TN",
    summary:
      "Built reproducible forecasting pipelines and compared model reliability under noisy, volatile, and heavy-tailed time-series conditions.",
    signals: ["PyTorch", "Forecasting", "Model evaluation"],
    featured: true,
  },
  {
    period: "2023—26",
    role: "Data Operations & Analytics Assistant",
    organization: "Rhodes College Financial Aid Office",
    location: "Memphis, TN",
    summary:
      "Automated payroll, reconciliation, and reporting workflows while building validation checks and reviewer-ready operational outputs.",
    signals: ["Python", "Excel", "Data quality"],
    featured: true,
  },
  {
    period: "2025",
    role: "Computer Science Teaching Assistant",
    organization: "Johns Hopkins Center for Talented Youth",
    summary:
      "Supported 30+ students through Python, debugging, recursion, data structures, and project work across an accelerated CS course.",
    signals: ["Teaching", "Python", "Technical communication"],
  },
  {
    period: "2024",
    role: "AI & Data Vision Study Abroad",
    organization: "Yonsei University",
    location: "Seoul, South Korea",
    summary:
      "Expanded an applied AI and computer-vision foundation in an international engineering context.",
    signals: ["AI", "Computer vision", "Global study"],
  },
  {
    period: "2023",
    role: "Satellite Data & Telemetry Research Intern",
    organization: "RHOK-SAT · Rhodes College",
    location: "Memphis, TN",
    summary:
      "Built telemetry processing and dashboard workflows for CubeSat packet data, operational anomalies, and tracking context.",
    signals: ["Telemetry", "Plotly/Dash", "Data validation"],
  },
];

export const labProjects: LabProject[] = [
  {
    title: "AgentClassroom",
    description: "Rendered webpage capture and deterministic design distillation into agent-ready skillpacks.",
    category: "ai-tools",
    categoryLabel: "AI tools",
    year: "2026",
    stage: "Single-page MVP",
    stack: ["Playwright", "Node", "React"],
    href: "https://github.com/RandomEdge999/AgentClassroom",
  },
  {
    title: "Joby",
    description: "Private direct-ATS ingestion, ranking, notes, contacts, and application tracking workspace.",
    category: "product-systems",
    categoryLabel: "Product systems",
    year: "2026",
    stage: "Local workspace",
    stack: ["FastAPI", "Next.js", "SQLite"],
    href: "https://github.com/RandomEdge999/Joby",
  },
  {
    title: "RhOKPY",
    description: "Rhodes classroom platform modernization for university-authenticated courses, assignments, and grades.",
    category: "product-systems",
    categoryLabel: "Product systems",
    year: "2026",
    stage: "Classroom platform",
    stack: ["University SSO", "Assignments", "Course delivery"],
    href: "https://rhokpy.com",
  },
  {
    title: "City Pulse",
    description: "A city dashboard turning simulated social and environmental feeds into emotion, anomaly, map, and forecast views.",
    category: "ml-data",
    categoryLabel: "Data systems",
    year: "2026",
    stage: "Full-stack prototype",
    stack: ["Next.js", "FastAPI", "TimescaleDB"],
    href: "https://github.com/RandomEdge999/City-Pulse",
  },
  {
    title: "Teacher Evaluation",
    description: "Authenticated classroom observations with rubric scoring, progress tracking, validation, and PostgreSQL persistence.",
    category: "product-systems",
    categoryLabel: "Product systems",
    year: "2025",
    stage: "Alpha",
    stack: ["Next.js", "Prisma", "PostgreSQL"],
    href: "https://github.com/RandomEdge999/Teacher-Evaluation-System",
  },
  {
    title: "Hand Reading AI",
    description: "Local hand-sign recognition using MediaPipe landmarks, ensemble models, and prediction smoothing.",
    category: "ml-data",
    categoryLabel: "Applied ML",
    year: "2025",
    stage: "Local application",
    stack: ["MediaPipe", "OpenCV", "XGBoost"],
    href: "https://github.com/RandomEdge999/hand-reading-ai",
  },
  {
    title: "AI Social Mirror",
    description: "Tone, intent, sentiment, and misinterpretation analysis for posts, profiles, and email.",
    category: "ai-tools",
    categoryLabel: "AI tools",
    year: "2025",
    stage: "Product experiment",
    stack: ["Next.js", "TypeScript", "Hugging Face"],
    href: "https://github.com/RandomEdge999/ai-social-mirror",
  },
  {
    title: "RedSubContinent",
    description: "Source-led historical mapping with explicit uncertainty, story views, filters, and data exports.",
    category: "ml-data",
    categoryLabel: "Data systems",
    year: "2026",
    stage: "Research product",
    stack: ["Next.js", "MapLibre", "D3"],
    href: "https://github.com/RandomEdge999/RedSubContinent",
  },
];

export const capabilities: Capability[] = [
  {
    number: "01",
    title: "Applied ML & research",
    description: "Build the pipeline, compare the baselines, and document where the model stops being trustworthy.",
    tools: ["Python", "PyTorch", "scikit-learn", "Time series", "Model evaluation"],
  },
  {
    number: "02",
    title: "AI & developer systems",
    description: "Design local-first agent workflows where approvals, traces, terminals, and recovery remain inspectable.",
    tools: ["Rust", "Tauri", "Playwright", "Local LLMs", "Agent workflows"],
  },
  {
    number: "03",
    title: "Full-stack products",
    description: "Carry product behavior across the interface, API, data model, background work, and deployment surface.",
    tools: ["React", "TypeScript", "FastAPI", "PostgreSQL", "Testing"],
  },
  {
    number: "04",
    title: "Data operations & reliability",
    description: "Turn messy operational data into validated, documented outputs that real stakeholders can review.",
    tools: ["pandas", "openpyxl", "Excel", "Validation", "Dashboards"],
  },
];

export const recognition: Recognition[] = [
  {
    title: "Best Data Visualization",
    issuer: "Tennessee DataFest",
    date: "April 2026",
    detail: "Team award for turning analysis into a clear, cohesive visual story under time pressure.",
  },
  {
    title: "IBM AI Developer",
    issuer: "IBM / Coursera",
    date: "August 2024",
    detail: "Ten-course professional certificate spanning AI foundations, Python, Flask, and generative AI applications.",
  },
  {
    title: "Honor Roll",
    issuer: "Rhodes College",
    date: "Fall 2023",
    detail: "Academic recognition for the Fall 2023 semester.",
  },
];
