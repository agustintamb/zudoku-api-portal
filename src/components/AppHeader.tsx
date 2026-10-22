import type { ReactNode } from "react";
import { Link, useLocation } from "zudoku/router";
import { AppFooter } from "./AppFooter";

const NAV = [
  { label: "Home", to: "/home" },
  { label: "Dashboard", to: "/dashboard" },
  { label: "Docs", to: "/introduction" },
  { label: "API Store", to: "/api-store" },
];

export function AppHeader() {
  const { pathname } = useLocation();

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 40,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "1rem",
        padding: "0.75rem 1.5rem",
        background: "hsl(var(--background))",
        borderBottom: "1px solid hsl(var(--border))",
      }}
    >
      <Link
        to="/home"
        style={{ fontWeight: 700, color: "hsl(var(--foreground))", textDecoration: "none" }}
      >
        Zudoku Sandbox
      </Link>
      <nav style={{ display: "flex", gap: "0.25rem", flexWrap: "wrap" }}>
        {NAV.map((item) => {
          const active = pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              style={{
                padding: "0.375rem 0.75rem",
                borderRadius: "0.5rem",
                fontSize: "0.875rem",
                fontWeight: 500,
                textDecoration: "none",
                color: active ? "hsl(var(--accent-foreground))" : "hsl(var(--muted-foreground))",
                background: active ? "hsl(var(--accent))" : "transparent",
              }}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "hsl(var(--background))",
      }}
    >
      <AppHeader />
      <main style={{ flex: 1 }}>{children}</main>
      <AppFooter />
    </div>
  );
}
