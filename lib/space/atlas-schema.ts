import { z } from "zod";

export const worldIdSchema = z.enum([
  "sun",
  "mercury",
  "venus",
  "earth",
  "moon",
  "mars",
  "jupiter",
  "saturn",
  "uranus",
  "neptune",
]);

export const evidenceStatusSchema = z.enum([
  "observed",
  "processed",
  "inferred",
  "illustrative",
]);

export const lightingPolicySchema = z.enum([
  "hidden",
  "natural-survey",
  "angle",
]);

export const motionKindSchema = z.enum([
  "none",
  "solar",
  "atmosphere",
  "clouds",
]);

export const modeLegendItemSchema = z.object({
  label: z.string().min(2),
  detail: z.string().min(3),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
});

export const textureAssetSchema = z.object({
  path: z.string().startsWith("/media/space/atlas/"),
  sourceUrl: z.string().url(),
  credit: z.string().min(3),
  evidence: evidenceStatusSchema,
  processing: z.string().min(8),
  nativeDimensions: z.string().min(3),
  deliveredDimensions: z.string().min(3),
});

export const hotspotMediaSchema = z.object({
  path: z.string().startsWith("/media/space/atlas/features/"),
  alt: z.string().min(20),
  caption: z.string().min(20),
  credit: z.string().min(3),
  sourceUrl: z.string().url(),
  evidence: evidenceStatusSchema,
  processing: z.string().min(8),
});

export const worldAssetsSchema = z.object({
  color: z.string().startsWith("/media/space/atlas/"),
  fallback: z.string().startsWith("/media/space/atlas/"),
  bump: z.string().startsWith("/media/space/atlas/").optional(),
  layers: z.record(z.string(), z.string().startsWith("/media/space/atlas/")).default({}),
});

export const worldModeSchema = z.object({
  id: z.string().min(2),
  label: z.string().min(2),
  description: z.string().min(12),
  visibleChange: z.string().min(20),
  evidence: evidenceStatusSchema,
  lighting: lightingPolicySchema,
  motion: motionKindSchema,
  legend: z.array(modeLegendItemSchema).default([]),
  reliefScale: z.number().min(0).max(0.2).optional(),
  focusHotspotId: z.string().min(2).optional(),
  effect: z.enum([
    "surface",
    "texture",
    "clouds",
    "night",
    "atmosphere",
    "interior",
    "lighting",
    "hotspots",
    "missions",
    "rings",
    "tilt",
    "temperature",
    "magnetic",
  ]),
  textureKey: z.string().min(2).optional(),
});

export const sourceSchema = z.object({
  id: z.string().min(2),
  title: z.string().min(4),
  publisher: z.string().min(2),
  url: z.string().url(),
});

export const measurementSchema = z.object({
  label: z.string().min(2),
  value: z.string().min(1),
});

export const worldHotspotSchema = z.object({
  id: z.string().min(2),
  label: z.string().min(2),
  category: z.string().min(2),
  lat: z.number().min(-90).max(90),
  lon: z.number().min(-180).max(180),
  renderLat: z.number().min(-90).max(90).optional(),
  renderLon: z.number().min(-180).max(180).optional(),
  renderRadius: z.number().min(0.05).max(3).optional(),
  summary: z.string().min(12).max(180),
  detail: z.string().min(30),
  evidence: evidenceStatusSchema,
  coordinateConfidence: z.enum(["sourced", "approximate", "representative"]),
  sourceIds: z.array(z.string().min(2)).min(1),
  modeIds: z.array(z.string().min(2)).min(1),
  measurements: z.array(measurementSchema).min(1),
  media: hotspotMediaSchema.optional(),
});

const physicalSchema = z.object({
  type: z.string().min(3),
  radiusKm: z.number().positive(),
  gravity: z.string().min(2),
  dayLength: z.string().min(2),
  meanTemperature: z.string().min(2),
  distance: z.string().min(2),
});

const rendererBase = {
  axialTilt: z.number().min(0).max(180),
  rotationSeconds: z.number().positive(),
  atmosphereColor: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
};

export const rendererSchema = z.discriminatedUnion("kind", [
  z.object({
    kind: z.literal("solid"),
    ...rendererBase,
    bumpScale: z.number().min(0).max(0.2),
    roughness: z.number().min(0).max(1),
  }),
  z.object({
    kind: z.literal("earth"),
    ...rendererBase,
    bumpScale: z.number().min(0).max(0.2),
    cloudOpacity: z.number().min(0).max(1),
  }),
  z.object({
    kind: z.literal("venus"),
    ...rendererBase,
    bumpScale: z.number().min(0).max(0.2),
    cloudOpacity: z.number().min(0).max(1),
  }),
  z.object({
    kind: z.literal("gas"),
    ...rendererBase,
    flattening: z.number().min(0).max(0.2),
  }),
  z.object({
    kind: z.literal("rings"),
    ...rendererBase,
    flattening: z.number().min(0).max(0.2),
    ringInner: z.number().min(1),
    ringOuter: z.number().gt(1),
  }),
  z.object({
    kind: z.literal("sun"),
    ...rendererBase,
    emissiveIntensity: z.number().positive(),
  }),
]);

export const planetaryWorldSchema = z
  .object({
    id: worldIdSchema,
    name: z.string().min(2),
    orderLabel: z.string().min(2),
    classification: z.string().min(3),
    accent: z.string().regex(/^#[0-9a-fA-F]{6}$/),
    shortDescription: z.string().min(24),
    overview: z.string().min(60),
    defaultModeId: z.string().min(2),
    physical: physicalSchema,
    assets: worldAssetsSchema,
    renderer: rendererSchema,
    modes: z.array(worldModeSchema).min(5),
    hotspots: z.array(worldHotspotSchema).min(3),
    sources: z.array(sourceSchema).min(1),
    interiorLayers: z
      .array(
        z.object({
          label: z.string().min(2),
          radiusRatio: z.number().positive().max(1),
          color: z.string().regex(/^#[0-9a-fA-F]{6}$/),
          state: z.string().min(3),
        }),
      )
      .min(2),
  })
  .superRefine((world, context) => {
    const modeIds = new Set(world.modes.map((mode) => mode.id));
    const sourceIds = new Set(world.sources.map((source) => source.id));

    if (!modeIds.has(world.defaultModeId)) {
      context.addIssue({
        code: "custom",
        path: ["defaultModeId"],
        message: "Default mode must exist in the world's modes",
      });
    }

    world.hotspots.forEach((hotspot, index) => {
      hotspot.modeIds.forEach((modeId) => {
        if (!modeIds.has(modeId)) {
          context.addIssue({
            code: "custom",
            path: ["hotspots", index, "modeIds"],
            message: `Unknown mode ${modeId}`,
          });
        }
      });
      hotspot.sourceIds.forEach((sourceId) => {
        if (!sourceIds.has(sourceId)) {
          context.addIssue({
            code: "custom",
            path: ["hotspots", index, "sourceIds"],
            message: `Unknown source ${sourceId}`,
          });
        }
      });
    });

    world.modes.forEach((mode, index) => {
      if (!mode.focusHotspotId) return;
      const hotspot = world.hotspots.find((candidate) => candidate.id === mode.focusHotspotId);
      if (!hotspot || !hotspot.modeIds.includes(mode.id)) {
        context.addIssue({
          code: "custom",
          path: ["modes", index, "focusHotspotId"],
          message: `Focus hotspot ${mode.focusHotspotId} must exist and be visible in ${mode.id}`,
        });
      }
    });
  });

export const atlasCollectionSchema = z.object({
  id: z.literal("atlas-of-worlds"),
  title: z.literal("Atlas of Worlds"),
  worlds: z.array(planetaryWorldSchema).length(10),
});

export type WorldId = z.infer<typeof worldIdSchema>;
export type EvidenceStatus = z.infer<typeof evidenceStatusSchema>;
export type LightingPolicy = z.infer<typeof lightingPolicySchema>;
export type MotionKind = z.infer<typeof motionKindSchema>;
export type ModeLegendItem = z.infer<typeof modeLegendItemSchema>;
export type TextureAsset = z.infer<typeof textureAssetSchema>;
export type HotspotMedia = z.infer<typeof hotspotMediaSchema>;
export type WorldMode = z.infer<typeof worldModeSchema>;
export type WorldHotspot = z.infer<typeof worldHotspotSchema>;
export type PlanetaryWorld = z.infer<typeof planetaryWorldSchema>;
export type AtlasCollection = z.infer<typeof atlasCollectionSchema>;
