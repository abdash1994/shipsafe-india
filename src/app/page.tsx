"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Scan failed");
      }

      const result = await res.json();
      // Store result and navigate to results page
      sessionStorage.setItem("scanResult", JSON.stringify(result));
      router.push("/results");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Scan failed. Try again.");
      setLoading(false);
    }
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "var(--bg)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Tricolor bar at top */}
      <div className="tricolor-bar" style={{ height: 3 }} />

      {/* Nav */}
      <nav
        style={{
          padding: "20px 40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 22 }}>🛡️</span>
          <span
            style={{
              fontFamily: "var(--font-display, 'Syne', sans-serif)",
              fontWeight: 800,
              fontSize: 18,
              color: "var(--text)",
              letterSpacing: "-0.02em",
            }}
          >
            ShipSafe
            <span style={{ color: "var(--saffron)" }}> India</span>
          </span>
        </div>
        <div
          style={{
            display: "flex",
            gap: 24,
            fontSize: 13,
            color: "var(--text-muted)",
          }}
        >
          <span>62 Checks</span>
          <span>•</span>
          <span>Free</span>
          <span>•</span>
          <span>No signup</span>
        </div>
      </nav>

      {/* Hero */}
      <section
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "80px 24px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background grid */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `
              linear-gradient(rgba(255,107,0,0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,107,0,0.03) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
            pointerEvents: "none",
          }}
        />

        {/* Glow */}
        <div
          style={{
            position: "absolute",
            top: "30%",
            left: "50%",
            transform: "translateX(-50%)",
            width: 600,
            height: 300,
            background:
              "radial-gradient(ellipse, rgba(255,107,0,0.08) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div style={{ position: "relative", maxWidth: 760 }}>
          {/* Badge */}
          <div
            className="animate-fade-up"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "rgba(255,107,0,0.1)",
              border: "1px solid rgba(255,107,0,0.25)",
              borderRadius: 100,
              padding: "6px 16px",
              marginBottom: 32,
              fontSize: 12,
              color: "var(--saffron)",
              fontFamily: "var(--font-mono, monospace)",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            <span>🇮🇳</span>
            India-First Pre-Launch Scanner
          </div>

          {/* Headline */}
          <h1
            className="animate-fade-up-delay-1"
            style={{
              fontFamily: "var(--font-display, 'Syne', sans-serif)",
              fontWeight: 800,
              fontSize: "clamp(40px, 7vw, 72px)",
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              color: "var(--text)",
              margin: "0 0 20px 0",
            }}
          >
            Is your app actually
            <br />
            <span style={{ color: "var(--saffron)" }}>ready to ship</span> in India?
          </h1>

          {/* Sub */}
          <p
            className="animate-fade-up-delay-2"
            style={{
              fontSize: 18,
              color: "var(--text-muted)",
              lineHeight: 1.6,
              margin: "0 auto 48px auto",
              maxWidth: 540,
            }}
          >
            Paste your URL. Get a full compliance report in 60 seconds — DPDP,
            RBI, CERT-In, security, SEO, and more. The only scanner built for
            Indian vibe coders.
          </p>

          {/* Scanner input */}
          <form
            onSubmit={handleScan}
            className="animate-fade-up-delay-3"
            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}
          >
            <div
              style={{
                display: "flex",
                width: "100%",
                maxWidth: 600,
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: 12,
                overflow: "hidden",
                transition: "border-color 0.2s",
              }}
              onFocusCapture={(e) =>
                (e.currentTarget.style.borderColor = "var(--saffron)")
              }
              onBlurCapture={(e) =>
                (e.currentTarget.style.borderColor = "var(--border)")
              }
            >
              <div
                style={{
                  padding: "14px 16px",
                  color: "var(--text-dim)",
                  fontSize: 15,
                  display: "flex",
                  alignItems: "center",
                  flexShrink: 0,
                }}
              >
                https://
              </div>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="yourapp.in"
                disabled={loading}
                style={{
                  flex: 1,
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  color: "var(--text)",
                  fontSize: 16,
                  padding: "14px 0",
                  fontFamily: "var(--font-mono, monospace)",
                }}
              />
              <button
                type="submit"
                disabled={loading || !url.trim()}
                style={{
                  padding: "14px 24px",
                  background: loading ? "rgba(255,107,0,0.4)" : "var(--saffron)",
                  border: "none",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: 14,
                  cursor: loading ? "wait" : "pointer",
                  transition: "background 0.2s",
                  flexShrink: 0,
                  letterSpacing: "0.02em",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                {loading ? (
                  <>
                    <ScanSpinner />
                    Scanning...
                  </>
                ) : (
                  "Scan Now →"
                )}
              </button>
            </div>

            {error && (
              <p style={{ color: "var(--red-fail)", fontSize: 13 }}>{error}</p>
            )}

            <p style={{ fontSize: 12, color: "var(--text-dim)" }}>
              Free · No account required · Results in ~15 seconds
            </p>
          </form>
        </div>
      </section>

      {/* What we check */}
      <section
        style={{
          padding: "60px 40px",
          borderTop: "1px solid var(--border)",
          maxWidth: 1000,
          margin: "0 auto",
          width: "100%",
        }}
      >
        <p
          style={{
            fontSize: 11,
            color: "var(--text-dim)",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            marginBottom: 32,
            textAlign: "center",
          }}
        >
          What we check
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 16,
          }}
        >
          {checkCategories.map((cat, i) => (
            <div
              key={cat.label}
              className={`animate-fade-up-delay-${Math.min(i + 1, 4)}`}
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: 10,
                padding: "20px",
              }}
            >
              <div style={{ fontSize: 24, marginBottom: 10 }}>{cat.icon}</div>
              <div
                style={{
                  fontWeight: 700,
                  fontSize: 14,
                  marginBottom: 6,
                  color: "var(--text)",
                }}
              >
                {cat.label}
              </div>
              <div style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.5 }}>
                {cat.description}
              </div>
              {cat.isIndia && (
                <div
                  style={{
                    marginTop: 10,
                    display: "inline-block",
                    background: "rgba(255,107,0,0.12)",
                    color: "var(--saffron)",
                    fontSize: 10,
                    padding: "2px 8px",
                    borderRadius: 100,
                    fontFamily: "var(--font-mono, monospace)",
                  }}
                >
                  INDIA-ONLY
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* India-specific callout */}
      <section
        style={{
          maxWidth: 1000,
          margin: "0 auto 60px",
          width: "100%",
          padding: "0 40px",
        }}
      >
        <div
          style={{
            background: "linear-gradient(135deg, rgba(255,107,0,0.08) 0%, rgba(19,136,8,0.06) 100%)",
            border: "1px solid rgba(255,107,0,0.2)",
            borderRadius: 12,
            padding: "32px 40px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            className="tricolor-bar"
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: 4,
              borderRadius: "12px 0 0 12px",
            }}
          />
          <h2
            style={{
              fontFamily: "var(--font-display, Syne, sans-serif)",
              fontWeight: 800,
              fontSize: 22,
              margin: "0 0 12px",
              letterSpacing: "-0.02em",
            }}
          >
            The only scanner that speaks India
          </h2>
          <p style={{ color: "var(--text-muted)", lineHeight: 1.7, maxWidth: 600 }}>
            Every other scanner (VibeDoctor, CheckVibe, Vibe App Scanner) checks
            global security. None of them check for{" "}
            <strong style={{ color: "var(--text)" }}>DPDP consent</strong>,{" "}
            <strong style={{ color: "var(--text)" }}>Grievance Officer</strong>,{" "}
            <strong style={{ color: "var(--text)" }}>Razorpay key exposure</strong>,{" "}
            <strong style={{ color: "var(--text)" }}>RBI data localization</strong>, or{" "}
            <strong style={{ color: "var(--text)" }}>CERT-In reporting requirements</strong>.
            We do.
          </p>
          <div
            style={{
              marginTop: 20,
              display: "flex",
              gap: 16,
              flexWrap: "wrap",
            }}
          >
            {["DPDP Act 2023", "RBI PA-O 2025", "CERT-In Directions", "Consumer Protection Rules"].map(
              (label) => (
                <span
                  key={label}
                  style={{
                    background: "rgba(255,107,0,0.1)",
                    color: "var(--saffron)",
                    padding: "4px 12px",
                    borderRadius: 100,
                    fontSize: 12,
                    border: "1px solid rgba(255,107,0,0.2)",
                  }}
                >
                  {label}
                </span>
              )
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          borderTop: "1px solid var(--border)",
          padding: "24px 40px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: 12,
          color: "var(--text-dim)",
        }}
      >
        <span>🛡️ ShipSafe India — Built for Indian vibe coders</span>
        <span>Free · Open · No tracking</span>
      </footer>

      {/* Loading overlay */}
      {loading && <ScanOverlay url={url} />}
    </main>
  );
}

function ScanSpinner() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <circle cx="7" cy="7" r="5.5" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
      <path
        d="M7 1.5A5.5 5.5 0 0 1 12.5 7"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 7 7"
          to="360 7 7"
          dur="0.7s"
          repeatCount="indefinite"
        />
      </path>
    </svg>
  );
}

function ScanOverlay({ url }: { url: string }) {
  const steps = [
    "Fetching page...",
    "Checking DPDP compliance...",
    "Scanning security headers...",
    "Verifying legal requirements...",
    "Checking SEO & discoverability...",
    "Analysing monitoring setup...",
    "Generating report...",
  ];

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(10,10,10,0.95)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
        backdropFilter: "blur(8px)",
      }}
    >
      {/* Scanner animation */}
      <div
        style={{
          width: 120,
          height: 120,
          borderRadius: "50%",
          border: "2px solid rgba(255,107,0,0.2)",
          position: "relative",
          marginBottom: 40,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 8,
            borderRadius: "50%",
            border: "2px solid rgba(255,107,0,0.4)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 20,
            borderRadius: "50%",
            border: "2px solid var(--saffron)",
            borderTopColor: "transparent",
            animation: "spin 1s linear infinite",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 36,
          }}
        >
          🛡️
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>

      <p
        style={{
          fontFamily: "var(--font-display, Syne, sans-serif)",
          fontWeight: 800,
          fontSize: 24,
          marginBottom: 8,
          letterSpacing: "-0.02em",
        }}
      >
        Scanning your app
      </p>
      <p
        style={{
          fontFamily: "var(--font-mono, monospace)",
          fontSize: 12,
          color: "var(--saffron)",
          marginBottom: 40,
          maxWidth: 400,
          textAlign: "center",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {url}
      </p>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
          width: 280,
        }}
      >
        {steps.map((step, i) => (
          <div
            key={step}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              fontSize: 13,
              color: "var(--text-muted)",
              animation: `fade-up 0.3s ease ${i * 0.4}s both`,
            }}
          >
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "var(--saffron)",
                flexShrink: 0,
                animation: `pulse 1s ease ${i * 0.4}s infinite`,
              }}
            />
            {step}
          </div>
        ))}
      </div>
      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 0.4; } 50% { opacity: 1; } }
        @keyframes fade-up { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}

const checkCategories = [
  {
    icon: "🇮🇳",
    label: "India Compliance",
    description: "DPDP consent, Grievance Officer, RBI payments, CERT-In breach reporting",
    isIndia: true,
  },
  {
    icon: "🔒",
    label: "Security",
    description: "HTTPS, headers, exposed API keys, CORS, secret detection",
    isIndia: false,
  },
  {
    icon: "⚖️",
    label: "Legal",
    description: "Privacy policy, terms of service, cookie consent, accessibility",
    isIndia: false,
  },
  {
    icon: "🔍",
    label: "SEO",
    description: "robots.txt, sitemap, meta tags, Open Graph, H1 structure",
    isIndia: false,
  },
  {
    icon: "📊",
    label: "Monitoring",
    description: "Analytics, error tracking, uptime monitoring, database backups",
    isIndia: false,
  },
];
