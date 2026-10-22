import { SlotBar } from "./SlotTag";

// Slot: top-navigation-before
// Renders above the top navigation tabs row (the second header row with page links).
// Useful for: section labels, breadcrumbs, contextual alerts above the nav.
export function TopNavigationBefore() {
  return (
    <SlotBar
      name="top-navigation-before"
      description="above the top nav tabs row"
      color="#84cc16"
    />
  );
}
