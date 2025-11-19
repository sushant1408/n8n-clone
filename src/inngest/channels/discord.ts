import { channel, topic } from "@inngest/realtime";

const DISCORD_CHANNEL_NAME = "discord-execution";

const discordChannel = channel(DISCORD_CHANNEL_NAME).addTopic(
  topic("status").type<{
    nodeId: string;
    status: "loading" | "success" | "error";
  }>()
);

export { discordChannel, DISCORD_CHANNEL_NAME };
