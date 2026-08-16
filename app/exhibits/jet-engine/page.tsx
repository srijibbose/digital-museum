import type { Metadata } from "next";
import JetEngineExperience from "@/components/jet-engine/JetEngineExperience";

export const metadata: Metadata = {
  title: "The Engine Is a River",
  description: "An interactive turbofan engine exhibit from Loupe Digital Museum.",
};

export default function JetEnginePage() {
  return <JetEngineExperience />;
}
