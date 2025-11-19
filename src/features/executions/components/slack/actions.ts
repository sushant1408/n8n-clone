"use server";

import type { Realtime } from "@inngest/realtime";
import { getSubscriptionToken } from "@inngest/realtime";

import { slackChannel } from "@/inngest/channels/slack";
import { inngest } from "@/inngest/client";

export type SlackToken = Realtime.Token<typeof slackChannel, ["status"]>;

async function fetchSlackRealtimeToken(): Promise<SlackToken> {
  const token = getSubscriptionToken(inngest, {
    channel: slackChannel(),
    topics: ["status"],
  });

  return token;
}

export { fetchSlackRealtimeToken };
