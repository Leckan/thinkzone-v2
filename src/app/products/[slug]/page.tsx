import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PageShell } from "@/components/site-shell";
import { DealAnalyzerDemo } from "@/components/deal-analyzer-demo";
import { products } from "@/lib/content";

export function generateStaticParams() { return products.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params; const product = products.find((entry) => entry.slug === slug);
  return product ? { title: product.name, description: product.summary, alternates: { canonical: `/products/${product.slug}` } } : {};
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const product = products.find((entry) => entry.slug === slug); if (!product) notFound();
  return <PageShell><main className="detail-page"><div className="breadcrumb"><Link href="/products">Products</Link><span>/</span>{product.name}</div><section className="detail-hero"><div className="detail-copy"><div className="section-kicker"><span>PRODUCT / {product.status.toUpperCase()}</span></div><h1>{product.name.split(" ").slice(0, -1).join(" ")}<br /><span>{product.name.split(" ").slice(-1)}</span></h1><p className="detail-lede">{product.description}</p><Link className="button button-dark" href={`/contact?product=${product.slug}`}>Talk with us about this product <span className="arrow">↗</span></Link></div><div className={`detail-art ${product.color}`}><span className="detail-art-index">THINK ZONE / PRODUCT STUDY</span><span className="detail-art-core">{product.name.startsWith("Real") ? "↗" : product.name.startsWith("AI Space") ? "⌘" : product.name.startsWith("AI Fix") ? "⌂" : "✳"}</span><span className="detail-art-foot">{product.category.toUpperCase()}</span></div></section>{product.slug === "real-estate-deal-analyzer" && <DealAnalyzerDemo />}<section className="detail-content"><div><div className="section-kicker"><span>THE OPPORTUNITY</span></div><h2>{product.summary}</h2><p>We are developing this product around a clear user need, with careful attention to the details that make AI useful in day-to-day work. Product status reflects its current stage of exploration.</p></div><div className="detail-side"><div className="section-kicker"><span>IN FOCUS</span></div>{product.capabilities.map((item, i) => <div className="capability" key={item}><span>0{i + 1}</span>{item}</div>)}<div className="audience-note"><span>DESIGNED FOR</span><p>{product.audience}</p></div></div></section><section className="detail-next"><div><span>MORE FROM THE PORTFOLIO</span><h2>Explore the other<br />products in motion.</h2></div><Link className="button button-dark" href="/products">View all products <span className="arrow">↗</span></Link></section></main></PageShell>;
}
