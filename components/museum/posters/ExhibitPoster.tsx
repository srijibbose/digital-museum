import type { ExhibitDefinition } from "@/content/exhibits";
import { LivingAtlasPoster } from "./LivingAtlasPoster";
import { ThirteenMinutesPoster } from "./ThirteenMinutesPoster";
import { JetEnginePoster } from "./JetEnginePoster";

export function ExhibitPoster({ exhibit }: { exhibit: ExhibitDefinition }) {
  switch (exhibit.visualTheme.variant) {
    case "living-atlas":
      return <LivingAtlasPoster />;
    case "thirteen-minutes":
      return <ThirteenMinutesPoster />;
    case "jet-engine":
      return <JetEnginePoster />;
    default:
      return (
        <div className="poster-generic" aria-hidden="true">
          <div className="poster-generic__orb" />
          <span className="poster-generic__label">{exhibit.title}</span>
        </div>
      );
  }
}
