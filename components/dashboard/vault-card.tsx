import { StatusBadge } from "@/components/ui/status-badge";
import type { VaultItem } from "@/lib/types/dashboard";
import { shortAddress } from "@/lib/utils";

export function VaultCard({
  vault,
  onSelect,
}: {
  vault: VaultItem;
  onSelect: (v: VaultItem) => void;
}) {
  return (
    <div
      onClick={() => onSelect(vault)}
      className="cursor-pointer rounded-2xl border border-border bg-card/80 p-4 transition-all hover:border-primary/40 hover:bg-card"
    >
      <div className="mb-3 flex items-center justify-between">
        <p className="font-mono text-sm font-semibold">{shortAddress(vault.addr)}</p>
        <StatusBadge status={vault.status} />
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div>
          <p className="text-muted">Chain</p>
          <p className="mt-0.5 font-medium">{vault.chain}</p>
        </div>

        <div>
          <p className="text-muted">Owner</p>
          <p className="mt-0.5 font-medium font-mono truncate" title={vault.owner ?? ""}>
            {vault.owner
              ? vault.owner.length > 14
                ? `${vault.owner.slice(0, 6)}...${vault.owner.slice(-4)}`
                : vault.owner
              : "—"}
          </p>
        </div>

        <div>
          <p className="text-muted">Balance</p>
          <p className="mt-0.5 font-medium">{vault.balance}</p>
        </div>

        <div className="col-span-2">
          <p className="text-muted">Rule</p>
          <p className="mt-0.5 font-medium">{vault.rule}</p>
        </div>
      </div>
    </div>
  );
}
