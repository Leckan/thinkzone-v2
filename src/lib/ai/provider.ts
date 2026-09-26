import type { OpportunityAssessment } from "@/lib/assessment";

export type AssistantTurn = { role: "user" | "assistant"; content: string };

export interface AIProvider {
  respond(turns: AssistantTurn[]): Promise<string>;
  assess(input: OpportunityAssessment): Promise<string>;
}

export class AIConfigurationError extends Error {}

export async function getAIProvider(): Promise<AIProvider> {
  const provider = process.env.AI_PROVIDER ?? "openai";
  if (provider !== "openai") throw new AIConfigurationError(`Unsupported AI_PROVIDER: ${provider}`);
  if (!process.env.OPENAI_API_KEY) throw new AIConfigurationError("OPENAI_API_KEY is not configured.");
  if (!process.env.OPENAI_MODEL) throw new AIConfigurationError("OPENAI_MODEL is not configured.");

  const { OpenAIProvider } = await import("./providers/openai");
  return new OpenAIProvider(process.env.OPENAI_API_KEY, process.env.OPENAI_MODEL);
}
