import { ErrorDescription } from "@/components/ui/error-description";
import { useDeposit } from "@/features/vault/hooks/use-deposit";
import { type DepositToken } from "@/features/vault/hooks/use-token-list";
import { useWithdraw } from "@/features/vault/hooks/use-withdraw";
import { Minus, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { DepositModal } from "../deposit-modal";
import { SectionHeader } from "../section-header";
import { TokenGroup } from "../token-group";
import { TokenRow } from "../token-row";
import { WithdrawModal } from "../withdraw-modal";

interface ConsoleTabProps {
  vaultAddress: `0x${string}`;
  systemTokens: string[];
  vaultTokens: { amount: string; symbol: string }[];
  vaultSymbols: Set<string>;
  selection: { symbol: string; source: string };
  setSelection: (selection: { symbol: string; source: string }) => void;
  onDepositSuccess?: () => void;
}

export const ConsoleTab = ({
  vaultAddress,
  systemTokens,
  vaultTokens,
  vaultSymbols,
  selection,
  setSelection,
  onDepositSuccess,
}: ConsoleTabProps) => {
  const [showDeposit, setShowDeposit] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const { deposit, status, error } = useDeposit(vaultAddress);
  const { withdraw, status: withdrawStatus, error: withdrawError } = useWithdraw(vaultAddress);

  useEffect(() => {
    if (status === "done") {
      onDepositSuccess?.();
      const t = setTimeout(() => setShowDeposit(false), 2000);
      return () => clearTimeout(t);
    }
  }, [status, onDepositSuccess]);

  useEffect(() => {
    if (withdrawStatus === "done") {
      onDepositSuccess?.();
      // Delayed refresh for RPC propagation; close modal after 2s
      const refreshT = setTimeout(() => onDepositSuccess?.(), 800);
      const closeT = setTimeout(() => setShowWithdraw(false), 2000);
      return () => {
        clearTimeout(refreshT);
        clearTimeout(closeT);
      };
    }
  }, [withdrawStatus, onDepositSuccess]);

  useEffect(() => {
    if (status === "approving")
      toast.loading("Approving token…", {
        id: "deposit",
        description: "Waiting for approval transaction.",
      });
    if (status === "depositing")
      toast.loading("Depositing…", {
        id: "deposit",
        description: "Waiting for deposit transaction.",
      });
    if (status === "done")
      toast.success("Deposit confirmed", {
        id: "deposit",
        description: "Your deposit was successful.",
      });
    if (status === "error" && error)
      toast.error("Deposit failed", {
        id: "deposit",
        description: <ErrorDescription message={error} />,
        duration: Infinity,
      });
  }, [status, error]);

  useEffect(() => {
    if (withdrawStatus === "withdrawing")
      toast.loading("Withdrawing…", {
        id: "withdraw",
        description: "Waiting for withdraw transaction.",
      });
    if (withdrawStatus === "done")
      toast.success("Withdraw confirmed", {
        id: "withdraw",
        description: "Your withdrawal was successful.",
      });
    if (withdrawStatus === "error" && withdrawError)
      toast.error("Withdraw failed", {
        id: "withdraw",
        description: <ErrorDescription message={withdrawError} />,
        duration: Infinity,
      });
  }, [withdrawStatus, withdrawError]);

  const handleDeposit = (token: DepositToken, amount: string) => {
    deposit(token, amount);
  };

  const handleWithdraw = (symbol: string, amount: string) => {
    withdraw(symbol, amount);
  };

  return (
    <div className="space-y-4">
      {showDeposit && (
        <DepositModal
          onClose={() => setShowDeposit(false)}
          onConfirm={handleDeposit}
          status={status}
          error={error}
        />
      )}

      {showWithdraw && (
        <WithdrawModal
          vaultTokens={vaultTokens}
          onClose={() => setShowWithdraw(false)}
          onConfirm={handleWithdraw}
          status={withdrawStatus}
          error={withdrawError}
        />
      )}

      <SectionHeader title="Select token swap default">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setShowDeposit(true)}
            data-testid="vault-deposit-button"
            disabled={status === "approving" || status === "depositing"}
            className="border-primary/30 text-primary hover:bg-primary/10 flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Plus className="h-3 w-3" /> Deposit
          </button>
          <button
            onClick={() => setShowWithdraw(true)}
            data-testid="vault-withdraw-button"
            disabled={vaultTokens.length === 0 || withdrawStatus === "withdrawing"}
            className="border-primary/30 text-primary hover:bg-primary/10 flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Minus className="h-3 w-3" /> Withdraw
          </button>
        </div>
      </SectionHeader>

      <TokenGroup title="System">
        {systemTokens.map((sym) => (
          <TokenRow
            key={sym}
            symbol={sym}
            isVault={vaultSymbols.has(sym)}
            isSelected={selection.symbol === sym && selection.source === "system"}
            onClick={() => setSelection({ symbol: sym, source: "system" })}
          />
        ))}
      </TokenGroup>

      <TokenGroup title="Token Holdings">
        {vaultTokens.length > 0 ? (
          vaultTokens.map((t) => (
            <TokenRow
              key={t.symbol}
              symbol={t.symbol}
              amount={t.amount}
              isSelected={selection.symbol === t.symbol && selection.source === "holdings"}
              onClick={() => setSelection({ symbol: t.symbol, source: "holdings" })}
            />
          ))
        ) : (
          <div className="text-secondary py-3 text-center text-sm">Empty</div>
        )}
      </TokenGroup>
    </div>
  );
};
