"use client";

import { useMemo, useState } from "react";

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string }) => Promise<string[]>;
    };
  }
}

function shortAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function WalletBar() {
  const [address, setAddress] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const label = useMemo(() => {
    if (loading) return "Connecting...";
    if (!address) return "Connect Wallet";
    return shortAddress(address);
  }, [address, loading]);

  async function connect() {
    if (!window.ethereum) {
      alert("No injected wallet found. Please install MetaMask.");
      return;
    }

    setLoading(true);
    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      setAddress(accounts?.[0] ?? "");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={connect}
      className="rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium hover:bg-white/15"
      type="button"
    >
      {label}
    </button>
  );
}
