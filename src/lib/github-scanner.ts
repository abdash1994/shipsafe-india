import { ScanResult, Category, CategoryId } from "./types";
import { runGithubChecks } from "./checks/github";

export function parseGithubUrl(input: string): { owner: string; repo: string } | null {
  try {
    const url = input.startsWith("http") ? input : `https://${input}`;
    const parsed = new URL(url);
    if (!parsed.hostname.includes("github.com")) return null;
    const parts = parsed.pathname.replace(/^\//, "").split("/");
    if (parts.length < 2 || !parts[0] || !parts[1]) return null;
    return { owner: parts[0], repo: parts[1].replace(/\.git$/, "") };
  } catch {
    return null;
  }
}

export async function scanGithubRepo(owner: string, repo: string): Promise<ScanResult> {
  const start = Date.now();
  const checks = await runGithubChecks(owner, repo);

  const categories: Category[] = ([
    {
      id: "india" as CategoryId,
      label: "India Compliance",
      icon: "🇮🇳",
      description: "India-specific secrets and payment key exposure in source",
      checks: checks.filter(c => c.isIndiaSpecific),
    },
    {
      id: "security" as CategoryId,
      label: "Security & Secrets",
      icon: "🔒",
      description: "Committed secrets, .env exposure, hardcoded credentials",
      checks: checks.filter(c => !c.isIndiaSpecific && ["gh-env-committed", "gh-gitignore-env", "gh-secrets-pkgjson", "gh-security-headers"].includes(c.id)),
    },
    {
      id: "infrastructure" as CategoryId,
      label: "Deployment Config",
      icon: "⚙️",
      description: "Node version, registry, .env.example, vercel.json",
      checks: checks.filter(c => ["gh-npmrc-registry", "gh-node-version", "gh-env-example", "gh-deployment-config"].includes(c.id)),
    },
    {
      id: "legal" as CategoryId,
      label: "Documentation",
      icon: "📄",
      description: "README, license, and project documentation",
      checks: checks.filter(c => ["gh-readme", "gh-license"].includes(c.id)),
    },
  ] as Category[]).filter(cat => cat.checks.length > 0);

  const allChecks = categories.flatMap(c => c.checks);
  const weights: Record<string, number> = { critical: 20, high: 10, medium: 5, low: 2, info: 0 };
  const maxPossible = allChecks.reduce((s, c) => s + (weights[c.severity] || 0), 0);
  const deductions = allChecks
    .filter(c => c.status === "fail")
    .reduce((s, c) => s + (weights[c.severity] || 0), 0);
  const warnDeductions = allChecks
    .filter(c => c.status === "warn")
    .reduce((s, c) => s + Math.floor((weights[c.severity] || 0) / 2), 0);

  const score = maxPossible === 0
    ? 100
    : Math.max(0, Math.round(((maxPossible - deductions - warnDeductions) / maxPossible) * 100));

  const grade =
    score >= 90 ? "A" : score >= 75 ? "B" : score >= 60 ? "C" : score >= 40 ? "D" : "F";

  return {
    url: `https://github.com/${owner}/${repo}`,
    scannedAt: new Date().toISOString(),
    score,
    grade,
    categories,
    summary: {
      critical: allChecks.filter(c => c.status === "fail" && c.severity === "critical").length,
      high: allChecks.filter(c => c.status === "fail" && c.severity === "high").length,
      medium: allChecks.filter(c => (c.status === "fail" || c.status === "warn") && c.severity === "medium").length,
      passed: allChecks.filter(c => c.status === "pass").length,
      total: allChecks.length,
    },
    scanDurationMs: Date.now() - start,
  };
}
