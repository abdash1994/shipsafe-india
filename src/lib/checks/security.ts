import { CheckResult, FetchedPage } from "../types";

export function runSecurityChecks(page: FetchedPage): CheckResult[] {
  const h = page.headers;
  const html = page.html.toLowerCase();

  return [
    {
      id: "https-enforced",
      title: "HTTPS Enforced",
      description: "Site accessible over HTTPS with valid certificate",
      status: page.finalUrl.startsWith("https://") ? "pass" : "fail",
      severity: "critical",
      detail: page.finalUrl.startsWith("https://")
        ? "HTTPS is active"
        : "Site does not redirect to HTTPS",
      fixGuide:
        "Enable HTTPS on your host (Vercel, Netlify, Cloudflare all auto-issue certs). Never launch on http://.",
      isIndiaSpecific: false,
    },
    {
      id: "hsts",
      title: "HSTS Header",
      description: "Strict-Transport-Security forces HTTPS on all connections",
      status: h["strict-transport-security"] ? "pass" : "fail",
      severity: "high",
      detail: h["strict-transport-security"] || "Header missing",
      fixGuide:
        'Add `Strict-Transport-Security: max-age=31536000; includeSubDomains` to your response headers.',
      isIndiaSpecific: false,
    },
    {
      id: "csp",
      title: "Content Security Policy",
      description: "CSP header prevents XSS and injection attacks",
      status: h["content-security-policy"] ? "pass" : "fail",
      severity: "high",
      detail: h["content-security-policy"] || "Header missing",
      fixGuide:
        "Add a Content-Security-Policy header. Start with `default-src 'self'` and expand as needed.",
      isIndiaSpecific: false,
    },
    {
      id: "x-frame-options",
      title: "Clickjacking Protection",
      description: "X-Frame-Options prevents your site from being embedded in iframes",
      status: h["x-frame-options"] ? "pass" : "fail",
      severity: "medium",
      detail: h["x-frame-options"] || "Header missing",
      fixGuide: "Add `X-Frame-Options: DENY` or `SAMEORIGIN` to response headers.",
      isIndiaSpecific: false,
    },
    {
      id: "x-content-type",
      title: "MIME Sniffing Protection",
      description: "X-Content-Type-Options prevents MIME type attacks",
      status: h["x-content-type-options"] ? "pass" : "fail",
      severity: "medium",
      detail: h["x-content-type-options"] || "Header missing",
      fixGuide: "Add `X-Content-Type-Options: nosniff` to response headers.",
      isIndiaSpecific: false,
    },
    {
      id: "referrer-policy",
      title: "Referrer Policy",
      description: "Controls information shared in the Referrer header",
      status: h["referrer-policy"] ? "pass" : "fail",
      severity: "low",
      detail: h["referrer-policy"] || "Header missing",
      fixGuide:
        "Add `Referrer-Policy: strict-origin-when-cross-origin` to response headers.",
      isIndiaSpecific: false,
    },
    {
      id: "no-vercel-domain",
      title: "Custom Domain (Not Platform Default)",
      description: "Site should use a custom domain, not yourapp.vercel.app",
      status: isDefaultPlatformDomain(page.finalUrl) ? "fail" : "pass",
      severity: "medium",
      detail: isDefaultPlatformDomain(page.finalUrl)
        ? `Using platform default domain: ${new URL(page.finalUrl).hostname}`
        : "Custom domain detected",
      fixGuide:
        "Configure a custom domain on your hosting platform before launch. Platform domains reduce trust and break email deliverability.",
      isIndiaSpecific: false,
    },
    {
      id: "no-exposed-keys",
      title: "No API Keys in HTML Source",
      description: "Checks for common API key patterns in client-side HTML",
      status: hasExposedKeys(html) ? "fail" : "pass",
      severity: "critical",
      detail: hasExposedKeys(html)
        ? "Potential API key pattern detected in HTML source"
        : "No obvious key patterns found in HTML",
      fixGuide:
        "Move all API keys to server-side environment variables. Never prefix sensitive keys with NEXT_PUBLIC_ or VITE_.",
      isIndiaSpecific: false,
    },
  ];
}

function isDefaultPlatformDomain(url: string): boolean {
  const hostname = new URL(url).hostname;
  return (
    hostname.endsWith(".vercel.app") ||
    hostname.endsWith(".netlify.app") ||
    hostname.endsWith(".railway.app") ||
    hostname.endsWith(".fly.dev") ||
    hostname.endsWith(".onrender.com") ||
    hostname.endsWith(".replit.app") ||
    hostname.endsWith(".glitch.me")
  );
}

function hasExposedKeys(html: string): boolean {
  const patterns = [
    /sk_live_[a-z0-9]{20,}/i,
    /sk-[a-z0-9]{40,}/i,
    /aik_[a-z0-9]{20,}/i,
    /ghp_[a-zA-Z0-9]{36}/,
    /akia[a-z0-9]{16}/i,
  ];
  return patterns.some((p) => p.test(html));
}
