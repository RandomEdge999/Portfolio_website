export type ProjectLink = {
  label: string;
  href: string;
  external?: boolean;
};

export type VisualGroup =
  | "operator"
  | "agent"
  | "city"
  | "education"
  | "model"
  | "vision"
  | "reader"
  | "satellite"
  | "marketplace"
  | "history"
  | "utility"
  | "creative"
  | "archive";

export type ProjectTier = "featured" | "systems" | "archive";

export type PortfolioProject = {
  title: string;
  slug: string;
  eyebrow: string;
  thesis: string;
  short: string;
  year: string;
  statusLabel: string;
  visualBrief: string;
  galleryGroup: VisualGroup;
  accent: string;
  tier: ProjectTier;
  logoMark: string;
  objectVisual: string;
  source: "local-readme" | "github-readme" | "portfolio-asset" | "archive";
  repoUrl?: string;
  stack: string[];
  proofPoints: string[];
  detailCopy: string;
  sourceQuality: string;
  links: ProjectLink[];
};

export type NavigationItem = {
  label: string;
  href: string;
};

export type ResumeLink = {
  label: string;
  audience: string;
  href: string;
};

export type SocialLink = {
  label: string;
  href: string;
  external?: boolean;
};

export type EducationItem = {
  institution: string;
  location: string;
  period: string;
  focus: string;
  logo: string;
};

export type SiteLink = {
  label: string;
  href: string;
  external?: boolean;
};

export type SystemLayer = {
  id: "interface" | "data" | "model" | "approval";
  index: string;
  label: string;
  title: string;
  description: string;
};

export type ProofMetric = {
  value: string;
  label: string;
  context: string;
};

export type CaseStudyVisual = "agents" | "forecast" | "operator" | "telemetry";

export type CaseStudy = {
  slug: string;
  number: string;
  title: string;
  headline: string;
  kicker: string;
  stage: string;
  year: string;
  summary: string;
  challenge: string;
  approach: string;
  outcome: string;
  scope: string;
  stack: string[];
  proofPoints: string[];
  visual: CaseStudyVisual;
  links: SiteLink[];
};

export type ExperienceEntry = {
  period: string;
  role: string;
  organization: string;
  location?: string;
  summary: string;
  signals: string[];
  featured?: boolean;
};

export type LabCategory = "ai-tools" | "ml-data" | "product-systems";

export type LabProject = {
  title: string;
  description: string;
  category: LabCategory;
  categoryLabel: string;
  year: string;
  stage: string;
  stack: string[];
  href?: string;
};

export type Capability = {
  number: string;
  title: string;
  description: string;
  tools: string[];
};

export type Recognition = {
  title: string;
  issuer: string;
  date: string;
  detail: string;
};
