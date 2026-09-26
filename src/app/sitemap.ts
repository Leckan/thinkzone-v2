import type { MetadataRoute } from "next";
import { products, solutions } from "@/lib/content";

const origin = "https://thinkzone.tech";
export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/about", "/solutions", "/products", "/ai-lab", "/industries", "/work", "/insights", "/assessment", "/contact"];
  return [
    ...pages.map((path) => ({ url: `${origin}${path}`, changeFrequency: "monthly" as const, priority: path === "" ? 1 : 0.7 })),
    ...products.map(({ slug }) => ({ url: `${origin}/products/${slug}`, changeFrequency: "monthly" as const, priority: 0.6 })),
    ...solutions.map(({ slug }) => ({ url: `${origin}/solutions/${slug}`, changeFrequency: "monthly" as const, priority: 0.6 })),
  ];
}
