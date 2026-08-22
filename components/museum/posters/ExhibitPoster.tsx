import type { ExhibitDefinition } from "@/content/exhibits";
import { LivingAtlasPoster } from "./LivingAtlasPoster";
import { ThirteenMinutesPoster } from "./ThirteenMinutesPoster";
import { JetEnginePoster } from "./JetEnginePoster";
import { BecomingHumanPoster } from "./BecomingHumanPoster";
import { AtlasOfWorldsPoster } from "./AtlasOfWorldsPoster";
import { DinosaursPoster } from "./DinosaursPoster";

export function ExhibitPoster({ exhibit }: { exhibit: ExhibitDefinition }) {
  switch (exhibit.visualTheme.variant) {
    case "living-atlas":
      return <LivingAtlasPoster />;
    case "thirteen-minutes":
      return <ThirteenMinutesPoster />;
    case "jet-engine":
      return <JetEnginePoster />;
    case "becoming-human":
      return <BecomingHumanPoster />;
    case "atlas-of-worlds":
      return <AtlasOfWorldsPoster />;
    case "dinosaurs":
      return <DinosaursPoster />;
    default:
      return (
        <div className="poster-generic" aria-hidden="true">
          <div className="poster-generic__orb" />
          <span className="poster-generic__label">{exhibit.title}</span>
        </div>
      );
  }
}
