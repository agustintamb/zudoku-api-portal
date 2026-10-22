import { useSyncExternalStore } from "react";
import { slotStore } from "./slotVisibility";
import { SlotBar } from "./SlotTag";

export function TopNavigationBefore() {
  const visible = useSyncExternalStore(
    slotStore.subscribe,
    slotStore.getSnapshot,
    slotStore.getServerSnapshot,
  );
  if (!visible) return null;
  return (
    <SlotBar
      name="top-navigation-before"
      description="above the top nav tabs row"
      color="#84cc16"
    />
  );
}
