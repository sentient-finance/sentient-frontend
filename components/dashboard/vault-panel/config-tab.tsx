export function ConfigTab({
  buyPrice,
  sellPrice,
  onBuyPriceChange,
  onSellPriceChange,
}: {
  buyPrice: string;
  sellPrice: string;
  onBuyPriceChange: (value: string) => void;
  onSellPriceChange: (value: string) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border/60 bg-card-2/40 p-4">
        <p className="mb-3 text-xs font-semibold text-foreground">Price Rules</p>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-muted">Buy below ($)</label>
            <input
              type="number"
              value={buyPrice}
              onChange={(e) => onBuyPriceChange(e.target.value)}
              placeholder="e.g. 1900"
              className="mt-1 w-full rounded-lg border border-border/60 bg-card px-3 py-2 text-xs font-medium text-foreground outline-none focus:border-success/50 focus:ring-1 focus:ring-success/20"
            />
          </div>
          <div>
            <label className="text-xs text-muted">Sell above ($)</label>
            <input
              type="number"
              value={sellPrice}
              onChange={(e) => onSellPriceChange(e.target.value)}
              placeholder="e.g. 2350"
              className="mt-1 w-full rounded-lg border border-border/60 bg-card px-3 py-2 text-xs font-medium text-foreground outline-none focus:border-danger/50 focus:ring-1 focus:ring-danger/20"
            />
          </div>
          <button className="w-full rounded-xl bg-primary/10 py-2 text-xs font-semibold text-primary transition-all hover:bg-primary hover:text-primary-foreground">
            Save Rules
          </button>
        </div>
      </div>
    </div>
  );
}
