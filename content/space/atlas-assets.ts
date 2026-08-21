import type { TextureAsset, WorldId } from "@/lib/space/atlas-schema";

export type AtlasAssetKey =
  | "sun-color"
  | "sun-171"
  | "sun-193"
  | "sun-304"
  | "mercury-color"
  | "mercury-bump"
  | "venus-atmosphere"
  | "venus-radar"
  | "venus-bump"
  | "earth-color"
  | "earth-bump"
  | "earth-clouds"
  | "earth-night"
  | "moon-color"
  | "moon-bump"
  | "mars-color"
  | "mars-bump"
  | "jupiter-color"
  | "saturn-color"
  | "saturn-rings"
  | "uranus-color"
  | "uranus-rings"
  | "neptune-color";

const path = (name: AtlasAssetKey) => `/media/space/atlas/${name}.webp`;

export const atlasAssetPaths: Record<WorldId, {
  color: string;
  fallback: string;
  bump?: string;
  layers?: Record<string, string>;
}> = {
  sun: {
    color: path("sun-color"),
    fallback: path("sun-color"),
    layers: {
      "171": path("sun-171"),
      "193": path("sun-193"),
      "304": path("sun-304"),
    },
  },
  mercury: {
    color: path("mercury-color"),
    fallback: path("mercury-color"),
    bump: path("mercury-bump"),
  },
  venus: {
    color: path("venus-atmosphere"),
    fallback: path("venus-atmosphere"),
    bump: path("venus-bump"),
    layers: { radar: path("venus-radar") },
  },
  earth: {
    color: path("earth-color"),
    fallback: path("earth-color"),
    bump: path("earth-bump"),
    layers: {
      clouds: path("earth-clouds"),
      night: path("earth-night"),
    },
  },
  moon: {
    color: path("moon-color"),
    fallback: path("moon-color"),
    bump: path("moon-bump"),
  },
  mars: {
    color: path("mars-color"),
    fallback: path("mars-color"),
    bump: path("mars-bump"),
  },
  jupiter: {
    color: path("jupiter-color"),
    fallback: path("jupiter-color"),
  },
  saturn: {
    color: path("saturn-color"),
    fallback: path("saturn-color"),
    layers: { rings: path("saturn-rings") },
  },
  uranus: {
    color: path("uranus-color"),
    fallback: path("uranus-color"),
    layers: { rings: path("uranus-rings") },
  },
  neptune: {
    color: path("neptune-color"),
    fallback: path("neptune-color"),
  },
};

export const atlasTextureLedger: Partial<Record<AtlasAssetKey, TextureAsset>> = {};

