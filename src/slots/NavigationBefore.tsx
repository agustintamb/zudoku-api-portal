import { useSyncExternalStore } from "react";
import { slotStore } from "./slotVisibility";
import { SlotTag } from "./SlotTag";

export function NavigationBefore() {
  const visible = useSyncExternalStore(
    slotStore.subscribe,
    slotStore.getSnapshot,
    slotStore.getServerSnapshot,
  );
  if (!visible) return null;
  return (
    <div style={{ padding: "0.5rem 0.75rem" }}>
      <SlotTag
        name="navigation-before"
        description="top of left sidebar"
        color="#06b6d4"
      />
    </div>
  );
}
