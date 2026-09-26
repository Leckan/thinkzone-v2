import { defineQuery } from "next-sanity";
import { getSanityClient } from "./client";

export type TextBlock = { _key?: string; _type: string; style?: string; children?: { _key?: string; text?: string }[] };
export type InsightEntry = { slug: string; title: string; category: string; excerpt: string; publishedAt?: string; body?: TextBlock[] };
export type WorkEntry = { slug: string; title: string; type: string; status: string; summary: string; industry?: string; challenge?: string; approach?: TextBlock[]; outcome?: string };

export const INSIGHTS_QUERY = defineQuery(`*[_type == "insight" && defined(slug.current) && publishedAt <= now()] | order(publishedAt desc)[0...24]{
  "slug": slug.current, title, category, "excerpt": coalesce(excerpt, ""), publishedAt
}`);

export const WORK_QUERY = defineQuery(`*[_type == "caseStudy" && defined(slug.current)] | order(publishedAt desc)[0...24]{
  "slug": slug.current, title, "type": coalesce(type, "R&D"), "status": coalesce(status, "Exploration"), "summary": coalesce(summary, ""), industry
}`);
export const INSIGHT_DETAIL_QUERY = defineQuery(`*[_type == "insight" && slug.current == $slug && publishedAt <= now()][0]{
  "slug": slug.current, title, category, "excerpt": coalesce(excerpt, ""), publishedAt, body[]{..., children[]{_key, text}}
}`);
export const WORK_DETAIL_QUERY = defineQuery(`*[_type == "caseStudy" && slug.current == $slug][0]{
  "slug": slug.current, title, "type": coalesce(type, "R&D"), "status": coalesce(status, "Exploration"), "summary": coalesce(summary, ""), industry, challenge, outcome, approach[]{..., children[]{_key, text}}
}`);

export const fallbackInsights: InsightEntry[] = [
  { slug: "start-with-the-work", category: "Product", title: "Start with the work, not the model", excerpt: "A useful AI product begins by understanding the decision or task people need help with.", body: [{ _type: "block", style: "normal", children: [{ text: "Before choosing a model, understand the work around the opportunity: who is doing it, where information comes from, what makes it difficult, and how people know they have reached a good result." }] }] },
  { slug: "automation-respects-exceptions", category: "Operations", title: "Good automation respects the exceptions", excerpt: "The strongest workflows account for review, recovery, and the moments when the process changes.", body: [{ _type: "block", style: "normal", children: [{ text: "A process map that only describes the happy path misses a large part of the work. Useful automation makes exceptions visible and gives people a clear way to review, correct, and recover." }] }] },
  { slug: "experiments-are-questions", category: "Venture Studio", title: "An experiment is a question made tangible", excerpt: "A prototype is valuable when it helps a team learn something specific about a problem.", body: [{ _type: "block", style: "normal", children: [{ text: "A focused experiment gives a team something concrete to react to. The goal is not polish for its own sake, but a clearer answer to a question that matters to the product." }] }] },
  { slug: "investment-assumptions", category: "Real Estate", title: "Investment assumptions deserve a clear home", excerpt: "Making assumptions visible is a small step toward more confident property decisions.", body: [{ _type: "block", style: "normal", children: [{ text: "Property decisions bring together many assumptions. Keeping them visible helps investors understand what a scenario includes, what remains uncertain, and which inputs might change the result." }] }] },
];

export const fallbackWork: WorkEntry[] = [
  { slug: "real-estate-deal-analysis", type: "Venture product", title: "Real estate deal analysis", status: "Product exploration", summary: "A focused AI product concept for helping property investors reason about deal assumptions.", challenge: "Property investment decisions involve many inputs and assumptions that can be difficult to keep visible and compare consistently.", outcome: "This exploration is shaping the Real Estate Deal Analyzer product direction." },
  { slug: "ai-space-redesign", type: "Venture product", title: "AI-assisted space redesign", status: "Prototype direction", summary: "Exploring how image generation can help people visualize possibilities for a property.", challenge: "It can be difficult for people to imagine how an unfamiliar or dated space might look after a redesign.", outcome: "This exploration informed the early direction for AI Space Revamp." },
  { slug: "applied-agent-systems", type: "R&D", title: "Applied agent systems", status: "Ongoing research", summary: "Experiments in agents that combine retrieval, tools, and structured workflows to get useful work done.", challenge: "Open-ended AI systems can struggle to complete operational tasks predictably without structure and oversight.", outcome: "Research continues into bounded tasks, clear tool use, and appropriate human review." },
];

export async function getInsights(): Promise<InsightEntry[]> {
  const client = getSanityClient();
  if (!client) return fallbackInsights;
  try {
    const entries = await client.fetch<InsightEntry[]>(INSIGHTS_QUERY, {}, { next: { revalidate: 300 } });
    return entries.length ? entries : fallbackInsights;
  } catch {
    console.error("Sanity insights query failed; using fallback content.");
    return fallbackInsights;
  }
}

export async function getWorkEntries(): Promise<WorkEntry[]> {
  const client = getSanityClient();
  if (!client) return fallbackWork;
  try {
    const entries = await client.fetch<WorkEntry[]>(WORK_QUERY, {}, { next: { revalidate: 300 } });
    return entries.length ? entries : fallbackWork;
  } catch {
    console.error("Sanity work query failed; using fallback content.");
    return fallbackWork;
  }
}

export async function getInsight(slug: string): Promise<InsightEntry | null> {
  const client = getSanityClient();
  if (!client) return fallbackInsights.find((entry) => entry.slug === slug) ?? null;
  try {
    return await client.fetch<InsightEntry | null>(INSIGHT_DETAIL_QUERY, { slug }, { next: { revalidate: 300 } }) ?? fallbackInsights.find((entry) => entry.slug === slug) ?? null;
  } catch {
    console.error("Sanity insight query failed; using fallback content.");
    return fallbackInsights.find((entry) => entry.slug === slug) ?? null;
  }
}

export async function getWorkEntry(slug: string): Promise<WorkEntry | null> {
  const client = getSanityClient();
  if (!client) return fallbackWork.find((entry) => entry.slug === slug) ?? null;
  try {
    return await client.fetch<WorkEntry | null>(WORK_DETAIL_QUERY, { slug }, { next: { revalidate: 300 } }) ?? fallbackWork.find((entry) => entry.slug === slug) ?? null;
  } catch {
    console.error("Sanity work item query failed; using fallback content.");
    return fallbackWork.find((entry) => entry.slug === slug) ?? null;
  }
}
