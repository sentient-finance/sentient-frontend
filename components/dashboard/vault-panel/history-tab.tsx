export function HistoryTab() {
  return (
    <div className="space-y-3 rounded-xl border border-border/60 bg-card-2/40 p-4">
      {[
        {
          type: "SwapExecuted",
          time: "2m ago",
          color: "bg-success",
          textColor: "text-success",
        },
        {
          type: "RuleEvaluated",
          time: "15m ago",
          color: "bg-primary",
          textColor: "text-primary",
        },
        {
          type: "ShieldTriggered",
          time: "3h ago",
          color: "bg-warning",
          textColor: "text-warning",
        },
      ].map((e, i) => (
        <div key={i} className="flex items-center gap-3">
          <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${e.color}`} />
          <span className={`text-xs font-semibold ${e.textColor}`}>{e.type}</span>
          <span className="ml-auto text-xs text-muted">{e.time}</span>
        </div>
      ))}
    </div>
  );
}
