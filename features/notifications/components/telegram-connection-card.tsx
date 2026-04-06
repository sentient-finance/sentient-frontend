"use client";

import { TelegramIcon } from "@/components/ui/icons";

interface TelegramConnectionCardProps {
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

export function TelegramConnectionCard({
  loading,
  isConnected,
  maskedRecipientId,
  connecting,
  disconnecting,
  testing,
  onConnect,
  onDisconnect,
  onTest,
}: TelegramConnectionCardProps) {
  return (
    <div className="border-border bg-card/80 min-w-[280px] shrink-0 overflow-hidden rounded-2xl border">
      <div className="h-0.5 w-full bg-linear-to-r from-[#2AABEE]/60 via-[#2AABEE]/30 to-transparent" />
      <div className="p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-[#2AABEE]/30 bg-[#2AABEE]/10 text-[#2AABEE]">
              <TelegramIcon className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-semibold">Telegram</p>
              <p className="text-muted text-[11px]">Real-time alerts via bot</p>
            </div>
          </div>

          {/* Status badge */}
          {loading ? (
            <div className="bg-card-2/60 h-5 w-20 animate-pulse rounded-full" />
          ) : isConnected ? (
            <div className="flex items-center gap-1.5 rounded-full border border-[#2AABEE]/30 bg-[#2AABEE]/10 px-2 py-0.5 text-[11px] text-[#2AABEE]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#2AABEE]" />
              {maskedRecipientId}
            </div>
          ) : (
            <div className="border-border bg-card-2/60 text-muted flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px]">
              <span className="bg-muted h-1.5 w-1.5 rounded-full" />
              Not connected
            </div>
          )}
        </div>

        <div className="mt-3">
          {loading ? null : isConnected ? (
            <div className="flex gap-2">
              <button
                onClick={onDisconnect}
                disabled={disconnecting}
                className="border-danger/30 bg-danger/10 text-danger hover:bg-danger/20 rounded-lg border px-3 py-1.5 text-[11px] font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-40"
              >
                {disconnecting ? "Disconnecting…" : "Disconnect"}
              </button>
              <button
                onClick={onTest}
                disabled={testing}
                className="border-border hover:border-primary/50 hover:text-primary rounded-lg border px-3 py-1.5 text-[11px] font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40"
              >
                {testing ? "Sending…" : "Test"}
              </button>
            </div>
          ) : (
            <button
              onClick={onConnect}
              disabled={connecting}
              className="w-full rounded-lg bg-[#2AABEE] py-2 text-xs font-semibold text-white shadow-sm shadow-[#2AABEE]/20 transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {connecting ? "Connecting…" : "Connect Telegram →"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
