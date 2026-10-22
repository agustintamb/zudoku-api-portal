import { Link } from "zudoku/router";
import { FOOTER } from "./footerData";

// Footer shared by every page, same links (src/components/footerData.ts).
// Home/Dashboard render the full version through <AppShell>; docs and API pages
// render the slim version through Zudoku's footer-before slot.
export function AppFooter({ slim = false }: { slim?: boolean }) {
  const columns = FOOTER.columns;

  if (slim) {
    return (
      <footer
        data-app-footer
        style={{
          borderTop: "1px solid hsl(var(--border))",
          background: "hsl(var(--background))",
          padding: "0.625rem 2rem",
        }}
      >
        <nav
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "0.25rem 1.25rem",
          }}
        >
          {columns.flatMap((column) => column.links).map((link) => (
            <Link
              key={link.href}
              to={link.href}
              style={{
                fontSize: "0.75rem",
                color: "hsl(var(--muted-foreground))",
                textDecoration: "none",
              }}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </footer>
    );
  }

  return (
    <footer
      data-app-footer
      style={{
        borderTop: "1px solid hsl(var(--border))",
        background: "hsl(var(--background))",
      }}
    >
      <div
        style={{
          maxWidth: "1536px",
          margin: "0 auto",
          padding: "5rem 2rem",
        }}
      >
        <div style={{ display: "flex", justifyContent: "center", gap: "2rem" }}>
          <div
            style={{
              width: "100%",
              maxWidth: "48rem",
              display: "grid",
              gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))`,
              gap: "2rem",
            }}
          >
            {columns.map((column) => (
              <div key={column.title} style={{ justifySelf: "center" }}>
                <span style={{ fontSize: "0.875rem", fontWeight: 600 }}>
                  {column.title}
                </span>
                <ul
                  style={{
                    listStyle: "none",
                    margin: "1rem 0 0",
                    padding: 0,
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.5rem",
                  }}
                >
                  {column.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        to={link.href}
                        style={{
                          fontSize: "0.875rem",
                          color: "hsl(var(--muted-foreground))",
                          textDecoration: "none",
                        }}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
