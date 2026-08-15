import type { ExhibitPosterKind } from "@/content/exhibits";
import { FullThrottlePoster } from "./FullThrottlePoster";
import { ThirteenMinutesPoster } from "./ThirteenMinutesPoster";

export function ExhibitPoster({ kind }: { kind: ExhibitPosterKind }) {
  if (kind === "thirteen-minutes") return <ThirteenMinutesPoster />;
  if (kind === "full-throttle") return <FullThrottlePoster />;
  return <div className="directory-poster directory-poster--anatomy" aria-hidden="true" />;
}
