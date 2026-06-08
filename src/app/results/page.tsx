"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { ScanResult, CheckResult, Category } from "@/lib/types";
import { decodeResult } from "@/lib/share";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";

export const dynamic = "force-dynamic";

function ResultsContent() {
  const [result, setResult] = useState<ScanResult | null>(null);
  const [expandedCheck, setExpandedCheck] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [manualChecked, setManualChecked] = useState<Record<string, boolean>>({});
  const router = useRouter();

  // Load after hydration to avoid server/client mismatch
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const encoded = params.get("r");
    if (encoded) {
      const decoded = decodeResult(encoded);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (decoded) { setResult(decoded); return; }
    }
    const stored = sessionStorage.getItem("scanResult");
    if (!stored) { router.push("/scan"); return; }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    try { setResult(JSON.parse(stored) as ScanResult); }
    catch { router.push("/scan"); }
  }, [router]);

  const handleShare = () => {
    if (!result) return;
    // Use ?url= param — triggers a fresh scan on open (60 chars vs 36KB full encoding)
    // Works perfectly on WhatsApp, iMessage, Telegram, email
    const shareUrl = `https://shipsafe-india.vercel.app?url=${encodeURIComponent(result.url)}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  if (!result) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg)", color: "var(--text-muted)" }}>
        Loading...
      </div>
    );
  }

  const allChecks = result.categories.flatMap(c => c.checks);
  const warnChecks = allChecks.filter(c => c.status === "warn");
  const failChecks = allChecks.filter(c => c.status === "fail");

  // Prioritized action plan — top fails by weight
  const weights: Record<string, number> = { critical: 4, high: 3, medium: 2, low: 1 };
  const topActions = [...failChecks]
    .sort((a, b) => (weights[b.severity] || 0) - (weights[a.severity] || 0))
    .slice(0, 3);

  // Score if top 3 fixed
  const severityWeights: Record<string, number> = { critical: 20, high: 10, medium: 5, low: 2, info: 0 };
  const topActionScore = topActions.reduce((sum, c) => sum + (severityWeights[c.severity] || 0), 0);
  const projectedScore = Math.min(100, result.score + topActionScore);
  const projectedGrade =
    projectedScore >= 90 ? "A" : projectedScore >= 75 ? "B" : projectedScore >= 60 ? "C" : projectedScore >= 40 ? "D" : "F";

  const gradeColor = {
    A: "var(--green-pass)", B: "#7CF5A0", C: "var(--yellow-warn)", D: "#FF8833", F: "var(--red-fail)",
  }[result.grade] || "var(--text)";

  const projectedGradeColor = {
    A: "var(--green-pass)", B: "#7CF5A0", C: "var(--yellow-warn)", D: "#FF8833", F: "var(--red-fail)",
  }[projectedGrade] || "var(--text)";

  // Unverifiable warn checks (cannot be auto-confirmed from URL)
  const unverifiableIds = new Set([
    "rbi-data-localization", "cert-in-plan", "dpdp-breach-notification",
    "analytics-installed", "error-tracking", "uptime-monitoring",
    "transactional-email", "db-backups", "gh-env-example",
  ]);
  const manualChecks = warnChecks.filter(c => unverifiableIds.has(c.id));
  const manualDoneCount = manualChecks.filter(c => manualChecked[c.id]).length;

  return (
    <main style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <div className="tricolor-bar" style={{ height: 3 }} />

      <SiteNav active="results" />

      {/* Results actions */}
      <nav style={{ padding: "16px 40px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <div style={{ fontSize: 12, color: "var(--text-dim)", fontFamily: "var(--font-mono, monospace)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
          Ship readiness report
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={handleShare}
            style={{ background: "var(--surface)", border: "1px solid var(--border)", color: copied ? "var(--green-pass)" : "var(--text-muted)", padding: "8px 16px", borderRadius: 8, cursor: "pointer", fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}
          >
            {copied ? "✓ Link copied!" : "🔗 Share results"}
          </button>
          <button
            onClick={() => router.push("/scan")}
            style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text-muted)", padding: "8px 16px", borderRadius: 8, cursor: "pointer", fontSize: 13 }}
          >
            ← Scan another URL
          </button>
        </div>
      </nav>

      {/* Score header */}
      <section style={{ padding: "40px 40px 28px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "flex", gap: 32, alignItems: "flex-start", flexWrap: "wrap" }}>
          <div style={{ width: 110, height: 110, borderRadius: "50%", border: `3px solid ${gradeColor}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: `0 0 24px ${gradeColor}22` }}>
            <span style={{ fontFamily: "var(--font-display, Syne, sans-serif)", fontWeight: 800, fontSize: 44, lineHeight: 1, color: gradeColor }}>{result.grade}</span>
            <span style={{ fontSize: 11, color: "var(--text-dim)" }}>{result.score}/100</span>
          </div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <p style={{ fontSize: 11, color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6, fontFamily: "var(--font-mono, monospace)" }}>Scanned</p>
            <h1 style={{ fontFamily: "var(--font-display, Syne, sans-serif)", fontWeight: 800, fontSize: 20, letterSpacing: "-0.02em", marginBottom: 4, wordBreak: "break-all" }}>
              {result.url}
            </h1>
            <p style={{ fontSize: 12, color: "var(--text-dim)", marginBottom: 20 }}>
              {new Date(result.scannedAt).toLocaleString("en-IN")} · {(result.scanDurationMs / 1000).toFixed(1)}s
            </p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {[
                { count: result.summary.critical, label: "Critical", color: "var(--red-fail)" },
                { count: result.summary.high, label: "High", color: "#FF8833" },
                { count: result.summary.medium, label: "Medium", color: "var(--yellow-warn)" },
                { count: result.summary.passed, label: "Passed", color: "var(--green-pass)" },
              ].map(({ count, label, color }) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: 6, background: `${color}11`, border: `1px solid ${color}33`, borderRadius: 100, padding: "4px 12px", fontSize: 13 }}>
                  <span style={{ fontWeight: 700, color }}>{count}</span>
                  <span style={{ color: "var(--text-muted)" }}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Score bar */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 40px 28px" }}>
        <div style={{ height: 5, background: "var(--surface-2)", borderRadius: 100, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${result.score}%`, background: "linear-gradient(to right, var(--red-fail), var(--yellow-warn), var(--green-pass))", borderRadius: 100 }} />
        </div>
      </div>

      {/* === PRIORITIZED ACTION PLAN === */}
      {topActions.length > 0 && (
        <section style={{ maxWidth: 1100, margin: "0 auto 24px", padding: "0 40px" }}>
          <div style={{ background: "linear-gradient(135deg, rgba(255,107,0,0.06) 0%, rgba(255,59,59,0.04) 100%)", border: "1px solid rgba(255,107,0,0.2)", borderRadius: 12, padding: "24px 28px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 12 }}>
              <div>
                <h2 style={{ fontFamily: "var(--font-display, Syne, sans-serif)", fontWeight: 800, fontSize: 16, letterSpacing: "-0.01em", margin: "0 0 4px" }}>
                  Fix these {topActions.length} things first
                </h2>
                <p style={{ fontSize: 12, color: "var(--text-muted)", margin: 0 }}>
                  Fixing just these will take your score from{" "}
                  <span style={{ color: gradeColor, fontWeight: 700 }}>{result.grade} ({result.score})</span>{" "}
                  to{" "}
                  <span style={{ color: projectedGradeColor, fontWeight: 700 }}>{projectedGrade} (~{projectedScore})</span>
                </p>
              </div>
              <div style={{ fontSize: 28, fontFamily: "var(--font-display, Syne, sans-serif)", fontWeight: 800 }}>
                <span style={{ color: gradeColor }}>{result.grade}</span>
                <span style={{ color: "var(--text-dim)", margin: "0 8px", fontSize: 20 }}>→</span>
                <span style={{ color: projectedGradeColor }}>{projectedGrade}</span>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {topActions.map((check, i) => (
                <div key={check.id} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <div style={{ width: 22, height: 22, borderRadius: "50%", background: "rgba(255,107,0,0.15)", border: "1px solid var(--saffron)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "var(--saffron)", flexShrink: 0, marginTop: 1 }}>
                    {i + 1}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                      <span style={{ fontSize: 13, fontWeight: 600 }}>{check.title}</span>
                      {check.isIndiaSpecific && <span style={{ fontSize: 11 }}>🇮🇳</span>}
                      <span style={{ fontSize: 10, color: check.severity === "critical" ? "var(--red-fail)" : "#FF8833", border: `1px solid currentColor`, borderRadius: 100, padding: "1px 7px", fontFamily: "var(--font-mono, monospace)", textTransform: "uppercase", letterSpacing: "0.05em", opacity: 0.8 }}>
                        {check.severity}
                      </span>
                    </div>
                    <p style={{ fontSize: 12, color: "var(--text-muted)", margin: 0, lineHeight: 1.5 }}>
                      {check.fixGuide?.slice(0, 140)}{(check.fixGuide?.length || 0) > 140 ? "…" : ""}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* === MANUAL CHECKS REQUIRED === */}
      {manualChecks.length > 0 && (
        <section style={{ maxWidth: 1100, margin: "0 auto 24px", padding: "0 40px" }}>
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden" }}>
            <div style={{ padding: "16px 24px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <h2 style={{ fontFamily: "var(--font-display, Syne, sans-serif)", fontWeight: 700, fontSize: 15, margin: 0 }}>
                  🔧 Manual Checks Required
                </h2>
                <p style={{ fontSize: 12, color: "var(--text-muted)", margin: "3px 0 0" }}>
                  These can&apos;t be verified from a URL scan — check each one in your setup and tick it off
                </p>
              </div>
              <span style={{ fontSize: 13, color: manualDoneCount === manualChecks.length ? "var(--green-pass)" : "var(--text-dim)" }}>
                {manualDoneCount}/{manualChecks.length} done
              </span>
            </div>
            <div>
              {manualChecks.map((check, i) => (
                <div
                  key={check.id}
                  style={{ padding: "14px 24px", borderBottom: i < manualChecks.length - 1 ? "1px solid var(--border)" : "none", display: "flex", alignItems: "flex-start", gap: 14 }}
                >
                  <input
                    type="checkbox"
                    checked={!!manualChecked[check.id]}
                    onChange={e => setManualChecked(prev => ({ ...prev, [check.id]: e.target.checked }))}
                    style={{ marginTop: 3, accentColor: "var(--saffron)", width: 16, height: 16, flexShrink: 0, cursor: "pointer" }}
                  />
                  <div style={{ flex: 1, opacity: manualChecked[check.id] ? 0.5 : 1, transition: "opacity 0.2s" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                      <span style={{ fontSize: 13, fontWeight: 600, textDecoration: manualChecked[check.id] ? "line-through" : "none" }}>
                        {check.title}
                      </span>
                      {check.isIndiaSpecific && <span style={{ fontSize: 11 }}>🇮🇳</span>}
                    </div>
                    <p style={{ fontSize: 12, color: "var(--text-muted)", margin: "0 0 4px", lineHeight: 1.5 }}>{check.description}</p>
                    {check.fixGuide && (
                      <p style={{ fontSize: 11, color: "var(--text-dim)", margin: 0, lineHeight: 1.5 }}>{check.fixGuide}</p>
                    )}
                    {check.regulation && (
                      <span style={{ fontSize: 10, color: "var(--saffron)", fontFamily: "var(--font-mono, monospace)", display: "inline-block", marginTop: 4 }}>
                        📋 {check.regulation}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Categories */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 40px 80px", display: "flex", flexDirection: "column", gap: 20 }}>
        {result.categories.map(category => (
          <CategorySection
            key={category.id}
            category={category}
            expandedCheck={expandedCheck}
            onToggle={setExpandedCheck}
            manualCheckIds={new Set(manualChecks.map(c => c.id))}
          />
        ))}
      </div>

      <SiteFooter />
    </main>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: "var(--bg)" }} />}>
      <ResultsContent />
    </Suspense>
  );
}

function CategorySection({
  category, expandedCheck, onToggle, manualCheckIds,
}: {
  category: Category;
  expandedCheck: string | null;
  onToggle: (id: string | null) => void;
  manualCheckIds: Set<string>;
}) {
  const fails = category.checks.filter(c => c.status === "fail").length;
  const warns = category.checks.filter(c => c.status === "warn" && !manualCheckIds.has(c.id)).length;
  const passes = category.checks.filter(c => c.status === "pass").length;

  return (
    <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden" }}>
      <div style={{ padding: "18px 24px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 14 }}>
        <span style={{ fontSize: 20 }}>{category.icon}</span>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <h2 style={{ fontFamily: "var(--font-display, Syne, sans-serif)", fontWeight: 700, fontSize: 15, letterSpacing: "-0.01em", margin: 0 }}>
              {category.label}
            </h2>
            {category.id === "india" && (
              <span style={{ background: "rgba(255,107,0,0.12)", color: "var(--saffron)", fontSize: 9, padding: "2px 7px", borderRadius: 100, fontFamily: "var(--font-mono, monospace)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                India-Only
              </span>
            )}
          </div>
          <p style={{ fontSize: 12, color: "var(--text-dim)", margin: "2px 0 0" }}>{category.description}</p>
        </div>
        <div style={{ display: "flex", gap: 10, fontSize: 12 }}>
          {fails > 0 && <span style={{ color: "var(--red-fail)" }}>{fails} fail{fails !== 1 ? "s" : ""}</span>}
          {warns > 0 && <span style={{ color: "var(--yellow-warn)" }}>{warns} warn{warns !== 1 ? "s" : ""}</span>}
          <span style={{ color: "var(--green-pass)" }}>{passes} pass</span>
        </div>
      </div>
      <div>
        {category.checks
          .filter(c => !manualCheckIds.has(c.id) || c.status !== "warn")
          .map((check, i, arr) => (
            <CheckRow
              key={check.id}
              check={check}
              isLast={i === arr.length - 1}
              isExpanded={expandedCheck === check.id}
              onToggle={() => onToggle(expandedCheck === check.id ? null : check.id)}
            />
          ))}
      </div>
    </div>
  );
}

function CheckRow({ check, isLast, isExpanded, onToggle }: {
  check: CheckResult; isLast: boolean; isExpanded: boolean; onToggle: () => void;
}) {
  const statusConfig = {
    pass: { icon: "✓", color: "var(--green-pass)" },
    fail: { icon: "✗", color: "var(--red-fail)" },
    warn: { icon: "!", color: "var(--yellow-warn)" },
    skip: { icon: "–", color: "var(--text-dim)" },
    info: { icon: "i", color: "var(--text-dim)" },
  }[check.status];

  const severityColor = {
    critical: "var(--red-fail)", high: "#FF8833", medium: "var(--yellow-warn)", low: "var(--text-dim)", info: "var(--text-dim)",
  }[check.severity];

  return (
    <div style={{ borderBottom: isLast ? "none" : "1px solid var(--border)" }}>
      <button
        onClick={onToggle}
        style={{ width: "100%", padding: "13px 24px", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 12, textAlign: "left" }}
      >
        <div style={{ width: 20, height: 20, borderRadius: "50%", background: `${statusConfig.color}18`, border: `1.5px solid ${statusConfig.color}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 10, fontWeight: 700, color: statusConfig.color, fontFamily: "var(--font-mono, monospace)" }}>
          {statusConfig.icon}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 1 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>{check.title}</span>
            {check.isIndiaSpecific && <span style={{ fontSize: 10 }}>🇮🇳</span>}
          </div>
          <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{check.description}</span>
        </div>
        {check.status !== "pass" && (
          <span style={{ fontSize: 10, color: severityColor, border: `1px solid ${severityColor}44`, borderRadius: 100, padding: "2px 7px", textTransform: "uppercase", letterSpacing: "0.05em", fontFamily: "var(--font-mono, monospace)", flexShrink: 0 }}>
            {check.severity}
          </span>
        )}
        <span style={{ color: "var(--text-dim)", fontSize: 12, flexShrink: 0, transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>▾</span>
      </button>

      {isExpanded && (
        <div style={{ padding: "0 24px 18px 56px", display: "flex", flexDirection: "column", gap: 10 }}>
          {check.detail && (
            <div style={{ fontFamily: "var(--font-mono, monospace)", fontSize: 12, color: "var(--text-muted)", background: "var(--surface-2)", padding: "10px 14px", borderRadius: 6, borderLeft: `3px solid ${statusConfig.color}` }}>
              {check.detail}
            </div>
          )}
          {check.fixGuide && check.status !== "pass" && (
            <div>
              <p style={{ fontSize: 11, color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 5 }}>How to fix</p>
              <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.6, margin: 0 }}>{check.fixGuide}</p>
            </div>
          )}
          {check.regulation && (
            <span style={{ fontSize: 11, color: "var(--saffron)", fontFamily: "var(--font-mono, monospace)" }}>📋 {check.regulation}</span>
          )}
        </div>
      )}
    </div>
  );
}
