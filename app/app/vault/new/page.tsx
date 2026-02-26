export default function CreateVaultPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Create Vault</h1>
      <p className="text-sm text-white/70">Day 1 skeleton form. Contract write wiring in Day 2/3.</p>

      <form className="grid gap-4 rounded-2xl border border-white/15 bg-card/60 p-5 md:grid-cols-2">
        <label className="grid gap-2">
          <span className="text-sm text-white/80">Executor Address</span>
          <input className="rounded-lg border border-white/20 bg-black/20 px-3 py-2" placeholder="0x..." />
        </label>
        <label className="grid gap-2">
          <span className="text-sm text-white/80">Max Trade Amount</span>
          <input className="rounded-lg border border-white/20 bg-black/20 px-3 py-2" placeholder="1000" />
        </label>
        <label className="grid gap-2">
          <span className="text-sm text-white/80">Cooldown (seconds)</span>
          <input className="rounded-lg border border-white/20 bg-black/20 px-3 py-2" placeholder="300" />
        </label>
        <label className="grid gap-2">
          <span className="text-sm text-white/80">Automation Caller (optional)</span>
          <input className="rounded-lg border border-white/20 bg-black/20 px-3 py-2" placeholder="0x..." />
        </label>
        <button type="button" className="md:col-span-2 rounded-xl bg-primary px-4 py-2 font-semibold">
          Create (coming next)
        </button>
      </form>
    </div>
  );
}
