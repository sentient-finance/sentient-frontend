"use client";

import { useQuery } from "@tanstack/react-query";
import {
  listVaults,
  getVault,
  getVaultHistory,
  getCCIPConfig,
  estimateCCIPFee,
  registerNotificationChannel,
  getNotificationChannels,
  deleteNotificationChannel,
  createPriceAlert,
  getPriceAlerts,
  deletePriceAlert,
  type ListVaultsParams,
  type GetVaultParams,
  type GetVaultHistoryParams,
  type EstimateFeeRequest,
  type ChannelRegisterRequest,
  type PriceAlertCreateRequest,
} from "./client";

export const vaultKeys = {
  all: ["vaults"] as const,
  lists: (params?: ListVaultsParams) => [...vaultKeys.all, "list", params] as const,
  detail: (address: string, params?: GetVaultParams) =>
    [...vaultKeys.all, "detail", address, params] as const,
  history: (address: string, params?: GetVaultHistoryParams) =>
    [...vaultKeys.all, "history", address, params] as const,
};

export function useVaultsList(params: ListVaultsParams = {}, options?: { enabled?: boolean }) {
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

export function useVaultHistory(address: string, params?: GetVaultHistoryParams) {
  return useQuery({
    queryKey: vaultKeys.history(address, params),
    queryFn: () => getVaultHistory(address, params ?? {}),
    enabled: !!address && address.startsWith("0x") && address.length === 42,
  });
}

export const ccipKeys = {
  config: ["ccip", "config"] as const,
  estimateFee: (params: EstimateFeeRequest) => ["ccip", "estimate-fee", params] as const,
};

export function useCCIPConfig(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ccipKeys.config,
    queryFn: getCCIPConfig,
    enabled: options?.enabled ?? true,
  });
}

export function useCCIPEstimateFee(
  params: EstimateFeeRequest | null,
  options?: { enabled?: boolean }
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
    queryKey:
      hasValidParams && params
        ? ccipKeys.estimateFee(params)
        : ["ccip", "estimate-fee", "disabled"],
    queryFn: () => (params ? estimateCCIPFee(params) : Promise.reject(new Error("No params"))),
    enabled,
  });
}

// === Notification Channel Hooks ===
export function useNotificationChannels(params?: { user_wallet?: string; telegram_chat_id?: string }) {
  return useQuery({
    queryKey: ["notification-channels", params] as const,
    queryFn: () => getNotificationChannels(params),
    enabled: !!params?.user_wallet || !!params?.telegram_chat_id,
  });
}

// === Price Alert Hooks ===
export function usePriceAlerts(params?: { recipient_id?: string; vault_address?: string; is_active?: boolean }) {
  return useQuery({
    queryKey: ["price-alerts", params] as const,
    queryFn: () => getPriceAlerts(params),
    enabled: !!params?.recipient_id,
  });
}
