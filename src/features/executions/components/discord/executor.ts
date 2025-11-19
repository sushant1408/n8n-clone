import Handlebars from "handlebars";
import { decode } from "html-entities";
import { NonRetriableError } from "inngest";
import ky from "ky";

import type { NodeExecutor } from "@/features/executions/types";
import { discordChannel } from "@/inngest/channels/discord";

Handlebars.registerHelper("json", (context) => {
  const stringified = JSON.stringify(context, null, 2);
  const safeString = new Handlebars.SafeString(stringified);

  return safeString;
});

type DiscordData = {
  variableName?: string;
  username?: string;
  webhookUrl?: string;
  content?: string;
};

const discordExecutor: NodeExecutor<DiscordData> = async ({
  data,
  nodeId,
  context,
  step,
  publish,
}) => {
  await publish(discordChannel().status({ nodeId, status: "loading" }));

  const rawContent = Handlebars.compile(data.content)(context);
  const content = decode(rawContent);

  const username = data.username
    ? decode(Handlebars.compile(data.username)(context))
    : undefined;

  try {
    const result = await step.run("discord-webhook", async () => {
      if (!data.variableName) {
        await publish(discordChannel().status({ nodeId, status: "error" }));
        throw new NonRetriableError(
          "Discord node: variable name not configured"
        );
      }

      if (!data.content) {
        await publish(discordChannel().status({ nodeId, status: "error" }));
        throw new NonRetriableError(
          "Discord node: Message content is required"
        );
      }

      if (!data.webhookUrl) {
        await publish(discordChannel().status({ nodeId, status: "error" }));
        throw new NonRetriableError("Discord node: Webhook URL is required");
      }

      await ky.post(data.webhookUrl, {
        json: {
          content: content.slice(0, 2000),
          username,
        },
      });

      return {
        ...context,
        [data.variableName]: {
          messageSent: true,
          messageContent: content.slice(0, 2000),
        },
      };
    });

    await publish(discordChannel().status({ nodeId, status: "success" }));

    return result;
  } catch (error) {
    await publish(discordChannel().status({ nodeId, status: "error" }));
    throw error;
  }
};

export { discordExecutor };
