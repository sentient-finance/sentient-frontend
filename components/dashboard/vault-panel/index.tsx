"use client";

import type { VaultItem } from "@/lib/types/dashboard";
import { shortAddress } from "@/lib/utils";
import { StatusBadge } from "@/components/ui/status-badge";
import { Check, Copy, Power, X } from "lucide-react";
import { tabItems } from "./constants";
import { ConfigTab } from "./tabs/config-tab";
import { ConsoleTab } from "./tabs/console-tab";
import { HistoryTab } from "./tabs/history-tab";
import { useVaultPanelState, type Tab } from "./use-vault-panel-state";

export function VaultPanel({ vault, onClose }: { vault: VaultItem; onClose: () => void }) {
  const {
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
  } = useVaultPanelState(vault);

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className="flex h-full w-full max-w-none flex-col bg-card/95 backdrop-blur-xl md:max-w-[460px] md:border-l md:border-border/60">
        {/* Header Section */}
        <header className="flex items-start justify-between px-5 pt-5 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <p className="break-all text-sm font-bold md:text-base">{shortAddress(vault.addr)}</p>
              <button onClick={handleCopy} className="text-muted hover:text-foreground">
                {copied ? <Check className="h-3 w-3 text-success" /> : <Copy className="h-3 w-3" />}
              </button>
            </div>
            <div className="mt-1 flex items-center gap-2">
              <StatusBadge status={isActive ? "active" : "inactive"} variant="dot" />
              <span className="text-xs text-muted">·</span>
              <span className="text-xs text-muted">{vault.chain}</span>
            </div>
          </div>
          <div className="flex gap-1">
            <button
              onClick={() => setIsActive(!isActive)}
              className={`h-8 w-8 flex items-center justify-center rounded-lg border transition-colors ${isActive ? "border-success/40 text-success bg-success/5" : "border-border/60 text-muted"}`}
            >
              <Power className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={onClose}
              className="h-8 w-8 flex items-center justify-center rounded-lg border border-border/60 text-muted"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </header>

        {/* Navigation */}
        <nav className="flex border-b border-border/50 px-5">
          {tabItems.map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as Tab)}
              className={`flex items-center gap-1.5 px-1 pb-2.5 pt-1 text-xs font-medium mr-5 border-b-2 transition-colors ${
                activeTab === id
                  ? "border-red-500 text-foreground"
                  : "border-transparent text-muted hover:text-foreground"
              }`}
            >
              <Icon className="h-3 w-3" />
              {label}
            </button>
          ))}
        </nav>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-5 space-y-6">
          {activeTab === "console" && (
            <ConsoleTab
              vaultAddress={vault.addr as `0x${string}`}
              systemTokens={systemTokens}
              vaultTokens={vaultTokens}
              vaultSymbols={vaultSymbols}
              selection={selection}
              setSelection={setSelection}
            />
          )}

          {activeTab === "config" && <ConfigTab prices={prices} setPrices={setPrices} />}

          {activeTab === "history" && (
            <HistoryTab vaultAddress={vault.addr as `0x${string}`} />
          )}
        </main>
      </div>
    </div>
  );
}
