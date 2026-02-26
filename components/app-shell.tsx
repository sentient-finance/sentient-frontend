import Link from "next/link";
import { WalletBar } from "./wallet-bar";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 border-b border-white/10 bg-black/20 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link href="/app" className="text-lg font-semibold tracking-wide">
            CRE Wallet
          </Link>
          <nav className="hidden gap-5 text-sm text-white/80 md:flex">
            <Link href="/app">Dashboard</Link>
            <Link href="/app/vault/new">Create Vault</Link>
            <Link href="/app/monitor">Monitor</Link>
          </nav>
          <WalletBar />
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
    </div>
  );
}
