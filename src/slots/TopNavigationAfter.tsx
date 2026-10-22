import { useSyncExternalStore } from "react";
import { slotStore } from "./slotVisibility";
import { SlotBar } from "./SlotTag";

export function TopNavigationAfter() {
  const visible = useSyncExternalStore(
    slotStore.subscribe,
    slotStore.getSnapshot,
    slotStore.getServerSnapshot,
  );
  if (!visible) return null;
  return (
    <SlotBar
      name="top-navigation-after"
      description="below the top nav tabs row"
      color="#22c55e"
    />
  );
}
