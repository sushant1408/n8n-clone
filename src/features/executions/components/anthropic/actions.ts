"use server";

import type { Realtime } from "@inngest/realtime";
import { getSubscriptionToken } from "@inngest/realtime";

import { anthropicChannel } from "@/inngest/channels/anthropic";
import { inngest } from "@/inngest/client";

export type AnthropicToken = Realtime.Token<
  typeof anthropicChannel,
  ["status"]
>;

async function fetchAnthropicRealtimeToken(): Promise<AnthropicToken> {
  const token = getSubscriptionToken(inngest, {
    channel: anthropicChannel(),
    topics: ["status"],
  });

  return token;
}

export { fetchAnthropicRealtimeToken };
