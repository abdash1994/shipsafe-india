import Link from "next/link";

export function SiteNav({
  active,
}: {
  active?: "home" | "startup" | "scan" | "results";
}) {
  const links = [
    { id: "home", href: "/", label: "Home" },
    { id: "startup", href: "/startup", label: "Get Started" },
    { id: "scan", href: "/scan", label: "Scan My App" },
  ] as const;

  return (
    <nav
      style={{
        padding: "20px 40px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
        borderBottom: "1px solid var(--border)",
        flexWrap: "wrap",
      }}
    >
      <Link
        href="/"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          textDecoration: "none",
          color: "var(--text)",
        }}
      >
        <span style={{ fontSize: 22 }}>🛡️</span>
        <span
          style={{
            fontFamily: "var(--font-display, 'Syne', sans-serif)",
            fontWeight: 800,
            fontSize: 18,
            letterSpacing: "-0.02em",
          }}
        >
          ShipSafe<span style={{ color: "var(--saffron)" }}> India</span>
        </span>
      </Link>

      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        {links.map((link) => {
          const isActive = active === link.id;

          return (
            <Link
              key={link.id}
              href={link.href}
              style={{
                color: isActive ? "var(--text)" : "var(--text-muted)",
                textDecoration: "none",
                fontSize: 13,
                padding: "8px 12px",
                borderRadius: 999,
                border: `1px solid ${isActive ? "rgba(255,107,0,0.3)" : "transparent"}`,
                background: isActive ? "rgba(255,107,0,0.08)" : "transparent",
                transition: "all 0.18s ease",
              }}
            >
              {link.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
