"use client";

import { moon } from "@/content/space/moon";
import { useMoonStore } from "@/lib/space/moon-store";
import { SpaceExperience } from "./SpaceExperience";

export function MoonExperience() {
  return <SpaceExperience body={moon} useStore={useMoonStore} />;
}
