import type { LucideIcon } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*  Shared helpers                                                            */
/* -------------------------------------------------------------------------- */

/** Converts any name into a stable URL slug, e.g. "M&A & Consolidation" → "ma-and-consolidation" */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/* -------------------------------------------------------------------------- */
/*  Council deep profiles (one per council in content.ts COUNCILS)            */
/* -------------------------------------------------------------------------- */

export interface CouncilProfile {
  /** EXACT council name as it appears in COUNCILS (content.ts) — used as the join key */
  name: string;
  /** Council chair: full name */
  chair: string;
  /** Chair honorific/title, e.g. "Chair · Master of Infinite Games" */
  chairTitle: string;
  /** Optional English rendering of the chair title (bilingual site) */
  enChairTitle?: string;
  /** Physical seat of the council, e.g. "Jakarta" */
  seat: string;
  /** 2–3 sentence mastery narrative, written in the GUNARA voice */
  mastery: string;
  /** Exactly 6 capability statements (short, punchy, ≤ 9 words each) */
  capabilities: string[];
  /** Exactly 3 signature achievements with hard numbers */
  achievements: { value: string; label: string }[];
  /** One-sentence signature move — what this council does that no one else can */
  signatureMove: string;
}

/* -------------------------------------------------------------------------- */
/*  Service deep details (one per service in content.ts SERVICES, keyed "01".."12") */
/* -------------------------------------------------------------------------- */

export interface ServiceDetail {
  /** EXACT service num from SERVICES, e.g. "01" */
  num: string;
  /** Optional English rendering of the practice name (bilingual site) */
  enName?: string;
  /** 2 overview paragraphs */
  overview: string[];
  /** Exactly 6 capability statements */
  capabilities: string[];
  /** Exactly 4 tangible deliverables the client receives */
  deliverables: string[];
  /** Exactly 3 outcome KPIs */
  kpis: { value: string; label: string }[];
  /** Exactly 3 related council NAMES (exact names from COUNCILS) */
  relatedCouncils: string[];
  /** 3 sentences describing how an engagement runs */
  protocol: string[];
}

/* -------------------------------------------------------------------------- */
/*  Industries                                                                */
/* -------------------------------------------------------------------------- */

export interface Industry {
  slug: string;
  name: string;
  /** Optional English rendering of the industry name (bilingual site) */
  enName?: string;
  tagline: string;
  /** Optional English rendering of the tagline (bilingual site) */
  enTagline?: string;
  icon: LucideIcon;
  /** 2 paragraphs */
  description: string[];
  /** Exactly 4 hard challenges the industry faces */
  challenges: { title: string; text: string }[];
  /** Exactly 4 approach bullets (how GUNARA attacks it) */
  approach: string[];
  /** Exactly 3 proof stats */
  stats: { value: string; label: string }[];
  /** Exactly 3 related council NAMES (exact names from COUNCILS) */
  councils: string[];
  /** Exactly 3 service nums from SERVICES ("01".."12") */
  services: string[];
}

/* -------------------------------------------------------------------------- */
/*  Insights (editorial)                                                      */
/* -------------------------------------------------------------------------- */

export interface Insight {
  slug: string;
  title: string;
  /** Optional English rendering of the title (bilingual site) */
  enTitle?: string;
  category: string;
  /** ISO date, e.g. "2025-11-04" */
  date: string;
  /** Read time in minutes */
  readTime: number;
  author: { name: string; role: string };
  excerpt: string;
  /** Optional English rendering of the excerpt (bilingual site) */
  enExcerpt?: string;
  /** Cover path, e.g. "/images/insight-1.jpg" */
  cover: string;
  /**
   * Body paragraphs. A string starting with "## " renders as a section
   * subheading. Aim for 10–14 entries mixing subheads and paragraphs.
   */
  body: string[];
  /** Exactly 4 key takeaways */
  keyPoints: string[];
  /** Exactly 3 tags */
  tags: string[];
}

/* -------------------------------------------------------------------------- */
/*  Leadership & Careers                                                      */
/* -------------------------------------------------------------------------- */

export interface Leader {
  name: string;
  role: string;
  /** Optional English rendering of the role (bilingual site) */
  enRole?: string;
  council: string;
  /** 2–3 sentence bio */
  bio: string;
  /** "/images/leadership-N.jpg" or "/images/founder-*.png" */
  image: string | null;
  initials: string;
  /** Rendered as the full-width founder card at the top of the leadership grid */
  featured?: boolean;
}

export interface Role {
  id: string;
  title: string;
  /** Optional English rendering of the title (bilingual site) */
  enTitle?: string;
  team: string;
  location: string;
  type: string;
  level: string;
  description: string;
  /** Exactly 5 requirements */
  requirements: string[];
}

export interface Perk {
  icon: LucideIcon;
  title: string;
  text: string;
}

/* -------------------------------------------------------------------------- */
/*  Legal & FAQ                                                               */
/* -------------------------------------------------------------------------- */

export interface LegalDoc {
  id: "privacy" | "terms" | "cookies";
  title: string;
  updated: string;
  intro: string;
  sections: { heading: string; text: string[] }[];
}

export interface FaqItem {
  q: string;
  a: string;
}

/* -------------------------------------------------------------------------- */
/*  Offices & Timeline                                                        */
/* -------------------------------------------------------------------------- */

export interface Office {
  city: string;
  country: string;
  address: string;
  /** IANA timezone, e.g. "Asia/Jakarta" */
  timezone: string;
  /** Globe map coordinates in %, matching content.ts HUBS */
  x: number;
  y: number;
  flagship?: boolean;
}

export interface TimelineEvent {
  year: string;
  title: string;
  text: string;
}
