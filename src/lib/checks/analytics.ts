import { CheckResult, FetchedPage } from "../types";

export function runAnalyticsChecks(page: FetchedPage): CheckResult[] {
  const html = page.html.toLowerCase();

  const hasAnalytics =
    html.includes("googletagmanager") ||
    html.includes("gtag") ||
    html.includes("plausible") ||
    html.includes("cloudflareinsights") ||
    html.includes("posthog") ||
    html.includes("mixpanel") ||
    html.includes("amplitude") ||
    html.includes("heap") ||
    html.includes("segment") ||
    html.includes("fathom");

  const hasErrorTracking =
    html.includes("sentry") ||
    html.includes("rollbar") ||
    html.includes("bugsnag") ||
    html.includes("logrocket") ||
    html.includes("datadog");

  const hasUptime =
    html.includes("betterstack") ||
    html.includes("uptimerobot") ||
    html.includes("freshping") ||
    html.includes("pingdom");

  const hasSPF = false; // Cannot check from HTML — would need DNS lookup

  return [
    {
      id: "analytics-installed",
      title: "Web Analytics Installed",
      description: "You need analytics to understand where users come from and what they do",
      status: hasAnalytics ? "pass" : "fail",
      severity: "high",
      detail: hasAnalytics
        ? "Analytics script detected in page"
        : "No analytics script found — you are flying blind",
      fixGuide:
        "Install Plausible (₹750/mo, GDPR/DPDP-friendly, no cookie banner needed) or Cloudflare Web Analytics (free, cookieless). Avoid GA4 without a cookie consent banner.",
      isIndiaSpecific: false,
    },
    {
      id: "error-tracking",
      title: "Error Tracking Installed",
      description: "You cannot fix bugs you don't know about",
      status: hasErrorTracking ? "pass" : "fail",
      severity: "high",
      detail: hasErrorTracking
        ? "Error tracking script detected"
        : "No error tracking detected (Sentry, Rollbar, etc.)",
      fixGuide:
        "Install Sentry (free tier) or similar. Add it before launch. The first week in production will surface bugs you never saw in development.",
      isIndiaSpecific: false,
    },
    {
      id: "uptime-monitoring",
      title: "Uptime Monitoring",
      description: "Know when you're down before your users do",
      status: hasUptime ? "pass" : "warn",
      severity: "medium",
      detail: hasUptime
        ? "Uptime monitoring reference found"
        : "Cannot auto-verify uptime monitoring — check your hosting dashboard",
      fixGuide:
        "Set up BetterStack (free tier), UptimeRobot, or Freshping to ping your site every minute and alert you via SMS/email/Slack when it's down.",
      isIndiaSpecific: false,
    },
    {
      id: "transactional-email",
      title: "Transactional Email Setup",
      description: "Emails must land in inbox, not spam (SPF/DKIM/DMARC)",
      status: "warn",
      severity: "high",
      detail:
        "Cannot verify SPF/DKIM/DMARC from page scan. Check your DNS records manually.",
      fixGuide:
        "Use Resend, Postmark, or AWS SES for transactional emails. Configure SPF, DKIM, and DMARC DNS records. Test by sending a signup email to a Gmail and checking headers.",
      isIndiaSpecific: false,
    },
    {
      id: "db-backups",
      title: "Database Backups",
      description: "If your database disappears, can you restore it?",
      status: "warn",
      severity: "critical",
      detail:
        "Cannot auto-verify backup configuration. Check your database provider dashboard.",
      fixGuide:
        "Enable daily automated backups in Supabase, PlanetScale, Neon, or whatever DB you use. Most are opt-in. Test restoring from backup at least once before launch.",
      isIndiaSpecific: false,
    },
  ];
}
