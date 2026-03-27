"use client";

import { ErrorDescription } from "@/components/ui/error-description";
import { useCCIPPanel, DESTINATION_OPTIONS } from "@/features/ccip/hooks/use-ccip-panel";
import { CCIP_EXPLORER_BASE } from "@/lib/constants/urls";
import { getExplorerBase } from "@/lib/utils";
import { ExternalLink, Loader2, ShieldAlert } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";
import { DripFaucet } from "./drip-faucet";
import { FeeStatus } from "./fee-status";
import { GuardCard } from "./guard-card";
import { SetupView } from "./setup-view";
import { TokenChip } from "./token-chip";
import { VaultGasSection } from "./vault-gas-section";

// ─── types ────────────────────────────────────────────────────────────────────

interface CCIPPanelProps {
  vaultAddress: `0x${string}`;
  chainId: number;
  vaultOwner: string | null;
}

// ─── main panel ───────────────────────────────────────────────────────────────

export function CCIPPanel({ vaultAddress, chainId, vaultOwner }: CCIPPanelProps) {
  const {
    isConnected,
    isOwner,
    isWritePending,
    pendingAction,
    writeHash,
    writeError,
    resetWrite,
    ccipNotSet,
    ccipRouterAddress,
    setCcipRouterAddress,
    defaultRouter,
    handleSetCCIPConfig,
    shieldToken,
    vaultTokenBalanceFormatted,
    hasEnoughToken,
    shieldAmount,
    setShieldAmount,
    shieldReceiver,
    userAddress,
    setShieldReceiver,
    destSelector,
    setDestSelector,
    vaultEthBalanceFormatted,
    hasEnoughEth,
    feeWei,
    depositEthAmount,
    setDepositEthAmount,
    canDepositEth,
    handleDepositEth,
    feeLoading,
    feeData,
    feeError,
    canEstimateFee,
    ethNeeded,
    handleEmergencyShield,
    canExecuteShield,
    handleDrip,
  } = useCCIPPanel({ vaultAddress, chainId, vaultOwner });

  const TOAST_ID = "ccip";

  // ── write state → toast ──────────────────────────────────────────────────

  useEffect(() => {
    if (!isWritePending) return;
    const labels: Record<string, { title: string; description: string }> = {
      config: { title: "Setting CCIP router…", description: "Waiting for transaction." },
      deposit: { title: "Depositing ETH…", description: "Waiting for transaction." },
      drip: { title: "Dripping CCIP-BnM…", description: "Waiting for transaction." },
      shield: { title: "Executing Emergency Shield…", description: "Sending cross-chain message." },
    };
    const { title, description } = labels[pendingAction ?? ""] ?? {
      title: "Processing…",
      description: "Waiting for transaction.",
    };
    toast.loading(title, { id: TOAST_ID, description });
  }, [isWritePending, pendingAction]);

  useEffect(() => {
    if (!writeHash) return;
    const explorerUrl = `${getExplorerBase(chainId)}/tx/${writeHash}`;
    toast.success("Transaction submitted", {
      id: TOAST_ID,
      description: (
        <a href={explorerUrl} target="_blank" rel="noopener noreferrer" className="underline">
          View on explorer
        </a>
      ),
    });
    resetWrite();
  }, [writeHash, chainId, resetWrite]);

  useEffect(() => {
    if (!writeError) return;
    toast.error("Transaction failed", {
      id: TOAST_ID,
      description: <ErrorDescription message={writeError} />,
      duration: Infinity,
    });
    resetWrite();
  }, [writeError, resetWrite]);

  // ── auth guards ──────────────────────────────────────────────────────────

  if (!isConnected) {
    return <GuardCard message="Connect wallet to configure CCIP or execute Emergency Shield." />;
  }

  if (!isOwner) {
    return <GuardCard message="Only vault owner can configure CCIP or execute Emergency Shield." />;
  }

  // ── main panel ───────────────────────────────────────────────────────────

  return (
    <div className="space-y-4">
      <div className="border-border/50 bg-card-2/40 space-y-4 rounded-xl border p-4">
        {/* ── state: ccip not configured ── */}
        {ccipNotSet ? (
          <SetupView
            ccipRouterAddress={ccipRouterAddress}
            setCcipRouterAddress={setCcipRouterAddress}
            defaultRouter={defaultRouter}
            isWritePending={isWritePending}
            onSubmit={handleSetCCIPConfig}
          />
        ) : (
          /* ── state: ccip configured ── */
          <div className="grid grid-cols-[1fr_1fr] gap-4">
            {/* left col: shield form */}
            <div className="space-y-3">
              {/* token balance */}
              <TokenChip
                shieldToken={shieldToken}
                vaultTokenBalanceFormatted={vaultTokenBalanceFormatted}
                hasEnoughToken={hasEnoughToken}
              />

              {/* amount */}
              <div>
                <label htmlFor="shield-amount" className="text-muted mb-1 block text-[10px]">
                  Amount
                </label>
                <input
                  id="shield-amount"
                  data-testid="shield-amount-input"
                  type="text"
                  value={shieldAmount}
                  onChange={(e) => setShieldAmount(e.target.value)}
                  placeholder="1"
                  className="border-border/60 bg-card text-foreground focus:border-primary/50 w-full rounded-lg border px-3 py-2 text-xs font-medium outline-none"
                />
              </div>

              {/* receiver */}
              <div>
                <label htmlFor="shield-receiver" className="text-muted mb-1 block text-[10px]">
                  Receiver
                </label>
                <input
                  id="shield-receiver"
                  data-testid="shield-receiver-input"
                  type="text"
                  value={shieldReceiver || userAddress || ""}
                  onChange={(e) => setShieldReceiver(e.target.value)}
                  placeholder={userAddress ?? "0x..."}
                  className="border-border/60 bg-card text-foreground focus:border-primary/50 w-full rounded-lg border px-3 py-2 font-mono text-xs outline-none"
                />
              </div>

              {/* destination chain */}
              <div>
                <label htmlFor="dest-chain" className="text-muted mb-1 block text-[10px]">
                  Destination Chain
                </label>
                <select
                  id="dest-chain"
                  data-testid="dest-chain-select"
                  value={destSelector.toString()}
                  onChange={(e) => setDestSelector(BigInt(e.target.value))}
                  className="border-border/60 bg-card text-foreground focus:border-primary/50 w-full rounded-lg border px-3 py-2 text-xs font-medium outline-none"
                >
                  {DESTINATION_OPTIONS.map((opt) => (
                    <option key={opt.selector.toString()} value={opt.selector.toString()}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* eth balance + conditional deposit row */}
              <VaultGasSection
                vaultEthBalanceFormatted={vaultEthBalanceFormatted}
                hasEnoughEth={hasEnoughEth}
                feeWei={feeWei}
                depositEthAmount={depositEthAmount}
                setDepositEthAmount={setDepositEthAmount}
                canDepositEth={canDepositEth}
                isWritePending={isWritePending}
                onDeposit={handleDepositEth}
              />

              {/* fee / warning messages */}
              <FeeStatus
                feeLoading={feeLoading}
                feeData={feeData}
                feeError={feeError}
                canEstimateFee={canEstimateFee}
                ethNeeded={ethNeeded}
                hasEnoughToken={hasEnoughToken}
                hasEnoughEth={hasEnoughEth}
                shieldAmount={shieldAmount}
              />

              {/* shield action */}
              <button
                onClick={handleEmergencyShield}
                disabled={!canExecuteShield}
                data-testid="execute-shield-button"
                className="bg-warning/20 text-warning hover:bg-warning/30 flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-semibold transition-all disabled:opacity-50"
              >
                {isWritePending ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <ShieldAlert className="h-3.5 w-3.5" />
                    Execute Emergency Shield
                  </>
                )}
              </button>
            </div>

            {/* right col: drip faucet + explorer */}
            <div className="space-y-2">
              <DripFaucet onDrip={handleDrip} isPending={isWritePending} hasUser={!!userAddress} />
              <a
                href={`${CCIP_EXPLORER_BASE}/address/${vaultAddress}`}
                target="_blank"
                rel="noopener noreferrer"
                className="border-primary/40 bg-primary/10 text-primary hover:bg-primary/20 flex w-full items-center justify-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold transition-colors"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Open CCIP Explorer
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
