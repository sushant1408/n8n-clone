"use server";

import type { Realtime } from "@inngest/realtime";
import { getSubscriptionToken } from "@inngest/realtime";

import { discordChannel } from "@/inngest/channels/discord";
import { inngest } from "@/inngest/client";

export type DiscordToken = Realtime.Token<typeof discordChannel, ["status"]>;

async function fetchDiscordRealtimeToken(): Promise<DiscordToken> {
  const token = getSubscriptionToken(inngest, {
    channel: discordChannel(),
    topics: ["status"],
  });

  return token;
}

export { fetchDiscordRealtimeToken };
