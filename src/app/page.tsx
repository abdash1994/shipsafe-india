import { redirect } from "next/navigation";

import { FounderJourneyCards } from "@/components/founder-journey-cards";
import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";
import { getLegacyScanRedirect } from "@/lib/scan-entry";
import { founderJourneys } from "@/lib/site-journeys";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ url?: string }>;
}) {
  const params = await searchParams;
  const legacyRedirect = getLegacyScanRedirect(params.url);

  if (legacyRedirect) {
    redirect(legacyRedirect);
  }

  return (
    <main style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", flexDirection: "column" }}>
      <div className="tricolor-bar" style={{ height: 3 }} />
      <SiteNav active="home" />

      <section
        style={{
          position: "relative",
          overflow: "hidden",
          padding: "72px 40px 40px",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(255,107,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,107,0,0.03) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "18%",
            left: "50%",
            transform: "translateX(-50%)",
            width: 680,
            height: 340,
            background: "radial-gradient(ellipse, rgba(255,107,0,0.08) 0%, transparent 72%)",
            pointerEvents: "none",
          }}
        />

        <div style={{ position: "relative", maxWidth: 1180, margin: "0 auto" }}>
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
              marginBottom: 28,
              fontSize: 12,
              color: "var(--saffron)",
              fontFamily: "var(--font-mono, monospace)",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            Founder journey for Indian internet products
          </div>

          <div style={{ maxWidth: 760, marginBottom: 36 }}>
            <h1
              className="animate-fade-up-delay-1"
              style={{
                fontFamily: "var(--font-display, 'Syne', sans-serif)",
                fontWeight: 800,
                fontSize: "clamp(40px, 6vw, 72px)",
                lineHeight: 1.03,
                letterSpacing: "-0.04em",
                margin: "0 0 18px",
              }}
            >
              Start smart.
              <br />
              <span style={{ color: "var(--saffron)" }}>Ship safe.</span>
            </h1>
            <p
              className="animate-fade-up-delay-2"
              style={{
                fontSize: 18,
                color: "var(--text-muted)",
                lineHeight: 1.75,
                margin: 0,
                maxWidth: 620,
              }}
            >
              ShipSafe now covers the full founder path: know what to set up before launch,
              then run a live scan before you go public in India.
            </p>
          </div>

          <div className="animate-fade-up-delay-3">
            <FounderJourneyCards journeys={founderJourneys} />
          </div>
        </div>
      </section>

      <section style={{ maxWidth: 1180, margin: "0 auto", width: "100%", padding: "0 40px 32px" }}>
        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 18,
            padding: "24px 28px",
          }}
        >
          <p
            style={{
              margin: "0 0 14px",
              fontSize: 11,
              color: "var(--text-dim)",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              fontFamily: "var(--font-mono, monospace)",
            }}
          >
            Recommended founder flow
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 16,
            }}
          >
            {[
              {
                title: "1. Get your setup right",
                body: "Registration basics, policies, payment readiness, support, and operational foundations.",
              },
              {
                title: "2. Cover India-specific risk",
                body: "Think through DPDP, grievance handling, consent, and basic incident readiness before launch stress hits.",
              },
              {
                title: "3. Scan the real product",
                body: "Run ShipSafe on the actual deployed app to catch legal, security, SEO, and monitoring gaps in one pass.",
              },
            ].map((step) => (
              <div key={step.title}>
                <h2
                  style={{
                    margin: "0 0 6px",
                    fontFamily: "var(--font-display, Syne, sans-serif)",
                    fontWeight: 700,
                    fontSize: 22,
                    letterSpacing: "-0.02em",
                  }}
                >
                  {step.title}
                </h2>
                <p style={{ margin: 0, color: "var(--text-muted)", fontSize: 14, lineHeight: 1.7 }}>
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ maxWidth: 1180, margin: "0 auto 56px", width: "100%", padding: "0 40px" }}>
        <div
          style={{
            background: "linear-gradient(135deg, rgba(255,107,0,0.08) 0%, rgba(19,136,8,0.06) 100%)",
            border: "1px solid rgba(255,107,0,0.2)",
            borderRadius: 18,
            padding: "28px 32px",
          }}
        >
          <p
            style={{
              margin: "0 0 12px",
              fontSize: 11,
              color: "var(--saffron)",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              fontFamily: "var(--font-mono, monospace)",
            }}
          >
            Why this split matters
          </p>
          <h2
            style={{
              margin: "0 0 10px",
              fontFamily: "var(--font-display, Syne, sans-serif)",
              fontWeight: 800,
              fontSize: 28,
              letterSpacing: "-0.03em",
            }}
          >
            Guidance and diagnosis are different jobs
          </h2>
          <p style={{ margin: "0 0 16px", color: "var(--text-muted)", fontSize: 15, lineHeight: 1.75, maxWidth: 760 }}>
            Founders starting out need a sequence: what to set up, what can wait, and what breaks trust if ignored.
            Founders about to launch need evidence: is the live product actually ready to ship in India? ShipSafe now gives you both without forcing them into one overloaded screen.
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {["Get Started", "Run the Scan", "Fix the Gaps", "Ship with confidence"].map((label) => (
              <span
                key={label}
                style={{
                  background: "rgba(255,107,0,0.1)",
                  color: "var(--saffron)",
                  padding: "4px 12px",
                  borderRadius: 999,
                  fontSize: 12,
                  border: "1px solid rgba(255,107,0,0.2)",
                }}
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
