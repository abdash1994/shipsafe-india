# ShipSafe India

> Paste your URL. Know if your app is India-ready in 60 seconds. The only pre-launch scanner that checks DPDP, RBI, and CERT-In — not just global security.

**Live demo:** [shipsafe-india.vercel.app](https://shipsafe-india.vercel.app) · **Pitch deck:** [PITCH.md](./PITCH.md)

---

## What it does

- Runs **39 automated checks** across security, India compliance, SEO, legal, and monitoring
- Catches **India-specific gaps** no other scanner covers — DPDP consent, Grievance Officer, Razorpay key exposure, RBI data localization, CERT-In reporting
- Returns a **grade (A–F) and score (0–100)** with per-check explanations and fix guides
- Flags which **regulation applies** (DPDP §5, RBI PA-O 2025, CERT-In 2022) so you know the real-world consequence
- **Free, no signup** — paste a URL and get results in ~15 seconds

---

## Features

| | |
|---|---|
| 🇮🇳 **India Compliance** | DPDP consent, Grievance Officer, Razorpay key check, RBI data localization, CERT-In, Hindi language, refund policy |
| 🔒 **Security** | HTTPS, HSTS, CSP, X-Frame-Options, Referrer-Policy, secret key detection, custom domain check |
| ⚖️ **Legal** | Privacy policy, terms of service, cookie consent, form accessibility, security contact |
| 🔍 **SEO** | robots.txt, sitemap.xml, Open Graph, H1, canonical URLs, meta description, viewport, favicon |
| 📊 **Monitoring** | Analytics, error tracking (Sentry), uptime monitoring, transactional email, database backups |

---

## India compliance — why it matters

Every other scanner (VibeDoctor, CheckVibe, Vibe App Scanner) covers global security. None check for India-specific requirements:

| Check | Regulation | Penalty if missed |
|-------|-----------|-------------------|
| DPDP consent banner | DPDP Act 2023, §5–6 | Up to ₹250 crore |
| Grievance Officer published | DPDP + RBI PA-O 2025 | Payment processor blocks activation |
| Razorpay key in client HTML | PCI DSS + RBI PA-O 2025 | Payment account suspended |
| Refund policy page | Consumer Protection Rules 2020 | Cashfree/Razorpay onboarding blocked |
| Data on India servers | RBI Circular 2018 | RBI enforcement |
| CERT-In incident plan | CERT-In Directions 2022 | ₹70,000+ per incident |

---

## Tech stack

```
Frontend      Next.js 16 (App Router) + TypeScript + Tailwind CSS v4
Scanner       Custom HTTP + HTML analysis — no external APIs, no API keys needed
Security      SSRF protection, rate limiting (10 req/min), full HTTP security headers
Hosting       Vercel
```

---

## Quick start

```bash
git clone https://github.com/abdash1994/shipsafe-india.git
cd shipsafe-india
npm install
npm run dev        # dashboard at http://localhost:3000
```

Then POST to the API:

```bash
curl -X POST http://localhost:3000/api/scan \
  -H "Content-Type: application/json" \
  -d '{"url": "https://yourapp.in"}'
```

---

## Repository structure

```
shipsafe-india/
├── src/
│   ├── app/
│   │   ├── page.tsx              Landing page + URL scanner input
│   │   ├── results/page.tsx      Results display with grade + findings
│   │   └── api/scan/route.ts     Scanner API (POST /api/scan)
│   └── lib/
│       ├── scanner.ts            Orchestrator — runs all checks, computes score
│       ├── fetcher.ts            HTTP fetch + resource helpers
│       └── checks/
│           ├── india.ts          11 India-specific checks (DPDP, RBI, CERT-In)
│           ├── security.ts       8 security checks
│           ├── legal.ts          6 legal/compliance checks
│           ├── seo.ts            9 SEO checks
│           └── analytics.ts      5 monitoring checks
├── vercel.json                   Vercel build config
├── next.config.ts                Security headers + HTTP→HTTPS redirect
├── .npmrc                        Pins to public npm registry
├── PITCH.md                      Investor pitch deck (12 slides)
└── .env.example                  Environment variable reference
```

---

## API

`POST /api/scan` — rate limited to 10 requests/IP/minute

```json
// Request
{ "url": "https://yourapp.in" }

// Response
{
  "score": 42,
  "grade": "D",
  "summary": { "critical": 3, "high": 8, "medium": 11, "passed": 8, "total": 39 },
  "categories": [...]
}
```

Each check in `categories` includes `title`, `status` (pass/fail/warn), `severity`, `detail`, `fixGuide`, and `regulation`.

---

## Roadmap

- [ ] Fix-it widget — DPDP consent banner auto-embed (₹999/month)
- [ ] Continuous monitoring — rescan on deploy, alert on regression  
- [ ] PDF compliance report — downloadable audit proof
- [ ] CI/CD integration — GitHub Actions, Vercel deploy hooks
- [ ] Mobile app checks — Play Store, App Store requirements

---

## Author

**Aditya Bikram Dash** — Senior PM at Sonatype (compliance/security SaaS)  
[github.com/abdash1994](https://github.com/abdash1994) · [linkedin.com/in/adityabikramdash](https://linkedin.com/in/adityabikramdash)

---

*Built in one session with Cursor. Scanning URLs now — deploy your own or use the live demo.*
