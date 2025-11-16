import { channel, topic } from "@inngest/realtime";

const ANTHROPIC_CHANNEL_NAME = "anthropic-execution";

const anthropicChannel = channel(ANTHROPIC_CHANNEL_NAME).addTopic(
  topic("status").type<{
    nodeId: string;
    status: "loading" | "success" | "error";
  }>()
);

export { anthropicChannel, ANTHROPIC_CHANNEL_NAME };
