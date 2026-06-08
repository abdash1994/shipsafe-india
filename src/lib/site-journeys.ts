export interface FounderJourney {
  id: "startup" | "scan";
  eyebrow: string;
  title: string;
  description: string;
  href: "/startup" | "/scan";
  cta: string;
  bullets: string[];
}

export const founderJourneys: FounderJourney[] = [
  {
    id: "startup",
    eyebrow: "I'm starting up",
    title: "Start Smart",
    description:
      "Know what to set up before launch: company basics, policies, payments, compliance, and launch ops.",
    href: "/startup",
    cta: "Start the checklist",
    bullets: [
      "Know what is mandatory, recommended, or later",
      "Follow an India-first launch sequence",
      "Avoid setting up legal and ops too late",
    ],
  },
  {
    id: "scan",
    eyebrow: "I already built my app",
    title: "Ship Safe",
    description:
      "Scan your product for DPDP, legal, security, SEO, and monitoring gaps before you go live.",
    href: "/scan",
    cta: "Scan now",
    bullets: [
      "Run 39 launch-readiness checks",
      "Catch India-specific issues before users do",
      "Get fix guides and regulatory references",
    ],
  },
];
