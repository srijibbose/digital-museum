import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { DinosaurExperience } from "@/components/dinosaurs/DinosaurExperience";
import { isExhibitEnabled } from "@/content/exhibits";

export const metadata: Metadata = {
  title: "Dinosaurs, Reconsidered — An Evidence Atlas",
  description:
    "Inspect eight institutionally sourced dinosaur specimens through skeleton, bone, trace, comparative anatomy, and lineage evidence.",
};

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#ebe9e2",
};

export default function DinosaursPage() {
  if (!isExhibitEnabled("dinosaurs")) notFound();
  return <DinosaurExperience />;
}
