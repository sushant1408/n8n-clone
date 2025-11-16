import { channel, topic } from "@inngest/realtime";

const GOOGLE_FORM_TRIGGER_CHANNEL_NAME = "google-form-trigger-execution";

const googleFormTriggerChannel = channel(GOOGLE_FORM_TRIGGER_CHANNEL_NAME).addTopic(
  topic("status").type<{
    nodeId: string;
    status: "loading" | "success" | "error";
  }>()
);

export { googleFormTriggerChannel, GOOGLE_FORM_TRIGGER_CHANNEL_NAME };
