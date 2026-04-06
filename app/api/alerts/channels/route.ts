import { type NextRequest, NextResponse } from "next/server";

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

type ChannelEntry = { recipient_id: string; connected_at: string };

// In-memory store for demo; replace with DB in production
const connectedChannels: Record<string, ChannelEntry> = {};

/** GET /api/alerts/channels — list all connected channels */
export async function GET(): Promise<NextResponse> {
  const channels = Object.entries(connectedChannels).map(([channel_type, data]) => ({
    channel_type,
    recipient_id: data.recipient_id,
    connected_at: data.connected_at,
  }));
  return NextResponse.json(channels);
}

/** POST /api/alerts/channels { channel_type } — initiate a channel connection */
export async function POST(req: NextRequest): Promise<NextResponse> {
  if (!BOT_TOKEN) {
    return NextResponse.json({ error: "TELEGRAM_BOT_TOKEN is not configured" }, { status: 500 });
  }

  let body: { channel_type?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { channel_type } = body;

  if (!channel_type || !["telegram", "email"].includes(channel_type)) {
    return NextResponse.json(
      { error: "channel_type must be 'telegram' or 'email'" },
      { status: 400 }
    );
  }

  if (connectedChannels[channel_type]) {
    return NextResponse.json({
      recipient_id: connectedChannels[channel_type].recipient_id,
      message: `${channel_type} already connected`,
    });
  }

  if (channel_type === "telegram") {
    // TODO (backend): Query Telegram Bot API to retrieve the user's chat_id
    // after they have authenticated via @SentientAlertBot.
    // For now, return a placeholder that the frontend can use to test the flow.
    return NextResponse.json({
      recipient_id: "TEMPORARY_PLACEHOLDER",
      message: "Telegram connection pending. Complete verification in the bot.",
    });
  }

  return NextResponse.json({ error: "Unsupported channel type" }, { status: 400 });
}

/** DELETE /api/alerts/channels?channel_type=telegram — disconnect a channel */
export async function DELETE(req: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(req.url);
  const channel_type = searchParams.get("channel_type");

  if (!channel_type || !["telegram", "email"].includes(channel_type)) {
    return NextResponse.json(
      { error: "channel_type must be 'telegram' or 'email'" },
      { status: 400 }
    );
  }

  delete connectedChannels[channel_type];
  return NextResponse.json({ ok: true });
}
