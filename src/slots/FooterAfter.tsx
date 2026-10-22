import { useSyncExternalStore } from "react";
import { slotStore } from "./slotVisibility";
import { SlotBar } from "./SlotTag";

export function FooterAfter() {
  const visible = useSyncExternalStore(
    slotStore.subscribe,
    slotStore.getSnapshot,
    slotStore.getServerSnapshot,
  );
  if (!visible) return null;
  return (
    <SlotBar
      name="footer-after"
      description="inside footer, after columns — only renders when site.footer is set"
      color="#6366f1"
    />
  );
}
