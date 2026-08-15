import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

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
      <body>{children}</body>
    </html>
  );
}
