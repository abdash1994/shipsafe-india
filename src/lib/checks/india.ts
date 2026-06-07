import { CheckResult, FetchedPage } from "../types";

export function runIndiaChecks(
  page: FetchedPage,
  robotsTxt: string,
  sitemapXml: string
): CheckResult[] {
  const html = page.html;
  const htmlLower = html.toLowerCase();

  return [
    {
      id: "dpdp-consent-banner",
      title: "DPDP Consent Banner",
      description:
        "A DPDP-compliant consent banner must be shown before collecting personal data",
      status: hasDPDPConsent(htmlLower) ? "pass" : "fail",
      severity: "critical",
      detail: hasDPDPConsent(htmlLower)
        ? "Consent-related language detected in page"
        : "No consent banner or DPDP-related language found",
      fixGuide:
        "Add a DPDP-compliant consent banner. Under DPDP Act 2023, you must obtain free, specific, informed, and unambiguous consent before collecting personal data. The TrustStack widget (truststack.in) is a ₹999/month drop-in solution.",
      regulation: "DPDP Act 2023, Section 5 & 6",
      isIndiaSpecific: true,
    },
    {
      id: "dpdp-privacy-notice",
      title: "Privacy Notice (DPDP-Compliant)",
      description:
        "Privacy notice must be in plain language, itemized per purpose",
      status: hasPrivacyPolicy(htmlLower) ? "pass" : "fail",
      severity: "critical",
      detail: hasPrivacyPolicy(htmlLower)
        ? "Privacy policy link detected"
        : "No privacy policy link found",
      fixGuide:
        "Publish a privacy policy that explains what data you collect, why (purpose), and how long you retain it. Under DPDP, it must be available in English and ideally in the user's preferred Indian language.",
      regulation: "DPDP Act 2023, Section 5",
      isIndiaSpecific: true,
    },
    {
      id: "grievance-officer",
      title: "Grievance Officer Published",
      description:
        "Grievance Officer name and contact must be prominently published",
      status: hasGrievanceOfficer(htmlLower) ? "pass" : "fail",
      severity: "high",
      detail: hasGrievanceOfficer(htmlLower)
        ? "Grievance officer reference found"
        : "No grievance officer or nodal officer contact found",
      fixGuide:
        "Publish a Grievance Officer's name, email, and contact on your website (typically in Privacy Policy or Contact page). Required under DPDP Act and mandatory under RBI PA-O Directions for payment-enabled sites.",
      regulation: "DPDP Act 2023 + RBI PA-O Directions 2025",
      isIndiaSpecific: true,
    },
    {
      id: "hindi-language-support",
      title: "Hindi Language Support",
      description:
        "UI or privacy notice should be accessible in Hindi for Indian users",
      status: hasHindiSupport(html) ? "pass" : "warn",
      severity: "medium",
      detail: hasHindiSupport(html)
        ? "Hindi language content or language selector detected"
        : "No Hindi content or language toggle found",
      fixGuide:
        "Provide a Hindi (or relevant Indian language) version of your consent notice and privacy policy. DPDP Section 5 requires notice in a language the Data Principal understands.",
      regulation: "DPDP Act 2023, Section 5",
      isIndiaSpecific: true,
    },
    {
      id: "razorpay-key-client-side",
      title: "Razorpay Key Exposure Check",
      description:
        "Razorpay secret keys must not be exposed in client-side HTML",
      status: hasExposedRazorpayKey(html) ? "fail" : "pass",
      severity: "critical",
      detail: hasExposedRazorpayKey(html)
        ? "Razorpay key pattern detected in HTML source"
        : "No Razorpay secret key found in client HTML",
      fixGuide:
        "Razorpay secret keys (rzp_live_*) must stay server-side only. Only the publishable key (rzp_test_* or rzp_live_* in checkout script) belongs client-side — and even that should be via an API call.",
      regulation: "RBI PA-O Directions 2025, PCI DSS v4.0",
      isIndiaSpecific: true,
    },
    {
      id: "india-payment-refund-policy",
      title: "Refund Policy Published",
      description:
        "Required by RBI and payment processors for merchant onboarding",
      status: hasRefundPolicy(htmlLower) ? "pass" : "fail",
      severity: "high",
      detail: hasRefundPolicy(htmlLower)
        ? "Refund/cancellation policy link detected"
        : "No refund or cancellation policy found",
      fixGuide:
        "Publish a clear refund and cancellation policy. Razorpay, Cashfree, and PhonePe require this before merchant activation. Also required under Consumer Protection (E-Commerce) Rules.",
      regulation: "RBI PA-O Directions 2025, Consumer Protection Rules 2020",
      isIndiaSpecific: true,
    },
    {
      id: "india-physical-address",
      title: "Physical Address / Contact Info",
      description:
        "A physical address or registered office address must be published",
      status: hasPhysicalAddress(htmlLower) ? "pass" : "warn",
      severity: "medium",
      detail: hasPhysicalAddress(htmlLower)
        ? "Address-related content detected"
        : "No physical address found on page",
      fixGuide:
        "Publish your registered business address. Required for RBI payment processor onboarding, GSTIN verification, and consumer trust under Indian e-commerce rules.",
      regulation: "Consumer Protection (E-Commerce) Rules 2020",
      isIndiaSpecific: true,
    },
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
        "Prepare a breach notification runbook: who to notify (Data Protection Board + affected users), within 72 hours. Different from CERT-In's 6-hour clock. Both apply simultaneously.",
      regulation: "DPDP Act 2023, Section 8 (effective May 2027)",
      isIndiaSpecific: true,
    },
    {
      id: "upi-payment-integration",
      title: "Indian Payment Gateway Detected",
      description: "Check if India-native payment gateway is integrated",
      status: hasIndianPaymentGateway(htmlLower) ? "pass" : "warn",
      severity: "info",
      detail: hasIndianPaymentGateway(htmlLower)
        ? "Razorpay / Cashfree / PhonePe / UPI integration detected"
        : "No Indian payment gateway script detected",
      fixGuide:
        "For Indian users, prefer Razorpay, Cashfree, or PhonePe over Stripe. UPI acceptance is expected by Indian consumers. Stripe has limited UPI support.",
      isIndiaSpecific: true,
    },
    {
      id: "rbi-data-localization",
      title: "Payment Data Localization (India Servers)",
      description:
        "RBI mandates all payment data stored exclusively on India-based servers",
      status: "warn",
      severity: "high",
      detail:
        "Cannot auto-verify server location. Manual check required: ensure your database and payment logs are on India-region servers.",
      fixGuide:
        "RBI April 2018 circular (reaffirmed 2025): all end-to-end transaction data must reside on servers in India. Use AWS ap-south-1 (Mumbai), GCP asia-south1, or Azure Central India. Foreign copies must be deleted within 24 hours.",
      regulation: "RBI Circular 2018 + PA-O Directions 2025",
      isIndiaSpecific: true,
    },
  ];
}

function hasDPDPConsent(html: string): boolean {
  return (
    html.includes("consent") ||
    html.includes("dpdp") ||
    html.includes("personal data") ||
    html.includes("data protection") ||
    html.includes("cookie") ||
    html.includes("i agree") ||
    html.includes("accept all")
  );
}

function hasPrivacyPolicy(html: string): boolean {
  return (
    html.includes("privacy policy") ||
    html.includes("privacy-policy") ||
    html.includes("/privacy") ||
    html.includes("निजता नीति")
  );
}

function hasGrievanceOfficer(html: string): boolean {
  return (
    html.includes("grievance") ||
    html.includes("nodal officer") ||
    html.includes("grievance officer") ||
    html.includes("grievance redressal")
  );
}

function hasHindiSupport(html: string): boolean {
  // Check for Hindi Unicode range (Devanagari: U+0900–U+097F)
  const devanagariPattern = /[\u0900-\u097F]/;
  if (devanagariPattern.test(html)) return true;
  const lower = html.toLowerCase();
  return (
    lower.includes('lang="hi"') ||
    lower.includes("lang='hi'") ||
    lower.includes("हिंदी") ||
    lower.includes("hindi") ||
    lower.includes("language-toggle")
  );
}

function hasExposedRazorpayKey(html: string): boolean {
  return /rzp_live_[a-zA-Z0-9]{14,}/.test(html) ||
    /key_id.*rzp_live/.test(html.toLowerCase());
}

function hasRefundPolicy(html: string): boolean {
  return (
    html.includes("refund") ||
    html.includes("cancellation policy") ||
    html.includes("return policy") ||
    html.includes("refund-policy") ||
    html.includes("/refund") ||
    html.includes("/cancellation")
  );
}

function hasPhysicalAddress(html: string): boolean {
  return (
    html.includes("registered office") ||
    html.includes("corporate address") ||
    html.includes("our address") ||
    html.includes("office address") ||
    /\d{6}/.test(html) // Indian PIN code
  );
}

function hasCERTInMention(html: string): boolean {
  return (
    html.includes("cert-in") ||
    html.includes("certin") ||
    html.includes("security@") ||
    html.includes("incident response")
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
    html.includes("upi") ||
    html.includes("bhim")
  );
}
