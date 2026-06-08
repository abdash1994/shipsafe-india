export function SiteFooter() {
  return (
    <footer
      style={{
        borderTop: "1px solid var(--border)",
        padding: "20px 40px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        fontSize: 12,
        color: "var(--text-dim)",
        gap: 12,
        flexWrap: "wrap",
      }}
    >
      <span>🛡️ ShipSafe India — Start smart. Ship safe.</span>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        <a
          href="https://github.com/abdash1994/shipsafe-india"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "var(--text-dim)", textDecoration: "none" }}
        >
          GitHub
        </a>
        <span>·</span>
        <span>Built for Indian founders shipping on the internet</span>
      </div>
    </footer>
  );
}
