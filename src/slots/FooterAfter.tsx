import { SlotBar } from "./SlotTag";

// Slot: footer-after
// Renders inside <footer>, after the columns grid and before the copyright bar.
// Only visible when site.footer is configured.
// Useful for: legal links, cookie preferences, secondary footer content.
export function FooterAfter() {
  return (
    <SlotBar
      name="footer-after"
      description="inside footer, after columns — only renders when site.footer is set"
      color="#6366f1"
    />
  );
}
