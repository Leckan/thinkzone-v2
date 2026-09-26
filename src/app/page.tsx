import Link from "next/link";
import { SiteFooter, SiteHeader } from "@/components/site-shell";
import type { Metadata } from "next";

export const metadata: Metadata = { alternates: { canonical: "https://thinkzone.tech" } };

const products = [
  { number: "01", slug: "real-estate-deal-analyzer", name: "Real Estate Deal Analyzer", category: "INVESTMENT INTELLIGENCE", status: "In development", copy: "Know the numbers before you make the move. Analyze a deal with the context investors need to act with confidence.", mark: "↗", tone: "mint" },
  { number: "02", slug: "ai-space-revamp", name: "AI Space Revamp", category: "PROPERTY VISUALIZATION", status: "Coming soon", copy: "See what a space could become. Turn property photos into compelling redesign concepts in minutes.", mark: "⌘", tone: "sand" },
  { number: "03", slug: "ai-fix-flip-coach", name: "Fix & Flip Coach", category: "REAL ESTATE AI", status: "Research phase", copy: "A smarter renovation partner for scoping projects, estimating costs, and pressure-testing your next flip.", mark: "⌂", tone: "blue" },
  { number: "04", slug: "skill-mastery-ai", name: "Skill Mastery AI", category: "LEARNING SYSTEMS", status: "Experimental", copy: "Personalized practice and progress paths that make meaningful skill-building part of the daily routine.", mark: "✳", tone: "lilac" },
  { number: "05", slug: "ai-digital-twin", name: "AI Digital Twin", category: "COMPANY EXPERIMENT", status: "Experimental", copy: "An experimental AI representation of Think Zone, exploring new ways to interact with company knowledge and ideas.", mark: "◎", tone: "mint" },
];

const solutions = [
  ["01", "ai-strategy", "AI strategy", "Find the highest-value opportunities and turn them into a practical roadmap."],
  ["02", "ai-automation", "AI automation", "Give repetitive work to intelligent workflows built around your real operations."],
  ["03", "ai-agents", "AI agents", "Build capable assistants that can reason, use tools, and get work done."],
  ["04", "ai-product-development", "AI product development", "Take an idea from first prototype to a reliable product people can use."],
  ["05", "data-ai-engineering", "Data & AI engineering", "Create the data foundations and integrations that make AI useful."],
  ["06", "ai-mvp-development", "AI MVP development", "Validate a focused product idea quickly, with a clear path to production."],
];

const Arrow = () => <span aria-hidden="true" className="arrow">↗</span>;

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>

      <section className="hero" id="top">
        <div className="hero-copy">
          <div className="eyebrow"><span className="eyebrow-line" /> THINK ZONE / VENTURE STUDIO</div>
          <h1>We build AI<br />products that<br /><span>do real work.</span></h1>
          <p className="hero-lede">Intelligent software for the messy, meaningful problems businesses face every day.</p>
          <div className="hero-actions"><Link className="button button-dark" href="/products">Explore our products <Arrow /></Link><Link className="text-link" href="/contact">Build with Think Zone <span>→</span></Link></div>
          <div className="hero-foot"><span>PRODUCTS, SYSTEMS & NEW POSSIBILITIES</span><span>SCROLL TO EXPLORE&nbsp; ↓</span></div>
        </div>
        <div className="hero-visual" aria-label="Abstract visualization of connected AI systems" role="img">
          <div className="visual-top"><span>THINK ZONE / SYSTEM 001</span><span className="live"><i /> LIVE THINKING</span></div>
          <div className="orbit orbit-one" /><div className="orbit orbit-two" /><div className="orbit orbit-three" />
          <div className="visual-cross cross-a">+</div><div className="visual-cross cross-b">+</div><div className="visual-cross cross-c">+</div>
          <div className="node node-center"><span className="node-glyph">tz</span><span>REAL-WORLD<br />INTELLIGENCE</span></div>
          <div className="node node-one"><b>01</b><span>DATA</span></div><div className="node node-two"><b>02</b><span>DECISIONS</span></div><div className="node node-three"><b>03</b><span>ACTION</span></div>
          <div className="visual-label label-a">IDEA → PRODUCT</div><div className="visual-label label-b">BUILT FOR IMPACT</div>
          <div className="visual-bottom"><span>THINK CLEARER. BUILD BETTER.</span><span>37° 46′ 49.6″ N</span></div>
        </div>
        <div className="hero-side-note">INDEPENDENT BY DESIGN <span>·</span> BUILT FOR WHAT&apos;S NEXT</div>
      </section>

      <section className="trust-strip" aria-label="Company capabilities"><div className="trust-intro">A venture studio at the<br />intersection of</div><div className="trust-item">Product leadership</div><div className="trust-item">Software engineering</div><div className="trust-item">Artificial intelligence</div><div className="trust-item">Data & analytics</div><div className="trust-item">Cloud technology</div></section>

      <section className="section problem-section" id="about">
        <div className="section-kicker"><span>01</span> THE OPPORTUNITY</div>
        <div className="problem-grid"><h2>Business is moving.<br /><span>Your systems should, too.</span></h2><div className="problem-copy"><p>Great businesses run into the same friction: work that repeats, knowledge that gets lost, decisions waiting on disconnected data, and promising ideas stuck in a slide deck.</p><p>We turn those moments into intelligent products and systems—designed around the way people actually work.</p><a className="text-link" href="#solutions">See how we work <span>→</span></a></div></div>
        <div className="friction-list"><div><span>01 / REPETITION</span><p>Manual work that steals focus</p></div><div><span>02 / FRAGMENTATION</span><p>Data that never tells the full story</p></div><div><span>03 / DELAY</span><p>Good decisions made too late</p></div><div><span>04 / INERTIA</span><p>Ideas waiting to become real</p></div></div>
      </section>

      <section className="section products-section" id="products">
        <div className="section-heading"><div><div className="section-kicker"><span>02</span> OUR VENTURE PORTFOLIO</div><h2>Products we&apos;re<br /><span>putting into the world.</span></h2></div><p>We build and own focused AI products for real people, real work, and industries ready for a better way.</p></div>
        <div className="product-grid">{products.map((product) => <article className="product-card" key={product.number}><div className={`product-art ${product.tone}`}><div className="product-art-top"><span>THINK ZONE / {product.number}</span><span className="product-status"><i /> {product.status}</span></div><span className="product-symbol">{product.mark}</span><span className="product-art-index">PRODUCT / {product.number}</span></div><div className="product-info"><div className="product-category">{product.category}</div><h3>{product.name}</h3><p>{product.copy}</p><Link href={`/products/${product.slug}`}>Explore product <Arrow /></Link></div></article>)}</div>
        <div className="portfolio-foot"><span>OUR PORTFOLIO IS ALWAYS IN MOTION.</span><a href="#lab">Inside the AI Lab <span>↗</span></a></div>
      </section>

      <section className="real-estate" id="industries">
        <div className="real-estate-art"><div className="re-art-label">VERTICAL 01 / PROPERTY</div><div className="building-grid"><div className="building-building"><div /><div /><div /><div /><div /><div /><div /><div /><div /></div><div className="building-orbit"/><div className="building-cross">+</div></div><div className="re-art-foot"><span>PROPERTY INTELLIGENCE</span><span>LAT. 37.7749° N</span></div></div>
        <div className="real-estate-copy"><div className="section-kicker light"><span>03</span> AN INDUSTRY WE KNOW</div><h2>Real estate,<br />reimagined with <span>AI.</span></h2><p>We&apos;re creating a new generation of tools to help property investors see opportunities sooner, understand the numbers clearly, and move with conviction.</p><div className="re-capabilities"><span>Deal analysis</span><span>Property intelligence</span><span>Investor assistants</span><span>Workflow automation</span></div><Link className="button button-light" href="/industries">Explore real estate AI <Arrow /></Link></div>
      </section>

      <section className="section solutions-section" id="solutions"><div className="section-heading"><div><div className="section-kicker"><span>04</span> SELECTIVE PARTNERSHIPS</div><h2>From first question<br />to <span>working system.</span></h2></div><p>We partner with ambitious teams to find the right problem, build the right thing, and get it working in the real world.</p></div><div className="solutions-grid">{solutions.map(([number, slug, title, copy]) => <Link className="solution-card" href={`/solutions/${slug}`} key={number}><span className="solution-number">{number}</span><span className="solution-arrow">↗</span><h3>{title}</h3><p>{copy}</p></Link>)}</div></section>

      <section className="lab-section" id="lab"><div className="lab-orb"><div className="lab-orb-core">tz</div><span className="lab-ring ring-one"/><span className="lab-ring ring-two"/><span className="lab-ring ring-three"/><i className="lab-point point-one"/><i className="lab-point point-two"/><i className="lab-point point-three"/></div><div className="lab-copy"><div className="section-kicker"><span>05</span> THINK ZONE / R&amp;D</div><h2>Curiosity is part<br />of the <span>process.</span></h2><p>The AI Lab is where we test new ideas, explore emerging technology, and find the next useful thing. Some experiments become products. All of them make us better builders.</p><Link className="text-link" href="/ai-lab">Explore the AI Lab <span>→</span></Link></div><div className="lab-coordinate">RESEARCH / EXPERIMENT / REPEAT</div></section>

      <section className="closing-cta"><div className="cta-top"><span>HAVE A GOOD PROBLEM?</span><span>LET&apos;S MAKE SOMETHING USEFUL.</span></div><h2>Let&apos;s build what<br /><span>comes next.</span></h2><div className="cta-bottom"><p>Have a product idea, a workflow that needs a rethink, or a business problem AI might solve? We&apos;d like to hear about it.</p><Link className="button button-dark" href="/contact">Build with Think Zone <Arrow /></Link></div><div className="cta-star">✳</div></section>

      </main>
      <SiteFooter />
    </>
  );
}
