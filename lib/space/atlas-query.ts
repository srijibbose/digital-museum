import { worldIdSchema, type WorldId } from "@/lib/space/atlas-schema";

const DEFAULT_WORLD: WorldId = "venus";

export function parseWorldQuery(
  value: string | string[] | undefined,
): WorldId {
  const candidate = Array.isArray(value) ? value[0] : value;
  const result = worldIdSchema.safeParse(candidate);
  return result.success ? result.data : DEFAULT_WORLD;
}

export function worldQuery(worldId: WorldId): string {
  return `?world=${encodeURIComponent(worldId)}`;
}
