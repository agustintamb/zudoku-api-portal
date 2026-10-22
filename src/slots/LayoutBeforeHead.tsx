import { useSyncExternalStore } from "react";
import { slotStore } from "./slotVisibility";
import { SlotBar } from "./SlotTag";

export function LayoutBeforeHead() {
  const visible = useSyncExternalStore(
    slotStore.subscribe,
    slotStore.getSnapshot,
    slotStore.getServerSnapshot,
  );
  if (!visible) return null;
  return (
    <SlotBar
      name="layout-before-head"
      description="above the header — announcement banners, notices"
      color="#ef4444"
    />
  );
}
