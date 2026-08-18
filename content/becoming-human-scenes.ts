export type SceneComposition = "lower-left" | "lower-right" | "upper-left" | "upper-right" | "center-title";
export type SceneAtmosphere = "ash" | "rain" | "pollen" | "dust" | "embers" | "snow" | "ochre" | "paper" | "steam" | "signal";

export interface WorldPack {
  id: string;
  title: string;
  model: string;
  plate: string;
  background: string;
  haze: string;
  light: string;
  atmosphere: SceneAtmosphere;
  ariaDescription: string;
}

export interface EvidenceMedia {
  src: string;
  alt: string;
  label: string;
  credit: string;
  license: string;
  licenseUrl: string;
  sourceUrl: string;
  treatment: "portrait" | "object" | "diagram";
}

export interface ChapterScene {
  chapterId: string;
  world: number;
  composition: SceneComposition;
  focalPoint: string;
  scale: number;
  camera: [number, number, number];
  accent: string;
  prompt: string;
  evidenceMedia?: EvidenceMedia;
}

const world = (index: number, slug: string, rest: Omit<WorldPack, "id" | "model" | "plate">): WorldPack => ({
  id: slug,
  model: `/models/becoming-human/worlds/world-${String(index).padStart(2, "0")}-${slug}.glb`,
  plate: `/media/becoming-human/worlds/world-${String(index).padStart(2, "0")}-${slug}.webp`,
  ...rest,
});

export const becomingHumanWorlds: WorldPack[] = [
  world(0, "boundary", {
    title: "The Boundary",
    background: "#776958",
    haze: "rgba(217, 185, 141, .24)",
    light: "#ffd2a1",
    atmosphere: "ash",
    ariaDescription: "An ash-toned fern landscape is split by a river. A distant impact glow hangs over a crater and a dark geological boundary.",
  }),
  world(1, "canopy", {
    title: "The Canopy Cathedral",
    background: "#5f7665",
    haze: "rgba(146, 194, 148, .2)",
    light: "#cde2a6",
    atmosphere: "rain",
    ariaDescription: "A wet low-poly forest rises around a braided stream. Dense crowns, high branches and a small primate make the world vertical.",
  }),
  world(2, "ground", {
    title: "The Ground Mosaic",
    background: "#8e7c63",
    haze: "rgba(222, 187, 126, .24)",
    light: "#ffe0a4",
    atmosphere: "dust",
    ariaDescription: "An open woodland-grassland mosaic holds acacias, a winding river, hominin footprints, a stone core and a traveling group.",
  }),
  world(3, "horizon", {
    title: "The Long Horizon",
    background: "#344956",
    haze: "rgba(237, 115, 55, .2)",
    light: "#ffad72",
    atmosphere: "embers",
    ariaDescription: "A river corridor crosses a dusk grassland. People tend a hearth at a rock shelter while other travelers follow the horizon.",
  }),
  world(4, "many-camps", {
    title: "Many Camps, One Sky",
    background: "#677073",
    haze: "rgba(190, 211, 220, .18)",
    light: "#dce8eb",
    atmosphere: "snow",
    ariaDescription: "Three camps share one Pleistocene panorama across cold steppe, forest edge and open ground without any lineage placed above another.",
  }),
  world(5, "symbols", {
    title: "Worlds in the Mind",
    background: "#493a32",
    haze: "rgba(209, 97, 50, .2)",
    light: "#ffb37b",
    atmosphere: "ochre",
    ariaDescription: "An ochre-marked shelter opens onto coast, forest and cold terrain. A maker stands near the marks while multiple biomes continue beyond.",
  }),
  world(6, "settlement", {
    title: "The Seasonal Bargain",
    background: "#947e57",
    haze: "rgba(232, 202, 137, .2)",
    light: "#f1d89f",
    atmosphere: "pollen",
    ariaDescription: "A river joins fields, storage, clay, paths and a growing village. People work, carry and exchange on both banks.",
  }),
  world(7, "knowledge", {
    title: "The Reproducibility Workshop",
    background: "#8d725d",
    haze: "rgba(242, 218, 178, .17)",
    light: "#ffe0b0",
    atmosphere: "paper",
    ariaDescription: "A tactile workshop contains a press, loose pages, reusable type, a brass lens and the people who operate and observe them.",
  }),
  world(8, "energy", {
    title: "The Carbon City",
    background: "#4b555c",
    haze: "rgba(226, 150, 91, .16)",
    light: "#ffc06a",
    atmosphere: "steam",
    ariaDescription: "Factories, rail, workers, smoke, transmission and illuminated city blocks reveal energy as an entire material system.",
  }),
  world(9, "network", {
    title: "The Physical Network",
    background: "#213441",
    haze: "rgba(71, 218, 220, .15)",
    light: "#83ecdf",
    atmosphere: "signal",
    ariaDescription: "A physical city of server buildings, cables and workers carries pulses through streets that resemble—but remain—real infrastructure.",
  }),
];

const media = {
  laetoli: {
    src: "/media/becoming-human/evidence/laetoli-footprints.png",
    alt: "Published contour and side-view scans comparing modern footprints with the Laetoli G1-37 footprint.",
    label: "DIRECT EVIDENCE · LAETOLI G1-37",
    credit: "Raichlen, Gordon, Harcourt-Smith, Foster & Haas, PLOS ONE (2010)",
    license: "CC BY 2.5",
    licenseUrl: "https://creativecommons.org/licenses/by/2.5/",
    sourceUrl: "https://doi.org/10.1371/journal.pone.0009769.g001",
    treatment: "diagram",
  },
  biface: {
    src: "/media/becoming-human/evidence/met-biface.jpg",
    alt: "A photographed flint biface from the Metropolitan Museum of Art.",
    label: "OBJECT · FLINT BIFACE",
    credit: "The Metropolitan Museum of Art · 25.10.12r",
    license: "Public Domain / Open Access",
    licenseUrl: "https://www.metmuseum.org/policies/image-resources",
    sourceUrl: "https://www.metmuseum.org/art/collection/search/590926",
    treatment: "object",
  },
  erectus: {
    src: "/media/becoming-human/evidence/homo-erectus-skull.jpg",
    alt: "A museum cast of a Homo erectus skull photographed in Augsburg Naturmuseum.",
    label: "COMPARATIVE CAST · HOMO ERECTUS",
    credit: "Tiia Monto / Wikimedia Commons",
    license: "CC BY-SA 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Homo_erectus_skull.jpg",
    treatment: "portrait",
  },
  neanderthal: {
    src: "/media/becoming-human/evidence/neanderthal-skull.jpg",
    alt: "A Neanderthal skull cast photographed at the National Museum of Natural History.",
    label: "COMPARATIVE CAST · NEANDERTHAL",
    credit: "Adam Foster / Wikimedia Commons",
    license: "CC BY 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by/2.0/",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Homo_neanderthalensis_skull_-_National_Museum_of_Natural_History_(8587341141).jpg",
    treatment: "portrait",
  },
  tablet: {
    src: "/media/becoming-human/evidence/met-cuneiform-tablet.jpg",
    alt: "A cuneiform student exercise tablet from the Metropolitan Museum of Art.",
    label: "OBJECT · MEMORY IN CLAY",
    credit: "The Metropolitan Museum of Art · 86.11.283",
    license: "Public Domain / Open Access",
    licenseUrl: "https://www.metmuseum.org/policies/image-resources",
    sourceUrl: "https://www.metmuseum.org/art/collection/search/321878",
    treatment: "object",
  },
  astrolabe: {
    src: "/media/becoming-human/evidence/met-astrolabe.jpg",
    alt: "A photographed historical astrolabe from the Metropolitan Museum of Art.",
    label: "OBJECT · MEASURING THE SKY",
    credit: "The Metropolitan Museum of Art · 2025.130",
    license: "Public Domain / Open Access",
    licenseUrl: "https://www.metmuseum.org/policies/image-resources",
    sourceUrl: "https://www.metmuseum.org/art/collection/search/923639",
    treatment: "object",
  },
} satisfies Record<string, EvidenceMedia>;

export const becomingHumanScenes: ChapterScene[] = [
  { chapterId: "you-are-here", world: 9, composition: "lower-left", focalPoint: "62% 52%", scale: 1.08, camera: [0, 0, 0], accent: "#7de5da", prompt: "SCROLL BACKWARD THROUGH THE SYSTEMS AROUND YOU" },
  { chapterId: "after-impact", world: 0, composition: "lower-right", focalPoint: "38% 45%", scale: 1.12, camera: [-0.35, 0.08, 0.12], accent: "#ffb276", prompt: "DESCEND TO THE BOUNDARY IN THE ROCK" },
  { chapterId: "into-canopy", world: 1, composition: "lower-left", focalPoint: "58% 46%", scale: 1.13, camera: [0.24, 0.12, 0], accent: "#bad889", prompt: "LOOK UP · LIFE MOVES INTO THE BRANCHES" },
  { chapterId: "family-branches", world: 1, composition: "upper-right", focalPoint: "42% 48%", scale: 1.34, camera: [-0.28, 0.18, 0], accent: "#d2e5ad", prompt: "PULL THE BRANCHES APART · THERE IS NO LADDER" },
  { chapterId: "two-feet", world: 2, composition: "lower-right", focalPoint: "46% 56%", scale: 1.16, camera: [-0.2, -0.05, 0], accent: "#f2c36d", prompt: "FOLLOW THE TRACKWAY", evidenceMedia: media.laetoli },
  { chapterId: "stone-remembers", world: 2, composition: "upper-left", focalPoint: "37% 58%", scale: 1.42, camera: [-0.42, -0.18, 0], accent: "#efb75d", prompt: "STRIKE THE PLATFORM · READ THE FRACTURE", evidenceMedia: media.biface },
  { chapterId: "traveler", world: 3, composition: "lower-left", focalPoint: "63% 49%", scale: 1.08, camera: [0.32, 0.04, 0], accent: "#f3a36e", prompt: "COMPARE THE BODY TO THE HORIZON", evidenceMedia: media.erectus },
  { chapterId: "fire-problem", world: 3, composition: "upper-right", focalPoint: "37% 62%", scale: 1.34, camera: [-0.36, -0.18, 0], accent: "#ff6a2c", prompt: "FIND · KEEP · MAKE" },
  { chapterId: "out-of-africa-one", world: 3, composition: "lower-right", focalPoint: "65% 43%", scale: 1.04, camera: [0.42, 0.08, 0], accent: "#f3b575", prompt: "TRACE CORRIDORS, NOT CONQUERING ARROWS" },
  { chapterId: "world-of-humans", world: 4, composition: "center-title", focalPoint: "50% 50%", scale: 1.02, camera: [0, 0, 0], accent: "#dce9e9", prompt: "SEVERAL KINDS OF HUMAN · ONE SHARED SKY" },
  { chapterId: "sapiens-emerges", world: 4, composition: "lower-left", focalPoint: "58% 50%", scale: 1.14, camera: [0.22, 0.02, 0], accent: "#e0c59e", prompt: "A POPULATION TAKES SHAPE · NOT A FIRST COUPLE" },
  { chapterId: "we-met-others", world: 4, composition: "upper-right", focalPoint: "35% 48%", scale: 1.22, camera: [-0.3, 0.04, 0], accent: "#d3a47e", prompt: "TRACE A SEGMENT THAT NEVER FULLY LEFT", evidenceMedia: media.neanderthal },
  { chapterId: "worlds-in-mind", world: 5, composition: "lower-right", focalPoint: "35% 48%", scale: 1.22, camera: [-0.28, 0.12, 0], accent: "#e06b39", prompt: "MOVE THE LIGHT · DO NOT INVENT THE MEANING" },
  { chapterId: "every-horizon", world: 5, composition: "upper-left", focalPoint: "65% 52%", scale: 1.08, camera: [0.36, -0.06, 0], accent: "#86c2c4", prompt: "ONE SPECIES · MANY LEARNED TOOLKITS" },
  { chapterId: "settlement-bargain", world: 6, composition: "lower-left", focalPoint: "62% 52%", scale: 1.04, camera: [0.3, 0, 0], accent: "#d6bd63", prompt: "LET FOUR SEASONS PASS" },
  { chapterId: "external-memory", world: 6, composition: "upper-right", focalPoint: "33% 60%", scale: 1.42, camera: [-0.38, -0.12, 0], accent: "#c97645", prompt: "LEAVE A MARK AFTER THE SPEAKER IS GONE", evidenceMedia: media.tablet },
  { chapterId: "cities-networks", world: 6, composition: "lower-right", focalPoint: "63% 42%", scale: 1.14, camera: [0.28, 0.12, 0], accent: "#e0c688", prompt: "FOLLOW FOOD · MATERIAL · INFORMATION · DISEASE" },
  { chapterId: "knowledge-multiplies", world: 7, composition: "lower-left", focalPoint: "36% 51%", scale: 1.2, camera: [-0.28, 0, 0], accent: "#f1d2a1", prompt: "SET · INK · PRESS · REPEAT" },
  { chapterId: "measuring-invisible", world: 7, composition: "upper-right", focalPoint: "68% 50%", scale: 1.28, camera: [0.35, 0, 0], accent: "#94c7c4", prompt: "CALIBRATE · OBSERVE · RUN IT AGAIN", evidenceMedia: media.astrolabe },
  { chapterId: "energy-leap", world: 8, composition: "lower-left", focalPoint: "55% 48%", scale: 1.1, camera: [0.18, 0, 0], accent: "#f39b59", prompt: "COUNT OUTPUT · FUEL · LABOR · EMISSIONS" },
  { chapterId: "night-becomes-day", world: 8, composition: "upper-right", focalPoint: "72% 44%", scale: 1.18, camera: [0.38, 0.1, 0], accent: "#ffd06c", prompt: "GENERATOR · GRID · LOAD · MAINTENANCE" },
  { chapterId: "thinking-machines", world: 9, composition: "lower-right", focalPoint: "37% 50%", scale: 1.24, camera: [-0.32, 0.02, 0], accent: "#70d6cf", prompt: "BUILD A RULE FROM REPRESENTATIONS" },
  { chapterId: "planet-of-minds", world: 9, composition: "upper-left", focalPoint: "64% 46%", scale: 1.1, camera: [0.32, 0.08, 0], accent: "#65d3e0", prompt: "FOLLOW ONE SIGNAL THROUGH THE PHYSICAL NETWORK" },
  { chapterId: "tools-that-model-us", world: 9, composition: "center-title", focalPoint: "50% 50%", scale: 1.34, camera: [0, -0.06, 0], accent: "#b9a6ff", prompt: "CHANGE THE EXAMPLES · WATCH THE BOUNDARY MOVE" },
];

export const sceneForChapter = (chapterId: string) => {
  const scene = becomingHumanScenes.find((candidate) => candidate.chapterId === chapterId);
  if (!scene) throw new Error(`Missing Becoming Human scene for ${chapterId}`);
  return scene;
};
