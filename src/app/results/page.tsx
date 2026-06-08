"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ScanResult, CheckResult, Category } from "@/lib/types";

export const dynamic = "force-dynamic";

export default function ResultsPage() {
  const [result, setResult] = useState<ScanResult | null>(null);
  const [expandedCheck, setExpandedCheck] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const stored = sessionStorage.getItem("scanResult");
    if (!stored) {
      router.push("/");
      return;
    }
    try {
      setResult(JSON.parse(stored));
    } catch {
      router.push("/");
    }
  }, [router]);

  if (!result) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--text-muted)",
        }}
      >
        Loading...
      </div>
    );
  }

  const gradeColor = {
    A: "var(--green-pass)",
    B: "#7CF5A0",
    C: "var(--yellow-warn)",
    D: "#FF8833",
    F: "var(--red-fail)",
  }[result.grade];

  return (
    <main style={{ minHeight: "100vh", background: "var(--bg)" }}>
      {/* Tricolor bar */}
      <div className="tricolor-bar" style={{ height: 3 }} />

      {/* Nav */}
      <nav
        style={{
          padding: "16px 40px",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <button
          onClick={() => router.push("/")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "var(--text)",
          }}
        >
          <span style={{ fontFamily: "var(--font-display, Syne, sans-serif)", fontWeight: 800, fontSize: 16 }}>
            🛡️ ShipSafe<span style={{ color: "var(--saffron)" }}> India</span>
          </span>
        </button>
        <button
          onClick={() => router.push("/")}
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            color: "var(--text-muted)",
            padding: "8px 16px",
            borderRadius: 8,
            cursor: "pointer",
            fontSize: 13,
          }}
        >
          ← Scan another URL
        </button>
      </nav>

      {/* Score header */}
      <section
        style={{
          padding: "48px 40px 36px",
          maxWidth: 1100,
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 40,
            alignItems: "flex-start",
            flexWrap: "wrap",
          }}
        >
          {/* Grade circle */}
          <div
            style={{
              width: 120,
              height: 120,
              borderRadius: "50%",
              border: `3px solid ${gradeColor}`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              boxShadow: `0 0 30px ${gradeColor}22`,
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-display, Syne, sans-serif)",
                fontWeight: 800,
                fontSize: 48,
                lineHeight: 1,
                color: gradeColor,
              }}
            >
              {result.grade}
            </span>
            <span style={{ fontSize: 11, color: "var(--text-dim)" }}>
              {result.score}/100
            </span>
          </div>

          {/* Summary */}
          <div style={{ flex: 1, minWidth: 200 }}>
            <p
              style={{
                fontSize: 11,
                color: "var(--text-dim)",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                marginBottom: 8,
                fontFamily: "var(--font-mono, monospace)",
              }}
            >
              Scanned
            </p>
            <h1
              style={{
                fontFamily: "var(--font-display, Syne, sans-serif)",
                fontWeight: 800,
                fontSize: 22,
                letterSpacing: "-0.02em",
                marginBottom: 4,
                wordBreak: "break-all",
              }}
            >
              {result.url}
            </h1>
            <p style={{ fontSize: 12, color: "var(--text-dim)", marginBottom: 24 }}>
              {new Date(result.scannedAt).toLocaleString("en-IN")} ·{" "}
              {(result.scanDurationMs / 1000).toFixed(1)}s
            </p>

            {/* Summary pills */}
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <SummaryPill
                count={result.summary.critical}
                label="Critical"
                color="var(--red-fail)"
              />
              <SummaryPill
                count={result.summary.high}
                label="High"
                color="#FF8833"
              />
              <SummaryPill
                count={result.summary.medium}
                label="Medium"
                color="var(--yellow-warn)"
              />
              <SummaryPill
                count={result.summary.passed}
                label="Passed"
                color="var(--green-pass)"
              />
            </div>
          </div>

          {/* Action CTA if failures exist */}
          {result.summary.critical > 0 && (
            <div
              style={{
                background: "rgba(255,59,59,0.08)",
                border: "1px solid rgba(255,59,59,0.2)",
                borderRadius: 10,
                padding: "20px 24px",
                maxWidth: 260,
              }}
            >
              <p
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: "var(--red-fail)",
                  marginBottom: 8,
                }}
              >
                ⚠️ {result.summary.critical} critical issue
                {result.summary.critical > 1 ? "s" : ""} found
              </p>
              <p style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.5 }}>
                Fix these before sharing with real users. Your app could be
                exposing data or failing legal requirements.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Score bar */}
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "0 40px 40px",
        }}
      >
        <div
          style={{
            height: 6,
            background: "var(--surface-2)",
            borderRadius: 100,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${result.score}%`,
              background: `linear-gradient(to right, var(--red-fail), var(--yellow-warn), var(--green-pass))`,
              borderRadius: 100,
              transition: "width 1s ease",
            }}
          />
        </div>
      </div>

      {/* Categories */}
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "0 40px 80px",
          display: "flex",
          flexDirection: "column",
          gap: 24,
        }}
      >
        {result.categories.map((category) => (
          <CategorySection
            key={category.id}
            category={category}
            expandedCheck={expandedCheck}
            onToggle={setExpandedCheck}
          />
        ))}
      </div>
    </main>
  );
}

function SummaryPill({
  count,
  label,
  color,
}: {
  count: number;
  label: string;
  color: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        background: `${color}11`,
        border: `1px solid ${color}33`,
        borderRadius: 100,
        padding: "4px 12px",
        fontSize: 13,
      }}
    >
      <span style={{ fontWeight: 700, color }}>{count}</span>
      <span style={{ color: "var(--text-muted)" }}>{label}</span>
    </div>
  );
}

function CategorySection({
  category,
  expandedCheck,
  onToggle,
}: {
  category: Category;
  expandedCheck: string | null;
  onToggle: (id: string | null) => void;
}) {
  const fails = category.checks.filter((c) => c.status === "fail").length;
  const warns = category.checks.filter((c) => c.status === "warn").length;
  const passes = category.checks.filter((c) => c.status === "pass").length;

  return (
    <div
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: 12,
        overflow: "hidden",
      }}
    >
      {/* Category header */}
      <div
        style={{
          padding: "20px 24px",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          gap: 16,
        }}
      >
        <span style={{ fontSize: 22 }}>{category.icon}</span>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <h2
              style={{
                fontFamily: "var(--font-display, Syne, sans-serif)",
                fontWeight: 700,
                fontSize: 16,
                letterSpacing: "-0.01em",
                margin: 0,
              }}
            >
              {category.label}
            </h2>
            {category.id === "india" && (
              <span
                style={{
                  background: "rgba(255,107,0,0.12)",
                  color: "var(--saffron)",
                  fontSize: 9,
                  padding: "2px 7px",
                  borderRadius: 100,
                  fontFamily: "var(--font-mono, monospace)",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                }}
              >
                India-Only
              </span>
            )}
          </div>
          <p style={{ fontSize: 12, color: "var(--text-dim)", margin: "2px 0 0" }}>
            {category.description}
          </p>
        </div>
        <div style={{ display: "flex", gap: 8, fontSize: 12 }}>
          {fails > 0 && (
            <span style={{ color: "var(--red-fail)" }}>
              {fails} fail{fails !== 1 ? "s" : ""}
            </span>
          )}
          {warns > 0 && (
            <span style={{ color: "var(--yellow-warn)" }}>
              {warns} warn{warns !== 1 ? "s" : ""}
            </span>
          )}
          <span style={{ color: "var(--green-pass)" }}>{passes} pass</span>
        </div>
      </div>

      {/* Check list */}
      <div>
        {category.checks.map((check, i) => (
          <CheckRow
            key={check.id}
            check={check}
            isLast={i === category.checks.length - 1}
            isExpanded={expandedCheck === check.id}
            onToggle={() =>
              onToggle(expandedCheck === check.id ? null : check.id)
            }
          />
        ))}
      </div>
    </div>
  );
}

function CheckRow({
  check,
  isLast,
  isExpanded,
  onToggle,
}: {
  check: CheckResult;
  isLast: boolean;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const statusConfig = {
    pass: { icon: "✓", color: "var(--green-pass)", bg: "rgba(0,208,132,0.06)" },
    fail: { icon: "✗", color: "var(--red-fail)", bg: "rgba(255,59,59,0.06)" },
    warn: { icon: "!", color: "var(--yellow-warn)", bg: "rgba(255,184,0,0.06)" },
    skip: { icon: "–", color: "var(--text-dim)", bg: "transparent" },
    info: { icon: "i", color: "var(--text-dim)", bg: "transparent" },
  }[check.status];

  const severityColor = {
    critical: "var(--red-fail)",
    high: "#FF8833",
    medium: "var(--yellow-warn)",
    low: "var(--text-dim)",
    info: "var(--text-dim)",
  }[check.severity];

  return (
    <div
      style={{
        borderBottom: isLast ? "none" : "1px solid var(--border)",
        background: isExpanded ? statusConfig.bg : "transparent",
      }}
    >
      <button
        onClick={onToggle}
        style={{
          width: "100%",
          padding: "14px 24px",
          background: "none",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: 14,
          textAlign: "left",
        }}
      >
        {/* Status icon */}
        <div
          style={{
            width: 22,
            height: 22,
            borderRadius: "50%",
            background: `${statusConfig.color}18`,
            border: `1.5px solid ${statusConfig.color}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            fontSize: 11,
            fontWeight: 700,
            color: statusConfig.color,
            fontFamily: "var(--font-mono, monospace)",
          }}
        >
          {statusConfig.icon}
        </div>

        {/* Title + description */}
        <div style={{ flex: 1 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 2,
            }}
          >
            <span
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "var(--text)",
              }}
            >
              {check.title}
            </span>
            {check.isIndiaSpecific && (
              <span style={{ fontSize: 10 }}>🇮🇳</span>
            )}
          </div>
          <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
            {check.description}
          </span>
        </div>

        {/* Severity badge */}
        {check.status !== "pass" && (
          <span
            style={{
              fontSize: 10,
              color: severityColor,
              border: `1px solid ${severityColor}44`,
              borderRadius: 100,
              padding: "2px 8px",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              fontFamily: "var(--font-mono, monospace)",
              flexShrink: 0,
            }}
          >
            {check.severity}
          </span>
        )}

        {/* Expand arrow */}
        <span
          style={{
            color: "var(--text-dim)",
            fontSize: 12,
            flexShrink: 0,
            transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s",
          }}
        >
          ▾
        </span>
      </button>

      {/* Expanded detail */}
      {isExpanded && (
        <div
          style={{
            padding: "0 24px 20px 60px",
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          {check.detail && (
            <div
              style={{
                fontFamily: "var(--font-mono, monospace)",
                fontSize: 12,
                color: "var(--text-muted)",
                background: "var(--surface-2)",
                padding: "10px 14px",
                borderRadius: 6,
                borderLeft: `3px solid ${statusConfig.color}`,
              }}
            >
              {check.detail}
            </div>
          )}

          {check.fixGuide && check.status !== "pass" && (
            <div>
              <p
                style={{
                  fontSize: 11,
                  color: "var(--text-dim)",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  marginBottom: 6,
                }}
              >
                How to fix
              </p>
              <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.6 }}>
                {check.fixGuide}
              </p>
            </div>
          )}

          {check.regulation && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: 11,
                color: "var(--saffron)",
              }}
            >
              <span>📋</span>
              <span
                style={{
                  fontFamily: "var(--font-mono, monospace)",
                }}
              >
                {check.regulation}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
