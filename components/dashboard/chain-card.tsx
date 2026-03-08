import type { ChainInfo } from "@/lib/types/dashboard";

export function ChainCard({ chain, onClick }: { chain: ChainInfo; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex w-44 shrink-0 flex-col gap-3 rounded-2xl border border-border bg-card/80 p-4 text-left transition-all hover:border-primary/40 hover:bg-card"
    >
      <div className="flex items-center gap-3">
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
          style={{ backgroundColor: chain.color }}
        >
          {chain.name[0]}
        </span>
        <div className="min-w-0">
          <p className="truncate font-semibold leading-tight">{chain.name}</p>
        </div>
      </div>
    </button>
  );
}
