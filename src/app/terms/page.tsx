import type { Metadata } from "next";
import Link from "next/link";
import { LegalDocumentContent } from "@/components/legal-document-content";
import { PageShell } from "@/components/site-shell";
import { termsOfServiceMarkdown } from "@/content/terms-of-service";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Review the terms governing access to Think Zone LLC websites, products, and services.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <PageShell>
      <main className="editorial-page legal-page">
        <div className="breadcrumb"><Link href="/">Home</Link><span>/</span>Terms of Service</div>
        <article>
          <div className="section-kicker"><span>THINK ZONE / LEGAL</span></div>
          <div className="editorial-rule" />
          <LegalDocumentContent markdown={termsOfServiceMarkdown} />
        </article>
        <div className="editorial-back">
          <a className="text-link" href="mailto:privacy@thinkzonellc.com">Questions about these terms <span aria-hidden="true">↗</span></a>
          <Link className="button button-dark" href="/">Back to Think Zone <span className="arrow">↗</span></Link>
        </div>
      </main>
    </PageShell>
  );
}
