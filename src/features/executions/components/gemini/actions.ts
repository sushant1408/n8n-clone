"use server";

import type { Realtime } from "@inngest/realtime";
import { getSubscriptionToken } from "@inngest/realtime";

import { geminiChannel } from "@/inngest/channels/gemini";
import { inngest } from "@/inngest/client";

export type GeminiToken = Realtime.Token<typeof geminiChannel, ["status"]>;

async function fetchGeminiRealtimeToken(): Promise<GeminiToken> {
  const token = getSubscriptionToken(inngest, {
    channel: geminiChannel(),
    topics: ["status"],
  });

  return token;
}

export { fetchGeminiRealtimeToken };
