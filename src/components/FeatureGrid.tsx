import type { ReactNode } from "react";

type Feature = {
  icon?: string;
  title: string;
  description: string;
  href?: string;
};

type FeatureGridProps = {
  items: Feature[];
  columns?: 2 | 3 | 4;
};

// Custom MDX component: registered in zudoku.config.tsx via mdx.components.
// Usage in .mdx files:
//   <FeatureGrid columns={3} items={[
//     { icon: "🚀", title: "Fast", description: "Optimized for speed." },
//     { icon: "🔒", title: "Secure", description: "JWT + HTTPS." },
//   ]} />
export function FeatureGrid({ items, columns = 3 }: FeatureGridProps) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        gap: "1rem",
        margin: "1.5rem 0",
      }}
    >
      {items.map((item, i) => {
        const inner = (
          <div
            style={{
              padding: "1.25rem",
              borderRadius: "0.5rem",
              border: "1px solid hsl(var(--border))",
              background: "hsl(var(--card))",
              height: "100%",
              transition: "box-shadow 0.15s",
              cursor: item.href ? "pointer" : "default",
            }}
          >
            {item.icon && (
              <div
                style={{
                  fontSize: "1.75rem",
                  marginBottom: "0.75rem",
                  lineHeight: 1,
                }}
                role="img"
                aria-hidden
              >
                {item.icon}
              </div>
            )}
            <div
              style={{
                fontWeight: 600,
                fontSize: "0.95rem",
                color: "hsl(var(--foreground))",
                marginBottom: "0.4rem",
              }}
            >
              {item.title}
            </div>
            <div
              style={{
                fontSize: "0.82rem",
                lineHeight: "1.55",
                color: "hsl(var(--muted-foreground))",
              }}
            >
              {item.description}
            </div>
          </div>
        );

        return item.href ? (
          <a
            key={i}
            href={item.href}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            {inner}
          </a>
        ) : (
          <div key={i}>{inner}</div>
        );
      })}
    </div>
  );
}
