import Link from "next/link";
import type { Metadata } from "next";
import { PageHero, PageShell, SectionIntro } from "@/components/site-shell";
import { getInsights } from "@/sanity/lib/content";

export const metadata: Metadata = { title: "Insights", description: "Notes and perspectives on building useful AI products, agents, and automation.", alternates: { canonical: "/insights" } };

export default async function InsightsPage() {
  const notes = await getInsights();
  return <PageShell><main><PageHero eyebrow="INSIGHTS / THINKING IN PUBLIC" title="Notes from the" highlight="work of building." description="Ideas, observations, and practical lessons from exploring AI products and intelligent systems. These short notes are the beginning of a growing publication." action="See what we build" href="/products"/><section className="inner-section"><SectionIntro eyebrow="FIELD NOTES" title={<>Ideas get better<br />when they&apos;re <span>shared.</span></>} copy="A few starting thoughts from the work. More writing will follow as our products and experiments develop."/><div className="insights-grid">{notes.map((note, i) => <article className="insight-card" key={note.slug}><div className="insight-card-art"><span>THINK ZONE / NOTE 0{i + 1}</span><b>{["↗", "◎", "✳", "⌂"][i % 4]}</b><small>{note.category.toUpperCase()}</small></div><div className="insight-info"><span>{note.category.toUpperCase()}</span><h3>{note.title}</h3><p>{note.excerpt}</p><Link className="insight-link" href={`/insights/${note.slug}`}>Read field note <span>↗</span></Link></div></article>)}</div><p className="work-disclaimer">Notes are editorial perspectives, not guarantees of business, investment, or technical outcomes.</p></section><section className="simple-cta"><div className="section-kicker"><span>LET&apos;S THINK IT THROUGH</span></div><h2>Have a question<br />we should <span>explore?</span></h2><Link className="button button-dark" href="/contact">Get in touch <span className="arrow">↗</span></Link></section></main></PageShell>;
}
