import { SlotTag } from "./SlotTag";

// Slot: head-navigation-start
// Renders inside the header bar, right after the logo and before the search box.
// Useful for: environment badge, org switcher, secondary nav items.
export function HeadNavigationStart() {
  return (
    <SlotTag
      name="head-navigation-start"
      description="inside header, after logo"
      color="#f97316"
    />
  );
}
