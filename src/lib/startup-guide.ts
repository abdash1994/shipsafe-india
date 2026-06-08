export type StartupItemStatus = "mandatory" | "recommended" | "later";

export interface StartupGuideItem {
  id: string;
  title: string;
  what: string;
  when: string;
  status: StartupItemStatus;
  commonMistake: string;
  scanHint?: string;
}

export interface StartupGuideCta {
  href: "/scan";
  label: string;
  detail: string;
}

export interface StartupGuidePhase {
  id:
    | "foundation"
    | "money-trust"
    | "compliance-risk"
    | "launch-readiness"
    | "pre-ship-check";
  title: string;
  summary: string;
  items: StartupGuideItem[];
  cta?: StartupGuideCta;
}

export const startupGuidePhases: StartupGuidePhase[] = [
  {
    id: "foundation",
    title: "Phase 1: Foundation",
    summary:
      "Set up the core building blocks you need before any real customer traffic lands on your product.",
    items: [
      {
        id: "domain-brand",
        title: "Buy your domain and lock brand basics",
        what: "Secure your main domain, email domain, and the public name users will recognize.",
        when: "Before you share the product publicly or wire up email flows.",
        status: "mandatory",
        commonMistake: "Launching from a temporary domain and breaking trust later when links and emails change.",
      },
      {
        id: "app-stack",
        title: "Choose your primary app stack",
        what: "Decide where your frontend, backend, database, auth, and storage will run.",
        when: "Before you write too much code or invite outside users.",
        status: "mandatory",
        commonMistake: "Adding tools one by one without deciding the core stack, which makes later migrations painful.",
      },
      {
        id: "auth-access",
        title: "Set up authentication and role boundaries",
        what: "Pick how users sign in and how admin actions will stay separated from user actions.",
        when: "As soon as your app handles accounts, data, or paid features.",
        status: "recommended",
        commonMistake: "Shipping admin-only actions with no clear access control or audit trail.",
      },
    ],
  },
  {
    id: "money-trust",
    title: "Phase 2: Money & Trust",
    summary:
      "Prepare the user-facing trust layer before you accept payments or ask customers for personal information.",
    items: [
      {
        id: "payments",
        title: "Choose a payment setup you can operate",
        what: "Pick a gateway and payment flow that matches your product, refund needs, and settlement expectations.",
        when: "Before collecting any money, subscriptions, or advance deposits.",
        status: "mandatory",
        commonMistake: "Integrating payments before defining refund, cancellation, and support flows.",
      },
      {
        id: "core-policies",
        title: "Publish your privacy policy, terms, and refund policy",
        what: "Create the policies customers, payment partners, and scanners expect to find.",
        when: "Before launch and definitely before onboarding real customers.",
        status: "mandatory",
        commonMistake: "Copy-pasting templates without matching them to your actual data use, refund rules, or product behavior.",
        scanHint: "The scan already checks for privacy, terms, and refund policy gaps.",
      },
      {
        id: "support-contact",
        title: "Create a visible support channel",
        what: "Publish a support email or contact route customers can use when something breaks.",
        when: "Before your first public users and before enabling payments.",
        status: "recommended",
        commonMistake: "Launching with no visible support path and treating support as a later ops problem.",
        scanHint: "The scan can verify whether a contact path is discoverable on the site.",
      },
    ],
  },
  {
    id: "compliance-risk",
    title: "Phase 3: Compliance & Risk",
    summary:
      "Cover the India-specific trust and risk basics that become painful only after launch if ignored.",
    items: [
      {
        id: "dpdp-basics",
        title: "Map your DPDP obligations",
        what: "Understand what personal data you collect, why you collect it, and what consent or notice you need.",
        when: "Before launch if you store user names, emails, phone numbers, payment-linked data, or contact submissions.",
        status: "mandatory",
        commonMistake: "Assuming DPDP starts mattering only after you become a big company.",
        scanHint: "ShipSafe can later scan for consent and privacy signals on the live product.",
      },
      {
        id: "grievance-contact",
        title: "Decide who handles grievances and compliance contact",
        what: "Publish a responsible contact point for users, partners, and payment providers.",
        when: "Before onboarding to payment systems and before public launch.",
        status: "mandatory",
        commonMistake: "Leaving compliance contact undefined until a processor or user asks for it.",
        scanHint: "The scan checks for grievance and security contact signals.",
      },
      {
        id: "incident-plan",
        title: "Write a minimal incident response plan",
        what: "Document who responds when credentials leak, data is exposed, or service goes down.",
        when: "Before launch, even if it is just a one-page founder playbook.",
        status: "recommended",
        commonMistake: "Relying on memory during incidents instead of having a simple escalation plan ready.",
      },
    ],
  },
  {
    id: "launch-readiness",
    title: "Phase 4: Launch Readiness",
    summary:
      "Add the operational systems that let you notice, diagnose, and recover from failures once users arrive.",
    items: [
      {
        id: "monitoring-observability",
        title: "Set up monitoring, error tracking, and logs",
        what: "Install uptime checks, error monitoring, and a place to inspect failures quickly.",
        when: "Before any public launch or beta with real users.",
        status: "mandatory",
        commonMistake: "Waiting until after launch to add monitoring, then learning about outages from customers.",
        scanHint: "The scan already looks for analytics, uptime, and error tracking signals.",
      },
      {
        id: "transactional-email",
        title: "Prepare transactional email and deliverability basics",
        what: "Set up your sender domain, auth records, and the emails needed for auth, receipts, or support.",
        when: "Before onboarding flows, payment confirmations, or account actions depend on email.",
        status: "recommended",
        commonMistake: "Testing only from a sandbox sender and never validating real domain deliverability.",
        scanHint: "The scan can remind you to confirm transactional email setup.",
      },
      {
        id: "backups-recovery",
        title: "Enable backups and recovery checks",
        what: "Make sure your database and critical files can be restored, not just backed up silently.",
        when: "Before launch if you store anything you cannot recreate manually.",
        status: "mandatory",
        commonMistake: "Assuming backups exist because a provider mentions them, without verifying restore paths.",
        scanHint: "The scan flags missing backup readiness as a manual launch check.",
      },
    ],
  },
  {
    id: "pre-ship-check",
    title: "Phase 5: Pre-Ship Check",
    summary:
      "Once the essentials are in place, use ShipSafe to validate the live product before you announce it widely.",
    items: [
      {
        id: "scan-before-launch",
        title: "Run a launch-readiness scan on the real app",
        what: "Scan the deployed product so you catch DPDP, legal, SEO, security, and monitoring gaps in one pass.",
        when: "Right before launch, and again whenever the product changes materially.",
        status: "mandatory",
        commonMistake: "Assuming internal testing is enough and skipping a live pre-launch pass on the actual domain.",
      },
    ],
    cta: {
      href: "/scan",
      label: "Run the ship readiness scan",
      detail: "Turn your setup work into a concrete readiness score before launch day.",
    },
  },
];
