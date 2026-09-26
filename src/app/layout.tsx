import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://thinkzone.tech"),
  title: {
    default: "Think Zone — AI Products That Do Real Work",
    template: "%s | Think Zone",
  },
  description:
    "Think Zone is an AI venture studio building intelligent software, AI agents, and automation systems that solve real-world business problems.",
  openGraph: {
    title: "Think Zone — AI Products That Do Real Work",
    description:
      "An AI venture studio building intelligent software, AI agents, and automation systems for the next generation of businesses.",
    url: "https://thinkzone.tech",
    siteName: "Think Zone",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
