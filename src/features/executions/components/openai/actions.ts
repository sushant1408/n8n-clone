"use server";

import type { Realtime } from "@inngest/realtime";
import { getSubscriptionToken } from "@inngest/realtime";

import { openaiChannel } from "@/inngest/channels/openai";
import { inngest } from "@/inngest/client";

export type OpenAiToken = Realtime.Token<typeof openaiChannel, ["status"]>;

async function fetchOpenAiRealtimeToken(): Promise<OpenAiToken> {
  const token = getSubscriptionToken(inngest, {
    channel: openaiChannel(),
    topics: ["status"],
  });

  return token;
}

export { fetchOpenAiRealtimeToken };
