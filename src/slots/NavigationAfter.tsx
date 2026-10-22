import { useSyncExternalStore } from "react";
import { slotStore } from "./slotVisibility";
import { SlotTag } from "./SlotTag";

export function NavigationAfter() {
  const visible = useSyncExternalStore(
    slotStore.subscribe,
    slotStore.getSnapshot,
    slotStore.getServerSnapshot,
  );
  if (!visible) return null;
  return (
    <div style={{ padding: "0.5rem 0.75rem" }}>
      <SlotTag
        name="navigation-after"
        description="bottom of left sidebar"
        color="#8b5cf6"
      />
    </div>
  );
}
