import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import "@/components/jet-engine/jet-engine-poster.css";

export const metadata: Metadata = {
  title: {
    default: "Loupe — Interactive digital museum",
    template: "%s — Loupe",
  },
  description:
    "Explore interactive, source-grounded digital museum exhibits about the human body, machines, space, and human history.",
  icons: { icon: "/icon.svg" },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
