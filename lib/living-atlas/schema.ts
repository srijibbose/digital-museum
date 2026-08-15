import { z } from "zod";

export const chapterIdSchema = z.enum([
  "surface",
  "signal",
  "breath",
  "pulse",
  "fuel-motion",
  "whole",
]);

export const systemIdSchema = z.enum([
  "skin",
  "nervous",
  "respiratory",
  "circulatory",
  "digestive",
  "skeletal",
  "muscular",
  "whole",
]);

export const hotspotIdSchema = z.enum([
  "skin",
  "brain",
  "spinal-cord",
  "lungs",
  "heart",
  "liver",
  "stomach",
  "skeleton",
  "muscles",
]);

export const anatomyChapterSchema = z.object({
  id: chapterIdSchema,
  ordinal: z.string().min(2),
  title: z.string().min(2),
  eyebrow: z.string().min(2),
  hook: z.string().min(10),
  narration: z.string().min(20).max(420),
  takeaway: z.string().min(10).max(180),
  interactionLabel: z.string().min(3),
  interactionHint: z.string().min(10),
  accent: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  systemIds: z.array(systemIdSchema).min(1),
  hotspotIds: z.array(hotspotIdSchema),
  fallbackDescription: z.string().min(20),
  sourceIds: z.array(z.string().min(2)).min(1),
});

export const organHotspotSchema = z.object({
  id: hotspotIdSchema,
  label: z.string().min(3),
  systemId: systemIdSchema,
  location: z.string().min(10),
  function: z.string().min(20),
  accessibleDescription: z.string().min(30),
  sourceIds: z.array(z.string().min(2)).min(1),
});

export const sourceSchema = z.object({
  id: z.string().min(2),
  title: z.string().min(4),
  publisher: z.string().min(2),
  url: z.string().url(),
});

export type ChapterId = z.infer<typeof chapterIdSchema>;
export type SystemId = z.infer<typeof systemIdSchema>;
export type HotspotId = z.infer<typeof hotspotIdSchema>;
export type AnatomyChapter = z.infer<typeof anatomyChapterSchema>;
export type OrganHotspot = z.infer<typeof organHotspotSchema>;
export type AtlasSource = z.infer<typeof sourceSchema>;
