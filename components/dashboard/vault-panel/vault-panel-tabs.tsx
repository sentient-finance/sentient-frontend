import { Clock, Settings2, Terminal } from "lucide-react";

export type Tab = "console" | "history" | "config";

export function VaultPanelTabs({
  tab,
  onTabChange,
}: {
  tab: Tab;
  onTabChange: (tab: Tab) => void;
}) {
  return (
    <div className="flex border-b border-border/50 px-5">
      {(["console", "history", "config"] as Tab[]).map((t) => (
        <button
          key={t}
          onClick={() => onTabChange(t)}
          className={`-mb-px mr-5 flex items-center gap-1.5 border-b-2 px-1 pb-2.5 pt-1 text-xs font-medium capitalize transition-colors ${
            tab === t
              ? "border-red-500 text-foreground"
              : "border-transparent text-muted hover:text-foreground"
          }`}
        >
          {t === "console" && <Terminal className="h-3 w-3" />}
          {t === "history" && <Clock className="h-3 w-3" />}
          {t === "config" && <Settings2 className="h-3 w-3" />}
          {t.charAt(0).toUpperCase() + t.slice(1)}
        </button>
      ))}
    </div>
  );
}
