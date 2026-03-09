"use client";

import { useEffect, useState } from "react";
import { usePublicClient } from "wagmi";
import { formatUnits } from "viem";
import { TOKEN_DATA } from "@/lib/constants/tokens";

export type TxType = "deposit" | "withdraw" | "swap";

export interface VaultTx {
  type: TxType;
  hash: string;
  blockNumber: bigint;
  timestamp?: number;
  /** deposit / withdraw */
  token?: string;
  amount?: string;
  /** swap */
  tokenIn?: string;
  tokenOut?: string;
  amountIn?: string;
  amountOut?: string;
}

const VAULT_HISTORY_ABI = [
  {
    name: "TokenDeposited",
    type: "event",
    inputs: [
      { name: "token", type: "address", indexed: true },
      { name: "amount", type: "uint256", indexed: false },
    ],
  },
  {
    name: "TokenWithdrawn",
    type: "event",
    inputs: [
      { name: "token", type: "address", indexed: true },
      { name: "amount", type: "uint256", indexed: false },
    ],
  },
  {
    name: "SwapExecuted",
    type: "event",
    inputs: [
      { name: "tokenIn", type: "address", indexed: true },
      { name: "tokenOut", type: "address", indexed: true },
      { name: "amountIn", type: "uint256", indexed: false },
      { name: "amountOut", type: "uint256", indexed: false },
      { name: "priceUsed", type: "uint256", indexed: false },
    ],
  },
] as const;

// Build address → token lookup
const ADDRESS_TO_TOKEN: Record<string, { symbol: string; decimals: number }> = {};
for (const t of Object.values(TOKEN_DATA)) {
  ADDRESS_TO_TOKEN[t.address.toLowerCase()] = { symbol: t.symbol, decimals: t.decimals };
}

function resolveToken(address: string) {
  return ADDRESS_TO_TOKEN[address.toLowerCase()] ?? { symbol: address.slice(0, 6) + "…", decimals: 18 };
}

function fmt(raw: bigint, decimals: number) {
  return parseFloat(formatUnits(raw, decimals)).toLocaleString(undefined, {
    maximumFractionDigits: 6,
  });
}

export function useVaultHistory(vaultAddress: `0x${string}`) {
  const publicClient = usePublicClient();
  const [txs, setTxs] = useState<VaultTx[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!publicClient) return;

    let cancelled = false;

    async function fetchLogs() {
      setIsLoading(true);
      setError(null);
      try {
        const [deposited, withdrawn, swapped] = await Promise.all([
          publicClient!.getLogs({
            address: vaultAddress,
            event: VAULT_HISTORY_ABI[0],
            fromBlock: "earliest",
            toBlock: "latest",
          }),
          publicClient!.getLogs({
            address: vaultAddress,
            event: VAULT_HISTORY_ABI[1],
            fromBlock: "earliest",
            toBlock: "latest",
          }),
          publicClient!.getLogs({
            address: vaultAddress,
            event: VAULT_HISTORY_ABI[2],
            fromBlock: "earliest",
            toBlock: "latest",
          }),
        ]);

        if (cancelled) return;

        const results: VaultTx[] = [];

        for (const log of deposited) {
          const tok = resolveToken(log.args.token as string);
          results.push({
            type: "deposit",
            hash: log.transactionHash ?? "",
            blockNumber: log.blockNumber ?? 0n,
            token: tok.symbol,
            amount: fmt(log.args.amount as bigint, tok.decimals),
          });
        }

        for (const log of withdrawn) {
          const tok = resolveToken(log.args.token as string);
          results.push({
            type: "withdraw",
            hash: log.transactionHash ?? "",
            blockNumber: log.blockNumber ?? 0n,
            token: tok.symbol,
            amount: fmt(log.args.amount as bigint, tok.decimals),
          });
        }

        for (const log of swapped) {
          const tIn = resolveToken(log.args.tokenIn as string);
          const tOut = resolveToken(log.args.tokenOut as string);
          results.push({
            type: "swap",
            hash: log.transactionHash ?? "",
            blockNumber: log.blockNumber ?? 0n,
            tokenIn: tIn.symbol,
            tokenOut: tOut.symbol,
            amountIn: fmt(log.args.amountIn as bigint, tIn.decimals),
            amountOut: fmt(log.args.amountOut as bigint, tOut.decimals),
          });
        }

        results.sort((a, b) => (a.blockNumber > b.blockNumber ? -1 : 1));
        setTxs(results);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load history");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    fetchLogs();
    return () => { cancelled = true; };
  }, [publicClient, vaultAddress]);

  return { txs, isLoading, error };
}
