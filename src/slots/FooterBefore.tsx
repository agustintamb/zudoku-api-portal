import { SlotBar } from "./SlotTag";

// Slot: footer-before
// Renders inside <footer>, before the columns grid.
// Only visible when site.footer is configured (footer returns null otherwise).
// Useful for: newsletter signup, footer CTA, status indicator.
export function FooterBefore() {
  return (
    <SlotBar
      name="footer-before"
      description="inside footer, before columns — only renders when site.footer is set"
      color="#14b8a6"
    />
  );
}
