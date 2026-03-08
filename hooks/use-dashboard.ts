"use client";

import type { ChainInfo, VaultItem } from "@/lib/types/dashboard";
import { useDashboardViewModel } from "@/lib/view-models/use-dashboard-view-model";
import { useMemo, useRef, useState } from "react";

function generateNewVault(chain: ChainInfo): VaultItem {
  return {
    addr: `0x${Math.random().toString(16).slice(2, 10)}...`,
    chain: chain.name,
    status: "active",
    balance: "0 USDC",
    rule: "Buy < $0 · Sell > $0",
    lastExecution: "never",
    pnl: "0%",
    pnlUp: true,
  };
}

export function useDashboard() {
  const { chains, vaults } = useDashboardViewModel();

  const [selected, setSelected] = useState<VaultItem | null>(null);
  const [chainSelectOpen, setChainSelectOpen] = useState(false);
  const [addedChains, setAddedChains] = useState<ChainInfo[]>([]);
  const [addedVaults, setAddedVaults] = useState<VaultItem[]>([]);

  const chainRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const allChains = useMemo(() => [...chains, ...addedChains], [chains, addedChains]);
  const allVaults = useMemo(() => [...vaults, ...addedVaults], [vaults, addedVaults]);

  const availableChains = useMemo(() => {
    const used = new Set(allChains.map((c) => c.name));
    return chains.filter((c) => !used.has(c.name));
  }, [chains, allChains]);

  const vaultsByChain = useMemo(
    () =>
      allVaults.reduce<Record<string, VaultItem[]>>((acc, v) => {
        if (!acc[v.chain]) acc[v.chain] = [];
        acc[v.chain].push(v);
        return acc;
      }, {}),
    [allVaults],
  );

  function scrollToChain(chainName: string) {
    chainRefs.current[chainName]?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function handleChainSelect(chain: ChainInfo) {
    const newChain = { ...chain, vaultCount: 1 };
    const newVault = generateNewVault(chain);

    setAddedChains((prev) => [...prev, newChain]);
    setAddedVaults((prev) => [...prev, newVault]);
    setChainSelectOpen(false);

    setTimeout(() => scrollToChain(chain.name), 100);
  }

  return {
    selected,
    setSelected,
    chainSelectOpen,
    setChainSelectOpen,
    allChains,
    allVaults,
    availableChains,
    vaultsByChain,
    chainRefs,
    scrollToChain,
    handleChainSelect,
  };
}
