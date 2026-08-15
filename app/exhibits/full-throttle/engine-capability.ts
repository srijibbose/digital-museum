export type EngineCapabilityInput = {
  webgl: boolean;
  reducedData: boolean;
  deviceMemory: number | null;
  previousFailures: number;
};

export function chooseEngineMode(input: EngineCapabilityInput) {
  if (!input.webgl || input.reducedData || input.previousFailures > 0) return "fallback" as const;
  if (input.deviceMemory !== null && input.deviceMemory < 3) return "fallback" as const;
  return "enhanced" as const;
}
