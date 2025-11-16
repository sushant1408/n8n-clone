import { channel, topic } from "@inngest/realtime";

const STRIPE_TRIGGER_CHANNEL_NAME = "stripe-trigger-execution";

const stripeTriggerChannel = channel(STRIPE_TRIGGER_CHANNEL_NAME).addTopic(
  topic("status").type<{
    nodeId: string;
    status: "loading" | "success" | "error";
  }>()
);

export { stripeTriggerChannel, STRIPE_TRIGGER_CHANNEL_NAME };
