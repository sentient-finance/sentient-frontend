import { Check, Copy, Power, X } from "lucide-react";

type VaultPanelHeaderProps = {
  addr: string;
  chain: string;
  active: boolean;
  copied: boolean;
  onCopyAddress: () => void;
  onToggleActive: () => void;
  onClose: () => void;
};

export function VaultPanelHeader({
  addr,
  chain,
  active,
  copied,
  onCopyAddress,
  onToggleActive,
  onClose,
}: VaultPanelHeaderProps) {
  return (
    <div className="flex items-start justify-between px-5 pb-4 pt-5">
      <div>
        <div className="flex items-center gap-2">
          <p className="break-all text-sm font-bold md:text-base">{addr}</p>
          <button
            onClick={onCopyAddress}
            title="Copy address"
            className="flex h-6 w-6 items-center justify-center rounded-md text-muted transition-colors hover:text-foreground"
          >
            {copied ? <Check className="h-3 w-3 text-success" /> : <Copy className="h-3 w-3" />}
          </button>
        </div>
        <div className="mt-1 flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 text-xs font-medium ${active ? "text-success" : "text-muted"}`}
          >
            <span className="relative flex h-1.5 w-1.5">
              {active && (
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60" />
              )}
              <span className={`relative h-1.5 w-1.5 rounded-full ${active ? "bg-success" : "bg-muted"}`} />
            </span>
            {active ? "ACTIVE" : "INACTIVE"}
          </span>
          <span className="text-xs text-muted">·</span>
          <span className="text-xs text-muted">{chain}</span>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={onToggleActive}
          title={active ? "Deactivate" : "Activate"}
          className={`flex h-8 w-8 items-center justify-center rounded-lg border transition-colors ${
            active
              ? "border-success/40 text-success hover:bg-success/10"
              : "border-border/60 text-muted hover:border-success/40 hover:text-success"
          }`}
        >
          <Power className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={onClose}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-border/60 text-muted transition-colors hover:border-border hover:text-foreground"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
