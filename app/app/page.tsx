const mockVaults = [
  { address: "0xA1B2...91f2", chain: "Base Sepolia", status: "Active", tvl: "$1,230" },
  { address: "0xC3D4...8aa1", chain: "Sepolia", status: "Paused", tvl: "$540" },
];

export default function AppDashboardPage() {
  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-white/70">Overview of your vaults (Day 1 placeholder data).</p>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {mockVaults.map((vault) => (
          <article key={vault.address} className="rounded-2xl border border-white/15 bg-card/60 p-4">
            <p className="text-sm text-white/70">{vault.chain}</p>
            <p className="mt-1 font-mono text-sm">{vault.address}</p>
            <div className="mt-3 flex items-center justify-between">
              <span className="rounded-full border border-white/15 px-2 py-1 text-xs">{vault.status}</span>
              <span className="text-sm font-semibold">{vault.tvl}</span>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
