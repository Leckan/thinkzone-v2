import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PageShell } from "@/components/site-shell";
import { PortableContent } from "@/components/portable-content";
import { fallbackWork, getWorkEntry } from "@/sanity/lib/content";

export function generateStaticParams() { return fallbackWork.map(({ slug }) => ({ slug })); }
export const dynamicParams = true;
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params; const entry = await getWorkEntry(slug);
  return entry ? { title: entry.title, description: entry.summary, alternates: { canonical: `/work/${entry.slug}` } } : {};
}

export default async function WorkDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const entry = await getWorkEntry(slug); if (!entry) notFound();
  return <PageShell><main className="editorial-page"><div className="breadcrumb"><Link href="/work">Work</Link><span>/</span>{entry.type}</div><article><div className="section-kicker"><span>THINK ZONE / {entry.type.toUpperCase()} / {entry.status.toUpperCase()}</span></div><h1>{entry.title}</h1><p className="editorial-lede">{entry.summary}</p>{entry.industry && <p className="editorial-date">{entry.industry}</p>}<div className="editorial-rule"/>{entry.challenge && <section className="editorial-section"><div className="section-kicker"><span>THE OPPORTUNITY</span></div><h2>The challenge</h2><p>{entry.challenge}</p></section>}{entry.approach && <section className="editorial-section"><div className="section-kicker"><span>THINK ZONE / APPROACH</span></div><h2>How we explored it</h2><PortableContent blocks={entry.approach}/></section>}{entry.outcome && <section className="editorial-section"><div className="section-kicker"><span>LEARNING</span></div><h2>What we learned</h2><p>{entry.outcome}</p></section>}<p className="editorial-disclaimer">This entry describes Think Zone product and research work. No client results or performance claims are implied.</p></article><div className="editorial-back"><Link className="text-link" href="/work">← Back to work</Link><Link className="button button-dark" href="/contact">Build with Think Zone <span className="arrow">↗</span></Link></div></main></PageShell>;
}
