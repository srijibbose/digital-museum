"use client";

import { earth } from "@/content/space/earth";
import { useEarthStore } from "@/lib/space/earth-store";
import { SpaceExperience } from "./SpaceExperience";

export function EarthExperience() {
  return <SpaceExperience body={earth} useStore={useEarthStore} />;
}
