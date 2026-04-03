/**
 * API types aligned with sentient-backend /api/v1/vaults responses.
 */

export interface VaultListItem {
  chain_id: number;
  address: string;
  owner: string | null;
  created_block_number: number | null;
  created_tx_hash: string | null;
  created_timestamp: string | null;
}

export interface VaultDetail {
  chain_id: number;
  address: string;
  owner: string | null;
  created_block_number: number | null;
  created_tx_hash: string | null;
  created_timestamp: string | null;
  event_count: number;
  latest_event_block: number | null;
  latest_event_timestamp: string | null;
}

export interface HistoryItem {
  chain_id: number;
  vault_address: string;
  event_type: string;
  block_number: number;
  tx_hash: string;
  log_index: number;
  timestamp: string;
  payload_json: Record<string, unknown>;
}

export interface PaginatedResponse<T> {
  total: number;
  limit: number;
  offset: number;
  items: T[];
}

/** CCIP config from backend */
export interface CCIPChainConfig {
  chain_id: number;
  chain_name: string;
  ccip_router: string;
}

export interface CCIPDestinationConfig {
  chain_id: number | null;
  chain_name: string;
  selector: number;
}

export interface CCIPConfigResponse {
  chains: CCIPChainConfig[];
  destinations: CCIPDestinationConfig[];
}

export interface EstimateFeeRequest {
  vault_address: string;
  chain_id?: number;
  destination_chain_selector: number;
  token_address: string;
  amount: string;
  receiver: string;
}

export interface EstimateFeeResponse {
  fee_wei: string;
  fee_eth: string;
}

// === Notification Channel ===
export interface NotificationChannel {
  id: number;
  user_wallet: string;
  channel_type: "telegram";
  channel_id: string;
  is_active: boolean;
  created_at: string;
}

export interface ChannelRegisterRequest {
  user_wallet: string;
  channel_type: "telegram";
  channel_id: string;
}

// === Price Alert ===
export interface PriceAlert {
  id: number;
  recipient_id: string;
  channel_type: "telegram";
  vault_address: string;
  chain_id: number;
  alert_type: "above" | "below";
  threshold_price: number;
  action_type: "none" | "fast_swap" | "auto_swap";
  action_config: Record<string, unknown> | null;
  is_active: boolean;
  triggered_at: string | null;
  created_at: string;
}

export interface PriceAlertCreateRequest {
  recipient_id: string;
  channel_type: "telegram";
  vault_address: string;
  chain_id?: number;
  alert_type: "above" | "below";
  threshold_price: number;
  action_type?: "none" | "fast_swap" | "auto_swap";
  action_config?: Record<string, unknown> | null;
}
