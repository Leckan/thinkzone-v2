import { z } from "zod";
import { AIConfigurationError, getAIProvider, type AssistantTurn } from "@/lib/ai/provider";
import { readJsonBody } from "@/lib/http/read-json-body";
import { checkRequestRateLimit } from "@/lib/http/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const turnSchema = z.object({ role: z.enum(["user", "assistant"]), content: z.string().trim().min(1).max(1800) });
const requestSchema = z.object({ turns: z.array(turnSchema).min(1).max(8) });
const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 8;

export async function GET() {
  return Response.json({ enabled: Boolean(process.env.OPENAI_API_KEY && process.env.OPENAI_MODEL && (process.env.AI_PROVIDER ?? "openai") === "openai") });
}

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) return Response.json({ error: "Request origin could not be verified." }, { status: 403 });
  const body = await readJsonBody(request, 16_000);
  if (!body.ok) return Response.json({ error: body.status === 413 ? "Request is too large." : "Please send a valid message." }, { status: body.status });
  const parsed = requestSchema.safeParse(body.value);
  if (!parsed.success || parsed.data.turns.at(-1)?.role !== "user") return Response.json({ error: "Please send a valid message." }, { status: 400 });

  const limit = checkRequestRateLimit(request, { namespace: "assistant", maxRequests: MAX_REQUESTS, windowMs: WINDOW_MS });
  if (!limit.allowed) {
    return Response.json({ error: "You've sent several messages recently. Please try again in a few minutes." }, { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } });
  }

  try {
    const provider = await getAIProvider();
    const reply = await provider.respond(parsed.data.turns as AssistantTurn[]);
    return Response.json({ reply });
  } catch (error) {
    if (error instanceof AIConfigurationError) return Response.json({ error: "The Think Zone assistant is not configured yet. Please contact us directly." }, { status: 503 });
    console.error("Think Zone assistant request failed.");
    return Response.json({ error: "The assistant is temporarily unavailable. Please try again or contact info@contact.thinkzone.tech." }, { status: 502 });
  }
}
