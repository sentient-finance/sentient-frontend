"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { appendToHistory } from "../lib/notification-history";

export type ChannelType = "telegram" | "email";

export type ConnectedChannel = {
  channel_type: ChannelType;
  recipient_id: string;
  connected_at: string;
};

async function fetchChannels(): Promise<ConnectedChannel[]> {
  const res = await fetch("/api/alerts/channels");
  if (!res.ok) throw new Error("Failed to fetch channels");
  return res.json();
}

async function connectChannel(channelType: ChannelType): Promise<{ recipient_id: string }> {
  const res = await fetch("/api/alerts/channels", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ channel_type: channelType }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error((data as { error?: string })?.error ?? "Failed to connect channel");
  }
  return res.json();
}

async function disconnectChannel(channelType: ChannelType): Promise<void> {
  const res = await fetch(`/api/alerts/channels?channel_type=${channelType}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to disconnect channel");
}

export function useChannelConnect() {
  const [channels, setChannels] = useState<ConnectedChannel[]>([]);
  const [loading, setLoading] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);
  const [testing, setTesting] = useState(false);

  const telegramChannel = channels.find((c) => c.channel_type === "telegram");
  const isTelegramConnected = !!telegramChannel;

  const maskedRecipientId = telegramChannel
    ? `${telegramChannel.recipient_id.slice(0, 5)}${"*".repeat(Math.max(0, telegramChannel.recipient_id.length - 5))}`
    : null;

  useEffect(() => {
    loadChannels();
  }, []);

  async function loadChannels() {
    setLoading(true);
    try {
      const data = await fetchChannels();
      setChannels(data);
    } catch {
      // silently fail — channels will appear as not connected
    } finally {
      setLoading(false);
    }
  }

  async function handleConnectTelegram() {
    setConnecting(true);
    try {
      const data = await connectChannel("telegram");
      setChannels((prev) => [
        ...prev.filter((c) => c.channel_type !== "telegram"),
        {
          channel_type: "telegram",
          recipient_id: data.recipient_id,
          connected_at: new Date().toISOString(),
        },
      ]);
      toast.success("Telegram connected successfully.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to connect Telegram.");
    } finally {
      setConnecting(false);
    }
  }

  async function handleDisconnectTelegram() {
    setDisconnecting(true);
    try {
      await disconnectChannel("telegram");
      setChannels((prev) => prev.filter((c) => c.channel_type !== "telegram"));
      toast.success("Telegram disconnected.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to disconnect Telegram.");
    } finally {
      setDisconnecting(false);
    }
  }

  const handleTest = useCallback(async () => {
    if (!telegramChannel) {
      toast.error("Connect Telegram first.");
      return;
    }
    setTesting(true);
    try {
      const res = await fetch("/api/telegram/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chatId: telegramChannel.recipient_id,
          message: "✅ Test notification from Sentient Finance. Your alerts are working.",
        }),
      });
      if (!res.ok) throw new Error("Failed to send");
      toast.success("Test message sent to Telegram.");
      appendToHistory({
        type: "TestAlert",
        vault: "—",
        chain: "—",
        dot: "bg-primary",
        textColor: "text-primary",
      });
    } catch {
      toast.error("Network error. Could not reach Telegram.");
    } finally {
      setTesting(false);
    }
  }, [telegramChannel]);

  return {
    channels,
    loading,
    isTelegramConnected,
    maskedRecipientId,
    connecting,
    disconnecting,
    testing,
    handleConnectTelegram,
    handleDisconnectTelegram,
    handleTest,
  };
}
