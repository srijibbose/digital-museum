import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { isExhibitEnabled } from "@/content/exhibits";
import { PowersOfTenExperience } from "./components/PowersOfTenExperience";
import { exhibitIntro } from "./content";

export const metadata: Metadata = { title: exhibitIntro.title, description: "A continuous scale journey from your hand to the observable universe." };
export const viewport: Viewport = { themeColor: "#06090b", width: "device-width", initialScale: 1, maximumScale: 1, userScalable: false };

export default function PowersOfTenPage() { if (!isExhibitEnabled("powers-of-ten")) notFound(); return <PowersOfTenExperience />; }
