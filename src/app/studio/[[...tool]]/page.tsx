import { NextStudio } from "next-sanity/studio";
import type { Metadata } from "next";
import config from "../../../../sanity.config";

export const dynamic = "force-static";
export const metadata: Metadata = { title: "Think Zone Content Studio", robots: { index: false, follow: false } };

export default function StudioPage() {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
    return <main className="studio-setup"><span>THINK ZONE / CONTENT STUDIO</span><h1>Connect your Sanity project</h1><p>Set <code>NEXT_PUBLIC_SANITY_PROJECT_ID</code> and <code>NEXT_PUBLIC_SANITY_DATASET</code> in the app environment, then rebuild to open the editor.</p></main>;
  }
  return <NextStudio config={config} />;
}
