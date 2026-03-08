"use client";

import type { VaultItem } from "@/lib/types/dashboard";
import { STABLE_COINS } from "@/lib/constants/tokens";
import { useState } from "react";
import { ConfigTab } from "./config-tab";
import { ConsoleTab } from "./console-tab";
import { HistoryTab } from "./history-tab";
import { Tab, VaultPanelTabs } from "./vault-panel-tabs";
import { VaultPanelHeader } from "./vault-panel-header";

function parseTokens(balance: string) {
  return balance.split(" / ").map((part) => {
    const trimmed = part.trim();
    const lastSpace = trimmed.lastIndexOf(" ");
    return { amount: trimmed.slice(0, lastSpace), symbol: trimmed.slice(lastSpace + 1) };
  });
}

function parsePrices(rule: string) {
  const buyMatch = rule.match(/Buy\s*[<>]\s*\$([0-9,]+)/);
  const sellMatch = rule.match(/Sell\s*[<>]\s*\$([0-9,]+)/);
  return {
    buy: buyMatch ? buyMatch[1].replace(/,/g, "") : "",
    sell: sellMatch ? sellMatch[1].replace(/,/g, "") : "",
  };
}

export function VaultPanel({ vault, onClose }: { vault: VaultItem; onClose: () => void }) {
  const [tab, setTab] = useState<Tab>("console");
  const [active, setActive] = useState(vault.status === "active");
  const [copied, setCopied] = useState(false);

  const initial = parsePrices(vault.rule);
  const [buyPrice, setBuyPrice] = useState(initial.buy);
  const [sellPrice, setSellPrice] = useState(initial.sell);

  const tokens = parseTokens(vault.balance);
  const vaultSymbols = new Set(tokens.map((t) => t.symbol));
  const extraStables = STABLE_COINS.filter((s) => !vaultSymbols.has(s.symbol));
  const allTokens = [...tokens.map((t) => t.symbol), ...extraStables.map((s) => s.symbol)];

  const [defaultToken, setDefaultToken] = useState<string>(
    tokens[0]?.symbol ?? STABLE_COINS[0].symbol,
  );
  const [defaultTokenSource, setDefaultTokenSource] = useState<"system" | "holdings">("system");

  function copyAddress() {
    navigator.clipboard.writeText(vault.addr);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className="flex h-full w-full max-w-none flex-col bg-card/95 backdrop-blur-xl md:max-w-[460px] md:border-l md:border-border/60">
        <VaultPanelHeader
          addr={vault.addr}
          chain={vault.chain}
          active={active}
          copied={copied}
          onCopyAddress={copyAddress}
          onToggleActive={() => setActive((v) => !v)}
          onClose={onClose}
        />

        <VaultPanelTabs tab={tab} onTabChange={setTab} />

        <div className="flex-1 space-y-4 overflow-y-auto p-5">
          {tab === "console" && (
            <ConsoleTab
              allTokens={allTokens}
              tokens={tokens}
              vaultSymbols={vaultSymbols}
              defaultToken={defaultToken}
              defaultTokenSource={defaultTokenSource}
              onSelectSystemToken={(symbol) => {
                setDefaultToken(symbol);
                setDefaultTokenSource("system");
              }}
              onSelectHoldingToken={(symbol) => {
                setDefaultToken(symbol);
                setDefaultTokenSource("holdings");
              }}
            />
          )}
          {tab === "history" && <HistoryTab />}
          {tab === "config" && (
            <ConfigTab
              buyPrice={buyPrice}
              sellPrice={sellPrice}
              onBuyPriceChange={setBuyPrice}
              onSellPriceChange={setSellPrice}
            />
          )}
        </div>
      </div>
    </div>
  );
}
