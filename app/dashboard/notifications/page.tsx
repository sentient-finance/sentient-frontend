"use client";

import { useNotifications } from "@/features/notifications";
import { useChannelConnect } from "@/features/notifications/hooks/use-channel-connect";
import { ConnectionsRow } from "@/features/notifications/components/connections-row";
import { RecentNotifications } from "@/features/notifications/components/recent-notifications";
import { AlertPreferences } from "@/features/notifications/components/alert-preferences";

export default function NotificationsPage() {
  const { alertPrefs, togglePref, recentNotifications } = useNotifications();
  const {
    loading,
    isTelegramConnected,
    maskedRecipientId,
    connecting,
    disconnecting,
    testing,
    handleConnectTelegram,
    handleDisconnectTelegram,
    handleTest,
  } = useChannelConnect();

  return (
    <div className="space-y-5">
      <ConnectionsRow
        loading={loading}
        isConnected={isTelegramConnected}
        maskedRecipientId={maskedRecipientId}
        connecting={connecting}
        disconnecting={disconnecting}
        testing={testing}
        onConnect={handleConnectTelegram}
        onDisconnect={handleDisconnectTelegram}
        onTest={handleTest}
      />

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="order-first md:order-last">
          <AlertPreferences prefs={alertPrefs} onToggle={togglePref} />
        </div>
        <div className="order-last md:order-first">
          <RecentNotifications notifications={recentNotifications} />
        </div>
      </div>
    </div>
  );
}
