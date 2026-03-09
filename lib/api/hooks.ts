"use client";

import { useQuery } from "@tanstack/react-query";
import {
  listVaults,
  getVault,
  getVaultHistory,
  estimateCCIPFee,
  type ListVaultsParams,
  type GetVaultParams,
  type GetVaultHistoryParams,
} from "./client";
import type { EstimateFeeRequest } from "./types";

export const vaultKeys = {
  all: ["vaults"] as const,
  lists: (params?: ListVaultsParams) =>
    [...vaultKeys.all, "list", params] as const,
  detail: (address: string, params?: GetVaultParams) =>
    [...vaultKeys.all, "detail", address, params] as const,
  history: (address: string, params?: GetVaultHistoryParams) =>
    [...vaultKeys.all, "history", address, params] as const,
};

export function useVaultsList(
  params: ListVaultsParams = {},
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: vaultKeys.lists(params),
    queryFn: () => listVaults(params),
    enabled: options?.enabled ?? true,
  });
}

export function useVaultDetail(address: string, params?: GetVaultParams) {
  return useQuery({
    queryKey: vaultKeys.detail(address, params),
    queryFn: () => getVault(address, params ?? {}),
    enabled: !!address && address.startsWith("0x") && address.length === 42,
  });
}

export function useVaultAPIHistory(
  address: string,
  params?: GetVaultHistoryParams,
) {
  return useQuery({
    queryKey: vaultKeys.history(address, params),
    queryFn: () => getVaultHistory(address, params ?? {}),
    enabled: !!address && address.startsWith("0x") && address.length === 42,
  });
}

export const ccipKeys = {
  estimateFee: (params: EstimateFeeRequest) =>
    ["ccip", "estimate-fee", params] as const,
};

export function useCCIPEstimateFee(
  params: EstimateFeeRequest | null,
  options?: { enabled?: boolean },
) {
  const hasValidParams =
    !!params &&
    !!params.vault_address &&
    !!params.token_address &&
    !!params.receiver &&
    !!params.amount &&
    params.destination_chain_selector > 0;
  const enabled = Boolean((options?.enabled ?? true) && hasValidParams);

  return useQuery({
    queryKey: hasValidParams && params ? ccipKeys.estimateFee(params) : ["ccip", "estimate-fee", "disabled"],
    queryFn: () => (params ? estimateCCIPFee(params) : Promise.reject(new Error("No params"))),
    enabled,
  });
}
