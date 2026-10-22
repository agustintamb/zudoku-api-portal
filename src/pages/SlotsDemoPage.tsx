import { Slot } from "zudoku/components";
import { SlotBar, SlotTag } from "../slots/SlotTag";

// content-before and content-after are registered here via Slot.Source.
// They only activate while this page is mounted — unlike config.slots which are global.
// This demonstrates per-page slot injection without affecting other pages.
export function SlotsDemoPage() {
  return (
    <>
      <Slot.Source name="content-before">
        <SlotBar
          name="content-before"
          description="above page content in <main> — active only on this page via Slot.Source"
          color="#f43f5e"
        />
      </Slot.Source>

      <Slot.Source name="content-after">
        <SlotBar
          name="content-after"
          description="below page content in <main> — active only on this page via Slot.Source"
          color="#ec4899"
        />
      </Slot.Source>

      <div style={{ maxWidth: "860px", margin: "0 auto", padding: "2.5rem 1.5rem" }}>
        <p
          style={{
            fontSize: "0.8rem",
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "hsl(var(--primary))",
            marginBottom: "0.5rem",
          }}
        >
          Layout Injection
        </p>
        <h1
          style={{
            fontSize: "2rem",
            fontWeight: 700,
            color: "hsl(var(--foreground))",
            marginBottom: "0.5rem",
          }}
        >
          Slots Demo
        </h1>
        <p style={{ color: "hsl(var(--muted-foreground))", marginBottom: "2.5rem", maxWidth: "560px" }}>
          Each colored label you see on this page is a slot — a named injection point in
          Zudoku's layout. Global slots (registered in <code style={{ fontFamily: "monospace" }}>config.slots</code>) appear
          on every page. Per-page slots use <code style={{ fontFamily: "monospace" }}>{"<Slot.Source>"}</code> inside a component and only
          activate while that component is mounted.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {SLOTS.map((group) => (
            <div
              key={group.area}
              style={{
                borderRadius: "0.75rem",
                border: "1px solid hsl(var(--border))",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  padding: "0.75rem 1.25rem",
                  background: "hsl(var(--muted))",
                  borderBottom: "1px solid hsl(var(--border))",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color: "hsl(var(--muted-foreground))",
                }}
              >
                {group.area}
              </div>
              <div style={{ padding: "1rem 1.25rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {group.slots.map((s) => (
                  <div
                    key={s.name}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "1rem",
                      flexWrap: "wrap",
                    }}
                  >
                    <SlotTag name={s.name} description={s.description} color={s.color} />
                    <div style={{ fontSize: "0.8rem", color: "hsl(var(--muted-foreground))", lineHeight: "1.5" }}>
                      <strong style={{ color: "hsl(var(--foreground))" }}>{s.where}</strong>
                      {" · "}{s.useCases}
                      {s.note && (
                        <span style={{ display: "block", marginTop: "0.2rem", opacity: 0.75 }}>
                          ⚠ {s.note}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            marginTop: "2rem",
            padding: "1rem 1.25rem",
            borderRadius: "0.5rem",
            background: "hsl(var(--muted))",
            fontSize: "0.8rem",
            color: "hsl(var(--muted-foreground))",
          }}
        >
          <strong style={{ color: "hsl(var(--foreground))" }}>Two registration modes:</strong>
          {" "}
          <code style={{ fontFamily: "monospace" }}>config.slots</code> — global, always active.
          {" "}
          <code style={{ fontFamily: "monospace" }}>{"<Slot.Source name=\"...\">content</Slot.Source>"}</code> — component-scoped,
          active only while that component is mounted.
        </div>
      </div>
    </>
  );
}

const SLOTS = [
  {
    area: "Layout (above/below entire header)",
    slots: [
      {
        name: "layout-before-head",
        description: "above the header",
        color: "#ef4444",
        where: "Above the <header> element",
        useCases: "Announcement banners, maintenance notices, cookie consent",
      },
      {
        name: "layout-after-head",
        description: "below the header",
        color: "#f97316",
        where: "Between the header and the page grid",
        useCases: "Progress bars, secondary banners, contextual alerts",
      },
    ],
  },
  {
    area: "Header bar (first row: logo + search)",
    slots: [
      {
        name: "head-navigation-start",
        description: "inside header, after logo",
        color: "#f97316",
        where: "Inside the header, right after the logo",
        useCases: "Environment badge (staging/prod), org switcher, breadcrumb",
      },
      {
        name: "head-navigation-end",
        description: "inside header, before theme switcher",
        color: "#eab308",
        where: "Inside the header, before the theme toggle button",
        useCases: "CTA button, notification badge, user status",
      },
    ],
  },
  {
    area: "Top navigation (second row: page tabs)",
    slots: [
      {
        name: "top-navigation-before",
        description: "above the top nav tabs row",
        color: "#84cc16",
        where: "Above the tabs that switch between Home / API Store / Documentation",
        useCases: "Section labels, breadcrumbs, contextual alerts",
      },
      {
        name: "top-navigation-after",
        description: "below the top nav tabs row",
        color: "#22c55e",
        where: "Below the tabs row, above the page content grid",
        useCases: "Sub-navigation, progress indicator, contextual toolbar",
      },
    ],
  },
  {
    area: "Left sidebar (only on pages with navigation)",
    slots: [
      {
        name: "navigation-before",
        description: "top of left sidebar",
        color: "#06b6d4",
        where: "Above sidebar navigation items",
        useCases: "Docs search, sidebar header, version badge, filter",
        note: "Only visible on pages that have a sidebar (MDX docs, API reference). Not on custom pages.",
      },
      {
        name: "navigation-after",
        description: "bottom of left sidebar",
        color: "#8b5cf6",
        where: "Below all sidebar navigation items",
        useCases: "Support link, feedback button, sidebar footer",
        note: "Only visible on pages that have a sidebar.",
      },
    ],
  },
  {
    area: "Page content (inside <main>)",
    slots: [
      {
        name: "content-before",
        description: "above page content in <main>",
        color: "#f43f5e",
        where: "Inside <main>, before the route's component renders",
        useCases: "Page-level alert, breadcrumb, context banner",
        note: "This page uses Slot.Source — content-before/after are only active here.",
      },
      {
        name: "content-after",
        description: "below page content in <main>",
        color: "#ec4899",
        where: "Inside <main>, after the route's component finishes",
        useCases: "Next/prev links, feedback widget, related content",
        note: "This page uses Slot.Source — content-before/after are only active here.",
      },
    ],
  },
  {
    area: "Footer (requires site.footer in config)",
    slots: [
      {
        name: "footer-before",
        description: "inside footer, before columns",
        color: "#14b8a6",
        where: "Inside <footer>, before the link columns grid",
        useCases: "Newsletter signup, footer CTA, status indicator",
        note: "Footer only renders when site.footer is configured.",
      },
      {
        name: "footer-after",
        description: "inside footer, after columns",
        color: "#6366f1",
        where: "Inside <footer>, after the link columns",
        useCases: "Legal links, cookie preferences, secondary footer content",
        note: "Footer only renders when site.footer is configured.",
      },
    ],
  },
];
