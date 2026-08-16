import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import "@/components/jet-engine/jet-engine.css";

export const metadata: Metadata = {
  title: {
    default: "Loupe — A museum for the quietly curious",
    template: "%s — Loupe",
  },
  description:
    "Short, immersive exhibits that make hidden systems visible.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
