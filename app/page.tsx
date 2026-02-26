import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-2xl rounded-2xl border border-white/15 bg-white/5 p-8 text-center shadow-2xl backdrop-blur">
        <p className="mb-2 text-xs uppercase tracking-[0.2em] text-white/60">Sentient Finance</p>
        <h1 className="mb-3 text-4xl font-bold">CRE Wallet MVP</h1>
        <p className="mx-auto mb-8 max-w-xl text-white/70">
          Day 1 scaffold: app layout, wallet connect button, and dashboard skeleton.
        </p>

        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/app"
            className="rounded-xl bg-primary px-5 py-3 font-semibold text-white hover:opacity-90"
          >
            Launch App
          </Link>
          <Link
            href="https://github.com/Sentient-Finance/cre-wallet"
            target="_blank"
            className="rounded-xl border border-white/20 px-5 py-3 font-semibold hover:bg-white/10"
          >
            View Repo
          </Link>
        </div>
      </div>
    </div>
  );
}
