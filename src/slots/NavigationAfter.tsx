import { SlotTag } from "./SlotTag";

// Slot: navigation-after
// Renders below all left sidebar navigation items.
// Only visible on pages that have a sidebar (MDX docs, API reference).
// Useful for: sidebar footer, support link, version info.
export function NavigationAfter() {
  return (
    <div style={{ padding: "0.5rem 0.75rem" }}>
      <SlotTag
        name="navigation-after"
        description="bottom of left sidebar"
        color="#8b5cf6"
      />
    </div>
  );
}
