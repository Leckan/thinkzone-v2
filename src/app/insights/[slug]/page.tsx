import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PageShell } from "@/components/site-shell";
import { PortableContent } from "@/components/portable-content";
import { fallbackInsights, getInsight } from "@/sanity/lib/content";

export function generateStaticParams() { return fallbackInsights.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params; const note = await getInsight(slug);
  return note ? { title: note.title, description: note.excerpt, alternates: { canonical: `/insights/${note.slug}` } } : {};
}

export default async function InsightPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const note = await getInsight(slug); if (!note) notFound();
  return <PageShell><main className="editorial-page"><div className="breadcrumb"><Link href="/insights">Insights</Link><span>/</span>{note.category}</div><article><div className="section-kicker"><span>FIELD NOTE / {note.category.toUpperCase()}</span></div><h1>{note.title}</h1><p className="editorial-lede">{note.excerpt}</p>{note.publishedAt && <p className="editorial-date">{new Intl.DateTimeFormat("en", { dateStyle: "long" }).format(new Date(note.publishedAt))}</p>}<div className="editorial-rule"/><PortableContent blocks={note.body}/><p className="editorial-disclaimer">A Think Zone field note. Editorial perspectives are not guarantees of business, investment, or technical outcomes.</p></article><div className="editorial-back"><Link className="text-link" href="/insights">← Back to insights</Link><Link className="button button-dark" href="/contact">Continue the conversation <span className="arrow">↗</span></Link></div></main></PageShell>;
}
