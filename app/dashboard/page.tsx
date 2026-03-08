"use client";

import { AddChainCard } from "@/components/dashboard/add-chain-card";
import { ChainCard } from "@/components/dashboard/chain-card";
import { ChainSelectModal } from "@/components/dashboard/chain-select-modal";
import { VaultCard } from "@/components/dashboard/vault-card";
import { VaultPanel } from "@/components/dashboard/vault-panel";
import { useDashboard } from "@/hooks/use-dashboard";

export default function DashboardPage() {
  const {
    allChains,
    availableChains,
    vaultsByChain,
    selected,
    setSelected,
    chainSelectOpen,
    setChainSelectOpen,
    chainRefs,
    scrollToChain,
    handleChainSelect,
  } = useDashboard();

  return (
    <>
      <div className="space-y-8">
        <section className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-muted">Chains</h2>
          <div className="flex flex-wrap gap-3">
            {allChains.map((c, i) => (
              <ChainCard key={`${c.id}-${i}`} chain={c} onClick={() => scrollToChain(c.name)} />
            ))}
            <AddChainCard onClick={() => setChainSelectOpen(true)} />
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-muted">Vaults</h2>
          <div className="flex flex-col gap-6">
            {Object.entries(vaultsByChain).map(([chainName, chainVaults]) => (
              <div
                key={chainName}
                ref={(el) => {
                  chainRefs.current[chainName] = el;
                }}
                className="flex flex-col gap-3"
              >
                <p className="text-xs font-medium text-muted">{chainName}</p>
                {chainVaults.map((v) => (
                  <VaultCard key={v.addr} vault={v} onSelect={setSelected} />
                ))}
              </div>
            ))}
          </div>
        </section>
      </div>

      {selected && <VaultPanel vault={selected} onClose={() => setSelected(null)} />}

      {chainSelectOpen && (
        <ChainSelectModal
          chains={availableChains}
          onSelect={handleChainSelect}
          onClose={() => setChainSelectOpen(false)}
        />
      )}
    </>
  );
}
