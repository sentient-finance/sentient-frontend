"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";
import { ROUTES } from "@/lib/constants/routes";
import { shortAddress } from "@/lib/utils";
import { VaultDetail } from "@/components/query/vault-detail";
import { useVaultDetail, useVaultAPIHistory } from "@/lib/api/hooks";

function isValidAddress(addr: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(addr);
}

export default function SearchAddressPage({
  params,
}: {
  params: Promise<{ address: string }>;
}) {
  const { address } = use(params);
  const router = useRouter();
  const decoded = decodeURIComponent(address ?? "");

  const {
    data: vault,
    isLoading: vaultLoading,
    error: vaultError,
  } = useVaultDetail(decoded);

  const { data: historyData } = useVaultAPIHistory(decoded, {
    limit: 50,
    chain: vault?.chain_id,
  });

  const history = historyData?.items ?? [];

  if (!decoded || decoded.length < 6) {
    return (
      <div className="flex items-center gap-3 p-4 rounded-xl border border-danger/20 bg-danger/5 text-danger animate-in fade-in slide-in-from-top-2">
        <AlertCircle className="h-5 w-5 shrink-0" />
        <p className="text-sm font-medium">Please enter a valid vault address.</p>
      </div>
    );
  }

  if (!isValidAddress(decoded)) {
    return (
      <div className="flex items-center gap-3 p-4 rounded-xl border border-danger/20 bg-danger/5 text-danger animate-in fade-in slide-in-from-top-2">
        <AlertCircle className="h-5 w-5 shrink-0" />
        <p className="text-sm font-medium">
          Invalid address format. Use full 0x + 40 hex characters.
        </p>
      </div>
    );
  }

  if (vaultLoading) {
    return (
      <div className="flex justify-center p-8">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (vaultError) {
    const err = vaultError as { detail?: string; status?: number };
    const msg =
      typeof err.detail === "string"
        ? err.detail
        : err.status === 404
          ? "Vault not found"
          : err.status === 409
            ? "Address exists on multiple chains. Add ?chain=<chainId> to the URL."
            : "Failed to load vault";
    return (
      <div className="flex items-center gap-3 p-4 rounded-xl border border-danger/20 bg-danger/5 text-danger animate-in fade-in slide-in-from-top-2">
        <AlertCircle className="h-5 w-5 shrink-0" />
        <p className="text-sm font-medium">{msg}</p>
      </div>
    );
  }

  if (!vault) return null;

  return (
    <VaultDetail
      vault={vault}
      history={history}
      onBack={() => router.push(ROUTES.SEARCH)}
    />
  );
}
