import { z } from "zod";

export const anatomySystemIdSchema = z.enum([
  "cardiovascular",
  "respiratory",
  "digestive",
  "urinary",
  "nervous",
  "sensory",
  "immune",
  "musculoskeletal",
]);
export const anatomyViewIdSchema = z.enum(["context", "isolate", "pathway"]);
export const anatomyModelKeySchema = z.enum([
  "heart",
  "lung",
  "vasculature",
  "liver",
  "pancreas",
  "small-intestine",
  "large-intestine",
  "kidney-left",
  "kidney-right",
  "ureter-left",
  "ureter-right",
  "urinary-bladder",
  "urethra",
  "brain",
  "spinal-cord",
  "eye-left",
  "eye-right",
  "spleen",
  "thymus",
  "lymph-node",
  "skeleton-full",
]);
export const anatomyEvidenceSchema = z.enum([
  "reference-anatomy",
  "observed-imaging",
  "scientific-visualization",
]);

export const anatomySourceSchema = z.object({
  id: z.string().min(2),
  title: z.string().min(4),
  publisher: z.string().min(2),
  url: z.string().url(),
  role: z.string().min(20),
});

export const anatomyModelSchema = z.object({
  key: anatomyModelKeySchema,
  label: z.string().min(3),
  path: z.string().startsWith("/models/anatomy/"),
  fallback: z.string().startsWith("/media/anatomy/"),
  sourceId: z.string().min(2),
  referenceBody: z.string().min(20),
  processing: z.string().min(20),
});

export const meshSelectorSchema = z.object({
  model: anatomyModelKeySchema,
  includes: z.array(z.string().min(1)).min(1),
});

export const anatomyStructureSchema = z.object({
  id: z.string().min(2),
  systemId: anatomySystemIdSchema,
  label: z.string().min(2),
  category: z.string().min(2),
  summary: z.string().min(20),
  detail: z.string().min(50),
  relationship: z.string().min(30),
  evidence: anatomyEvidenceSchema,
  sourceIds: z.array(z.string().min(2)).min(1),
  selectors: z.array(meshSelectorSchema).min(1),
  formalTerms: z.object({
    fma: z.string().optional(),
    uberon: z.string().optional(),
    laterality: z.string().optional(),
  }),
});

export const anatomyViewSchema = z.object({
  id: anatomyViewIdSchema,
  label: z.string().min(3),
  description: z.string().min(20),
  visibleChange: z.string().min(30),
  evidence: anatomyEvidenceSchema,
});

export const anatomySystemSchema = z.object({
  id: anatomySystemIdSchema,
  index: z.string().regex(/^0[1-9]$/),
  label: z.string().min(3),
  shortLabel: z.string().min(3),
  territory: z.string().min(3),
  thesis: z.string().min(40),
  overview: z.string().min(80),
  accent: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  fallback: z.string().startsWith("/media/anatomy/"),
  modelKeys: z.array(anatomyModelKeySchema).min(1),
  availableViews: z.array(anatomyViewIdSchema).min(2),
  viewLabels: z.object({
    context: z.string().min(3),
    isolate: z.string().min(3),
    pathway: z.string().min(3),
  }),
  defaultStructureId: z.string().min(2),
  structures: z.array(anatomyStructureSchema).min(1),
});

export const anatomyExhibitSchema = z
  .object({
    id: z.literal("human-anatomy"),
    title: z.literal("Human Anatomy"),
    curatorialThesis: z.string().min(80),
    models: z.array(anatomyModelSchema).min(3),
    views: z.array(anatomyViewSchema).length(3),
    systems: z.array(anatomySystemSchema).min(2),
    sources: z.array(anatomySourceSchema).min(3),
  })
  .superRefine((exhibit, context) => {
    const sourceIds = new Set(exhibit.sources.map((source) => source.id));
    const modelKeys = new Set(exhibit.models.map((model) => model.key));

    exhibit.models.forEach((model, index) => {
      if (!sourceIds.has(model.sourceId)) {
        context.addIssue({
          code: "custom",
          path: ["models", index, "sourceId"],
          message: `Unknown source ${model.sourceId}`,
        });
      }
    });

    exhibit.systems.forEach((system, systemIndex) => {
      system.modelKeys.forEach((modelKey, modelIndex) => {
        if (!modelKeys.has(modelKey)) {
          context.addIssue({
            code: "custom",
            path: ["systems", systemIndex, "modelKeys", modelIndex],
            message: `Unknown model ${modelKey}`,
          });
        }
      });

      if (!system.structures.some((structure) => structure.id === system.defaultStructureId)) {
        context.addIssue({
          code: "custom",
          path: ["systems", systemIndex, "defaultStructureId"],
          message: "Default structure must exist in the system",
        });
      }

      system.structures.forEach((structure, structureIndex) => {
        structure.sourceIds.forEach((sourceId) => {
          if (!sourceIds.has(sourceId)) {
            context.addIssue({
              code: "custom",
              path: ["systems", systemIndex, "structures", structureIndex, "sourceIds"],
              message: `Unknown source ${sourceId}`,
            });
          }
        });
        structure.selectors.forEach((selector) => {
          if (!modelKeys.has(selector.model)) {
            context.addIssue({
              code: "custom",
              path: ["systems", systemIndex, "structures", structureIndex, "selectors"],
              message: `Unknown model ${selector.model}`,
            });
          }
        });
      });
    });
  });

export type AnatomySystemId = z.infer<typeof anatomySystemIdSchema>;
export type AnatomyViewId = z.infer<typeof anatomyViewIdSchema>;
export type AnatomyModelKey = z.infer<typeof anatomyModelKeySchema>;
export type AnatomyEvidence = z.infer<typeof anatomyEvidenceSchema>;
export type AnatomySource = z.infer<typeof anatomySourceSchema>;
export type AnatomyModel = z.infer<typeof anatomyModelSchema>;
export type AnatomyStructure = z.infer<typeof anatomyStructureSchema>;
export type AnatomyView = z.infer<typeof anatomyViewSchema>;
export type AnatomySystem = z.infer<typeof anatomySystemSchema>;
export type AnatomyExhibit = z.infer<typeof anatomyExhibitSchema>;
