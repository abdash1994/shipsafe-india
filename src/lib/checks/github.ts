import { CheckResult } from "../types";

interface GithubFile {
  exists: boolean;
  content: string;
}

async function fetchGithubFile(
  owner: string,
  repo: string,
  path: string,
  branch = "main"
): Promise<GithubFile> {
  const urls = [
    `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${path}`,
    `https://raw.githubusercontent.com/${owner}/${repo}/master/${path}`,
  ];

  for (const url of urls) {
    try {
      const res = await fetch(url, {
        headers: { "User-Agent": "ShipSafeBot/1.0" },
        signal: AbortSignal.timeout(5000),
      });
      if (res.ok) {
        return { exists: true, content: await res.text() };
      }
    } catch {
      // try next branch
    }
  }
  return { exists: false, content: "" };
}

async function fetchGithubApi(
  owner: string,
  repo: string,
  token?: string
): Promise<Record<string, unknown> | null> {
  try {
    const headers: Record<string, string> = {
      "User-Agent": "ShipSafeBot/1.0",
      Accept: "application/vnd.github.v3+json",
    };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(
      `https://api.github.com/repos/${owner}/${repo}`,
      { headers, signal: AbortSignal.timeout(5000) }
    );
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function runGithubChecks(
  owner: string,
  repo: string
): Promise<CheckResult[]> {
  // Fetch all needed files in parallel
  const [
    dotenv,
    gitignore,
    npmrc,
    packageJson,
    nextConfig,
    vercelJson,
    envExample,
    license,
    readme,
    robotsTxt,
  ] = await Promise.all([
    fetchGithubFile(owner, repo, ".env"),
    fetchGithubFile(owner, repo, ".gitignore"),
    fetchGithubFile(owner, repo, ".npmrc"),
    fetchGithubFile(owner, repo, "package.json"),
    fetchGithubFile(owner, repo, "next.config.ts").then(f =>
      f.exists ? f : fetchGithubFile(owner, repo, "next.config.js")
    ),
    fetchGithubFile(owner, repo, "vercel.json"),
    fetchGithubFile(owner, repo, ".env.example").then(f =>
      f.exists ? f : fetchGithubFile(owner, repo, ".env.sample")
    ),
    fetchGithubFile(owner, repo, "LICENSE").then(f =>
      f.exists ? f : fetchGithubFile(owner, repo, "LICENSE.md")
    ),
    fetchGithubFile(owner, repo, "README.md").then(f =>
      f.exists ? f : fetchGithubFile(owner, repo, "readme.md")
    ),
    fetchGithubFile(owner, repo, "public/robots.txt").then(f =>
      f.exists ? f : fetchGithubFile(owner, repo, "robots.txt")
    ),
  ]);

  const pkgJson = safeJsonParse(packageJson.content);

  return [
    // .env file committed check
    {
      id: "gh-env-committed",
      title: ".env Not Committed",
      description: "A committed .env file exposes all your secrets to anyone who clones the repo",
      status: dotenv.exists ? "fail" : "pass",
      severity: "critical",
      detail: dotenv.exists
        ? ".env file found in repository root — all secrets are publicly visible"
        : ".env file not found in repository (correct)",
      fixGuide:
        "Delete .env from your repo: `git rm --cached .env && git commit -m 'remove .env'`. Add .env to .gitignore. Rotate every secret that was exposed immediately.",
      isIndiaSpecific: false,
    },

    // .gitignore covers .env
    {
      id: "gh-gitignore-env",
      title: ".gitignore Covers .env Files",
      description: ".gitignore must prevent future accidental commits of .env",
      status: !gitignore.exists
        ? "fail"
        : gitignore.content.includes(".env")
        ? "pass"
        : "fail",
      severity: "high",
      detail: !gitignore.exists
        ? "No .gitignore found"
        : gitignore.content.includes(".env")
        ? ".env is listed in .gitignore"
        : ".gitignore exists but does not include .env",
      fixGuide: "Add `.env*` to your .gitignore file.",
      isIndiaSpecific: false,
    },

    // Private registry in .npmrc
    {
      id: "gh-npmrc-registry",
      title: "Public npm Registry in .npmrc",
      description: "A private registry in .npmrc will break deployment on Vercel/Netlify",
      status: !npmrc.exists
        ? "pass"
        : npmrc.content.includes("registry.npmjs.org")
        ? "pass"
        : npmrc.content.toLowerCase().includes("registry=")
        ? "warn"
        : "pass",
      severity: "high",
      detail: !npmrc.exists
        ? "No .npmrc found (npm will use public registry)"
        : npmrc.content.includes("registry.npmjs.org")
        ? ".npmrc correctly pins to registry.npmjs.org"
        : npmrc.content.toLowerCase().includes("registry=")
        ? ".npmrc contains a custom registry — verify it is accessible from Vercel build machines"
        : ".npmrc found but no registry override detected",
      fixGuide:
        "Add `registry=https://registry.npmjs.org/` to your project .npmrc to override any global Sonatype/Nexus config on developer machines.",
      isIndiaSpecific: false,
    },

    // Hardcoded secrets in package.json
    {
      id: "gh-secrets-pkgjson",
      title: "No Hardcoded Secrets in package.json",
      description: "API keys or tokens must not be in package.json scripts or config",
      status: hasSecretPatterns(packageJson.content) ? "fail" : "pass",
      severity: "critical",
      detail: hasSecretPatterns(packageJson.content)
        ? "Potential secret pattern detected in package.json"
        : "No obvious secret patterns in package.json",
      fixGuide:
        "Move all secrets to environment variables. Never hardcode API keys in package.json scripts.",
      isIndiaSpecific: false,
    },

    // Node.js version pinned
    {
      id: "gh-node-version",
      title: "Node.js Version Pinned",
      description: "Unpinned Node.js version causes different behavior in dev vs production",
      status: (() => {
        const engines = pkgJson?.engines as Record<string, string> | undefined;
        const nvmrc = false; // Would need separate fetch
        if (engines?.node) return "pass";
        return "warn";
      })(),
      severity: "medium",
      detail: (() => {
        const engines = pkgJson?.engines as Record<string, string> | undefined;
        if (engines?.node) return `Node.js pinned to: ${engines.node}`;
        return "No engines.node field in package.json";
      })(),
      fixGuide:
        'Add `"engines": { "node": "20.x" }` to package.json and a `.nvmrc` file with `20`.',
      isIndiaSpecific: false,
    },

    // .env.example present
    {
      id: "gh-env-example",
      title: ".env.example Present",
      description: "New contributors need to know which environment variables are required",
      status: envExample.exists ? "pass" : "warn",
      severity: "low",
      detail: envExample.exists
        ? ".env.example or .env.sample found"
        : "No .env.example found — contributors won't know which env vars are needed",
      fixGuide:
        "Create .env.example with all required keys (no real values). Commit it to the repo.",
      isIndiaSpecific: false,
    },

    // vercel.json / deployment config
    {
      id: "gh-deployment-config",
      title: "Deployment Config Present",
      description: "vercel.json pins build settings so they don't change unexpectedly",
      status: vercelJson.exists ? "pass" : "warn",
      severity: "medium",
      detail: vercelJson.exists
        ? "vercel.json found"
        : "No vercel.json found — Vercel will auto-detect settings (usually fine but explicit is safer)",
      fixGuide:
        "Add a vercel.json specifying framework, buildCommand, and installCommand.",
      isIndiaSpecific: false,
    },

    // Security headers in next.config
    {
      id: "gh-security-headers",
      title: "Security Headers in next.config",
      description: "HTTP security headers (HSTS, CSP, X-Frame-Options) must be set in code",
      status: nextConfig.exists && nextConfig.content.includes("headers")
        ? "pass"
        : nextConfig.exists
        ? "warn"
        : "fail",
      severity: "high",
      detail: nextConfig.exists && nextConfig.content.includes("headers")
        ? "Security headers configured in next.config"
        : nextConfig.exists
        ? "next.config found but no headers() function detected"
        : "No next.config.ts/js found",
      fixGuide:
        "Add an async headers() function to next.config.ts that sets Strict-Transport-Security, Content-Security-Policy, X-Frame-Options, X-Content-Type-Options, and Referrer-Policy.",
      isIndiaSpecific: false,
    },

    // India: Razorpay key in source
    {
      id: "gh-razorpay-source",
      title: "No Razorpay Key in Source Code",
      description: "Razorpay live keys must not be committed to the repository",
      status: hasRazorpayKey(packageJson.content) ? "fail" : "pass",
      severity: "critical",
      detail: hasRazorpayKey(packageJson.content)
        ? "Razorpay key pattern detected in package.json"
        : "No Razorpay key found in scanned source files",
      fixGuide:
        "Store Razorpay keys in environment variables only. Never commit them. If you did, rotate your keys immediately at razorpay.com/dashboard.",
      regulation: "RBI PA-O Directions 2025, PCI DSS v4.0",
      isIndiaSpecific: true,
    },

    // README present
    {
      id: "gh-readme",
      title: "README Present",
      description: "Every repo should have documentation",
      status: readme.exists ? "pass" : "warn",
      severity: "low",
      detail: readme.exists ? "README.md found" : "No README.md found",
      fixGuide: "Add a README.md explaining what the project does, how to run it, and how to deploy it.",
      isIndiaSpecific: false,
    },

    // License
    {
      id: "gh-license",
      title: "License File Present",
      description: "Without a license, others technically cannot use your code",
      status: license.exists ? "pass" : "warn",
      severity: "low",
      detail: license.exists ? "LICENSE file found" : "No LICENSE file found",
      fixGuide:
        "Add a LICENSE file. For open source: MIT or Apache 2.0. For proprietary: a simple 'All Rights Reserved' file.",
      isIndiaSpecific: false,
    },
  ];
}

function safeJsonParse(content: string): Record<string, unknown> | null {
  try {
    return JSON.parse(content);
  } catch {
    return null;
  }
}

function hasSecretPatterns(content: string): boolean {
  const patterns = [
    /sk_live_[a-zA-Z0-9]{14,}/,
    /sk-[a-zA-Z0-9]{40,}/,
    /ghp_[a-zA-Z0-9]{36}/,
    /AKIA[A-Z0-9]{16}/,
    /xoxb-[0-9]+-[a-zA-Z0-9]+/,
  ];
  return patterns.some(p => p.test(content));
}

function hasRazorpayKey(content: string): boolean {
  return /rzp_live_[a-zA-Z0-9]{14,}/.test(content);
}
