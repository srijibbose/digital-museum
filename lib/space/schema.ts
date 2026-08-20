import { z } from "zod";

export const hotspotSchema = z.object({
  id: z.string().min(2),
  label: z.string().min(2),
  category: z.string().min(2),
  lat: z.number().min(-90).max(90),
  lon: z.number().min(-180).max(180),
  cameraDistance: z.number().min(1.2).max(6),
  summary: z.string().min(10).max(160),
  detail: z.string().min(20),
  accessibleDescription: z.string().min(20),
  sourceIds: z.array(z.string().min(2)).min(1),
  coordinateConfidence: z.enum(["sourced", "approximate"]),
});

export const modeSchema = z.object({
  id: z.string().min(2),
  label: z.string().min(2),
  description: z.string().min(10),
  categories: z.union([z.literal("all"), z.array(z.string().min(2))]),
});

export const categoryMetaSchema = z.object({
  id: z.string().min(2),
  label: z.string().min(2),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/),
});

export const sourceSchema = z.object({
  id: z.string().min(2),
  title: z.string().min(4),
  publisher: z.string().min(2),
  url: z.string().url(),
});

export const celestialBodySchema = z.object({
  id: z.string().min(2),
  name: z.string().min(2),
  tagline: z.string().min(10),
  promise: z.string().min(20),
  exhibitLabel: z.string().min(2),
  radius: z.number().positive(),
  colorTexture: z.string().min(2),
  nightTexture: z.string().min(2).optional(),
  rotationPeriodSec: z.number().positive(),
  accent: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  categories: z.array(categoryMetaSchema).min(1),
  hotspots: z.array(hotspotSchema).min(1),
  modes: z.array(modeSchema).min(1),
  sources: z.array(sourceSchema).min(1),
});

export type Hotspot = z.infer<typeof hotspotSchema>;
export type Mode = z.infer<typeof modeSchema>;
export type CategoryMeta = z.infer<typeof categoryMetaSchema>;
export type SpaceSource = z.infer<typeof sourceSchema>;
export type CelestialBody = z.infer<typeof celestialBodySchema>;
