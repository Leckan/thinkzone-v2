import { z } from "zod";
import { AIConfigurationError, getAIProvider, type AssistantTurn } from "@/lib/ai/provider";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const turnSchema = z.object({ role: z.enum(["user", "assistant"]), content: z.string().trim().min(1).max(1800) });
const requestSchema = z.object({ turns: z.array(turnSchema).min(1).max(8) });
type RateBucket = { count: number; resetAt: number };
const globalForRateLimit = globalThis as typeof globalThis & { thinkZoneAIRequests?: Map<string, RateBucket> };
const requestBuckets = globalForRateLimit.thinkZoneAIRequests ??= new Map();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 8;

export async function GET() {
  return Response.json({ enabled: Boolean(process.env.OPENAI_API_KEY && process.env.OPENAI_MODEL && (process.env.AI_PROVIDER ?? "openai") === "openai") });
}

function requestKey(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || request.headers.get("x-real-ip") || "unknown";
}

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) return Response.json({ error: "Request origin could not be verified." }, { status: 403 });
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > 16_000) return Response.json({ error: "Request is too large." }, { status: 413 });

  let body: unknown;
  try { body = await request.json(); } catch { return Response.json({ error: "Please send a valid message." }, { status: 400 }); }
  const parsed = requestSchema.safeParse(body);
  if (!parsed.success || parsed.data.turns.at(-1)?.role !== "user") return Response.json({ error: "Please send a valid message." }, { status: 400 });

  const now = Date.now();
  for (const [key, bucket] of requestBuckets) if (bucket.resetAt <= now) requestBuckets.delete(key);
  const key = requestKey(request);
  const bucket = requestBuckets.get(key);
  if (bucket && bucket.count >= MAX_REQUESTS && bucket.resetAt > now) {
    return Response.json({ error: "You've sent several messages recently. Please try again in a few minutes." }, { status: 429, headers: { "Retry-After": String(Math.ceil((bucket.resetAt - now) / 1000)) } });
  }
  requestBuckets.set(key, bucket && bucket.resetAt > now ? { ...bucket, count: bucket.count + 1 } : { count: 1, resetAt: now + WINDOW_MS });

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
