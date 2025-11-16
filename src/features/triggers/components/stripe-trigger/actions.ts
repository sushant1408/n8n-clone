"use server";

import type { Realtime } from "@inngest/realtime";
import { getSubscriptionToken } from "@inngest/realtime";

import { stripeTriggerChannel } from "@/inngest/channels/stripe-trigger";
import { inngest } from "@/inngest/client";

export type StripeTriggerToken = Realtime.Token<
  typeof stripeTriggerChannel,
  ["status"]
>;

async function fetchStripeTriggerRealtimeToken(): Promise<StripeTriggerToken> {
  const token = getSubscriptionToken(inngest, {
    channel: stripeTriggerChannel(),
    topics: ["status"],
  });

  return token;
}

export { fetchStripeTriggerRealtimeToken };
