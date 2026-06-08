import { CheckResult, FetchedPage } from "../types";

export function runIndiaChecks(
  page: FetchedPage,
  robotsTxt: string,
  sitemapXml: string
): CheckResult[] {
  const html = page.html;
  const htmlLower = html.toLowerCase();

  // Key context signals used to make checks conditional
  const hasPayments = hasIndianPaymentGateway(htmlLower);
  const hasStripeOrAnyPayment = hasAnyPaymentGateway(htmlLower);
  const hasPrivacy = hasPrivacyPolicy(htmlLower);
  const hasConsent = hasDPDPConsent(htmlLower);
  const hasGO = hasGrievanceOfficer(htmlLower);
  const hasRefund = hasRefundPolicy(htmlLower);

  return [
    // 1. DPDP Consent Banner
    {
      id: "dpdp-consent-banner",
      title: "DPDP Consent Banner",
      description:
        "A DPDP-compliant consent banner must be shown before collecting personal data",
      status: hasConsent ? "pass" : "fail",
      severity: "critical",
      detail: hasConsent
        ? "Consent management or cookie banner detected in page"
        : "No consent banner detected. Note: dynamic/JS-loaded banners (OneTrust, Cookiebot) may not be detected in static HTML scan",
      fixGuide:
        "Add a DPDP-compliant consent banner before collecting personal data. Common solutions: OneTrust, CookieYes, Cookiebot, or a custom implementation. Under DPDP Act 2023, consent must be free, specific, informed, and unambiguous.",
      regulation: "DPDP Act 2023, Section 5 & 6",
      isIndiaSpecific: true,
    },

    // 2. Privacy Notice
    {
      id: "dpdp-privacy-notice",
      title: "Privacy Notice (DPDP-Compliant)",
      description:
        "Privacy notice must be accessible and itemized per purpose",
      status: hasPrivacy ? "pass" : "fail",
      severity: "critical",
      detail: hasPrivacy
        ? "Privacy policy link detected"
        : "No privacy policy link found on this page",
      fixGuide:
        "Publish a privacy policy explaining what data you collect, why, and how long you retain it. Under DPDP, it must be in plain language and available in the user's preferred Indian language.",
      regulation: "DPDP Act 2023, Section 5",
      isIndiaSpecific: true,
    },

    // 3. Grievance Officer — only FAIL if site processes payments or collects user data with privacy policy
    {
      id: "grievance-officer",
      title: "Grievance Officer Published",
      description:
        "Grievance Officer contact must be published if you process Indian user data",
      status: hasGO
        ? "pass"
        : hasStripeOrAnyPayment
        ? "fail"   // Mandatory if you take payments
        : "warn",  // Recommended but unverifiable for sites without payment context
      severity: "high",
      detail: hasGO
        ? "Grievance officer reference found"
        : hasStripeOrAnyPayment
        ? "Payment processing detected but no Grievance Officer contact found on this page"
        : "No Grievance Officer found on this page. If you process Indian user data or payments, this is required. May be published on a separate policy page.",
      fixGuide:
        "Publish a Grievance Officer's name, email, and contact (typically in Privacy Policy or a dedicated Contact page). Required under DPDP Act and mandatory under RBI PA-O Directions for payment-enabled sites.",
      regulation: "DPDP Act 2023 + RBI PA-O Directions 2025",
      isIndiaSpecific: true,
    },

    // 4. Hindi Language Support
    {
      id: "hindi-language-support",
      title: "Hindi Language Support",
      description:
        "Privacy notice and consent UI should be accessible in Hindi for Indian users",
      status: hasHindiSupport(html) ? "pass" : "warn",
      severity: "medium",
      detail: hasHindiSupport(html)
        ? "Hindi language content or language selector detected"
        : "No Hindi content or language toggle found",
      fixGuide:
        "Provide a Hindi version of your consent notice and privacy policy. DPDP Section 5 requires notice in a language the Data Principal understands.",
      regulation: "DPDP Act 2023, Section 5",
      isIndiaSpecific: true,
    },

    // 5. Razorpay Key Exposure — skip if no Razorpay detected
    {
      id: "razorpay-key-client-side",
      title: "Razorpay Key Exposure Check",
      description:
        "Razorpay secret keys must not be exposed in client-side HTML",
      status: hasExposedRazorpayKey(html) ? "fail" : "pass",
      severity: "critical",
      detail: hasExposedRazorpayKey(html)
        ? "Razorpay key pattern detected in HTML source — rotate immediately"
        : hasPayments
        ? "Razorpay integration detected — no exposed secret key found"
        : "No Razorpay integration detected",
      fixGuide:
        "Razorpay secret keys (rzp_live_*) must stay server-side only. If exposed, rotate at razorpay.com/dashboard immediately.",
      regulation: "RBI PA-O Directions 2025, PCI DSS v4.0",
      isIndiaSpecific: true,
    },

    // 6. Refund Policy — only required if payment processing detected
    {
      id: "india-payment-refund-policy",
      title: "Refund Policy Published",
      description:
        "Required by RBI and payment processors for sites that accept payments",
      status: !hasStripeOrAnyPayment
        ? "pass"    // Not applicable — no payments detected
        : hasRefund
        ? "pass"
        : "fail",
      severity: "high",
      detail: !hasStripeOrAnyPayment
        ? "No payment processing detected — refund policy not required"
        : hasRefund
        ? "Refund/cancellation policy link detected"
        : "Payment processing detected but no refund policy found",
      fixGuide:
        "If you accept payments, publish a clear refund and cancellation policy. Razorpay, Cashfree, and PhonePe require this before merchant activation.",
      regulation: "RBI PA-O Directions 2025, Consumer Protection Rules 2020",
      isIndiaSpecific: true,
    },

    // 7. Physical Address — improved logic, not just 6-digit number matching
    {
      id: "india-physical-address",
      title: "Physical Address / Contact Info",
      description:
        "A registered business address must be published for e-commerce sites",
      status: hasStripeOrAnyPayment
        ? hasPhysicalAddress(htmlLower) ? "pass" : "warn"
        : "pass",  // Not required for non-payment sites
      severity: "medium",
      detail: !hasStripeOrAnyPayment
        ? "No payment processing detected — physical address check skipped"
        : hasPhysicalAddress(htmlLower)
        ? "Address-related content detected"
        : "Payment processing detected but no physical address found",
      fixGuide:
        "Publish your registered business address. Required for RBI payment processor onboarding and consumer trust under Indian e-commerce rules.",
      regulation: "Consumer Protection (E-Commerce) Rules 2020",
      isIndiaSpecific: true,
    },

    // 8. CERT-In plan — always warn, cannot be auto-verified
    {
      id: "cert-in-plan",
      title: "Cyber Incident Response Plan",
      description:
        "CERT-In mandates reporting cyber incidents within 6 hours of detection",
      status: hasCERTInMention(htmlLower) ? "pass" : "warn",
      severity: "medium",
      detail:
        "Cannot auto-verify internal incident response plan. Scan checks for public policy disclosure only.",
      fixGuide:
        "Maintain a written incident response plan. CERT-In Directions (2022) require reporting 20+ types of cyber incidents within 6 hours to cert-in.org.in. Publish your security contact at security@yourdomain.com.",
      regulation: "CERT-In Directions 2022",
      isIndiaSpecific: true,
    },

    // 9. DPDP breach notification — always warn
    {
      id: "dpdp-breach-notification",
      title: "Data Breach Notification Plan",
      description:
        "DPDP requires notifying the Data Protection Board within 72 hours of a breach",
      status: "warn",
      severity: "high",
      detail:
        "Cannot auto-verify internal breach response plan. Effective May 2027 enforcement date.",
      fixGuide:
        "Prepare a breach notification runbook: notify Data Protection Board + affected users within 72 hours. Different clock from CERT-In's 6-hour requirement.",
      regulation: "DPDP Act 2023, Section 8 (effective May 2027)",
      isIndiaSpecific: true,
    },

    // 10. Indian payment gateway — informational, not a compliance requirement
    {
      id: "upi-payment-integration",
      title: "Indian Payment Gateway",
      description: "For Indian users, UPI/Razorpay is strongly preferred over Stripe",
      status: hasPayments ? "pass" : hasStripeOrAnyPayment ? "warn" : "pass",
      severity: "info",
      detail: hasPayments
        ? "Razorpay / Cashfree / PhonePe / UPI integration detected"
        : hasStripeOrAnyPayment
        ? "Non-Indian payment gateway detected — consider adding UPI/Razorpay for Indian users"
        : "No payment processing detected",
      fixGuide:
        "For Indian users, prefer Razorpay, Cashfree, or PhonePe over Stripe. UPI acceptance is expected by Indian consumers.",
      isIndiaSpecific: true,
    },

    // 11. RBI data localization — always warn, cannot auto-verify
    {
      id: "rbi-data-localization",
      title: "Payment Data Localization (India Servers)",
      description:
        "RBI mandates payment data stored exclusively on India-based servers",
      status: hasStripeOrAnyPayment ? "warn" : "pass",
      severity: "high",
      detail: hasStripeOrAnyPayment
        ? "Payment processing detected. Cannot auto-verify server location — manual check required."
        : "No payment processing detected — data localization check not applicable",
      fixGuide:
        "RBI April 2018 circular (reaffirmed 2025): all end-to-end transaction data must reside on servers in India. Use AWS ap-south-1 (Mumbai), GCP asia-south1, or Azure Central India.",
      regulation: "RBI Circular 2018 + PA-O Directions 2025",
      isIndiaSpecific: true,
    },
  ];
}

// ──────────────────── Detection helpers ────────────────────

function hasDPDPConsent(html: string): boolean {
  return (
    // Specific DPDP / consent keywords
    html.includes("dpdp") ||
    html.includes("personal data protection") ||
    html.includes("data protection") ||
    html.includes("i agree") ||
    html.includes("accept all") ||
    html.includes("accept cookies") ||
    html.includes("manage cookies") ||
    html.includes("cookie preferences") ||
    html.includes("cookie settings") ||
    html.includes("cookie consent") ||
    html.includes("we use cookies") ||
    html.includes("cookieconsent") ||
    html.includes("cookie-consent") ||
    // Industry-standard CMP scripts
    html.includes("onetrust") ||
    html.includes("cookiebot") ||
    html.includes("cookiepro") ||
    html.includes("termly") ||
    html.includes("usercentrics") ||
    html.includes("iubenda") ||
    html.includes("cookieinformation") ||
    html.includes("didomi") ||
    html.includes("quantcast") ||
    html.includes("trustarc") ||
    // Generic consent patterns
    html.includes("consent-banner") ||
    html.includes("consent_banner") ||
    html.includes("gdpr") ||
    html.includes("ccpa")
  );
}

function hasPrivacyPolicy(html: string): boolean {
  return (
    html.includes("privacy policy") ||
    html.includes("privacy-policy") ||
    html.includes("/privacy") ||
    html.includes("privacy notice") ||
    html.includes("निजता नीति") ||
    html.includes("data policy") ||
    html.includes("privacy statement")
  );
}

function hasGrievanceOfficer(html: string): boolean {
  return (
    html.includes("grievance") ||
    html.includes("nodal officer") ||
    html.includes("grievance officer") ||
    html.includes("grievance redressal") ||
    html.includes("escalation officer")
  );
}

function hasHindiSupport(html: string): boolean {
  const devanagariPattern = /[\u0900-\u097F]/;
  if (devanagariPattern.test(html)) return true;
  const lower = html.toLowerCase();
  return (
    lower.includes('lang="hi"') ||
    lower.includes("lang='hi'") ||
    lower.includes("हिंदी") ||
    lower.includes("language-toggle") ||
    lower.includes("switch to hindi") ||
    lower.includes("हिन्दी")
  );
}

function hasExposedRazorpayKey(html: string): boolean {
  return /rzp_live_[a-zA-Z0-9]{14,}/.test(html) ||
    /key_id.*rzp_live/.test(html.toLowerCase());
}

function hasRefundPolicy(html: string): boolean {
  return (
    html.includes("refund policy") ||
    html.includes("refund-policy") ||
    html.includes("/refund") ||
    html.includes("cancellation policy") ||
    html.includes("return policy") ||
    html.includes("/cancellation") ||
    html.includes("money back") ||
    html.includes("moneyback")
  );
}

function hasPhysicalAddress(html: string): boolean {
  // Explicit address keywords only — removed 6-digit number match (too many false positives)
  return (
    html.includes("registered office") ||
    html.includes("corporate address") ||
    html.includes("our address") ||
    html.includes("office address") ||
    html.includes("head office") ||
    html.includes("registered address") ||
    html.includes("principal place of business")
  );
}

function hasCERTInMention(html: string): boolean {
  return (
    html.includes("cert-in") ||
    html.includes("certin") ||
    html.includes("security@") ||
    html.includes("incident response") ||
    html.includes("vulnerability disclosure")
  );
}

function hasIndianPaymentGateway(html: string): boolean {
  return (
    html.includes("razorpay") ||
    html.includes("cashfree") ||
    html.includes("phonepe") ||
    html.includes("paytm") ||
    html.includes("ccavenue") ||
    html.includes("instamojo") ||
    html.includes("billdesk") ||
    html.includes("payumoney") ||
    html.includes("payu")
  );
}

function hasAnyPaymentGateway(html: string): boolean {
  return (
    hasIndianPaymentGateway(html) ||
    html.includes("stripe") ||
    html.includes("paypal") ||
    html.includes("braintree") ||
    html.includes("square") ||
    html.includes("checkout.com") ||
    html.includes("adyen") ||
    html.includes("paddle") ||
    html.includes("lemon squeezy") ||
    html.includes("gumroad")
  );
}
