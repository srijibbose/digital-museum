import type { Metadata } from "next";
import JetEngineExperience from "@/components/jet-engine/JetEngineExperience";

export const metadata: Metadata = {
  title: "The Engine Is a River — Interactive 3D Jet Engine Laboratory",
  description:
    "Orbit a sourced 3D turbofan reconstruction and trace NASA flow stations through cycle-linked airflow, pressure, thermal, and shaft-work views.",
};

export default function JetEnginePage() {
  return <JetEngineExperience />;
}
