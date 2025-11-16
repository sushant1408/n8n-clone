import { channel, topic } from "@inngest/realtime";

const GEMINI_CHANNEL_NAME = "gemini-execution";

const geminiChannel = channel(GEMINI_CHANNEL_NAME).addTopic(
  topic("status").type<{
    nodeId: string;
    status: "loading" | "success" | "error";
  }>()
);

export { geminiChannel, GEMINI_CHANNEL_NAME };
