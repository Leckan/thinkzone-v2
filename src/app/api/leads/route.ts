import { Resend } from "resend";
import { z } from "zod";
import { getDb } from "@/db";
import { leads } from "@/db/schema";
import { readJsonBody } from "@/lib/http/read-json-body";
import { checkRequestRateLimit } from "@/lib/http/rate-limit";

export const runtime = "nodejs";

const leadInput = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(320),
  company: z.string().trim().max(160).optional().default(""),
  interest: z.enum(["AI opportunity", "AI product", "Automation & agents", "Data & engineering", "Think Zone product", "Other"]),
  message: z.string().trim().min(20).max(4000),
  website: z.string().max(300).optional().default(""),
});

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) {
    return Response.json({ error: "Request origin could not be verified." }, { status: 403 });
  }

  const body = await readJsonBody(request, 12_000);
  if (!body.ok) return Response.json({ error: body.status === 413 ? "Request is too large." : "Please submit a valid form." }, { status: body.status });
  const parsed = leadInput.safeParse(body.value);
  if (!parsed.success) return Response.json({ error: "Please check the required fields and try again." }, { status: 400 });
  if (parsed.data.website) return Response.json({ ok: true }, { status: 201 });

  const limit = checkRequestRateLimit(request, { namespace: "leads", maxRequests: 5, windowMs: 15 * 60 * 1000 });
  if (!limit.allowed) {
    return Response.json({ error: "Several inquiries were submitted recently. Please try again later." }, { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } });
  }

  const hasDatabase = Boolean(process.env.DATABASE_URL);
  const hasEmail = Boolean(process.env.RESEND_API_KEY && process.env.RESEND_FROM);
  if (!hasDatabase && !hasEmail) {
    return Response.json({ error: "The contact form is not configured yet. Please email info@contact.thinkzone.tech." }, { status: 503 });
  }

  let stored = false;
  let notified = false;
  if (hasDatabase) {
    try {
      await getDb().insert(leads).values({
        name: parsed.data.name,
        email: parsed.data.email,
        company: parsed.data.company || null,
        interest: parsed.data.interest,
        message: parsed.data.message,
      });
      stored = true;
    } catch {
      console.error("Lead database write failed.");
    }
  }

  if (hasEmail) {
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const { error } = await resend.emails.send({
        from: process.env.RESEND_FROM!,
        to: (process.env.LEADS_TO ?? "info@contact.thinkzone.tech").split(",").map((email) => email.trim()),
        replyTo: parsed.data.email,
        subject: `Think Zone inquiry: ${parsed.data.interest}`,
        text: `Name: ${parsed.data.name}\nEmail: ${parsed.data.email}\nCompany: ${parsed.data.company || "Not provided"}\nInterest: ${parsed.data.interest}\n\n${parsed.data.message}`,
      });
      notified = !error;
      if (error) console.error("Lead notification delivery failed.");
    } catch {
      console.error("Lead notification request failed.");
    }
  }

  if (stored || notified) return Response.json({ ok: true }, { status: 201 });
  return Response.json({ error: "We couldn't deliver your message. Please email info@contact.thinkzone.tech." }, { status: 502 });
}
