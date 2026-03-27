/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { type DepositToken, useBaseTokenList } from "@/features/vault/hooks/use-token-list";
import { TokenIcon } from "@web3icons/react/dynamic";
import { Loader2, Search, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { DepositStatus } from "@/features/vault/hooks/use-deposit";

interface DepositModalProps {
  onClose: () => void;
  onConfirm: (token: DepositToken, amount: string) => void;
  status: DepositStatus;
  error: string | null;
}

export function DepositModal({ onClose, onConfirm, status, error }: DepositModalProps) {
  const { tokens, isLoading, error: tokenError } = useBaseTokenList();
  const [query, setQuery] = useState("");
  const [selectedToken, setSelectedToken] = useState<DepositToken | null>(null);
  const [amount, setAmount] = useState("");

  const isPending = status === "approving" || status === "depositing";
  const canClose = !isPending;

  useEffect(() => {
    if (status === "done") {
      setAmount("");
      setSelectedToken(null);
    }
  }, [status]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return tokens.slice(0, 50);
    return tokens
      .filter(
        (t) =>
          t.symbol.toLowerCase().includes(q) ||
          t.name.toLowerCase().includes(q) ||
          t.address.toLowerCase().includes(q)
      )
      .slice(0, 50);
  }, [tokens, query]);

  const handleConfirm = () => {
    if (!selectedToken || !amount || Number(amount) <= 0) return;
    onConfirm(selectedToken, amount);
  };

  return (
    <div
      className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={canClose ? onClose : undefined}
    >
      <div
        className="border-border bg-card relative flex w-[calc(100vw-2rem)] flex-col rounded-2xl border shadow-xl md:w-[360px]"
        style={{ maxHeight: "80vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4">
          <h3 className="text-sm font-semibold">Deposit</h3>
          <button
            onClick={onClose}
            disabled={!canClose}
            className="text-muted hover:text-foreground flex h-7 w-7 items-center justify-center rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-40"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Status notification */}
        {isPending && (
          <div className="border-primary/40 bg-primary/10 mx-5 mb-3 flex items-center gap-2 rounded-lg border px-4 py-3">
            <Loader2 className="text-primary h-4 w-4 shrink-0 animate-spin" />
            <p className="text-primary text-sm font-medium">
              {status === "approving" ? "Approving token…" : "Depositing…"}
            </p>
          </div>
        )}
        {status === "done" && (
          <div className="border-success/40 bg-success/10 mx-5 mb-3 flex items-center gap-2 rounded-lg border px-4 py-3">
            <p className="text-success text-sm font-medium">Deposit confirmed!</p>
          </div>
        )}
        {status === "error" && error && (
          <div className="border-danger/40 bg-danger/10 mx-5 mb-3 flex items-center gap-2 rounded-lg border px-4 py-3">
            <p className="text-danger text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Search */}
        <div className="px-5 pb-3">
          <div className="border-border/60 bg-card-2/40 focus-within:border-primary/50 flex items-center gap-2 rounded-lg border px-3 py-2">
            <Search className="text-muted h-3.5 w-3.5 shrink-0" />
            <input
              autoFocus
              type="text"
              data-testid="deposit-token-search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, symbol or address…"
              className="placeholder:text-muted flex-1 bg-transparent text-xs outline-none"
            />
            {query && (
              <button onClick={() => setQuery("")} className="text-muted hover:text-foreground">
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>

        {/* Token list */}
        <div className="border-border/40 flex-1 overflow-y-auto border-y">
          {isLoading && (
            <div className="flex h-32 items-center justify-center">
              <svg className="text-primary h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="3"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
            </div>
          )}

          {!isLoading && !error && filtered.length === 0 && (
            <p className="text-muted py-8 text-center text-xs">No tokens found</p>
          )}

          {!isLoading &&
            !tokenError &&
            filtered.map((token) => {
              const isSelected = selectedToken?.address === token.address;
              return (
                <button
                  key={token.address}
                  onClick={() => setSelectedToken(token)}
                  data-testid={`deposit-token-${token.symbol}`}
                  className={`border-border/20 flex w-full items-center gap-3 border-b px-5 py-3 transition-all last:border-0 ${
                    isSelected ? "bg-primary/10" : "hover:bg-white/5"
                  }`}
                >
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full ${
                      isSelected ? "ring-primary/50 ring-1" : "bg-white/5"
                    }`}
                  >
                    <TokenIcon symbol={token.symbol} size={28} variant="branded" />
                  </div>

                  <div className="flex flex-1 flex-col items-start">
                    <span className="text-xs leading-tight font-semibold">{token.symbol}</span>
                    <span className="text-muted text-[10px]">{token.name}</span>
                  </div>

                  {isSelected && <div className="bg-primary h-2 w-2 rounded-full" />}
                </button>
              );
            })}
        </div>

        {/* Amount + actions */}
        <div className="space-y-3 px-5 py-4">
          <div
            className={`focus-within:border-primary/50 flex items-center gap-2 rounded-lg border px-3 py-2 transition-colors ${
              selectedToken ? "border-border/60" : "border-border/30 opacity-50"
            }`}
          >
            <input
              type="number"
              min="0"
              data-testid="deposit-amount-input"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              disabled={!selectedToken}
              className="placeholder:text-muted flex-1 bg-transparent text-sm outline-none disabled:cursor-not-allowed"
            />
            {selectedToken && (
              <span className="text-muted text-xs font-semibold">{selectedToken.symbol}</span>
            )}
          </div>

          <div className="flex gap-2">
            <button
              onClick={onClose}
              disabled={!canClose}
              className="border-border/60 text-muted hover:text-foreground flex-1 rounded-lg border py-2 text-xs transition-colors disabled:cursor-not-allowed disabled:opacity-40"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              data-testid="deposit-confirm-button"
              disabled={!selectedToken || !amount || Number(amount) <= 0 || isPending}
              className="bg-primary flex-1 rounded-lg py-2 text-xs font-semibold text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
            >
              {isPending ? (
                <span className="flex items-center justify-center gap-1.5">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  {status === "approving" ? "Approving…" : "Depositing…"}
                </span>
              ) : (
                "Confirm"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
