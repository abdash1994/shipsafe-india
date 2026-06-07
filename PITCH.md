# ShipSafe India — Pitch Deck

> **The only pre-launch scanner built for Indian vibe coders.**
> Paste your URL. Know if your app is India-ready in 60 seconds.

---

## Slide 1 — The Problem

**91.5% of AI-built apps ship with at least one critical vulnerability.**
*(Escape.tech audit of 5,600 real vibe-coded apps, Q1 2026)*

Every Indian founder building with Cursor, Bolt, Lovable, or Replit faces the same gap:

- They ship fast — sometimes in hours
- They miss the things a senior engineer would catch in 2 hours
- And India has its own layer on top: **DPDP, RBI, CERT-In** — regulations that global tools don't know exist

**Result:** Apps go live legally exposed, technically broken, or invisble to Google.

---

## Slide 2 — The Market Signal

The Instagram reel that inspired this product got **15,500 likes and 8,000 comments** — all asking for a "pre-launch checklist." Every comment was a potential customer saying:

> *"I don't know if my app is ready and I'm scared."*

The creator's solution: a PDF delivered via DMs.

Our solution: an automated scanner that runs in 60 seconds.

---

## Slide 3 — What Is ShipSafe India?

**ShipSafe India is a URL scanner that tells Indian founders exactly what's broken before they share their app with real users.**

```
https://yourapp.in  →  [Scan Now]
```

60 seconds later:

```
Grade: D  |  Score: 42/100

🔴 3 Critical  |  🟠 8 High  |  🟡 11 Medium  |  ✅ 8 Passed

🇮🇳 INDIA COMPLIANCE
  ✗ DPDP Consent Banner missing         [CRITICAL]
  ✗ Grievance Officer not published     [HIGH]
  ✗ No Refund Policy found              [HIGH]
  ✓ HTTPS enforced
  ...
```

Every finding comes with a plain-English explanation and a "How to fix it" guide.

---

## Slide 4 — Why India-Specific?

Every other scanner (VibeDoctor, CheckVibe, Vibe App Scanner) checks global security.
**None of them check for any of this:**

| India Requirement | Regulation | Risk if Missed |
|-------------------|-----------|----------------|
| DPDP Consent Banner | DPDP Act 2023, Section 5 | Up to ₹250 crore fine |
| Grievance Officer published | DPDP + RBI PA-O 2025 | Payment processor won't activate |
| Razorpay key not in client HTML | RBI PA-O 2025, PCI DSS | Payment account suspension |
| Refund Policy page | Consumer Protection Rules 2020 | Can't onboard to Razorpay/Cashfree |
| Hindi language support | DPDP Section 5 | Non-compliant consent |
| Data on India servers | RBI Circular 2018 | RBI enforcement action |
| CERT-In 6-hour reporting | CERT-In Directions 2022 | ₹70,000+ penalty per incident |
| DPDP breach notification | DPDP Act 2023, Section 8 | Data Protection Board penalty |

**We're the only scanner that checks all 8 of these.**

---

## Slide 5 — Product Demo

**Input:** `https://example.com`
**Time:** ~15 seconds
**Output:** 39 checks, 5 categories, grade A–F

**Categories:**
1. 🇮🇳 **India Compliance** — 11 checks (unique to us)
2. 🔒 **Security** — 8 checks (HTTPS, headers, secret detection, SSRF)
3. ⚖️ **Legal** — 6 checks (privacy policy, T&C, accessibility)
4. 🔍 **SEO** — 9 checks (robots.txt, sitemap, OG tags, H1)
5. 📊 **Monitoring** — 5 checks (analytics, error tracking, uptime, backups)

**Each finding shows:**
- What's wrong (in plain English)
- Why it matters (business + legal consequence)
- How to fix it (step-by-step guide)
- Which regulation applies (e.g. "DPDP Act 2023, Section 5")

---

## Slide 6 — Traction & Validation

| Signal | Evidence |
|--------|---------|
| Market demand | 8,000 people commented "List" on one Instagram reel about a pre-launch checklist |
| Regulatory urgency | DPDP enforcement kicks in May 2027 — every Indian company is scrambling |
| Competitor gap | 5 global scanners exist; 0 India-specific ones |
| Technical moat | 11 India-specific checks not available anywhere else |
| Build time | MVP built in <12 hours using Cursor |

---

## Slide 7 — Business Model

### Phase 1 — Free Scan (Launch)
- Full 39-check scan, free, no signup
- Goal: viral word-of-mouth ("Share your score" like Lighthouse)
- Revenue: ₹0 — build the user base

### Phase 2 — Fix-It Widget (Month 2–3)
- DPDP consent widget (already built from TrustStack project)
- **₹999/month** per site — auto-embedded after scan failure
- Target: 500 sites → **₹5L/month ARR**

### Phase 3 — Compliance Reports (Month 4–6)
- Downloadable PDF compliance report for investors / auditors
- **₹2,999/report** one-time
- Continuous monitoring: **₹2,499/month**

### Phase 4 — API + Integrations (Month 6+)
- API access for agencies and dev tools
- **₹9,999/month** per agency
- CI/CD integration (GitHub Actions, Vercel Deploy hooks)

---

## Slide 8 — Go-To-Market

**Beachhead:** Indian indie hackers and solo founders building with Cursor, Bolt, Lovable

**Channel 1 — Organic (Day 1)**
- Post scan results on Twitter/X: "I scanned my app and got a D — here's what was broken"
- Product Hunt launch
- Indie Hackers, Reddit r/indiehackers, r/india

**Channel 2 — Creator Partnership**
- Reach out to creators like @saban.talks (15K+ likes on vibe-coding checklist content)
- Offer revenue share for referrals

**Channel 3 — Regulatory Fear Marketing (May 2026–May 2027)**
- "DPDP enforcement starts in 12 months. Is your app ready?"
- LinkedIn content targeting Indian CTOs/founders

**Channel 4 — Developer Communities**
- Slack/Discord communities: BangaloreStartups, IndiaHacks, Cursor India
- Speaker at local meetups (Bangalore, Mumbai, Hyderabad)

---

## Slide 9 — Competitive Landscape

| Feature | ShipSafe India | VibeDoctor | CheckVibe | Vibe App Scanner |
|---------|---------------|-----------|-----------|-----------------|
| DPDP Compliance | ✅ | ❌ | ❌ | ❌ |
| RBI Payment Check | ✅ | ❌ | ❌ | ❌ |
| CERT-In Requirements | ✅ | ❌ | ❌ | ❌ |
| Grievance Officer Check | ✅ | ❌ | ❌ | ❌ |
| Hindi Language Check | ✅ | ❌ | ❌ | ❌ |
| India-First Positioning | ✅ | ❌ | ❌ | ❌ |
| Security Headers | ✅ | ✅ | ✅ | ✅ |
| SEO Checks | ✅ | ❌ | ❌ | ❌ |
| Free Scan | ✅ | ✅ | ✅ | ❌ |
| Fix-It Widget | ✅ (roadmap) | ❌ | ❌ | ❌ |
| India Server Region | ✅ (Mumbai) | ❌ | ❌ | ❌ |

**We win on India compliance. Nobody else is even playing.**

---

## Slide 10 — The Team

**Aditya Bikram Dash** — Product Lead
- Senior PM at Sonatype (security/compliance SaaS)
- Built TrustStack DPDP consent platform (prior project)
- Deep understanding of India's regulatory landscape
- Built this MVP in <12 hours using Cursor

**Why we can win:**
- Domain expertise in compliance + security (day job is literally SCA/compliance software)
- Already built the DPDP consent widget (Phase 2 revenue already coded)
- Understand the Indian developer market from the inside

---

## Slide 11 — Ask

**What we're doing:**
- Launching as a free tool to build the user base
- Validating Phase 2 (fix-it widget) with real user feedback
- Running alongside regular job until ₹5L/month ARR

**What would accelerate this:**
- **₹15L seed** to hire one growth person, run content marketing for 6 months, and build the CI/CD integration
- **Strategic intro** to Razorpay/Cashfree/Cashfree team — partnership opportunity (they could embed this into their merchant onboarding)
- **Incubator support** (Antler, Y Combinator India cohort) for network + credibility

---

## Slide 12 — Why Now?

1. **DPDP enforcement deadline** — May 2027. Every Indian company has 12 months to comply. The fear is real and growing.
2. **Vibe coding is peaking** — millions of non-developers are shipping apps. They don't know what they're missing.
3. **No India-specific tool exists** — we have first-mover advantage in a market with regulatory tailwind.
4. **We already built it** — this isn't a deck for something hypothetical. The product is live and scanning URLs right now.

---

## Links

- **GitHub:** https://github.com/abdash1994/shipsafe-india
- **Live App:** https://shipsafe-india.vercel.app *(post-deploy)*
- **Built by:** Aditya Bikram Dash

---

*ShipSafe India — Ship fast. Ship safe. Ship legal.*
