import { useSyncExternalStore } from "react";
import { slotStore } from "./slotVisibility";
import { SlotBar } from "./SlotTag";

export function FooterBefore() {
  const visible = useSyncExternalStore(
    slotStore.subscribe,
    slotStore.getSnapshot,
    slotStore.getServerSnapshot,
  );
  if (!visible) return null;
  return (
    <SlotBar
      name="footer-before"
      description="inside footer, before columns — only renders when site.footer is set"
      color="#14b8a6"
    />
  );
}
