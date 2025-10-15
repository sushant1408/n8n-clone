// import { createAnthropic } from "@ai-sdk/anthropic";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
// import { createOpenAI } from "@ai-sdk/openai";
import { generateText } from "ai";

import { inngest } from "@/inngest/client";

// const anthropic = createAnthropic();
const google = createGoogleGenerativeAI();
// const openai = createOpenAI();

export const execute = inngest.createFunction(
  { id: "execute" },
  { event: "execute/ai" },
  async ({ event, step }) => {
    const { steps: geminiSteps } = await step.ai.wrap(
      "gemini-generate-text",
      generateText,
      {
        model: google("gemini-2.5-flash"),
        system: "You are a helpful assistant",
        prompt: "What is 2 + 2?",
      }
    );
    // const { steps: openaiSteps } = await step.ai.wrap(
    //   "openai-generate-text",
    //   generateText,
    //   {
    //     model: openai("gpt-4o"),
    //     system: "You are a helpful assistant",
    //     prompt: "What is 2 + 2?",
    //   }
    // );
    // const { steps: anthropicSteps } = await step.ai.wrap(
    //   "anthropic-generate-text",
    //   generateText,
    //   {
    //     model: anthropic("claude-sonnet-4-5"),
    //     system: "You are a helpful assistant",
    //     prompt: "What is 2 + 2?",
    //   }
    // );

    return { geminiSteps };
  }
);
