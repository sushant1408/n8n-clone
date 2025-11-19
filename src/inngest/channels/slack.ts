import { channel, topic } from "@inngest/realtime";

const SLACK_CHANNEL_NAME = "slack-execution";

const slackChannel = channel(SLACK_CHANNEL_NAME).addTopic(
  topic("status").type<{
    nodeId: string;
    status: "loading" | "success" | "error";
  }>()
);

export { slackChannel, SLACK_CHANNEL_NAME };
