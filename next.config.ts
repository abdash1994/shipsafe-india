import type { NextConfig } from "next";

const securityHeaders = [
  // Force HTTPS — browsers remember for 2 years
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  // Prevent MIME-type sniffing
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  // Prevent clickjacking
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  // Don't leak referrer to third-party sites
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  // Restrict browser features
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  // Content Security Policy
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      // Next.js needs inline scripts for hydration
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      // Styles: self + inline (Next.js injects styles)
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      // Fonts from Google
      "font-src 'self' https://fonts.gstatic.com",
      // Images: self + data URIs
      "img-src 'self' data: blob:",
      // API calls only to self
      "connect-src 'self'",
      // No frames allowed
      "frame-src 'none'",
      // No plugins
      "object-src 'none'",
      // Block base tag hijacking
      "base-uri 'self'",
      // Forms only submit to self
      "form-action 'self'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  // Redirect HTTP → HTTPS in production (Vercel handles this natively,
  // but this catches any edge case. Uses relative redirect so it works
  // on any domain — vercel.app or a custom domain later)
  async redirects() {
    if (process.env.NODE_ENV !== "production") return [];
    return [
      {
        source: "/:path*",
        has: [{ type: "header", key: "x-forwarded-proto", value: "http" }],
        destination: "https://:host/:path*",
        permanent: true,
      },
    ];
  },

  // Apply security headers to all routes
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },

  // Disable x-powered-by header (don't advertise Next.js version)
  poweredByHeader: false,

  // Only allow images from trusted sources if you add next/image later
  images: {
    domains: [],
  },
};

export default nextConfig;
