import { defineField, defineType } from "sanity";

export const caseStudy = defineType({
  name: "caseStudy",
  title: "Work entry",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (rule) => rule.required().max(120) }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "title", maxLength: 96 }, validation: (rule) => rule.required() }),
    defineField({ name: "type", title: "Work type", type: "string", options: { list: ["Venture product", "Client work", "R&D"] }, validation: (rule) => rule.required() }),
    defineField({ name: "status", title: "Status", type: "string", options: { list: ["Exploration", "In progress", "Published"] }, initialValue: "Exploration", validation: (rule) => rule.required() }),
    defineField({ name: "industry", title: "Industry", type: "string" }),
    defineField({ name: "summary", title: "Summary", type: "text", rows: 3, validation: (rule) => rule.required().max(280) }),
    defineField({ name: "challenge", title: "The problem", type: "text", rows: 4 }),
    defineField({ name: "approach", title: "Our approach", type: "array", of: [{ type: "block" }] }),
    defineField({ name: "outcome", title: "Outcome / learning", type: "text", rows: 4, description: "Only add outcomes that are approved for public use and supported by evidence." }),
    defineField({ name: "publishedAt", title: "Publish date", type: "datetime" }),
  ],
  preview: { select: { title: "title", subtitle: "type" } },
});
