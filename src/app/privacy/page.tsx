import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/site-shell";
import { LegalDocumentContent } from "@/components/legal-document-content";
import { privacyPolicyMarkdown } from "@/content/privacy-policy";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Read how Think Zone LLC collects, uses, shares, and protects personal information across its websites, products, and services.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <PageShell>
      <main className="editorial-page privacy-page">
        <div className="breadcrumb"><Link href="/">Home</Link><span>/</span>Privacy Policy</div>
        <article>
          <div className="section-kicker"><span>THINK ZONE / LEGAL</span></div>
          <div className="editorial-rule" />
          <LegalDocumentContent markdown={privacyPolicyMarkdown} />
        </article>
        <div className="editorial-back">
          <a className="text-link" href="mailto:privacy@thinkzonellc.com">Privacy questions <span aria-hidden="true">↗</span></a>
          <Link className="button button-dark" href="/">Back to Think Zone <span className="arrow">↗</span></Link>
        </div>
      </main>
    </PageShell>
  );
}
