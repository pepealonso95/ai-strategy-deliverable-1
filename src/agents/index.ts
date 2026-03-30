import { hasOpenAIKey, usingFixtureMode } from "@/src/lib/env";
import { MockAgentRuntime } from "@/src/agents/mock-runtime";
import { OpenAIAgentRuntime } from "@/src/agents/runtime";

export function createAgentRuntime() {
  if (usingFixtureMode() || !hasOpenAIKey()) {
    return new MockAgentRuntime();
  }

  return new OpenAIAgentRuntime();
}
