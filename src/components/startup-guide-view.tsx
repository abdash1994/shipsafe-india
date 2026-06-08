import Link from "next/link";

import type { StartupGuidePhase, StartupItemStatus } from "@/lib/startup-guide";

const statusStyle: Record<
  StartupItemStatus,
  { label: string; color: string; background: string }
> = {
  mandatory: {
    label: "Mandatory",
    color: "var(--red-fail)",
    background: "rgba(255,59,59,0.08)",
  },
  recommended: {
    label: "Recommended",
    color: "var(--yellow-warn)",
    background: "rgba(255,184,0,0.08)",
  },
  later: {
    label: "Later",
    color: "var(--text-dim)",
    background: "rgba(255,255,255,0.05)",
  },
};

export function StartupGuideView({
  phases,
  checkedIds = new Set<string>(),
  activeStatus = "all",
  onToggle,
}: {
  phases: StartupGuidePhase[];
  checkedIds?: Set<string>;
  activeStatus?: StartupItemStatus | "all";
  onToggle?: (id: string) => void;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {phases.map((phase) => {
        const visibleItems = phase.items.filter(
          (item) => activeStatus === "all" || item.status === activeStatus,
        );

        if (visibleItems.length === 0) {
          return null;
        }

        return (
          <section
            key={phase.id}
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: 16,
              overflow: "hidden",
            }}
          >
            <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--border)" }}>
              <h2
                style={{
                  fontFamily: "var(--font-display, Syne, sans-serif)",
                  fontWeight: 800,
                  fontSize: 24,
                  margin: "0 0 6px 0",
                  letterSpacing: "-0.02em",
                }}
              >
                {phase.title}
              </h2>
              <p style={{ margin: 0, color: "var(--text-muted)", fontSize: 14, lineHeight: 1.7 }}>
                {phase.summary}
              </p>
            </div>

            <div style={{ padding: "8px 24px 0" }}>
              {visibleItems.map((item, index) => {
                const style = statusStyle[item.status];
                const checked = checkedIds.has(item.id);

                return (
                  <div
                    key={item.id}
                    style={{
                      padding: "18px 0",
                      borderBottom:
                        index === visibleItems.length - 1 ? "none" : "1px solid var(--border)",
                      opacity: checked ? 0.62 : 1,
                      transition: "opacity 0.18s ease",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 12,
                        alignItems: "flex-start",
                        marginBottom: 10,
                        flexWrap: "wrap",
                      }}
                    >
                      <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                        {onToggle ? (
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => onToggle(item.id)}
                            aria-label={`Mark ${item.title} complete`}
                            style={{
                              marginTop: 3,
                              width: 16,
                              height: 16,
                              accentColor: "var(--saffron)",
                              cursor: "pointer",
                              flexShrink: 0,
                            }}
                          />
                        ) : null}
                        <div>
                          <h3
                            style={{
                              margin: "0 0 4px 0",
                              fontSize: 16,
                              fontWeight: 700,
                              textDecoration: checked ? "line-through" : "none",
                            }}
                          >
                            {item.title}
                          </h3>
                          <p style={{ margin: 0, fontSize: 13, color: "var(--text-muted)", lineHeight: 1.7 }}>
                            {item.what}
                          </p>
                        </div>
                      </div>

                      <span
                        style={{
                          color: style.color,
                          background: style.background,
                          border: `1px solid ${style.color}33`,
                          borderRadius: 999,
                          padding: "4px 10px",
                          fontSize: 11,
                          fontFamily: "var(--font-mono, monospace)",
                          letterSpacing: "0.06em",
                          textTransform: "uppercase",
                          flexShrink: 0,
                        }}
                      >
                        {style.label}
                      </span>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
                      <InfoBlock
                        label="When you need it"
                        value={item.when}
                      />
                      <InfoBlock
                        label="Common mistake"
                        value={item.commonMistake}
                      />
                    </div>

                    {item.scanHint ? (
                      <div
                        style={{
                          marginTop: 12,
                          background: "rgba(255,107,0,0.07)",
                          border: "1px solid rgba(255,107,0,0.18)",
                          borderRadius: 10,
                          padding: "12px 14px",
                          fontSize: 13,
                          color: "var(--text-muted)",
                          lineHeight: 1.6,
                        }}
                      >
                        <span style={{ color: "var(--saffron)", fontWeight: 700 }}>ShipSafe tie-in:</span>{" "}
                        {item.scanHint}
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>

            {phase.cta ? (
              <div
                style={{
                  padding: "20px 24px 24px",
                  borderTop: "1px solid var(--border)",
                  background: "linear-gradient(135deg, rgba(255,107,0,0.06) 0%, rgba(19,136,8,0.04) 100%)",
                }}
              >
                <Link
                  href={phase.cta.href}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 10,
                    background: "var(--saffron)",
                    color: "#fff",
                    textDecoration: "none",
                    padding: "12px 18px",
                    borderRadius: 12,
                    fontWeight: 700,
                    fontSize: 14,
                    marginBottom: 8,
                  }}
                >
                  {phase.cta.label}
                  <span>→</span>
                </Link>
                <p style={{ margin: 0, color: "var(--text-muted)", fontSize: 13, lineHeight: 1.6 }}>
                  {phase.cta.detail}
                </p>
              </div>
            ) : null}
          </section>
        );
      })}
    </div>
  );
}

function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        background: "var(--surface-2)",
        border: "1px solid var(--border)",
        borderRadius: 12,
        padding: "12px 14px",
      }}
    >
      <p
        style={{
          margin: "0 0 5px 0",
          fontSize: 11,
          color: "var(--text-dim)",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          fontFamily: "var(--font-mono, monospace)",
        }}
      >
        {label}
      </p>
      <p style={{ margin: 0, fontSize: 13, color: "var(--text-muted)", lineHeight: 1.6 }}>{value}</p>
    </div>
  );
}
