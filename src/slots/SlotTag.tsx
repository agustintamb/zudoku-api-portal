type SlotTagProps = {
  name: string;
  description: string;
  color: string;
};

// Shared debug badge used by every slot demo component.
// Renders a small pill that clearly identifies the slot name and location.
export function SlotTag({ name, description, color }: SlotTagProps) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.4rem",
        padding: "0.2rem 0.6rem",
        borderRadius: "9999px",
        border: `1.5px solid ${color}`,
        background: `${color}18`,
        fontFamily: "monospace",
        fontSize: "0.7rem",
        fontWeight: 600,
        color,
        whiteSpace: "nowrap",
        userSelect: "none",
      }}
      title={description}
    >
      🔌 {name}
    </span>
  );
}

// Full-width bar variant — for layout-level slots that span the whole viewport.
export function SlotBar({
  name,
  description,
  color,
}: SlotTagProps) {
  return (
    <div
      style={{
        width: "100%",
        padding: "0.25rem 1rem",
        background: `${color}14`,
        borderBottom: `2px solid ${color}`,
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        fontSize: "0.7rem",
        fontFamily: "monospace",
        fontWeight: 600,
        color,
      }}
      title={description}
    >
      🔌 SLOT: <strong>{name}</strong>
      <span style={{ fontWeight: 400, opacity: 0.8 }}>— {description}</span>
    </div>
  );
}
