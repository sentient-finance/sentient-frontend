"use client";

import type { VaultItem } from "@/lib/types/dashboard";
import { useMemo, useState } from "react";
import { STABLE_COINS } from "./constants";
import { parsePrices, parseTokens } from "./utils";

export type Tab = "console" | "history" | "config";

export function useVaultPanelState(vault: VaultItem) {
  const [activeTab, setActiveTab] = useState<Tab>("console");
  const [isActive, setIsActive] = useState(vault.status === "active");
  const [copied, setCopied] = useState(false);

  const initialPrices = useMemo(() => parsePrices(vault.rule), [vault.rule]);
  const [prices, setPrices] = useState(initialPrices);
  const [selection, setSelection] = useState({ symbol: "", source: "system" });

  const vaultTokens = useMemo(() => parseTokens(vault.balance), [vault.balance]);
  const vaultSymbols = useMemo(() => new Set(vaultTokens.map((t) => t.symbol)), [vaultTokens]);
  const systemTokens = useMemo(() => {
    const tokensInVault = vaultTokens.map((t) => t.symbol);
    const extras = STABLE_COINS.filter((s) => !vaultSymbols.has(s));
    return [...tokensInVault, ...extras];
  }, [vaultTokens, vaultSymbols]);

  function handleCopy() {
    navigator.clipboard.writeText(vault.addr);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return {
    activeTab,
    setActiveTab,
    isActive,
    setIsActive,
    copied,
    handleCopy,
    prices,
    setPrices,
    selection,
    setSelection,
    vaultTokens,
    vaultSymbols,
    systemTokens,
  };
}
