import type { ExhibitDefinition } from "@/content/exhibits";

export type ExhibitAccess =
  | { mode: "public" }
  | { mode: "members"; gateLabel: string; gateDescription: string }
  | { mode: "private" };

export type ExhibitViewer = { signedIn: boolean };

export function canEnterExhibit(
  exhibit: ExhibitDefinition,
  viewer: ExhibitViewer,
): boolean {
  return (
    exhibit.access.mode === "public" ||
    (exhibit.access.mode === "members" && viewer.signedIn)
  );
}

export function isPubliclyDiscoverable(exhibit: ExhibitDefinition): boolean {
  return exhibit.enabled && exhibit.access.mode !== "private";
}
