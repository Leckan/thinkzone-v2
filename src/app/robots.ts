import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/admin/" },
    sitemap: "https://thinkzone.tech/sitemap.xml",
    host: "https://thinkzone.tech",
  };
}
