"use client";

import { TelegramConnectionCard } from "./telegram-connection-card";
import { EmailConnectionCard } from "./email-connection-card";

interface ConnectionsRowProps {
  loading: boolean;
  isConnected: boolean;
  maskedRecipientId: string | null;
  connecting: boolean;
  disconnecting: boolean;
  testing: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
  onTest: () => void;
}

export function ConnectionsRow(props: ConnectionsRowProps) {
  return (
    <div>
      <p className="text-muted mb-3 text-xs font-semibold tracking-widest uppercase">Connections</p>
      <div className="flex gap-3 overflow-x-auto pb-1">
        <TelegramConnectionCard {...props} />
        <EmailConnectionCard />
      </div>
    </div>
  );
}
