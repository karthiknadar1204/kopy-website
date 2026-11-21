import type { Metadata } from "next";
import { Header, Footer } from "@/components/chrome";
import { absolute, site } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: site.origin,
  title: {
    default: "Kopy — Clipboard history and a file shelf for Mac",
    template: "%s | Kopy",
  },
  description:
    "A native Mac shelf for copied text, links, screenshots and files. Search, save snippets and recover accidental deletes. One-time purchase planned at $2.99.",
  applicationName: "Kopy",
  robots: { index: site.indexable, follow: true },
  icons: { icon: "/images/kopy-icon.png", apple: "/images/kopy-icon.png" },
  openGraph: {
    type: "website",
    siteName: "Kopy",
    locale: "en_US",
    images: [
      {
        url: absolute("/opengraph-image"),
        width: 1200,
        height: 630,
        alt: "Kopy — a little shelf for everything between apps",
      },
    ],
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
