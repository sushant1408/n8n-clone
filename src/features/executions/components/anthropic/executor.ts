import { createAnthropic } from "@ai-sdk/anthropic";
import { generateText } from "ai";
import Handlebars from "handlebars";
import { NonRetriableError } from "inngest";

import type { NodeExecutor } from "@/features/executions/types";
import type { Credential } from "@/generated/prisma";
import { anthropicChannel } from "@/inngest/channels/anthropic";
import prisma from "@/lib/db";
import { decrypt } from "@/lib/encryption";
import type { AVAILABLE_MODELS } from "./dialog";

Handlebars.registerHelper("json", (context) => {
  const stringified = JSON.stringify(context, null, 2);
  const safeString = new Handlebars.SafeString(stringified);

  return safeString;
});

type AnthropicData = {
  variableName?: string;
  credentialId?: Credential["id"];
  model?: (typeof AVAILABLE_MODELS)[number];
  systemPrompt?: string;
  userPrompt?: string;
};

const anthropicExecutor: NodeExecutor<AnthropicData> = async ({
  data,
  nodeId,
  context,
  step,
  publish,
  userId,
}) => {
  await publish(anthropicChannel().status({ nodeId, status: "loading" }));

  if (!data.model) {
    await publish(anthropicChannel().status({ nodeId, status: "error" }));
    throw new NonRetriableError("Anthropic node: no model selected");
  }

  if (!data.variableName) {
    await publish(anthropicChannel().status({ nodeId, status: "error" }));
    throw new NonRetriableError("Anthropic node: variable name not configured");
  }

  if (!data.userPrompt) {
    await publish(anthropicChannel().status({ nodeId, status: "error" }));
    throw new NonRetriableError("Anthropic node: userPrompt is missing");
  }

  if (!data.credentialId) {
    await publish(anthropicChannel().status({ nodeId, status: "error" }));
    throw new NonRetriableError("Anthropic node: credential is missing");
  }

  const systemPrompt = data.systemPrompt
    ? Handlebars.compile(data.systemPrompt)(context)
    : "You are a helpful assistant";
  const userPrompt = Handlebars.compile(data.userPrompt)(context);

  const credential = await step.run("get-credential", () => {
    return prisma.credential.findUnique({
      where: { id: data.credentialId, userId },
    });
  });

  if (!credential) {
    await publish(anthropicChannel().status({ nodeId, status: "error" }));
    throw new NonRetriableError("Anthropic node: credential not found");
  }

  const anthropic = createAnthropic({
    apiKey: decrypt(credential.value),
  });

  try {
    const { steps } = await step.ai.wrap(
      "anthropic-generate-text",
      generateText,
      {
        model: anthropic(data.model),
        system: systemPrompt,
        prompt: userPrompt,
        experimental_telemetry: {
          isEnabled: true,
          recordInputs: true,
          recordOutputs: true,
        },
      }
    );

    const text =
      steps[0].content[0].type === "text" ? steps[0].content[0].text : "";

    await publish(anthropicChannel().status({ nodeId, status: "success" }));

    return {
      ...context,
      [data.variableName]: {
        aiResponse: text,
      },
    };
  } catch (error) {
    await publish(anthropicChannel().status({ nodeId, status: "error" }));
    throw error;
  }
};

export { anthropicExecutor };
