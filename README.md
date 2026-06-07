# 🛡️ ShipSafe India

> **The only pre-launch scanner built for Indian vibe coders.**
> Paste your URL. Know if your app is India-ready in 60 seconds.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)

**Live:** [shipsafe-india.vercel.app](https://shipsafe-india.vercel.app) · **Pitch Deck:** [PITCH.md](./PITCH.md)

---

## The Problem

91.5% of AI-built apps ship with at least one critical vulnerability *(Escape.tech, Q1 2026)*. Indian founders using Cursor, Bolt, Lovable, or Replit ship fast — but miss two layers of problems:

1. **Universal gaps** — broken auth, no analytics, exposed API keys, missing SEO basics
2. **India-specific gaps** — DPDP consent, Grievance Officer, RBI data localization, CERT-In reporting — things no global scanner checks

**ShipSafe India automates both layers into a 60-second URL scan.**

---

## What It Checks (39 checks, 5 categories)

### 🇮🇳 India Compliance — 11 checks *(unique — no other scanner covers these)*

| Check | Regulation | Risk if Missed |
|-------|-----------|----------------|
| DPDP consent banner present | DPDP Act 2023, §5–6 | Up to ₹250 crore fine |
| Privacy notice in plain language | DPDP Act 2023, §5 | Non-compliant data collection |
| Grievance Officer name + contact published | DPDP + RBI PA-O 2025 | Payment processor won't activate |
| Hindi language support | DPDP Act 2023, §5 | Consent invalid for non-English users |
| Razorpay/payment key not in client HTML | RBI PA-O 2025, PCI DSS | Payment account suspension |
| Refund policy page exists | Consumer Protection Rules 2020 | Razorpay/Cashfree onboarding blocked |
| Physical address/contact published | E-Commerce Rules 2020 | Consumer violation |
| Indian payment gateway detected | — | UPI/Razorpay expected by Indian users |
| Cyber incident response awareness | CERT-In Directions 2022 | ₹70,000+ penalty per incident |
| Data breach notification plan | DPDP Act 2023, §8 | Data Protection Board penalty |
| RBI data localization awareness | RBI Circular 2018 | RBI enforcement action |

### 🔒 Security — 8 checks
HTTPS enforced · HSTS · Content Security Policy · X-Frame-Options · X-Content-Type-Options · Referrer Policy · Custom domain check · No exposed API keys in HTML

### ⚖️ Legal & Compliance — 6 checks
Privacy policy · Terms of service · Cookie consent · Contact email · Form accessibility (WCAG labels) · Security contact

### 🔍 SEO & Discoverability — 9 checks
robots.txt · sitemap.xml · Page title · Meta description · Open Graph tags · H1 tag · Canonical URL · Viewport meta · Favicon

### 📊 Monitoring & Analytics — 5 checks
Web analytics · Error tracking · Uptime monitoring · Transactional email (SPF/DKIM) · Database backups

---

## How It Works

```
1. Enter any URL → https://yourapp.in
2. Scanner fetches the page + robots.txt + sitemap.xml
3. Runs 39 checks across 5 categories
4. Returns grade (A–F), score (0–100), and per-check findings
5. Each finding shows: what's wrong, why it matters, how to fix it, which regulation applies
```

**Example output for a typical vibe-coded app:**

```
Grade: D  |  Score: 42/100

🔴 3 Critical  |  🟠 8 High  |  🟡 11 Medium  |  ✅ 8 Passed

🇮🇳 INDIA COMPLIANCE
  ✗ DPDP Consent Banner missing              [CRITICAL] DPDP Act §5
  ✗ Grievance Officer not published          [HIGH]     DPDP + RBI
  ✗ No Refund Policy found                   [HIGH]     Consumer Protection Rules
  ⚠ Hindi language support not detected     [MEDIUM]   DPDP Act §5
  ✓ HTTPS enforced

🔒 SECURITY
  ✗ Content Security Policy header missing  [HIGH]
  ✓ No API keys exposed in HTML
  ...
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 |
| Runtime | Node.js 20 |
| Deployment | Vercel (Mumbai-region) |
| Scanner | Custom HTTP + HTML analysis (no external APIs) |

---

## Running Locally

```bash
git clone https://github.com/abdash1994/shipsafe-india.git
cd shipsafe-india
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

> **Note:** If your local `~/.npmrc` points to a private registry (e.g. Sonatype Nexus),
> the project `.npmrc` overrides it to use `registry.npmjs.org`.

---

## API

### `POST /api/scan`

**Request:**
```json
{ "url": "https://yourapp.in" }
```

**Response:**
```json
{
  "url": "https://yourapp.in",
  "scannedAt": "2026-06-08T...",
  "score": 42,
  "grade": "D",
  "categories": [...],
  "summary": {
    "critical": 3,
    "high": 8,
    "medium": 11,
    "passed": 8,
    "total": 39
  },
  "scanDurationMs": 350
}
```

Rate limited to **10 requests per IP per minute**.

---

## Security Design

- **SSRF protection** — private/internal IP addresses blocked from scanning
- **Rate limiting** — in-memory, 10 req/min per IP with standard `X-RateLimit-*` headers
- **Security headers** — HSTS, CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy
- **No secrets required** — scanner uses only public HTTP, no API keys needed to run
- **HTTP → HTTPS redirect** — enforced in production via `x-forwarded-proto` header

---

## Project Background

ShipSafe India was built after researching a viral Instagram reel by `@saban.talks` that got **15,500 likes and 8,000 comments** — all asking for a pre-launch checklist for vibe-coded apps. The creator's solution was a PDF delivered via DM. This is the automated version, built India-first because no existing scanner (VibeDoctor, CheckVibe, Vibe App Scanner) checks for DPDP, RBI, or CERT-In compliance.

**Origin:** Built in a single session using Cursor by [Aditya Bikram Dash](https://github.com/abdash1994), Senior PM at Sonatype — where compliance scanning is the day job.

📋 **[Read the full investor pitch deck →](./PITCH.md)**

---

## Regulations Covered

| Regulation | Scope |
|-----------|-------|
| **DPDP Act 2023** | India's privacy law — consent, notices, rights, breach notification |
| **RBI PA-O Directions 2025** | Payment aggregator compliance, data localization, merchant requirements |
| **CERT-In Directions 2022** | Cyber incident reporting (6-hour clock) |
| **Consumer Protection (E-Commerce) Rules 2020** | Contact info, refund policy, address |
| **WCAG 2.2 AA** | Web accessibility |

---

## Roadmap

- [ ] Fix-it widget — DPDP consent banner (one-click embed, ₹999/month)
- [ ] Continuous monitoring — rescan on deploy, alert on regression
- [ ] CI/CD integration — GitHub Actions, Vercel deploy hooks
- [ ] PDF compliance report — downloadable audit proof for investors
- [ ] Mobile app checks — Play Store, App Store-specific requirements
- [ ] API access for agencies — multi-site scanning

---

## License

MIT — free to use, fork, and build on.
