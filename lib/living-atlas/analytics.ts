import type { ChapterId } from "@/lib/living-atlas/schema";

export type AtlasEventName =
  | "exhibit_opened"
  | "webgl_mode_selected"
  | "chapter_seen"
  | "chapter_completed"
  | "exhibit_completed"
  | "related_exhibit_selected";

type AtlasEventDetail = {
  chapterId?: ChapterId;
  mode?: "full" | "lite" | "fallback";
};

export function trackAtlasEvent(
  name: AtlasEventName,
  detail: AtlasEventDetail = {},
) {
  if (typeof window === "undefined") return;

  window.dispatchEvent(
    new CustomEvent("living-atlas:analytics", {
      detail: { name, ...detail },
    }),
  );
}
