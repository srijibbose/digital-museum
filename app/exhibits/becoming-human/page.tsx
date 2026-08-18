import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { BecomingHumanV2Experience } from "@/components/becoming-human/BecomingHumanV2Experience";
import { isExhibitEnabled } from "@/content/exhibits";

export const metadata: Metadata = {
  title: "Becoming Human — The Deep History of Us",
  description:
    "A 35-episode interactive museum journey through human evolution, cumulative culture, external memory, energy, networks and AI.",
};

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#030303",
};

export default function BecomingHumanPage() {
  if (!isExhibitEnabled("becoming-human")) notFound();
  return <BecomingHumanV2Experience />;
}
