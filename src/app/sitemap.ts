import type { MetadataRoute } from "next";
import { products, solutions } from "@/lib/content";
import { getInsights, getWorkEntries } from "@/sanity/lib/content";

const origin = "https://thinkzone.tech";
export const revalidate = 300;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [insights, work] = await Promise.all([getInsights(), getWorkEntries()]);
  const pages = ["", "/about", "/solutions", "/products", "/ai-lab", "/industries", "/work", "/insights", "/assessment", "/contact"];
  return [
    ...pages.map((path) => ({ url: `${origin}${path}`, changeFrequency: "monthly" as const, priority: path === "" ? 1 : 0.7 })),
    ...products.map(({ slug }) => ({ url: `${origin}/products/${slug}`, changeFrequency: "monthly" as const, priority: 0.6 })),
    ...solutions.map(({ slug }) => ({ url: `${origin}/solutions/${slug}`, changeFrequency: "monthly" as const, priority: 0.6 })),
    ...insights.map(({ slug, publishedAt }) => ({ url: `${origin}/insights/${encodeURIComponent(slug)}`, ...(publishedAt ? { lastModified: new Date(publishedAt) } : {}), changeFrequency: "monthly" as const, priority: 0.5 })),
    ...work.map(({ slug }) => ({ url: `${origin}/work/${encodeURIComponent(slug)}`, changeFrequency: "monthly" as const, priority: 0.5 })),
  ];
}
