import { createOpenAI } from "@ai-sdk/openai";
import { generateText } from "ai";
import Handlebars from "handlebars";
import { NonRetriableError } from "inngest";

import type { NodeExecutor } from "@/features/executions/types";
import type { Credential } from "@/generated/prisma";
import { openaiChannel } from "@/inngest/channels/openai";
import prisma from "@/lib/db";
import type { AVAILABLE_MODELS } from "./dialog";

Handlebars.registerHelper("json", (context) => {
  const stringified = JSON.stringify(context, null, 2);
  const safeString = new Handlebars.SafeString(stringified);

  return safeString;
});

type OpenAiData = {
  variableName?: string;
  credentialId?: Credential["id"];
  model?: (typeof AVAILABLE_MODELS)[number];
  systemPrompt?: string;
  userPrompt?: string;
};

const openAiExecutor: NodeExecutor<OpenAiData> = async ({
  data,
  nodeId,
  context,
  step,
  publish,
}) => {
  await publish(openaiChannel().status({ nodeId, status: "loading" }));

  if (!data.model) {
    await publish(openaiChannel().status({ nodeId, status: "error" }));
    throw new NonRetriableError("OpenAI node: no model selected");
  }

  if (!data.variableName) {
    await publish(openaiChannel().status({ nodeId, status: "error" }));
    throw new NonRetriableError("OpenAI node: variable name not configured");
  }

  if (!data.userPrompt) {
    await publish(openaiChannel().status({ nodeId, status: "error" }));
    throw new NonRetriableError("OpenAI node: userPrompt is missing");
  }

  if (!data.credentialId) {
    await publish(openaiChannel().status({ nodeId, status: "error" }));
    throw new NonRetriableError("OpenAI node: credential is missing");
  }

  const systemPrompt = data.systemPrompt
    ? Handlebars.compile(data.systemPrompt)(context)
    : "You are a helpful assistant";
  const userPrompt = Handlebars.compile(data.userPrompt)(context);

  const credential = await step.run("get-credential", () => {
    return prisma.credential.findUnique({ where: { id: data.credentialId } });
  });

  if (!credential) {
    await publish(openaiChannel().status({ nodeId, status: "error" }));
    throw new NonRetriableError("OpenAI node: credential not found");
  }

  const openai = createOpenAI({
    apiKey: credential.value,
  });

  try {
    const { steps } = await step.ai.wrap("openai-generate-text", generateText, {
      model: openai(data.model),
      system: systemPrompt,
      prompt: userPrompt,
      experimental_telemetry: {
        isEnabled: true,
        recordInputs: true,
        recordOutputs: true,
      },
    });

    const text =
      steps[0].content[0].type === "text" ? steps[0].content[0].text : "";

    await publish(openaiChannel().status({ nodeId, status: "success" }));

    return {
      ...context,
      [data.variableName]: {
        aiResponse: text,
      },
    };
  } catch (error) {
    await publish(openaiChannel().status({ nodeId, status: "error" }));
    throw error;
  }
};

export { openAiExecutor };
