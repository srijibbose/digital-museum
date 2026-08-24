import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { JsonLd } from "@/components/seo/JsonLd";
import { createSiteGraph } from "@/lib/seo/json-ld";
import { resolveSiteOrigin, SITE_NAME } from "@/lib/seo/site";
import "./globals.css";
import "@/components/jet-engine/jet-engine-poster.css";

const DEFAULT_TITLE = "Loupe — Interactive digital museum";
const DEFAULT_DESCRIPTION =
  "Explore interactive, source-grounded digital museum exhibits about the human body, machines, space, and human history.";
const googleVerification = process.env.GOOGLE_SITE_VERIFICATION;
const bingVerification = process.env.BING_SITE_VERIFICATION;

export const metadata: Metadata = {
  metadataBase: resolveSiteOrigin(),
  title: {
    default: DEFAULT_TITLE,
    template: "%s — Loupe",
  },
  description: DEFAULT_DESCRIPTION,
  applicationName: SITE_NAME,
  category: "education",
  creator: SITE_NAME,
  publisher: SITE_NAME,
  referrer: "origin-when-cross-origin",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [
      {
        url: "/social/museum/default",
        width: 1200,
        height: 630,
        alt: SITE_NAME,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: ["/social/museum/default"],
  },
  icons: { icon: "/icon.svg" },
  manifest: "/manifest.webmanifest",
  verification:
    googleVerification || bingVerification
      ? {
          ...(googleVerification ? { google: googleVerification } : {}),
          ...(bingVerification
            ? { other: { "msvalidate.01": bingVerification } }
            : {}),
        }
      : undefined,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <JsonLd data={createSiteGraph()} />
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
