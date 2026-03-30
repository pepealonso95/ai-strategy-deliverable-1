import OpenAI from "openai";
import { getEnv } from "@/src/lib/env";

let client: OpenAI | null = null;

export function getOpenAIClient() {
  if (!client) {
    const env = getEnv();
    if (!env.OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY is required for live model execution.");
    }

    client = new OpenAI({
      apiKey: env.OPENAI_API_KEY,
    });
  }

  return client;
}
