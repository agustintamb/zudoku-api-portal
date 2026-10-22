import { SlotTag } from "./SlotTag";

// Slot: navigation-before
// Renders above the left sidebar navigation items.
// Only visible on pages that have a sidebar (MDX docs, API reference).
// Useful for: search within docs, sidebar header, version badge.
export function NavigationBefore() {
  return (
    <div style={{ padding: "0.5rem 0.75rem" }}>
      <SlotTag
        name="navigation-before"
        description="top of left sidebar"
        color="#06b6d4"
      />
    </div>
  );
}
