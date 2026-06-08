"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { startupGuidePhases, type StartupItemStatus } from "@/lib/startup-guide";

import { SiteFooter } from "./site-footer";
import { SiteNav } from "./site-nav";
import { StartupGuideView } from "./startup-guide-view";

const STORAGE_KEY = "startup-guide-progress";

export function StartupGuidePage() {
  const [checkedIds, setCheckedIds] = useState<Set<string>>(() => {
    if (typeof window === "undefined") {
      return new Set();
    }

    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return new Set();
    }

    try {
      return new Set(JSON.parse(stored) as string[]);
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
      return new Set();
    }
  });
  const [activeStatus, setActiveStatus] = useState<StartupItemStatus | "all">("all");

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...checkedIds]));
  }, [checkedIds]);

  const allItems = startupGuidePhases.flatMap((phase) => phase.items);
  const visibleItems = allItems.filter(
    (item) => activeStatus === "all" || item.status === activeStatus,
  );

  const completedVisible = visibleItems.filter((item) => checkedIds.has(item.id)).length;
  const mandatoryCount = allItems.filter((item) => item.status === "mandatory").length;
  const mandatoryDone = allItems.filter(
    (item) => item.status === "mandatory" && checkedIds.has(item.id),
  ).length;

  const progressCards = [
    {
      label: "Checklist progress",
      value: `${checkedIds.size}/${allItems.length}`,
      detail: "Across all launch-readiness tasks",
    },
    {
      label: "Mandatory complete",
      value: `${mandatoryDone}/${mandatoryCount}`,
      detail: "The minimum trust and compliance layer",
    },
    {
      label: "Current filter",
      value: activeStatus === "all" ? "All items" : activeStatus,
      detail: `${completedVisible}/${visibleItems.length || 0} complete in view`,
    },
  ];

  const founderSequence = useMemo(
    () => [
      "Set up the company and launch stack",
      "Publish trust basics before asking for money",
      "Cover India-specific compliance and ops",
      "Run ShipSafe as the final launch gate",
    ],
    [],
  );

  const toggleItem = (id: string) => {
    setCheckedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <main style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", flexDirection: "column" }}>
      <div className="tricolor-bar" style={{ height: 3 }} />
      <SiteNav active="startup" />

      <section style={{ maxWidth: 1180, margin: "0 auto", width: "100%", padding: "48px 40px 28px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.2fr) minmax(280px, 0.8fr)", gap: 24 }}>
          <div>
            <p
              style={{
                fontSize: 11,
                color: "var(--saffron)",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                fontFamily: "var(--font-mono, monospace)",
                marginBottom: 18,
              }}
            >
              Get started before you ship
            </p>
            <h1
              style={{
                fontFamily: "var(--font-display, Syne, sans-serif)",
                fontSize: "clamp(34px, 5vw, 58px)",
                lineHeight: 1.02,
                letterSpacing: "-0.04em",
                margin: "0 0 16px",
              }}
            >
              Know what you need,
              <br />
              <span style={{ color: "var(--saffron)" }}>and when you need it</span>
            </h1>
            <p style={{ fontSize: 17, color: "var(--text-muted)", lineHeight: 1.75, maxWidth: 680, marginBottom: 22 }}>
              This is the founder-side setup guide for Indian SaaS and web apps. Use it to
              sequence your startup essentials, trust layer, compliance basics, and launch ops
              before you run the actual ShipSafe scan.
            </p>

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Link
                href="/scan"
                style={{
                  background: "var(--saffron)",
                  color: "#fff",
                  textDecoration: "none",
                  padding: "12px 18px",
                  borderRadius: 12,
                  fontWeight: 700,
                  fontSize: 14,
                }}
              >
                Skip ahead to scan
              </Link>
              <a
                href="#startup-guide"
                style={{
                  border: "1px solid var(--border)",
                  background: "var(--surface)",
                  color: "var(--text)",
                  textDecoration: "none",
                  padding: "12px 18px",
                  borderRadius: 12,
                  fontWeight: 600,
                  fontSize: 14,
                }}
              >
                Work through the checklist
              </a>
            </div>
          </div>

          <div
            style={{
              background: "linear-gradient(180deg, rgba(255,107,0,0.08) 0%, rgba(255,255,255,0.02) 100%)",
              border: "1px solid rgba(255,107,0,0.16)",
              borderRadius: 18,
              padding: 22,
            }}
          >
            <p
              style={{
                fontSize: 11,
                color: "var(--text-dim)",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                fontFamily: "var(--font-mono, monospace)",
                marginBottom: 14,
              }}
            >
              Founder flow
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {founderSequence.map((step, index) => (
                <div key={step} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <div
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: "50%",
                      background: "rgba(255,107,0,0.12)",
                      border: "1px solid rgba(255,107,0,0.28)",
                      color: "var(--saffron)",
                      fontSize: 12,
                      fontWeight: 700,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {index + 1}
                  </div>
                  <p style={{ margin: "2px 0 0", color: "var(--text-muted)", fontSize: 14, lineHeight: 1.6 }}>
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section style={{ maxWidth: 1180, margin: "0 auto", width: "100%", padding: "0 40px 28px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 16 }}>
          {progressCards.map((card) => (
            <div key={card.label} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, padding: "18px 20px" }}>
              <p
                style={{
                  margin: "0 0 8px",
                  fontSize: 11,
                  color: "var(--text-dim)",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  fontFamily: "var(--font-mono, monospace)",
                }}
              >
                {card.label}
              </p>
              <div style={{ fontFamily: "var(--font-display, Syne, sans-serif)", fontSize: 28, fontWeight: 800, marginBottom: 6 }}>
                {card.value}
              </div>
              <p style={{ margin: 0, fontSize: 13, color: "var(--text-muted)", lineHeight: 1.6 }}>{card.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="startup-guide" style={{ maxWidth: 1180, margin: "0 auto", width: "100%", padding: "0 40px 56px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap", marginBottom: 18 }}>
          <div>
            <p
              style={{
                margin: "0 0 6px",
                fontSize: 11,
                color: "var(--text-dim)",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                fontFamily: "var(--font-mono, monospace)",
              }}
            >
              Checklist filter
            </p>
            <h2 style={{ margin: 0, fontFamily: "var(--font-display, Syne, sans-serif)", fontSize: 26, fontWeight: 800 }}>
              Build the launch layer in the right order
            </h2>
          </div>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {(["all", "mandatory", "recommended", "later"] as const).map((value) => (
              <button
                key={value}
                onClick={() => setActiveStatus(value)}
                style={{
                  borderRadius: 999,
                  border: "1px solid",
                  borderColor: activeStatus === value ? "var(--saffron)" : "var(--border)",
                  background: activeStatus === value ? "rgba(255,107,0,0.12)" : "var(--surface)",
                  color: activeStatus === value ? "var(--saffron)" : "var(--text-muted)",
                  padding: "8px 14px",
                  fontSize: 12,
                  cursor: "pointer",
                  fontFamily: "var(--font-mono, monospace)",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                {value}
              </button>
            ))}
          </div>
        </div>

        <StartupGuideView
          phases={startupGuidePhases}
          checkedIds={checkedIds}
          activeStatus={activeStatus}
          onToggle={toggleItem}
        />
      </section>

      <SiteFooter />
    </main>
  );
}
