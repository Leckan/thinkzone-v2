import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";

const links = [
  ["Solutions", "/solutions"],
  ["Products", "/products"],
  ["AI Lab", "/ai-lab"],
  ["Industries", "/industries"],
  ["Work", "/work"],
  ["Insights", "/insights"],
  ["About", "/about"],
] as const;

export function SiteHeader() {
  return <><div className="announcement"><span className="announcement-dot" /> Independent AI venture studio <span className="announcement-divider">/</span> Building what comes next</div><header className="nav-wrap"><Link className="brand" href="/" aria-label="Think Zone home"><Image className="brand-logo" src="/brand/thinkzone-logo.svg" alt="Think Zone Technology" width={150} height={54} priority /></Link><nav className="main-nav" aria-label="Main navigation">{links.map(([name, href]) => <Link href={href} key={href}>{name}</Link>)}</nav><Link className="nav-cta" href="/contact">Build with us <span aria-hidden="true" className="arrow">↗</span></Link><details className="mobile-menu"><summary aria-label="Open navigation"><span /><span /></summary><nav aria-label="Mobile navigation">{links.map(([name, href]) => <Link href={href} key={href}>{name}</Link>)}<Link href="/contact">Build with us ↗</Link></nav></details></header></>;
}

export function SiteFooter() {
  return <footer className="footer"><Link className="brand footer-brand" href="/" aria-label="Think Zone home"><Image className="brand-logo" src="/brand/thinkzone-logo.svg" alt="Think Zone Technology" width={150} height={54} /></Link><p>Intelligent products.<br />Real-world impact.</p><div className="footer-links"><Link href="/solutions">Solutions</Link><Link href="/products">Products</Link><Link href="/about">About</Link><Link href="/contact">Contact</Link></div><span className="copyright">© 2026 THINK ZONE LLC</span></footer>;
}

export function PageShell({ children }: { children: React.ReactNode }) {
  return <><SiteHeader />{children}<SiteFooter /></>;
}

export function PageHero({ eyebrow, title, highlight, description, action = "Start a conversation", href = "/contact" }: { eyebrow: string; title: string; highlight?: string; description: string; action?: string; href?: string }) {
  return <section className="inner-hero"><div className="inner-hero-copy"><div className="section-kicker"><span>↗</span>{eyebrow}</div><h1>{title}{highlight && <><br /><span>{highlight}</span></>}</h1><p>{description}</p><Link className="button button-dark" href={href}>{action} <span aria-hidden="true" className="arrow">↗</span></Link></div><div className="inner-hero-art" aria-hidden="true"><span className="inner-orbit inner-orbit-a"/><span className="inner-orbit inner-orbit-b"/><span className="inner-orbit inner-orbit-c"/><span className="inner-art-core">tz</span><span className="inner-art-caption">THINK ZONE / SYSTEMS IN MOTION</span></div></section>;
}

export function SectionIntro({ eyebrow, title, copy }: { eyebrow: string; title: ReactNode; copy?: string }) {
  return <div className="section-heading"><div><div className="section-kicker"><span>↗</span>{eyebrow}</div><h2>{title}</h2></div>{copy && <p>{copy}</p>}</div>;
}
