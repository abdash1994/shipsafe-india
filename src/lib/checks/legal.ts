import { CheckResult, FetchedPage } from "../types";

export function runLegalChecks(page: FetchedPage): CheckResult[] {
  const html = page.html.toLowerCase();

  return [
    {
      id: "privacy-policy",
      title: "Privacy Policy Exists",
      description: "Legally required when collecting any personal data",
      status: hasLink(html, ["privacy", "privacy-policy", "/privacy"]) ? "pass" : "fail",
      severity: "critical",
      detail: hasLink(html, ["privacy", "privacy-policy", "/privacy"])
        ? "Privacy policy link found"
        : "No privacy policy link detected in page HTML",
      fixGuide:
        "Publish a privacy policy page explaining what data you collect, why, and how. Required under DPDP Act (India), GDPR (EU users), and generally expected by app stores and payment processors.",
      isIndiaSpecific: false,
    },
    {
      id: "terms-of-service",
      title: "Terms of Service Exists",
      description: "Protects you legally and sets user expectations",
      status: hasLink(html, ["terms", "tos", "terms-of-service", "terms-and-conditions"])
        ? "pass"
        : "fail",
      severity: "high",
      detail: hasLink(html, ["terms", "tos", "terms-of-service", "terms-and-conditions"])
        ? "Terms link found"
        : "No terms of service link detected",
      fixGuide:
        "Publish a terms of service page covering permitted use, liability disclaimers, and dispute resolution. Without it, you have no legal recourse if users abuse your platform.",
      isIndiaSpecific: false,
    },
    {
      id: "cookie-consent",
      title: "Cookie Consent (Pre-Tracking)",
      description:
        "Non-essential tracking must not fire before user gives consent",
      status: hasCookieConsent(html) ? "pass" : "warn",
      severity: "high",
      detail: hasCookieConsent(html)
        ? "Cookie consent mechanism detected"
        : "No cookie banner or consent gate detected — verify tracking pixels are not firing on page load",
      fixGuide:
        "If you use GA4, Meta Pixel, LinkedIn Insight, or any ad pixel, you need consent before loading them for EU users. Use Cookieless analytics (Plausible, Cloudflare Analytics) to skip this entirely.",
      isIndiaSpecific: false,
    },
    {
      id: "contact-page",
      title: "Contact / Support Email Visible",
      description: "Users must be able to reach you — trust signal and legal requirement",
      status: hasContactInfo(html) ? "pass" : "warn",
      severity: "medium",
      detail: hasContactInfo(html)
        ? "Contact info found"
        : "No contact email or support page found on page",
      fixGuide:
        "Add at minimum a support email address on your website. Cloudflare Email Routing provides free email forwarding to your Gmail.",
      isIndiaSpecific: false,
    },
    {
      id: "accessibility-labels",
      title: "Form Labels (Accessibility)",
      description:
        "Form inputs without labels are the #1 cited ADA violation",
      status: checkFormLabels(page.html) ? "pass" : "warn",
      severity: "medium",
      detail:
        "Checking for inputs without associated labels (placeholder-only inputs are not accessible)",
      fixGuide:
        "Every <input>, <select>, and <textarea> must have an associated <label> element or aria-label. Placeholder text alone is not sufficient and triggers automated ADA demand letters.",
      isIndiaSpecific: false,
    },
    {
      id: "security-contact",
      title: "Security Contact Email",
      description: "security@ email for responsible disclosure",
      status: html.includes("security@") ? "pass" : "warn",
      severity: "low",
      detail: html.includes("security@")
        ? "Security contact email found"
        : "No security@ email published on page",
      fixGuide:
        "Add a security@ email to your site. This is the address security researchers will try first when they find a vulnerability in your app. CERT-In also needs this for coordinated disclosure.",
      isIndiaSpecific: false,
    },
  ];
}

function hasLink(html: string, patterns: string[]): boolean {
  return patterns.some(
    (p) =>
      html.includes(`href="/${p}`) ||
      html.includes(`href='/${p}`) ||
      html.includes(`/${p}"`) ||
      html.includes(p + " ") ||
      html.includes(">" + p + "<")
  );
}

function hasCookieConsent(html: string): boolean {
  return (
    html.includes("cookie") ||
    html.includes("cookieconsent") ||
    html.includes("cookie-consent") ||
    html.includes("onetrust") ||
    html.includes("cookiebot") ||
    html.includes("gdpr") ||
    html.includes("ccpa")
  );
}

function hasContactInfo(html: string): boolean {
  return (
    html.includes("contact") ||
    html.includes("support@") ||
    html.includes("hello@") ||
    html.includes("mailto:") ||
    html.includes("/contact") ||
    html.includes("reach us")
  );
}

function checkFormLabels(html: string): boolean {
  const inputCount = (html.match(/<input/gi) || []).length;
  const labelCount = (html.match(/<label/gi) || []).length;
  const ariaLabelCount = (html.match(/aria-label/gi) || []).length;
  if (inputCount === 0) return true;
  return labelCount + ariaLabelCount >= inputCount * 0.8;
}
