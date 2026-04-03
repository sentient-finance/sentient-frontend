import type {
  PaginatedResponse,
  VaultDetail,
  VaultListItem,
  HistoryItem,
  CCIPConfigResponse,
  EstimateFeeRequest,
  EstimateFeeResponse,
  NotificationChannel,
  ChannelRegisterRequest,
  PriceAlert,
  PriceAlertCreateRequest,
} from "./types";
import { FACTORY_CHAIN } from "@/lib/constants/chains";

export type { EstimateFeeRequest, ChannelRegisterRequest, PriceAlertCreateRequest } from "./types";

const API_BASE = "/api/proxy";

export interface ApiError {
  detail: string | Record<string, unknown>;
  status: number;
}

async function handleResponse<T>(res: Response): Promise<T> {
  const text = await res.text();
  if (!res.ok) {
    let detail: string | Record<string, unknown> = text;
    try {
      detail = JSON.parse(text) as Record<string, unknown>;
    } catch {
      // keep text
    }
    throw { detail, status: res.status } as ApiError;
  }
  if (!text) return {} as T;
  return JSON.parse(text) as T;
}

function buildUrl(path: string, params: Record<string, string | number | undefined>): string {
  const search = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v != null) search.set(k, String(v));
  }
  const qs = search.toString();
  return `${API_BASE}${path}${qs ? `?${qs}` : ""}`;
}

export interface ListVaultsParams {
  chain?: number;
  owner?: string;
  limit?: number;
  offset?: number;
}

export async function listVaults(
  params: ListVaultsParams = {}
): Promise<PaginatedResponse<VaultListItem>> {
  const url = buildUrl("/api/v1/vaults", {
    chain: params.chain,
    owner: params.owner,
    limit: params.limit,
    offset: params.offset,
  });
  const res = await fetch(url);
  return handleResponse<PaginatedResponse<VaultListItem>>(res);
}

export interface GetVaultParams {
  chain?: number;
}

export async function getVault(address: string, params: GetVaultParams = {}): Promise<VaultDetail> {
  const url = buildUrl(`/api/v1/vaults/${encodeURIComponent(address)}`, {
    chain: params.chain,
  });
  const res = await fetch(url);
  return handleResponse<VaultDetail>(res);
}

export interface GetVaultHistoryParams {
  chain?: number;
  type?: string;
  from?: string;
  to?: string;
  limit?: number;
  offset?: number;
}

export async function getVaultHistory(
  address: string,
  params: GetVaultHistoryParams = {}
): Promise<PaginatedResponse<HistoryItem>> {
  const url = buildUrl(`/api/v1/vaults/${encodeURIComponent(address)}/history`, {
    chain: params.chain,
    type: params.type,
    from: params.from,
    to: params.to,
    limit: params.limit,
    offset: params.offset,
  });
  const res = await fetch(url);
  return handleResponse<PaginatedResponse<HistoryItem>>(res);
}

export async function getCCIPConfig(): Promise<CCIPConfigResponse> {
  const res = await fetch(`${API_BASE}/api/v1/vaults/ccip/config`);
  return handleResponse<CCIPConfigResponse>(res);
}

export async function estimateCCIPFee(body: EstimateFeeRequest): Promise<EstimateFeeResponse> {
  const res = await fetch(`${API_BASE}/api/v1/vaults/ccip/estimate-fee`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      vault_address: body.vault_address,
      chain_id: body.chain_id ?? FACTORY_CHAIN.id,
      destination_chain_selector: body.destination_chain_selector,
      token_address: body.token_address,
      amount: body.amount,
      receiver: body.receiver,
    }),
  });
  return handleResponse<EstimateFeeResponse>(res);
}

// === Notification Channel ===
export async function registerNotificationChannel(
  data: ChannelRegisterRequest
): Promise<NotificationChannel> {
  const response = await fetch(`${API_BASE}/api/v1/alerts/channels`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error(`Failed to register channel: ${response.statusText}`);
  return response.json() as Promise<NotificationChannel>;
}

export async function getNotificationChannels(params?: {
  user_wallet?: string;
  telegram_chat_id?: string;
}): Promise<NotificationChannel[]> {
  const searchParams = new URLSearchParams();
  if (params?.user_wallet) searchParams.set("user_wallet", params.user_wallet);
  if (params?.telegram_chat_id) searchParams.set("telegram_chat_id", params.telegram_chat_id);
  const response = await fetch(`${API_BASE}/api/v1/alerts/channels?${searchParams}`);
  if (!response.ok) throw new Error(`Failed to fetch channels: ${response.statusText}`);
  return response.json() as Promise<NotificationChannel[]>;
}

export async function deleteNotificationChannel(channelId: number): Promise<void> {
  const response = await fetch(`${API_BASE}/api/v1/alerts/channels/${channelId}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error(`Failed to delete channel: ${response.statusText}`);
}

// === Price Alert ===
export async function createPriceAlert(data: PriceAlertCreateRequest): Promise<PriceAlert> {
  const response = await fetch(`${API_BASE}/api/v1/alerts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error(`Failed to create alert: ${response.statusText}`);
  return response.json() as Promise<PriceAlert>;
}

export async function getPriceAlerts(params?: {
  recipient_id?: string;
  vault_address?: string;
  is_active?: boolean;
}): Promise<PriceAlert[]> {
  const searchParams = new URLSearchParams();
  if (params?.recipient_id) searchParams.set("recipient_id", params.recipient_id);
  if (params?.vault_address) searchParams.set("vault_address", params.vault_address);
  if (params?.is_active !== undefined) searchParams.set("is_active", String(params.is_active));
  const response = await fetch(`${API_BASE}/api/v1/alerts?${searchParams}`);
  if (!response.ok) throw new Error(`Failed to fetch alerts: ${response.statusText}`);
  return response.json() as Promise<PriceAlert[]>;
}

export async function deletePriceAlert(alertId: number): Promise<void> {
  const response = await fetch(`${API_BASE}/api/v1/alerts/${alertId}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error(`Failed to delete alert: ${response.statusText}`);
}
