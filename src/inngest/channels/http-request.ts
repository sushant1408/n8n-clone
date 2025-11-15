import { channel, topic } from "@inngest/realtime";

const HTTP_REQUEST_CHANNEL_NAME = "http-request-execution";

const httpRequestChannel = channel(HTTP_REQUEST_CHANNEL_NAME).addTopic(
  topic("status").type<{
    nodeId: string;
    status: "loading" | "success" | "error";
  }>()
);

export { httpRequestChannel, HTTP_REQUEST_CHANNEL_NAME };
