import type { ReactNode } from "react";

type Variant = "info" | "warning" | "success" | "error" | "tip";

const STYLES: Record<
  Variant,
  { border: string; bg: string; icon: string; titleColor: string }
> = {
  info: {
    border: "hsl(221 83% 53%)",
    bg: "hsl(221 83% 97%)",
    icon: "ℹ️",
    titleColor: "hsl(221 83% 35%)",
  },
  warning: {
    border: "hsl(38 92% 50%)",
    bg: "hsl(38 92% 97%)",
    icon: "⚠️",
    titleColor: "hsl(38 92% 30%)",
  },
  success: {
    border: "hsl(142 76% 36%)",
    bg: "hsl(142 76% 97%)",
    icon: "✅",
    titleColor: "hsl(142 76% 25%)",
  },
  error: {
    border: "hsl(0 84% 60%)",
    bg: "hsl(0 84% 97%)",
    icon: "❌",
    titleColor: "hsl(0 84% 40%)",
  },
  tip: {
    border: "hsl(271 81% 56%)",
    bg: "hsl(271 81% 97%)",
    icon: "💡",
    titleColor: "hsl(271 81% 35%)",
  },
};

type CalloutBoxProps = {
  variant?: Variant;
  title?: string;
  children: ReactNode;
};

// Custom MDX component: registered in zudoku.config.tsx via mdx.components.
// Usage in .mdx files:
//   <CalloutBox variant="info" title="Note">
//     Your content here.
//   </CalloutBox>
export function CalloutBox({ variant = "info", title, children }: CalloutBoxProps) {
  const s = STYLES[variant];

  return (
    <div
      style={{
        borderLeft: `4px solid ${s.border}`,
        background: s.bg,
        borderRadius: "0 0.375rem 0.375rem 0",
        padding: "1rem 1.25rem",
        margin: "1.5rem 0",
      }}
    >
      {title && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            marginBottom: "0.5rem",
            fontWeight: 600,
            fontSize: "0.9rem",
            color: s.titleColor,
          }}
        >
          <span role="img" aria-hidden>
            {s.icon}
          </span>
          {title}
        </div>
      )}
      <div
        style={{
          fontSize: "0.875rem",
          lineHeight: "1.6",
          color: "hsl(var(--foreground))",
        }}
      >
        {children}
      </div>
    </div>
  );
}
