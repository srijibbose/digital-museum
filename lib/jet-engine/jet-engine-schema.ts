import { z } from "zod";

export const jetEvidenceSchema = z.enum([
  "reference-convention",
  "modelled-cycle",
  "explanatory-reconstruction",
]);

export const jetStationIdSchema = z.enum(["0", "2", "f", "3", "4", "5", "8"]);
export const jetProfileIdSchema = z.enum(["ground-idle", "takeoff", "climb", "cruise"]);
export const jetViewIdSchema = z.enum(["section", "airflow", "pressure", "thermal", "shafts"]);

export const jetSourceSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(8),
  organization: z.string().min(2),
  url: z.string().url(),
  kind: z.enum(["primary-reference", "technical-handbook", "technical-report"]),
  use: z.string().min(30),
  accessed: z.string().date(),
});

export const jetStationSchema = z.object({
  id: jetStationIdSchema,
  number: z.string().min(1),
  shortLabel: z.string().min(2),
  label: z.string().min(3),
  stream: z.enum(["shared", "core", "bypass"]),
  x: z.number().min(0).max(1200),
  evidence: jetEvidenceSchema,
  summary: z.string().min(70),
  transformation: z.string().min(45),
  interpretation: z.string().min(45),
  sourceIds: z.array(z.string().min(1)).min(1),
});

export const jetProfileSchema = z.object({
  id: jetProfileIdSchema,
  label: z.string().min(3),
  context: z.string().min(8),
  altitudeM: z.number().min(0).max(20_000),
  mach: z.number().min(0).max(1),
  turbineInletTemperatureK: z.number().min(800).max(2_000),
  overallPressureRatio: z.number().min(5).max(60),
  fanPressureRatio: z.number().min(1).max(2),
  throttlePercent: z.number().min(0).max(100),
  assumption: z.string().min(50),
});

export const jetViewSchema = z.object({
  id: jetViewIdSchema,
  label: z.string().min(3),
  evidence: jetEvidenceSchema,
  description: z.string().min(35),
});

export const jetEngineContentSchema = z.object({
  title: z.string().min(5),
  subtitle: z.string().min(5),
  thesis: z.string().min(100),
  visitorPromise: z.string().min(80),
  reconstructionNotice: z.string().min(100),
  modelNotice: z.string().min(100),
  stations: z.array(jetStationSchema).length(7),
  profiles: z.array(jetProfileSchema).length(4),
  views: z.array(jetViewSchema).length(5),
  sources: z.array(jetSourceSchema).min(4),
});

export type JetEvidence = z.infer<typeof jetEvidenceSchema>;
export type JetStationId = z.infer<typeof jetStationIdSchema>;
export type JetProfileId = z.infer<typeof jetProfileIdSchema>;
export type JetViewId = z.infer<typeof jetViewIdSchema>;
export type JetSource = z.infer<typeof jetSourceSchema>;
export type JetStation = z.infer<typeof jetStationSchema>;
export type JetProfile = z.infer<typeof jetProfileSchema>;
export type JetView = z.infer<typeof jetViewSchema>;
export type JetEngineContent = z.infer<typeof jetEngineContentSchema>;
