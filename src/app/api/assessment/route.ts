import { z } from "zod";
import { assessmentQuestions } from "@/lib/assessment";
import { AIConfigurationError, getAIProvider } from "@/lib/ai/provider";
import { readJsonBody } from "@/lib/http/read-json-body";
import { checkRequestRateLimit } from "@/lib/http/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const assessmentSchema = z.object({
  opportunity: z.enum(assessmentQuestions[0].options),
  currentProcess: z.enum(assessmentQuestions[1].options),
  desiredOutcome: z.enum(assessmentQuestions[2].options),
});

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) {
    return Response.json({ error: "Request origin could not be verified." }, { status: 403 });
  }

  const body = await readJsonBody(request, 4_000);
  if (!body.ok) {
    return Response.json({ error: body.status === 413 ? "Request is too large." : "Please submit a valid assessment." }, { status: body.status });
  }

  const parsed = assessmentSchema.safeParse(body.value);
  if (!parsed.success) return Response.json({ error: "Please answer each question before generating your reflection." }, { status: 400 });

  const limit = checkRequestRateLimit(request, { namespace: "assessment", maxRequests: 3, windowMs: 15 * 60 * 1000 });
  if (!limit.allowed) {
    return Response.json({ error: "Several assessments were generated recently. Please try again later." }, { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } });
  }

  try {
    const provider = await getAIProvider();
    const reflection = await provider.assess(parsed.data);
    return Response.json({ reflection });
  } catch (error) {
    if (error instanceof AIConfigurationError) {
      return Response.json({ error: "The AI assessment is temporarily unavailable. Your on-page reflection is still available." }, { status: 503 });
    }
    console.error("Think Zone assessment request failed.");
    return Response.json({ error: "We couldn't generate the AI reflection right now. Your on-page reflection is still available." }, { status: 502 });
  }
}
