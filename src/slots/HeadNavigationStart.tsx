import { useSyncExternalStore } from "react";
import { slotStore } from "./slotVisibility";
import { SlotTag } from "./SlotTag";

export function HeadNavigationStart() {
  const visible = useSyncExternalStore(
    slotStore.subscribe,
    slotStore.getSnapshot,
    slotStore.getServerSnapshot,
  );
  if (!visible) return null;
  return (
    <SlotTag
      name="head-navigation-start"
      description="inside header, after logo"
      color="#f97316"
    />
  );
}
