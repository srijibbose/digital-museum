import type { ExhibitDefinition } from "@/content/exhibits";
import { ThirteenMinutesPoster } from "./ThirteenMinutesPoster";
import { JetEnginePoster } from "./JetEnginePoster";
import { BecomingHumanPoster } from "./BecomingHumanPoster";
import { AtlasOfWorldsPoster } from "./AtlasOfWorldsPoster";
import { HumanAnatomyPoster } from "./HumanAnatomyPoster";

export function ExhibitPoster({ exhibit }: { exhibit: ExhibitDefinition }) {
  switch (exhibit.visualTheme.variant) {
    case "human-anatomy":
      return <HumanAnatomyPoster />;
    case "thirteen-minutes":
      return <ThirteenMinutesPoster />;
    case "jet-engine":
      return <JetEnginePoster />;
    case "becoming-human":
      return <BecomingHumanPoster />;
    case "atlas-of-worlds":
      return <AtlasOfWorldsPoster />;
    default:
      return (
        <div className="poster-generic" aria-hidden="true">
          <div className="poster-generic__orb" />
          <span className="poster-generic__label">{exhibit.title}</span>
        </div>
      );
  }
}
