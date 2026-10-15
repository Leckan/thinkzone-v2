import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";
import { BrandFavicon } from "@/components/brand-favicon";

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
  return (
    <footer className="footer">
      <Link className="brand footer-brand" href="/" aria-label="Think Zone home">
        <Image className="brand-logo" src="/brand/thinkzone-logo.svg" alt="Think Zone Technology" width={150} height={54} />
      </Link>
      <p>Intelligent products.<br />Real-world impact.</p>
      <div className="footer-links">
        <Link href="/solutions">Solutions</Link>
        <Link href="/products">Products</Link>
        <Link href="/about">About</Link>
        <Link href="/contact">Contact</Link>
        <Link href="/privacy">Privacy</Link>
        <Link href="/terms">Terms</Link>
      </div>
      <nav className="footer-socials" aria-label="Think Zone social media">
        <a href="https://www.linkedin.com/company/think-zone-llc/" target="_blank" rel="noopener noreferrer" aria-label="Think Zone on LinkedIn">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.35 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.13 20.45H3.58V9h3.55v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0Z" /></svg>
        </a>
        <a href="https://www.instagram.com/thinkzone.tech/" target="_blank" rel="noopener noreferrer" aria-label="Think Zone on Instagram">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9a5.5 5.5 0 0 1-5.5 5.5h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2Zm0 2A3.5 3.5 0 0 0 4 7.5v9A3.5 3.5 0 0 0 7.5 20h9a3.5 3.5 0 0 0 3.5-3.5v-9A3.5 3.5 0 0 0 16.5 4h-9ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm5.25-3.5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5Z" /></svg>
        </a>
        <a href="https://www.facebook.com/thinkzone.tech" target="_blank" rel="noopener noreferrer" aria-label="Think Zone on Facebook">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13.74 21v-7.1h2.39l.36-2.78h-2.75V9.35c0-.81.23-1.36 1.38-1.36h1.47V5.5c-.25-.03-1.11-.11-2.12-.11-2.1 0-3.54 1.28-3.54 3.63v2.02H8.56v2.78h2.37V21h2.81ZM12 0C5.37 0 0 5.37 0 12c0 5.99 4.39 10.95 10.13 11.85V15.4H7.65v-3.4h2.48V9.43c0-2.45 1.46-3.81 3.69-3.81 1.07 0 2.19.19 2.19.19v2.4h-1.23c-1.21 0-1.59.75-1.59 1.52V12h2.7l-.43 3.4h-2.27v8.45C18.93 22.95 24 18 24 12 24 5.37 18.63 0 12 0Z" /></svg>
        </a>
      </nav>
      <span className="copyright">© 2026 THINK ZONE LLC</span>
    </footer>
  );
}

export function PageShell({ children }: { children: React.ReactNode }) {
  return <><SiteHeader />{children}<SiteFooter /></>;
}

export function PageHero({ eyebrow, title, highlight, description, action = "Start a conversation", href = "/contact" }: { eyebrow: string; title: string; highlight?: string; description: string; action?: string; href?: string }) {
  return <section className="inner-hero"><div className="inner-hero-copy"><div className="section-kicker"><span>↗</span>{eyebrow}</div><h1>{title}{highlight && <><br /><span>{highlight}</span></>}</h1><p>{description}</p><Link className="button button-dark" href={href}>{action} <span aria-hidden="true" className="arrow">↗</span></Link></div><div className="inner-hero-art" aria-hidden="true"><span className="inner-orbit inner-orbit-a"/><span className="inner-orbit inner-orbit-b"/><span className="inner-orbit inner-orbit-c"/><span className="inner-art-core"><BrandFavicon inverse /></span><span className="inner-art-caption">THINK ZONE / SYSTEMS IN MOTION</span></div></section>;
}

export function SectionIntro({ eyebrow, title, copy }: { eyebrow: string; title: ReactNode; copy?: string }) {
  return <div className="section-heading"><div><div className="section-kicker"><span>↗</span>{eyebrow}</div><h2>{title}</h2></div>{copy && <p>{copy}</p>}</div>;
}
