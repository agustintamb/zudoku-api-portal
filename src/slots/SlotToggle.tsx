import { useSyncExternalStore } from "react";
import { Button } from "zudoku/ui/Button";
import { slotStore } from "./slotVisibility";
import { SlotTag } from "./SlotTag";

// Renders the slot visibility toggle button + the head-navigation-end indicator.
// The toggle is always visible. The SlotTag only shows when slots are ON.
// Registered in config.slots["head-navigation-end"].
export function SlotToggle() {
  const visible = useSyncExternalStore(
    slotStore.subscribe,
    slotStore.getSnapshot,
    slotStore.getServerSnapshot,
  );

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
      <Button
        variant="outline"
        size="sm"
        onClick={slotStore.toggle}
        title={visible ? "Hide slot indicators" : "Show slot indicators"}
        style={{ fontFamily: "monospace", fontSize: "0.72rem", gap: "0.35rem" }}
      >
        🔌 Slots: <strong>{visible ? "ON" : "OFF"}</strong>
      </Button>
      {visible && (
        <SlotTag
          name="head-navigation-end"
          description="inside header, before theme switcher"
          color="#eab308"
        />
      )}
    </div>
  );
}
