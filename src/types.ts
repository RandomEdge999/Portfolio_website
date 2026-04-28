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
