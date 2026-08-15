export type ExperienceCapability =
  | { mode: "live"; reason: "supported" }
  | {
      mode: "static";
      reason: "reduced-motion" | "reduced-data" | "no-webgl";
    };

export type ExperienceCapabilityInput = {
  hasWebGL: boolean;
  reducedMotion: boolean;
  saveData: boolean;
};

export function resolveExperienceCapability({
  hasWebGL,
  reducedMotion,
  saveData,
}: ExperienceCapabilityInput): ExperienceCapability {
  if (reducedMotion) return { mode: "static", reason: "reduced-motion" };
  if (saveData) return { mode: "static", reason: "reduced-data" };
  if (!hasWebGL) return { mode: "static", reason: "no-webgl" };
  return { mode: "live", reason: "supported" };
}
