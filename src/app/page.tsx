"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

const BOOKMARKLET = `javascript:(function(){window.open('https://shipsafe-india.vercel.app?url='+encodeURIComponent(window.location.href),'_blank')})();`;

function HomeContent() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [inputMode, setInputMode] = useState<"url" | "github">("url");
  const router = useRouter();
  const searchParams = useSearchParams();
  const autoScanTriggered = useRef(false);

  // Auto-scan if ?url= is in query string (bookmarklet flow)
  useEffect(() => {
    const urlParam = searchParams.get("url");
    if (urlParam && !autoScanTriggered.current) {
      autoScanTriggered.current = true;
      const decoded = decodeURIComponent(urlParam);
      setUrl(decoded);
      if (decoded.includes("github.com")) setInputMode("github");
      // Small delay so UI renders first
      setTimeout(() => {
        triggerScan(decoded);
      }, 300);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const triggerScan = async (scanUrl: string) => {
    if (!scanUrl.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: scanUrl.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Scan failed");
      sessionStorage.setItem("scanResult", JSON.stringify(data));
      router.push("/results");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Scan failed. Try again.");
      setLoading(false);
    }
  };

  const handleScan = (e: React.FormEvent) => {
    e.preventDefault();
    triggerScan(url);
  };

  const handleCopyBookmarklet = () => {
    navigator.clipboard.writeText(BOOKMARKLET).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const isGithubUrl = url.includes("github.com");
  const placeholder = inputMode === "github"
    ? "github.com/username/repo"
    : "yourapp.in";

  return (
    <main style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", flexDirection: "column" }}>
      {/* Tricolor bar */}
      <div className="tricolor-bar" style={{ height: 3 }} />

      {/* Nav */}
      <nav style={{ padding: "20px 40px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid var(--border)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 22 }}>🛡️</span>
          <span style={{ fontFamily: "var(--font-display, 'Syne', sans-serif)", fontWeight: 800, fontSize: 18, color: "var(--text)", letterSpacing: "-0.02em" }}>
            ShipSafe<span style={{ color: "var(--saffron)" }}> India</span>
          </span>
        </div>
        <div style={{ display: "flex", gap: 24, fontSize: 13, color: "var(--text-muted)" }}>
          <span>39 Checks</span>
          <span>•</span>
          <span>Free</span>
          <span>•</span>
          <span>No signup</span>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "72px 24px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        {/* Background grid */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(rgba(255,107,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,107,0,0.03) 1px, transparent 1px)`, backgroundSize: "40px 40px", pointerEvents: "none" }} />
        {/* Glow */}
        <div style={{ position: "absolute", top: "30%", left: "50%", transform: "translateX(-50%)", width: 600, height: 300, background: "radial-gradient(ellipse, rgba(255,107,0,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div style={{ position: "relative", maxWidth: 780 }}>
          {/* Badge */}
          <div className="animate-fade-up" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,107,0,0.1)", border: "1px solid rgba(255,107,0,0.25)", borderRadius: 100, padding: "6px 16px", marginBottom: 32, fontSize: 12, color: "var(--saffron)", fontFamily: "var(--font-mono, monospace)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
            <span>🇮🇳</span>
            India-First Pre-Launch Scanner
          </div>

          {/* Headline */}
          <h1 className="animate-fade-up-delay-1" style={{ fontFamily: "var(--font-display, 'Syne', sans-serif)", fontWeight: 800, fontSize: "clamp(38px, 6vw, 68px)", lineHeight: 1.05, letterSpacing: "-0.03em", color: "var(--text)", margin: "0 0 20px 0" }}>
            Is your app actually
            <br /><span style={{ color: "var(--saffron)" }}>ready to ship</span> in India?
          </h1>

          <p className="animate-fade-up-delay-2" style={{ fontSize: 18, color: "var(--text-muted)", lineHeight: 1.6, margin: "0 auto 40px auto", maxWidth: 540 }}>
            DPDP, RBI, CERT-In compliance + security + SEO — checked in 60 seconds.
            Paste a URL, drop a GitHub repo, or scan from your browser.
          </p>

          {/* Input mode tabs */}
          <div className="animate-fade-up-delay-2" style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 16 }}>
            {(["url", "github"] as const).map(mode => (
              <button
                key={mode}
                onClick={() => { setInputMode(mode); setUrl(""); setError(""); }}
                style={{
                  padding: "6px 16px",
                  borderRadius: 100,
                  border: "1px solid",
                  fontSize: 12,
                  cursor: "pointer",
                  fontFamily: "var(--font-mono, monospace)",
                  transition: "all 0.15s",
                  borderColor: inputMode === mode ? "var(--saffron)" : "var(--border)",
                  background: inputMode === mode ? "rgba(255,107,0,0.12)" : "transparent",
                  color: inputMode === mode ? "var(--saffron)" : "var(--text-muted)",
                }}
              >
                {mode === "url" ? "🌐 Website URL" : "🐙 GitHub Repo"}
              </button>
            ))}
          </div>

          {/* Scanner input */}
          <form onSubmit={handleScan} className="animate-fade-up-delay-3" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
            <div
              style={{ display: "flex", width: "100%", maxWidth: 620, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden", transition: "border-color 0.2s" }}
              onFocusCapture={e => (e.currentTarget.style.borderColor = "var(--saffron)")}
              onBlurCapture={e => (e.currentTarget.style.borderColor = isGithubUrl ? "rgba(255,107,0,0.5)" : "var(--border)")}
            >
              <div style={{ padding: "14px 14px", color: "var(--text-dim)", fontSize: 15, display: "flex", alignItems: "center", flexShrink: 0 }}>
                {isGithubUrl || inputMode === "github" ? "🐙" : "🌐"}
              </div>
              <input
                type="text"
                value={url}
                onChange={e => {
                  setUrl(e.target.value);
                  if (e.target.value.includes("github.com")) setInputMode("github");
                  else if (inputMode === "github" && !e.target.value.includes("github")) setInputMode("url");
                }}
                placeholder={placeholder}
                disabled={loading}
                style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "var(--text)", fontSize: 15, padding: "14px 0", fontFamily: "var(--font-mono, monospace)" }}
              />
              <button
                type="submit"
                disabled={loading || !url.trim()}
                style={{ padding: "14px 24px", background: loading ? "rgba(255,107,0,0.4)" : "var(--saffron)", border: "none", color: "#fff", fontWeight: 700, fontSize: 14, cursor: loading ? "wait" : "pointer", flexShrink: 0, letterSpacing: "0.02em", display: "flex", alignItems: "center", gap: 8 }}
              >
                {loading ? <><ScanSpinner /> Scanning...</> : "Scan Now →"}
              </button>
            </div>

            {error && <p style={{ color: "var(--red-fail)", fontSize: 13 }}>{error}</p>}

            <p style={{ fontSize: 12, color: "var(--text-dim)" }}>
              Free · No account required · Results in ~15 seconds
            </p>
          </form>

          {/* Input mode hints */}
          <div className="animate-fade-up-delay-4" style={{ marginTop: 20, display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <span style={{ fontSize: 12, color: "var(--text-dim)" }}>Try:</span>
            {["yourapp.in", "github.com/username/repo"].map(example => (
              <button
                key={example}
                onClick={() => { setUrl(example); if (example.includes("github")) setInputMode("github"); }}
                style={{ fontSize: 12, color: "var(--text-muted)", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 6, padding: "3px 10px", cursor: "pointer", fontFamily: "var(--font-mono, monospace)" }}
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Three ways to scan */}
      <section style={{ padding: "48px 40px", borderTop: "1px solid var(--border)", maxWidth: 1000, margin: "0 auto", width: "100%" }}>
        <p style={{ fontSize: 11, color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 28, textAlign: "center" }}>
          3 ways to scan
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>

          {/* Way 1: URL */}
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, padding: "20px 24px" }}>
            <div style={{ fontSize: 20, marginBottom: 10 }}>🌐</div>
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 6 }}>Paste a Website URL</div>
            <div style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.6, marginBottom: 12 }}>
              Drop any live URL. We fetch the page, check headers, scan HTML, and test robots.txt + sitemap.
            </div>
            <code style={{ fontSize: 11, color: "var(--saffron)", background: "rgba(255,107,0,0.08)", padding: "4px 8px", borderRadius: 4 }}>
              https://yourapp.in
            </code>
          </div>

          {/* Way 2: GitHub */}
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, padding: "20px 24px" }}>
            <div style={{ fontSize: 20, marginBottom: 10 }}>🐙</div>
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 6 }}>Drop a GitHub Repo URL</div>
            <div style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.6, marginBottom: 12 }}>
              Scan source code before you deploy. Detects committed .env files, hardcoded secrets, missing .gitignore entries, and more.
            </div>
            <code style={{ fontSize: 11, color: "var(--saffron)", background: "rgba(255,107,0,0.08)", padding: "4px 8px", borderRadius: 4 }}>
              github.com/user/repo
            </code>
          </div>

          {/* Way 3: Bookmarklet */}
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, padding: "20px 24px" }}>
            <div style={{ fontSize: 20, marginBottom: 10 }}>🔖</div>
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 6 }}>Browser Bookmarklet</div>
            <div style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.6, marginBottom: 12 }}>
              Drag to your bookmarks bar. One click on any page runs a full scan — no URL copying needed.
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
              <a
                href={BOOKMARKLET}
                style={{ fontSize: 11, background: "var(--saffron)", color: "#fff", padding: "5px 12px", borderRadius: 6, textDecoration: "none", fontWeight: 700, cursor: "grab" }}
                title="Drag me to your bookmarks bar"
                onClick={e => e.preventDefault()}
                onDragStart={e => e.dataTransfer.setData("text/plain", BOOKMARKLET)}
              >
                🛡️ ShipSafe India
              </a>
              <button
                onClick={handleCopyBookmarklet}
                style={{ fontSize: 11, color: "var(--text-muted)", background: "var(--surface-2)", border: "1px solid var(--border)", padding: "5px 10px", borderRadius: 6, cursor: "pointer" }}
              >
                {copied ? "✓ Copied!" : "Copy code"}
              </button>
            </div>
            <p style={{ fontSize: 10, color: "var(--text-dim)", marginTop: 8, marginBottom: 0 }}>
              Drag the orange button to your bookmarks bar, or copy the code and create a bookmark manually.
            </p>
          </div>

        </div>
      </section>

      {/* WhatsApp CTA */}
      <section style={{ maxWidth: 1000, margin: "0 auto 24px", width: "100%", padding: "0 40px" }}>
        <div style={{ background: "rgba(37,211,102,0.06)", border: "1px solid rgba(37,211,102,0.2)", borderRadius: 10, padding: "20px 24px", display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
          <span style={{ fontSize: 28, flexShrink: 0 }}>💬</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>Scan via WhatsApp</div>
            <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
              Send any URL or GitHub repo link to our WhatsApp bot and get a full scan report back — no browser needed.
            </div>
          </div>
          <div style={{ fontSize: 12, color: "var(--text-dim)", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, padding: "8px 14px", fontFamily: "var(--font-mono, monospace)" }}>
            Setup in README →
          </div>
        </div>
      </section>

      {/* India-specific callout */}
      <section style={{ maxWidth: 1000, margin: "0 auto 48px", width: "100%", padding: "0 40px" }}>
        <div style={{ background: "linear-gradient(135deg, rgba(255,107,0,0.08) 0%, rgba(19,136,8,0.06) 100%)", border: "1px solid rgba(255,107,0,0.2)", borderRadius: 12, padding: "28px 36px", position: "relative", overflow: "hidden" }}>
          <div className="tricolor-bar" style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 4, borderRadius: "12px 0 0 12px" }} />
          <h2 style={{ fontFamily: "var(--font-display, Syne, sans-serif)", fontWeight: 800, fontSize: 20, margin: "0 0 10px", letterSpacing: "-0.02em" }}>
            The only scanner that speaks India
          </h2>
          <p style={{ color: "var(--text-muted)", lineHeight: 1.7, maxWidth: 580, marginBottom: 16 }}>
            Every other scanner checks global security. None check for{" "}
            <strong style={{ color: "var(--text)" }}>DPDP consent</strong>,{" "}
            <strong style={{ color: "var(--text)" }}>Grievance Officer</strong>,{" "}
            <strong style={{ color: "var(--text)" }}>Razorpay key exposure</strong>,{" "}
            <strong style={{ color: "var(--text)" }}>RBI data localization</strong>, or{" "}
            <strong style={{ color: "var(--text)" }}>CERT-In requirements</strong>. We do.
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {["DPDP Act 2023", "RBI PA-O 2025", "CERT-In Directions", "Consumer Protection Rules"].map(label => (
              <span key={label} style={{ background: "rgba(255,107,0,0.1)", color: "var(--saffron)", padding: "4px 12px", borderRadius: 100, fontSize: 12, border: "1px solid rgba(255,107,0,0.2)" }}>
                {label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid var(--border)", padding: "20px 40px", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12, color: "var(--text-dim)" }}>
        <span>🛡️ ShipSafe India — Built for Indian vibe coders</span>
        <div style={{ display: "flex", gap: 16 }}>
          <a href="https://github.com/abdash1994/shipsafe-india" target="_blank" rel="noopener noreferrer" style={{ color: "var(--text-dim)", textDecoration: "none" }}>GitHub</a>
          <span>·</span>
          <span>Free · No tracking</span>
        </div>
      </footer>

      {/* Loading overlay */}
      {loading && <ScanOverlay url={url} />}
    </main>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: "var(--bg)" }} />}>
      <HomeContent />
    </Suspense>
  );
}

function ScanSpinner() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <circle cx="7" cy="7" r="5.5" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
      <path d="M7 1.5A5.5 5.5 0 0 1 12.5 7" stroke="white" strokeWidth="1.5" strokeLinecap="round">
        <animateTransform attributeName="transform" type="rotate" from="0 7 7" to="360 7 7" dur="0.7s" repeatCount="indefinite" />
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

  const isGithub = url.includes("github.com");

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(10,10,10,0.95)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", zIndex: 100, backdropFilter: "blur(8px)" }}>
      <div style={{ width: 120, height: 120, borderRadius: "50%", border: "2px solid rgba(255,107,0,0.2)", position: "relative", marginBottom: 40 }}>
        <div style={{ position: "absolute", inset: 8, borderRadius: "50%", border: "2px solid rgba(255,107,0,0.4)" }} />
        <div style={{ position: "absolute", inset: 20, borderRadius: "50%", border: "2px solid var(--saffron)", borderTopColor: "transparent", animation: "spin 1s linear infinite" }} />
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36 }}>
          {isGithub ? "🐙" : "🛡️"}
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>

      <p style={{ fontFamily: "var(--font-display, Syne, sans-serif)", fontWeight: 800, fontSize: 24, marginBottom: 8, letterSpacing: "-0.02em" }}>
        {isGithub ? "Scanning source code" : "Scanning your app"}
      </p>
      <p style={{ fontFamily: "var(--font-mono, monospace)", fontSize: 12, color: "var(--saffron)", marginBottom: 40, maxWidth: 400, textAlign: "center", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        {url}
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 8, width: 280 }}>
        {(isGithub
          ? ["Fetching repo files...", "Checking .env committed...", "Scanning .gitignore...", "Checking .npmrc registry...", "Detecting hardcoded secrets...", "Checking India compliance...", "Generating report..."]
          : steps
        ).map((step, i) => (
          <div key={step} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: "var(--text-muted)", animation: `fade-up 0.3s ease ${i * 0.4}s both` }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--saffron)", flexShrink: 0, animation: `pulse 1s ease ${i * 0.4}s infinite` }} />
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
