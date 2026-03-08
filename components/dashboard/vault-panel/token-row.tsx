import { TOKEN_DATA } from "@/lib/constants/tokens";
import { Check } from "lucide-react";
import Image from "next/image";

type TokenRowProps = {
  symbol: string;
  name?: string;
  icon?: string;
  selected?: boolean;
  isSelected?: boolean;
  amount?: string;
  badge?: string;
  isVault?: boolean;
  onClick: () => void;
};

export function TokenRow({
  symbol,
  name,
  icon,
  selected,
  isSelected,
  amount,
  badge,
  isVault,
  onClick,
}: TokenRowProps) {
  const info = TOKEN_DATA[symbol] || { name: symbol, icon: "" };
  const finalName = name ?? info.name;
  const finalIcon = icon ?? info.icon;
  const finalSelected = selected ?? isSelected ?? false;
  const finalBadge = badge ?? (isVault ? "vault" : undefined);

  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-3 border-b border-border/30 px-4 py-3 last:border-0 transition-all ${
        finalSelected
          ? "border-l-2 border-l-primary bg-primary/10"
          : "opacity-40 hover:opacity-70 hover:bg-white/5"
      }`}
    >
      <div
        className={`relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full p-1.5 transition-colors ${
          finalSelected ? "bg-primary/20 ring-1 ring-primary/40" : "bg-white/5"
        }`}
      >
        {finalIcon ? (
          <Image
            src={finalIcon}
            alt={symbol}
            width={36}
            height={36}
            className="h-full w-full object-contain"
          />
        ) : (
          <div className="h-5 w-5 rounded-full bg-primary/20" />
        )}
      </div>

      <div className="flex flex-1 flex-col items-start gap-0.5">
        <div className="flex items-center gap-2">
          <span
            className={`text-[14px] font-bold ${finalSelected ? "text-foreground" : "text-foreground/80"}`}
          >
            {finalName}
          </span>
          <span className="text-xs font-medium text-muted">{symbol}</span>
          {finalBadge && (
            <span className="rounded-[4px] bg-primary/10 px-1.5 py-0.5 text-[9px] font-black uppercase text-primary">
              {finalBadge}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {amount && <span className="text-xs font-bold text-foreground">{amount}</span>}
        {finalSelected && <Check className="h-4 w-4 text-primary" />}
      </div>
    </button>
  );
}
