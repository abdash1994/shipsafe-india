# 🛡️ ShipSafe India

**The only pre-launch scanner built for Indian vibe coders.**

Paste your URL. Get a full compliance + security report in 60 seconds — covering DPDP, RBI, CERT-In, and all the things Indian apps must get right before going live.

> 📋 **[Read the Pitch Deck →](./PITCH.md)**

## Live Demo

> [shipsafe-india.vercel.app](https://shipsafe-india.vercel.app)

## What It Checks (39 checks across 5 categories)

### 🇮🇳 India Compliance (India-only — no other scanner covers these)
- DPDP consent banner (Digital Personal Data Protection Act 2023)
- DPDP-compliant privacy notice
- Grievance Officer name + contact published (DPDP + RBI mandate)
- Hindi language support (DPDP Section 5)
- Razorpay / payment key exposure in client HTML
- Refund policy page (RBI PA-O Directions 2025)
- Physical address / contact info
- Cyber incident response plan (CERT-In 6-hour reporting)
- Data breach notification plan (DPDP 72-hour clock)
- Indian payment gateway integration check
- RBI data localization awareness (India-server requirement)

### 🔒 Security
- HTTPS enforced
- HSTS header
- Content Security Policy
- Clickjacking protection (X-Frame-Options)
- MIME sniffing protection
- Referrer Policy
- Custom domain (not .vercel.app etc.)
- No exposed API keys in HTML

### ⚖️ Legal & Compliance
- Privacy policy exists
- Terms of service exists
- Cookie consent
- Contact / support email
- Form accessibility (labels, not placeholder-only)
- Security contact email

### 🔍 SEO & Discoverability
- robots.txt configured correctly
- sitemap.xml exists
- Page title (50–60 chars)
- Meta description
- Open Graph tags (og:title + og:image)
- H1 tag (exactly one)
- Canonical URL
- Viewport meta tag
- Favicon

### 📊 Monitoring & Analytics
- Web analytics installed
- Error tracking (Sentry etc.)
- Uptime monitoring
- Transactional email (SPF/DKIM/DMARC)
- Database backups

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Runtime:** Node.js 20+

## Running Locally

```bash
git clone https://github.com/abdash1994/shipsafe-india.git
cd shipsafe-india
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## API

### `POST /api/scan`

```json
{ "url": "https://yourapp.in" }
```

Returns a `ScanResult` with score (0–100), grade (A–F), and all 39 checks categorized and detailed.

Rate limited to 10 requests per IP per minute.

## Security

- SSRF protection (private/internal IPs blocked from scanning)
- In-memory rate limiting (10 req/min per IP)
- Full HTTP security headers (HSTS, CSP, X-Frame-Options, etc.)
- No secrets required — scanner uses only public HTTP access

## Regulations Covered

| Regulation | Scope |
|-----------|-------|
| DPDP Act 2023 | India privacy law |
| RBI PA-O Directions 2025 | Payment aggregator compliance |
| CERT-In Directions 2022 | Cyber incident reporting |
| Consumer Protection (E-Commerce) Rules 2020 | E-commerce requirements |
| WCAG 2.2 AA | Accessibility |

## License

MIT
