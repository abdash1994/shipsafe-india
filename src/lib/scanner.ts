import { ScanResult, Category, CheckResult } from "./types";
import { fetchPage, fetchResource } from "./fetcher";
import { runSecurityChecks } from "./checks/security";
import { runIndiaChecks } from "./checks/india";
import { runLegalChecks } from "./checks/legal";
import { runSEOChecks } from "./checks/seo";
import { runAnalyticsChecks } from "./checks/analytics";

export async function scanUrl(rawUrl: string): Promise<ScanResult> {
  const start = Date.now();
  const url = rawUrl.startsWith("http") ? rawUrl : `https://${rawUrl}`;

  // Fetch main page + supporting resources in parallel
  const [page, robots, sitemap] = await Promise.all([
    fetchPage(url),
    fetchResource(url, "/robots.txt"),
    fetchResource(url, "/sitemap.xml"),
  ]);

  // Run all check modules
  const securityChecks = runSecurityChecks(page);
  const indiaChecks = runIndiaChecks(page, robots.content, sitemap.content);
  const legalChecks = runLegalChecks(page);
  const seoChecks = runSEOChecks(page, robots, sitemap);
  const analyticsChecks = runAnalyticsChecks(page);

  const categories: Category[] = [
    {
      id: "india",
      label: "India Compliance",
      icon: "🇮🇳",
      description: "DPDP Act, RBI, CERT-In, and India-specific requirements",
      checks: indiaChecks,
    },
    {
      id: "security",
      label: "Security",
      icon: "🔒",
      description: "HTTPS, headers, secret exposure, and attack surface",
      checks: securityChecks,
    },
    {
      id: "legal",
      label: "Legal & Compliance",
      icon: "⚖️",
      description: "Privacy policy, terms, consent, and accessibility",
      checks: legalChecks,
    },
    {
      id: "seo",
      label: "SEO & Discoverability",
      icon: "🔍",
      description: "robots.txt, sitemap, meta tags, and social previews",
      checks: seoChecks,
    },
    {
      id: "analytics",
      label: "Monitoring & Analytics",
      icon: "📊",
      description: "Analytics, error tracking, uptime, and backups",
      checks: analyticsChecks,
    },
  ];

  const allChecks = categories.flatMap((c) => c.checks);
  const summary = computeSummary(allChecks);
  const score = computeScore(allChecks);
  const grade = scoreToGrade(score);

  return {
    url: page.finalUrl,
    scannedAt: new Date().toISOString(),
    score,
    grade,
    categories,
    summary,
    scanDurationMs: Date.now() - start,
  };
}

function computeSummary(checks: CheckResult[]) {
  return {
    critical: checks.filter(
      (c) => c.status === "fail" && c.severity === "critical"
    ).length,
    high: checks.filter(
      (c) => c.status === "fail" && c.severity === "high"
    ).length,
    medium: checks.filter(
      (c) => (c.status === "fail" || c.status === "warn") && c.severity === "medium"
    ).length,
    passed: checks.filter((c) => c.status === "pass").length,
    total: checks.length,
  };
}

function computeScore(checks: CheckResult[]): number {
  const weights: Record<string, number> = {
    critical: 20,
    high: 10,
    medium: 5,
    low: 2,
    info: 0,
  };

  const maxPossible = checks.reduce((sum, c) => sum + (weights[c.severity] || 0), 0);
  const deductions = checks
    .filter((c) => c.status === "fail")
    .reduce((sum, c) => sum + (weights[c.severity] || 0), 0);
  const warnDeductions = checks
    .filter((c) => c.status === "warn")
    .reduce((sum, c) => sum + Math.floor((weights[c.severity] || 0) / 2), 0);

  if (maxPossible === 0) return 100;
  const raw = Math.max(
    0,
    ((maxPossible - deductions - warnDeductions) / maxPossible) * 100
  );
  return Math.round(raw);
}

function scoreToGrade(score: number): "A" | "B" | "C" | "D" | "F" {
  if (score >= 90) return "A";
  if (score >= 75) return "B";
  if (score >= 60) return "C";
  if (score >= 40) return "D";
  return "F";
}
