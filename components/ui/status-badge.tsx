type Status = "active" | "inactive" | "paused" | "queued" | "failed" | "success";

const chipCls: Record<Status, string> = {
  active: "bg-success/20 text-success",
  inactive: "bg-muted/20 text-muted",
  paused: "bg-warning/20 text-warning",
  queued: "bg-primary/20 text-primary",
  failed: "bg-danger/20 text-danger",
  success: "bg-success/20 text-success",
};

/**
 * StatusBadge — dual-variant status indicator.
 *
 * - `variant="chip"` (default): coloured pill label (e.g. vault card list)
 * - `variant="dot"`: pulsing dot + text (e.g. vault panel header)
 */
export function StatusBadge({
  status,
  variant = "chip",
}: {
  status: Status;
  variant?: "chip" | "dot";
}) {
  if (variant === "dot") {
    const active = status === "active";
    return (
      <span
        className={`inline-flex items-center gap-1.5 text-xs font-medium ${active ? "text-success" : "text-muted"}`}
      >
        <span className="relative flex h-1.5 w-1.5">
          {active && (
            <span className="absolute h-full w-full animate-ping rounded-full bg-success opacity-60" />
          )}
          <span className={`relative h-1.5 w-1.5 rounded-full ${active ? "bg-success" : "bg-muted"}`} />
        </span>
        {active ? "ACTIVE" : "INACTIVE"}
      </span>
    );
  }

  return (
    <span className={`rounded-full px-2 py-1 text-xs font-medium ${chipCls[status]}`}>
      {status}
    </span>
  );
}
