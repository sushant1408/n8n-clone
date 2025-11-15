import { channel, topic } from "@inngest/realtime";

const MANUAL_TRIGGER_CHANNEL_NAME = "manual-trigger-execution";

const manualTriggerChannel = channel(MANUAL_TRIGGER_CHANNEL_NAME).addTopic(
  topic("status").type<{
    nodeId: string;
    status: "loading" | "success" | "error";
  }>()
);

export { manualTriggerChannel, MANUAL_TRIGGER_CHANNEL_NAME };
