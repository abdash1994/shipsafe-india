import Link from "next/link";

import type { FounderJourney } from "@/lib/site-journeys";

export function FounderJourneyCards({
  journeys,
}: {
  journeys: FounderJourney[];
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: 18,
        width: "100%",
      }}
    >
      {journeys.map((journey) => (
        <Link
          key={journey.id}
          href={journey.href}
          style={{
            display: "block",
            background: "linear-gradient(180deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.01) 100%)",
            border: "1px solid var(--border)",
            borderRadius: 18,
            padding: "24px 24px 22px",
            color: "inherit",
            textDecoration: "none",
            transition: "transform 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease",
            boxShadow: "0 12px 30px rgba(0,0,0,0.18)",
          }}
        >
          <p
            style={{
              fontSize: 11,
              color: "var(--saffron)",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              fontFamily: "var(--font-mono, monospace)",
              marginBottom: 16,
            }}
          >
            {journey.eyebrow}
          </p>
          <h2
            style={{
              fontFamily: "var(--font-display, Syne, sans-serif)",
              fontSize: 28,
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              margin: "0 0 10px 0",
            }}
          >
            {journey.title}
          </h2>
          <p
            style={{
              fontSize: 14,
              color: "var(--text-muted)",
              lineHeight: 1.7,
              margin: "0 0 18px 0",
            }}
          >
            {journey.description}
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 18 }}>
            {journey.bullets.map((bullet) => (
              <div key={bullet} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <span style={{ color: "var(--saffron)", fontSize: 12, marginTop: 2 }}>●</span>
                <span style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.5 }}>{bullet}</span>
              </div>
            ))}
          </div>

          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              color: "var(--text)",
              fontWeight: 700,
              fontSize: 14,
            }}
          >
            {journey.cta}
            <span style={{ color: "var(--saffron)" }}>→</span>
          </div>
        </Link>
      ))}
    </div>
  );
}
