import { SlotBar } from "./SlotTag";

// Slot: top-navigation-after
// Renders below the top navigation tabs row.
// Useful for: sub-navigation, progress indicator, contextual toolbar.
export function TopNavigationAfter() {
  return (
    <SlotBar
      name="top-navigation-after"
      description="below the top nav tabs row"
      color="#22c55e"
    />
  );
}
