import { SlotBar } from "./SlotTag";

// Slot: layout-before-head
// Renders immediately above the <header> element, outside the header DOM node.
// Useful for: announcement banners, maintenance notices, cookie consent bars.
export function LayoutBeforeHead() {
  return (
    <SlotBar
      name="layout-before-head"
      description="above the header — announcement banners, notices"
      color="#ef4444"
    />
  );
}
