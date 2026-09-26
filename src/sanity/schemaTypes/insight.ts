import { defineField, defineType } from "sanity";

export const insight = defineType({
  name: "insight",
  title: "Insight",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (rule) => rule.required().max(120) }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "title", maxLength: 96 }, validation: (rule) => rule.required() }),
    defineField({ name: "excerpt", title: "Excerpt", type: "text", rows: 3, validation: (rule) => rule.required().max(240) }),
    defineField({ name: "category", title: "Category", type: "string", options: { list: ["Product", "AI Engineering", "Operations", "Real Estate", "Venture Studio"] }, validation: (rule) => rule.required() }),
    defineField({ name: "publishedAt", title: "Publish date", type: "datetime", validation: (rule) => rule.required() }),
    defineField({ name: "body", title: "Article", type: "array", of: [{ type: "block" }] }),
  ],
  preview: { select: { title: "title", subtitle: "category" } },
});
