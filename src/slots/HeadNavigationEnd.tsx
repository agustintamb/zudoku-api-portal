import { SlotTag } from "./SlotTag";

// Slot: head-navigation-end
// Renders inside the header bar, after the nav links and before the theme switcher.
// Useful for: CTA button, user status indicator, notification badge.
export function HeadNavigationEnd() {
  return (
    <SlotTag
      name="head-navigation-end"
      description="inside header, before theme switcher"
      color="#eab308"
    />
  );
}
