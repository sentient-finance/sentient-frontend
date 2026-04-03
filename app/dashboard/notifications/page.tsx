"use client";

import { useState, useEffect, useCallback } from "react";
import { useNotifications } from "@/features/notifications";
import { useTelegramConnect } from "@/features/notifications/hooks/use-telegram-connect";
import { ConnectionsRow } from "@/features/notifications/components/connections-row";
import { RecentNotifications } from "@/features/notifications/components/recent-notifications";
import { AlertPreferences } from "@/features/notifications/components/alert-preferences";
import { TelegramConnectModal } from "@/features/notifications/components/telegram-connect-modal";
import { createPriceAlert, deletePriceAlert, getPriceAlerts } from "@/lib/api/client";
import type { PriceAlert } from "@/lib/api/types";

export default function NotificationsPage() {
  const { alertPrefs, togglePref, recentNotifications } = useNotifications();
  const {
    isConnected,
    hydrated,
    maskedChatId,
    modalOpen,
    openModal,
    closeModal,
    inputValue,
    setInputValue,
    handleSave,
    handleDisconnect,
    handleTest,
    isSaving,
    isTesting,
  } = useTelegramConnect();

  // Price alerts state
  const [activeTab, setActiveTab] = useState<"preferences" | "price_alerts">("preferences");
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [alertsLoaded, setAlertsLoaded] = useState(false);
  const [alertsError, setAlertsError] = useState<string | null>(null);
  const [deletingAlertId, setDeletingAlertId] = useState<number | null>(null);

  // Alert form state
  const [selectedVault, setSelectedVault] = useState("");
  const [alertType, setAlertType] = useState<"above" | "below">("below");
  const [thresholdPrice, setThresholdPrice] = useState("");
  const [actionType, setActionType] = useState<"none" | "fast_swap" | "auto_swap">("none");
  const [alertStatus, setAlertStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  // Auto-clear success/error after 4 seconds
  useEffect(() => {
    if (alertStatus === "success" || alertStatus === "error") {
      const timer = setTimeout(() => setAlertStatus("idle"), 4000);
      return () => clearTimeout(timer);
    }
  }, [alertStatus]);

  const loadAlerts = useCallback(async (chatId: string) => {
    try {
      const data = await getPriceAlerts({ recipient_id: chatId });
      setAlerts(data);
      setAlertsError(null);
      setAlertsLoaded(true);
    } catch {
      setAlertsError("Failed to load alerts. Please try again.");
      setAlertsLoaded(true);
    }
  }, []);

  const handleTabChange = (tab: "preferences" | "price_alerts") => {
    setActiveTab(tab);
    if (tab === "price_alerts" && !alertsLoaded) {
      const chatId = localStorage.getItem("telegram_chat_id");
      if (chatId) {
        loadAlerts(chatId);
      }
    }
  };

  // Reset status on form change
  const handleVaultChange = (value: string) => {
    setSelectedVault(value);
    if (alertStatus !== "idle") setAlertStatus("idle");
  };

  const handleThresholdChange = (value: string) => {
    setThresholdPrice(value);
    if (alertStatus !== "idle") setAlertStatus("idle");
  };

  const handleCreateAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    const chatId = localStorage.getItem("telegram_chat_id");
    const price = parseFloat(thresholdPrice);
    if (!selectedVault || !thresholdPrice || isNaN(price) || !chatId) return;
    setAlertStatus("loading");
    try {
      await createPriceAlert({
        recipient_id: chatId,
        channel_type: "telegram",
        vault_address: selectedVault,
        alert_type: alertType,
        threshold_price: price,
        action_type: actionType,
      });
      setAlertStatus("success");
      setThresholdPrice("");
      setSelectedVault("");
      await loadAlerts(chatId);
    } catch {
      setAlertStatus("error");
    }
  };

  const handleDeleteAlert = async (alertId: number) => {
    const chatId = localStorage.getItem("telegram_chat_id");
    setDeletingAlertId(alertId);
    try {
      await deletePriceAlert(alertId);
      if (chatId) await loadAlerts(chatId);
    } catch {
      setAlertsError("Failed to delete alert. Please try again.");
    } finally {
      setDeletingAlertId(null);
    }
  };

  return (
    <div className="space-y-5">
      <ConnectionsRow
        hydrated={hydrated}
        isConnected={isConnected}
        maskedChatId={maskedChatId}
        isTesting={isTesting}
        onConnect={openModal}
        onDisconnect={handleDisconnect}
        onTest={handleTest}
      />

      {/* Tab navigation */}
      <div className="flex gap-4 border-b dark:border-gray-700">
        <button
          onClick={() => handleTabChange("preferences")}
          className={`px-1 pb-2 text-sm font-medium transition-colors ${
            activeTab === "preferences"
              ? "border-primary text-primary border-b-2"
              : "text-muted hover:text-foreground"
          }`}
        >
          Alert Preferences
        </button>
        <button
          onClick={() => handleTabChange("price_alerts")}
          className={`px-1 pb-2 text-sm font-medium transition-colors ${
            activeTab === "price_alerts"
              ? "border-primary text-primary border-b-2"
              : "text-muted hover:text-foreground"
          }`}
        >
          Price Alerts
        </button>
      </div>

      {activeTab === "preferences" ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div className="order-first md:order-last">
            <AlertPreferences prefs={alertPrefs} onToggle={togglePref} />
          </div>
          <div className="order-last md:order-first">
            <RecentNotifications notifications={recentNotifications} />
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Price Alerts Panel */}
          <div className="bg-card-2/40 border-border/50 rounded-xl border p-6">
            <h2 className="mb-1 text-lg font-semibold">📊 Price Alerts</h2>
            <p className="text-muted mb-4 text-sm">
              Get notified when a vault token price crosses your threshold. Alerts are{" "}
              <strong>one-shot</strong> — they trigger once and then deactivate.
            </p>

            {/* Create Alert Form */}
            <form
              onSubmit={handleCreateAlert}
              className="bg-background/50 dark:bg-background/20 mb-6 space-y-4 rounded-lg p-4"
            >
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium">Vault Address *</label>
                  <input
                    type="text"
                    value={selectedVault}
                    onChange={(e) => handleVaultChange(e.target.value)}
                    placeholder="0x..."
                    required
                    pattern="0x[a-fA-F0-9]{40}"
                    title="Enter a valid Ethereum address (0x followed by 40 hex characters)"
                    className="w-full rounded-lg border px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Threshold Price (USD) *</label>
                  <input
                    type="number"
                    value={thresholdPrice}
                    onChange={(e) => handleThresholdChange(e.target.value)}
                    placeholder="1850.00"
                    step="0.01"
                    min="0"
                    required
                    className="w-full rounded-lg border px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Alert When</label>
                  <select
                    value={alertType}
                    onChange={(e) => setAlertType(e.target.value as "above" | "below")}
                    className="w-full rounded-lg border px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700"
                  >
                    <option value="below">Price drops below</option>
                    <option value="above">Price rises above</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Action</label>
                  <select
                    value={actionType}
                    onChange={(e) =>
                      setActionType(e.target.value as "none" | "fast_swap" | "auto_swap")
                    }
                    className="w-full rounded-lg border px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700"
                  >
                    <option value="none">🔔 Notify only</option>
                    <option value="fast_swap">🚀 Fast Swap (with button)</option>
                    <option value="auto_swap">⚡ Auto Swap (automatic)</option>
                  </select>
                </div>
              </div>
              <button
                type="submit"
                disabled={alertStatus === "loading" || !selectedVault || !thresholdPrice}
                className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
              >
                {alertStatus === "loading" ? "Creating..." : "Create Alert"}
              </button>
              {alertStatus === "success" && (
                <span className="ml-2 text-sm text-green-600">✓ Alert created!</span>
              )}
              {alertStatus === "error" && (
                <span className="ml-2 text-sm text-red-600">Failed to create alert</span>
              )}
            </form>

            {/* Alert List */}
            {!localStorage.getItem("telegram_chat_id") ? (
              <p className="text-muted py-4 text-center text-sm">
                Connect Telegram above to create price alerts.
              </p>
            ) : alertsError ? (
              <p className="py-4 text-center text-sm text-red-600">{alertsError}</p>
            ) : alerts.length === 0 ? (
              <p className="text-muted py-4 text-center text-sm">
                No alerts yet. Create one above.
              </p>
            ) : (
              <div className="space-y-2">
                {alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="bg-background/50 dark:bg-background/20 flex items-center justify-between rounded-lg px-4 py-3"
                  >
                    <div>
                      <div className="text-sm font-medium">
                        {alert.alert_type === "below" ? "📉" : "📈"}{" "}
                        {alert.alert_type.toUpperCase()} ${alert.threshold_price}
                      </div>
                      <div className="text-muted mt-0.5 text-xs">
                        Vault: <code className="text-[10px]">{alert.vault_address}</code>
                        {" | "} Action:{" "}
                        <span className="capitalize">{alert.action_type.replace("_", " ")}</span>
                        {" | "}
                        {alert.is_active ? "✅ Active" : "⏸️ Triggered"}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteAlert(alert.id)}
                      disabled={deletingAlertId === alert.id}
                      className="text-xs font-medium text-red-600 hover:text-red-700 disabled:opacity-50"
                    >
                      {deletingAlertId === alert.id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <TelegramConnectModal
        modalOpen={modalOpen}
        onClose={closeModal}
        inputValue={inputValue}
        onInputChange={setInputValue}
        onSave={handleSave}
        isSaving={isSaving}
      />
    </div>
  );
}
