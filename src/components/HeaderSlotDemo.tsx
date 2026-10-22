import { Link } from "zudoku/router";
import { Badge } from "zudoku/ui/Badge";
import { Button } from "zudoku/ui/Button";

// This component is injected into the header via the "head-navigation-end" slot.
// Slots are React components rendered inside named positions of the Zudoku layout.
// Available header slots: "head-navigation-start", "head-navigation-end",
//   "layout-before-head", "layout-after-head",
//   "top-navigation-before", "top-navigation-after"
export function HeaderSlotDemo() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
      <Badge variant="secondary" style={{ fontSize: "0.7rem" }}>
        v2.0
      </Badge>
      <Button asChild size="sm" variant="outline">
        <Link to="/api-store">APIs</Link>
      </Button>
    </div>
  );
}
