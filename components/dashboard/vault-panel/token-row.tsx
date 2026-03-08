import { Check } from "lucide-react";
import Image from "next/image";

type TokenRowProps = {
  symbol: string;
  name: string;
  icon?: string;
  selected: boolean;
  amount?: string;
  badge?: string;
  onClick: () => void;
};

export function TokenRow({ symbol, name, icon, selected, amount, badge, onClick }: TokenRowProps) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-3 border-b border-border/30 px-4 py-3 last:border-0 transition-all ${
        selected
          ? "border-l-2 border-l-primary bg-primary/10"
          : "opacity-40 hover:opacity-70 hover:bg-white/5"
      }`}
    >
      <div
        className={`relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full p-1.5 transition-colors ${
          selected ? "bg-primary/20 ring-1 ring-primary/40" : "bg-white/5"
        }`}
      >
        {icon ? (
          <Image src={icon} alt={symbol} width={36} height={36} className="h-full w-full object-contain" />
        ) : (
          <div className="h-5 w-5 rounded-full bg-primary/20" />
        )}
      </div>

      <div className="flex flex-1 flex-col items-start gap-0.5">
        <div className="flex items-center gap-2">
          <span className={`text-[14px] font-bold ${selected ? "text-foreground" : "text-foreground/80"}`}>
            {name}
          </span>
          <span className="text-xs font-medium text-muted">{symbol}</span>
          {badge && (
            <span className="rounded-[4px] bg-primary/10 px-1.5 py-0.5 text-[9px] font-black uppercase text-primary">
              {badge}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {amount && <span className="text-xs font-bold text-foreground">{amount}</span>}
        {selected && <Check className="h-4 w-4 text-primary" />}
      </div>
    </button>
  );
}
