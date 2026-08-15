export type ArchivalImage = {
  id: "eagle-orbit" | "mission-control";
  src: string;
  alt: string;
  credit: "NASA";
  sourceUrl: string;
  reference: string;
};

export const ARCHIVAL_MEDIA = [
  {
    id: "eagle-orbit",
    src: "/images/nasa-eagle-prepares-to-land.jpg",
    alt: "Apollo 11 lunar module Eagle in landing configuration above the Moon.",
    credit: "NASA",
    sourceUrl: "https://science.nasa.gov/resource/the-eagle-prepares-to-land/",
    reference: "AS11-44-6574",
  },
  {
    id: "mission-control",
    src: "/images/nasa-mission-control-landing.jpg",
    alt: "Flight controllers at consoles in Mission Control during Apollo 11's lunar descent.",
    credit: "NASA",
    sourceUrl:
      "https://www.nasa.gov/history/50-years-ago-one-small-step-one-giant-leap/",
    reference: "S69-39601",
  },
] as const satisfies readonly ArchivalImage[];

