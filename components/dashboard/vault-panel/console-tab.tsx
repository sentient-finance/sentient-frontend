import { TOKEN_DATA } from "@/lib/constants/tokens";
import { Plus } from "lucide-react";
import { TokenRow } from "./token-row";

type TokenHolding = { amount: string; symbol: string };

export function ConsoleTab({
  allTokens,
  tokens,
  vaultSymbols,
  defaultToken,
  defaultTokenSource,
  onSelectSystemToken,
  onSelectHoldingToken,
}: {
  allTokens: string[];
  tokens: TokenHolding[];
  vaultSymbols: Set<string>;
  defaultToken: string;
  defaultTokenSource: "system" | "holdings";
  onSelectSystemToken: (symbol: string) => void;
  onSelectHoldingToken: (symbol: string) => void;
}) {
  return (
    <>
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-bold text-foreground">Select token swap default</p>
        <button className="flex items-center gap-1.5 rounded-lg border border-primary/30 px-2.5 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary/10">
          <Plus className="h-3 w-3" />
          Deposit
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-border/60 bg-card-2/40">
        <div className="border-b border-border/60 px-4 py-2">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted">System</p>
        </div>
        <div className="flex flex-col">
          {allTokens.map((symbol) => {
            const isVaultToken = vaultSymbols.has(symbol);
            const isSelected = defaultToken === symbol && defaultTokenSource === "system";
            const info = TOKEN_DATA[symbol] || { name: symbol, icon: "" };
            return (
              <TokenRow
                key={symbol}
                symbol={symbol}
                name={info.name}
                icon={info.icon}
                selected={isSelected}
                badge={isVaultToken ? "vault" : undefined}
                onClick={() => onSelectSystemToken(symbol)}
              />
            );
          })}
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-border/60 bg-card-2/40">
        <div className="border-b border-border/60 px-4 py-2">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted">Token Holdings</p>
        </div>
        <div className="flex flex-col">
          {tokens.map(({ amount, symbol }) => {
            const info = TOKEN_DATA[symbol] || { name: symbol, icon: "" };
            const isSelected = defaultToken === symbol && defaultTokenSource === "holdings";
            return (
              <TokenRow
                key={symbol}
                symbol={symbol}
                name={info.name}
                icon={info.icon}
                amount={amount}
                selected={isSelected}
                onClick={() => onSelectHoldingToken(symbol)}
              />
            );
          })}
        </div>
      </div>
    </>
  );
}
