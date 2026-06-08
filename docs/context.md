# ShipSafe India — Session Context & Resume Guide

> Last updated: 2026-06-08  
> Purpose: Complete context to resume work in a new session without losing history

---

## What this product is

**ShipSafe India** is a free, no-signup pre-launch scanner for Indian founders and vibe coders.

- Live: https://shipsafe-india.vercel.app
- Repo: https://github.com/abdash1994/shipsafe-india
- Stack: Next.js 16 (App Router) + TypeScript + Tailwind CSS v4 + Vercel

Core promise: paste a URL or GitHub repo → know if your app is India-ready in ~60 seconds.

---

## Sessions completed (2026-06-08)

### Session 1 — Instagram reel research
User shared an Instagram reel by @nimratbuilds about startup tech stack requirements.
Scraped the video frame-by-frame using browser CDP. Full tool list extracted:

| Tool | Purpose | Cost |
|---|---|---|
| GitHub | Version control | Free |
| Namecheap | Domain | $12/yr |
| Clerk | Authentication | Free |
| Cloudflare | DNS | Free |
| Sentry | Error tracking | Free |
| Resend | Email | Free |
| Uptime Robot | Monitoring | Free |
| PostHog | Analytics | Free |
| Pinecone | Vector database | Free |

Also identified what was **missing** from the reel for a market-ready app (1000s of users):
- Primary database (Postgres)
- App hosting / runtime
- Redis / cache
- File/object storage (S3/R2)
- Background jobs / queue
- CI/CD pipeline
- Payments (Stripe)
- Admin panel
- Feature flags
- Legal pages (Privacy, Terms, DPA)
- Rate limiting / WAF

---

### Session 2 — Product decision: feature split

**Decision made:** add a second feature track to ShipSafe India alongside the existing scanner.

Two separate jobs-to-be-done:
1. **Start Smart** (`/startup`) — proactive guide: "What do I need and when, before launch?"
2. **Ship Safe** (`/scan`) — reactive scan: "Is my live app compliant and ready to ship?"

**Positioning:**
- Get Started = startup essentials, registration, payments, policies, compliance, launch ops
- Ship Safe = scan for DPDP, RBI, CERT-In, legal, security, SEO, monitoring gaps

**Why not merge them:** The two user questions are fundamentally different. One is educational and milestone-based, the other is evidence-based and app-specific.

---

### Session 3 — Implementation

Full implementation was completed, tested, deployed, and merged to main.

#### New routes added

| Route | What it does |
|---|---|
| `/` | New two-path landing page — founder journey chooser |
| `/startup` | 5-phase interactive startup checklist guide |
| `/scan` | Existing scanner (moved from `/`) |
| `/results` | Unchanged functionally, nav/footer updated |

#### New files created

```
src/
  app/
    page.tsx                    ← replaced: two-card landing
    scan/page.tsx               ← new: scanner route
    startup/page.tsx            ← new: startup guide route
  components/
    founder-journey-cards.tsx   ← landing page two-card component
    scan-experience.tsx         ← full scanner UI extracted from old page.tsx
    site-nav.tsx                ← shared nav (Home | Get Started | Scan My App)
    site-footer.tsx             ← shared footer
    startup-guide-page.tsx      ← full startup guide page with state
    startup-guide-view.tsx      ← phase+item renderer (reusable)
  lib/
    site-journeys.ts            ← data model for two landing cards
    startup-guide.ts            ← 5-phase checklist data (13 items)
    scan-entry.ts               ← URL decode helpers + legacy redirect logic
vitest.config.ts                ← test runner config
```

#### Tests added (10 total, all passing)
```
src/lib/site-journeys.test.ts     5 tests — journey data structure
src/lib/scan-entry.test.ts        3 tests — URL decode + redirect logic
src/components/feature-split.test.tsx  2 tests — component render checks
```

#### Startup guide phases
- **Phase 1: Foundation** — domain, app stack, auth/roles
- **Phase 2: Money & Trust** — payments, policies (privacy/terms/refund), support contact
- **Phase 3: Compliance & Risk** — DPDP obligations, grievance contact, incident plan
- **Phase 4: Launch Readiness** — monitoring, transactional email, backups
- **Phase 5: Pre-Ship Check** — CTA into the ShipSafe scanner

Each item has: what it is, when you need it, mandatory/recommended/later status, common mistake, optional scan hint.

#### Key UX decisions
- Filter buttons (ALL / MANDATORY / RECOMMENDED / LATER) on startup guide
- Progress tracking cards (checklist progress, mandatory complete, current filter)
- localStorage persistence for checkbox state across sessions
- Each item links back to related scan checks where applicable
- Phase 5 ends with CTA directly into `/scan`

---

## Bugs found and fixed

| Bug | Fix |
|---|---|
| Hydration mismatch on `/results` — `useState` initializer read `window.sessionStorage` during SSR | Moved to `useEffect` after hydration |
| Nav stats row wrapping to second line on all viewports, looked like double-header | Removed stats from `SiteNav` entirely |
| Legacy `/?url=...` bookmarklet links broken after home page restructure | Added server-side redirect in `app/page.tsx` via `getLegacyScanRedirect()` |
| `/scan?url=` auto-scan not remounting on URL change | Added `key={initialUrl}` prop to force remount |

---

## Current deployment state

| | |
|---|---|
| **Production** | https://shipsafe-india.vercel.app — live, running new code |
| **GitHub** | `main` branch at commit `81f1f29` (Merge PR #1) |
| **Vercel project** | abdash1994s-projects/shipsafe |
| **Branch** | `feature/startup-guide-split` merged + deleted |

Verified on production:
- All 4 routes return HTTP 200
- `/api/scan` returns valid results (example.com: D/49, 39 checks, 5 categories)
- No React hydration errors on any route

---

## Decisions not yet made / next possible work

- The startup guide currently has one default path (Indian SaaS/web app). Could add tracks for ecommerce, fintech, marketplace.
- No analytics yet on which checklist items get marked most/least (PostHog events would be useful)
- No shareable checklist link (URL encoding of checked state)
- The Instagram reel tech stack list could be embedded as a "recommended tools" sub-section in the startup guide
- Phase 2 "Money & Trust" could deep-link to TrustStack (the DPDP consent widget product) for the consent/cookie item
- TrustStack integration is in the roadmap as the Phase 2 fix-it monetization layer

---

## Related products in Blue Ocean Project workspace

| Product | Location | Status |
|---|---|---|
| ShipSafe India | `/Desktop/shipsafe` (also on GitHub) | Live at shipsafe-india.vercel.app |
| TrustStack | `Blue Ocean Project/product portfolio/` | MVP shipped, Phase 2 = fix-it widget for ShipSafe |
| TokenLens | `Blue Ocean Project/tokenlens/` | AI token/cost analytics CLI |
| Job Search OS | `Blue Ocean Project/job-search-os/` | Remote job-search dashboard |

---

## How to resume work in a new session

1. Clone the repo: `git clone https://github.com/abdash1994/shipsafe-india.git && cd shipsafe-india`
2. Install: `npm install`
3. Run locally: `npm run dev` → http://localhost:3000
4. Tests: `npm test`
5. Build check: `npm run build`
6. Reference this file for full context on what was built and why

This file lives at `docs/context.md` in the repo.
