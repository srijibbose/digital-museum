export type StoryVisualKind =
  | "branch"
  | "fossil"
  | "walker"
  | "trackway"
  | "stone"
  | "horizon"
  | "variation"
  | "fire"
  | "projectile"
  | "voice"
  | "lineage"
  | "genome"
  | "mark"
  | "routes"
  | "crossing"
  | "climate"
  | "field"
  | "household"
  | "body-culture"
  | "dense-life"
  | "tablet"
  | "navigation"
  | "encounter"
  | "print"
  | "instrument"
  | "energy"
  | "electricity"
  | "computer"
  | "network"
  | "phone"
  | "model";

export interface ActVisual {
  id: string;
  background: string;
  sourceLabel: string;
  sourceUrl: string;
  accent: string;
  accentSoft: string;
  ink: string;
  veil: string;
  focalPoints: readonly [string, string, string];
  ambientLabel: string;
}

export interface EpisodeVisual {
  kind: StoryVisualKind;
  composition: "left" | "right" | "center" | "split";
  focalPoint: string;
  backgroundOverride?: string;
  backgroundSourceLabel?: string;
  backgroundSourceUrl?: string;
  objectImage?: string;
  objectAlt?: string;
  objectCredit?: string;
  objectSourceUrl?: string;
  showObjectInScene?: boolean;
  objectLabel?: string;
  includeInEvidence?: boolean;
}

export const becomingHumanActVisuals: Record<string, ActVisual> = {
  "body-made-in-branches": {
    id: "body-made-in-branches",
    background: "/media/becoming-human/chronicle/act-01-branches.webp",
    sourceLabel: "Blue Grotto by Dimitrios Savva / Poly Haven · CC0",
    sourceUrl: "https://polyhaven.com/a/blue_grotto",
    accent: "#d8f16a",
    accentSoft: "rgba(216, 241, 106, 0.2)",
    ink: "#f3f0de",
    veil: "rgba(5, 17, 12, 0.64)",
    focalPoints: ["42% 52%", "55% 38%", "33% 63%"],
    ambientLabel: "WOODLAND / WATER / VOLCANIC ASH",
  },
  "hands-distance-fire-voice": {
    id: "hands-distance-fire-voice",
    background: "/media/becoming-human/chronicle/act-02-fire.webp",
    sourceLabel: "Cave Wall by Dimitrios Savva / Poly Haven · CC0",
    sourceUrl: "https://polyhaven.com/a/cave_wall",
    accent: "#ffb55f",
    accentSoft: "rgba(255, 181, 95, 0.2)",
    ink: "#fff0dc",
    veil: "rgba(25, 12, 6, 0.67)",
    focalPoints: ["54% 48%", "72% 44%", "32% 52%"],
    ambientLabel: "STONE / DISTANCE / SHELTER / FIRE",
  },
  "world-of-humans": {
    id: "world-of-humans",
    background: "/media/becoming-human/chronicle/act-03-many-humans.webp",
    sourceLabel: "Dikhololo Night by Greg Zaal / Poly Haven · CC0",
    sourceUrl: "https://polyhaven.com/a/dikhololo_night",
    accent: "#a7d6ff",
    accentSoft: "rgba(167, 214, 255, 0.18)",
    ink: "#f0f3ff",
    veil: "rgba(3, 8, 22, 0.64)",
    focalPoints: ["50% 33%", "67% 55%", "28% 50%"],
    ambientLabel: "SEVERAL LINEAGES / ONE PLEISTOCENE SKY",
  },
  "settlement-bargain": {
    id: "settlement-bargain",
    background: "/media/becoming-human/chronicle/act-04-settlement.webp",
    sourceLabel: "Belfast Farmhouse by Dimitrios Savva / Poly Haven · CC0",
    sourceUrl: "https://polyhaven.com/a/belfast_farmhouse",
    accent: "#f0d57d",
    accentSoft: "rgba(240, 213, 125, 0.22)",
    ink: "#fff8df",
    veil: "rgba(24, 19, 8, 0.58)",
    focalPoints: ["42% 54%", "63% 52%", "25% 56%"],
    ambientLabel: "SEASON / STORAGE / HOUSEHOLD / ARCHIVE",
  },
  "oceans-encounters-copies": {
    id: "oceans-encounters-copies",
    background: "/media/becoming-human/chronicle/act-05-oceans.webp",
    sourceLabel: "Sundowner Overlook by Greg Zaal / Poly Haven · CC0",
    sourceUrl: "https://polyhaven.com/a/sundowner_overlook",
    accent: "#90e0dd",
    accentSoft: "rgba(144, 224, 221, 0.2)",
    ink: "#edfdfb",
    veil: "rgba(3, 19, 24, 0.62)",
    focalPoints: ["22% 52%", "37% 48%", "13% 60%"],
    ambientLabel: "SHORE / VOYAGE / ENCOUNTER / COPY",
  },
  "instruments-energy-infrastructure": {
    id: "instruments-energy-infrastructure",
    background: "/media/becoming-human/chronicle/act-06-machines.webp",
    sourceLabel: "Aerodynamics Workshop by Greg Zaal / Poly Haven · CC0",
    sourceUrl: "https://polyhaven.com/a/aerodynamics_workshop",
    accent: "#ff7a4d",
    accentSoft: "rgba(255, 122, 77, 0.2)",
    ink: "#fff3e9",
    veil: "rgba(23, 10, 5, 0.67)",
    focalPoints: ["50% 45%", "72% 47%", "30% 48%"],
    ambientLabel: "MEASUREMENT / FUEL / GRID / DEPENDENCE",
  },
  "representations-machines": {
    id: "representations-machines",
    background: "/media/becoming-human/chronicle/act-07-networks.webp",
    sourceLabel: "Shanghai Bund by Greg Zaal / Poly Haven · CC0",
    sourceUrl: "https://polyhaven.com/a/shanghai_bund",
    accent: "#f391ff",
    accentSoft: "rgba(243, 145, 255, 0.2)",
    ink: "#fff1ff",
    veil: "rgba(15, 4, 21, 0.67)",
    focalPoints: ["50% 43%", "72% 48%", "27% 48%"],
    ambientLabel: "INSTRUCTION / FIBER / PLATFORM / POCKET",
  },
  "tools-that-model-us": {
    id: "tools-that-model-us",
    background: "/media/becoming-human/chronicle/act-08-models.webp",
    sourceLabel: "Sunset JHB Central by Greg Zaal / Poly Haven · CC0",
    sourceUrl: "https://polyhaven.com/a/sunset_jhbcentral",
    accent: "#99f6d4",
    accentSoft: "rgba(153, 246, 212, 0.2)",
    ink: "#effff9",
    veil: "rgba(3, 16, 18, 0.7)",
    focalPoints: ["52% 48%", "67% 46%", "30% 51%"],
    ambientLabel: "DATA / LABOR / MODEL / RESPONSIBILITY",
  },
};

const realEvidence = {
  footprints: {
    objectImage: "/media/becoming-human/evidence/laetoli-footprints.png",
    objectAlt: "Published contour and side-view comparison of the Laetoli G1-37 footprint",
    objectCredit: "Raichlen et al. / PLOS ONE · CC BY 2.5",
    objectSourceUrl: "https://doi.org/10.1371/journal.pone.0009769.g001",
  },
  erectus: {
    objectImage: "/media/becoming-human/evidence/homo-erectus-skull.jpg",
    objectAlt: "Comparative photograph of a Homo erectus skull cast",
    objectCredit: "Tiia Monto / Wikimedia Commons · CC BY-SA 3.0",
    objectSourceUrl: "https://commons.wikimedia.org/wiki/File:Homo_erectus_skull.jpg",
  },
  biface: {
    objectImage: "/media/becoming-human/evidence/met-biface.jpg",
    objectAlt: "Open Access photograph of a flint biface",
    objectCredit: "The Metropolitan Museum of Art · Public Domain",
    objectSourceUrl: "https://www.metmuseum.org/art/collection/search/590926",
  },
  neanderthal: {
    objectImage: "/media/becoming-human/evidence/neanderthal-skull.jpg",
    objectAlt: "Comparative photograph of a Neanderthal skull cast",
    objectCredit: "Adam Foster / Wikimedia Commons · CC BY 2.0",
    objectSourceUrl: "https://commons.wikimedia.org/wiki/File:Homo_neanderthalensis_skull_-_National_Museum_of_Natural_History_(8587341141).jpg",
  },
  tablet: {
    objectImage: "/media/becoming-human/evidence/met-cuneiform-tablet.jpg",
    objectAlt: "Open Access photograph of a Babylonian student exercise tablet",
    objectCredit: "The Metropolitan Museum of Art · Public Domain",
    objectSourceUrl: "https://www.metmuseum.org/art/collection/search/321878",
  },
  astrolabe: {
    objectImage: "/media/becoming-human/evidence/met-astrolabe.jpg",
    objectAlt: "Open Access photograph of a historical astrolabe",
    objectCredit: "The Metropolitan Museum of Art · Public Domain",
    objectSourceUrl: "https://www.metmuseum.org/art/collection/search/923639",
  },
  earth: {
    objectImage: "/media/becoming-human/chronicle/nasa-blue-marble.jpg",
    objectAlt: "NASA Blue Marble composite showing Earth as a physical world of land and ocean",
    objectCredit: "NASA Earth Observatory",
    objectSourceUrl: "https://earthobservatory.nasa.gov/features/BlueMarble",
  },
  nightEarth: {
    objectImage: "/media/becoming-human/chronicle/nasa-black-marble.jpg",
    objectAlt: "NASA Black Marble composite showing electric light across Earth at night",
    objectCredit: "NASA Earth Observatory",
    objectSourceUrl: "https://earthobservatory.nasa.gov/images/144898/earth-at-night",
  },
  sahelanthropus: {
    objectImage: "/media/becoming-human/evidence/sahelanthropus-skull.jpg",
    objectAlt: "Museum photograph of a Sahelanthropus tchadensis skull reconstruction",
    objectCredit: "Daderot / Wikimedia Commons · CC0",
    objectSourceUrl: "https://commons.wikimedia.org/wiki/File:Sahelanthropus_tchadensis_skull_-_Naturmuseum_Senckenberg_-_DSC02104.JPG",
  },
  schoningen: {
    objectImage: "/media/becoming-human/evidence/schoningen-wooden-artifacts.jpg",
    objectAlt: "Composite record of wooden spears and other Lower Palaeolithic artifacts from Schöningen",
    objectCredit: "Matthias Vogel / Wikimedia Commons · CC BY 4.0",
    objectSourceUrl: "https://commons.wikimedia.org/wiki/File:Sch%C3%B6ningen_wooden_artifacts_Lower_Palaeolithic.jpg",
  },
  blombos: {
    objectImage: "/media/becoming-human/evidence/blombos-ochre.jpg",
    objectAlt: "Engraved ochre fragment from Blombos Cave with a recorded line drawing beneath it",
    objectCredit: "Chris S. Henshilwood / Wikimedia Commons · CC BY-SA 4.0",
    objectSourceUrl: "https://commons.wikimedia.org/wiki/File:Blombo.jpg",
  },
  locomotiveShop: {
    objectImage: "/media/becoming-human/evidence/locomotive-shop.jpg",
    objectAlt: "Chicago and North Western Railway locomotive shop photographed in 1942",
    objectCredit: "Jack Delano / Library of Congress · Public Domain",
    objectSourceUrl: "https://commons.wikimedia.org/wiki/File:Chicago_and_Northwestern_railroad_locomotive_shop_fsac.1a34676u.jpg",
  },
  eniac: {
    objectImage: "/media/becoming-human/evidence/eniac.jpg",
    objectAlt: "Close photograph of ENIAC vacuum-tube panels",
    objectCredit: "TexasDex / Wikimedia Commons · CC BY-SA 3.0",
    objectSourceUrl: "https://commons.wikimedia.org/wiki/File:ENIAC_Penn2.jpg",
  },
  submarineCable: {
    objectImage: "/media/becoming-human/evidence/submarine-cable.png",
    objectAlt: "Technical cross-section of a submarine communications cable",
    objectCredit: "Mysid / Wikimedia Commons · Public Domain",
    objectSourceUrl: "https://commons.wikimedia.org/wiki/File:Submarine_cable_cross-section.svg",
  },
  stoneScan: {
    objectImage: "/media/becoming-human/objects/stone-core-hero.png",
    objectAlt: "Blender-lit CC0 scan of a fractured geological surface used as interpretive material atmosphere",
    objectCredit: "Blender composition by Loupe · rock_face_02 / Poly Haven · CC0",
    objectSourceUrl: "https://polyhaven.com/a/rock_face_02",
    objectLabel: "INTERPRETIVE MATERIAL",
    includeInEvidence: false,
  },
} as const;

const visual = (
  kind: StoryVisualKind,
  composition: EpisodeVisual["composition"],
  focalPoint: string,
  object?: Partial<EpisodeVisual>,
): EpisodeVisual => ({ kind, composition, focalPoint, ...object });

export const becomingHumanEpisodeVisuals: Record<string, EpisodeVisual> = {
  "shared-branch": visual("branch", "center", "48% 46%"),
  "skull-at-threshold": visual("fossil", "right", "70% 44%", realEvidence.sahelanthropus),
  "woodland-walker": visual("walker", "left", "33% 58%"),
  trackmakers: visual("trackway", "right", "63% 62%", realEvidence.footprints),
  "before-homo-broken-stone": visual("stone", "center", "55% 54%", realEvidence.stoneScan),
  "repeatable-edge": visual("stone", "left", "30% 51%"),
  "bodies-built-for-ground": visual("horizon", "right", "70% 46%", {
    ...realEvidence.erectus,
    backgroundOverride: "/media/becoming-human/chronicle/scene-traveler.webp",
    backgroundSourceLabel: "Plains Sunset by Greg Zaal / Poly Haven · CC0",
    backgroundSourceUrl: "https://polyhaven.com/a/plains_sunset",
  }),
  "five-skulls-dmanisi": visual("variation", "split", "49% 47%", realEvidence.erectus),
  "handaxe-idea": visual("stone", "right", "69% 48%", realEvidence.biface),
  "three-histories-fire": visual("fire", "center", "52% 55%", {
    backgroundOverride: "/media/becoming-human/chronicle/scene-fire.webp",
    backgroundSourceLabel: "Small Cave by Sergej Majboroda / Poly Haven · CC0",
    backgroundSourceUrl: "https://polyhaven.com/a/small_cave",
  }),
  "projectiles-and-hunt": visual("projectile", "left", "29% 52%", {
    ...realEvidence.schoningen,
    backgroundOverride: "/media/becoming-human/chronicle/scene-traveler.webp",
    backgroundSourceLabel: "Plains Sunset by Greg Zaal / Poly Haven · CC0",
    backgroundSourceUrl: "https://polyhaven.com/a/plains_sunset",
  }),
  "language-no-fossil": visual("voice", "right", "73% 48%"),
  "lineage-no-birthday": visual("lineage", "center", "48% 46%"),
  "neanderthal-lives": visual("fossil", "left", "30% 50%", realEvidence.neanderthal),
  "genome-before-face": visual("genome", "right", "68% 48%"),
  "we-met-others": visual("lineage", "split", "50% 51%", realEvidence.neanderthal),
  "marks-missing-meanings": visual("mark", "left", "27% 55%", realEvidence.blombos),
  "many-departures": visual("routes", "right", "71% 48%", realEvidence.earth),
  "water-crossing": visual("crossing", "center", "45% 58%", realEvidence.earth),
  "holocene-possibilities": visual("climate", "right", "72% 47%"),
  "farming-more-than-once": visual("field", "left", "25% 56%"),
  "river-household": visual("household", "right", "67% 54%"),
  "bodies-respond-culture": visual("body-culture", "center", "51% 51%"),
  "dense-life": visual("dense-life", "left", "31% 53%"),
  "memory-leaves-brain": visual("tablet", "right", "69% 48%", realEvidence.tablet),
  "islands-connected": visual("navigation", "left", "22% 49%", realEvidence.earth),
  "shore-two-sides": visual("encounter", "split", "34% 50%"),
  "page-becomes-thousands": visual("print", "right", "68% 52%"),
  "extending-senses": visual("instrument", "left", "29% 48%", realEvidence.astrolabe),
  "fossil-energy": visual("energy", "right", "72% 49%", {
    ...realEvidence.locomotiveShop,
    showObjectInScene: false,
    backgroundOverride: "/media/becoming-human/evidence/locomotive-shop.jpg",
    backgroundSourceLabel: "Chicago & North Western locomotive shop · Jack Delano / Library of Congress · Public Domain",
    backgroundSourceUrl: "https://commons.wikimedia.org/wiki/File:Chicago_and_Northwestern_railroad_locomotive_shop_fsac.1a34676u.jpg",
  }),
  "night-infrastructure": visual("electricity", "center", "51% 47%", {
    ...realEvidence.nightEarth,
    backgroundOverride: "/media/becoming-human/chronicle/scene-network.webp",
    backgroundSourceLabel: "Modern Buildings Night by Sergej Majboroda / Poly Haven · CC0",
    backgroundSourceUrl: "https://polyhaven.com/a/modern_buildings_night",
  }),
  "instructions-machinery": visual("computer", "left", "28% 49%", {
    ...realEvidence.eniac,
    showObjectInScene: false,
    backgroundOverride: "/media/becoming-human/evidence/eniac.jpg",
    backgroundSourceLabel: "ENIAC vacuum-tube panels · TexasDex / Wikimedia Commons · CC BY-SA 3.0",
    backgroundSourceUrl: "https://commons.wikimedia.org/wiki/File:ENIAC_Penn2.jpg",
  }),
  "planetary-machine": visual("network", "right", "71% 46%", {
    ...realEvidence.submarineCable,
    backgroundOverride: "/media/becoming-human/chronicle/scene-network.webp",
    backgroundSourceLabel: "Modern Buildings Night by Sergej Majboroda / Poly Haven · CC0",
    backgroundSourceUrl: "https://polyhaven.com/a/modern_buildings_night",
  }),
  "computer-enters-hand": visual("phone", "center", "52% 50%"),
  "learned-patterns": visual("model", "split", "50% 47%"),
};

export function getEpisodeVisual(episodeId: string): EpisodeVisual {
  return becomingHumanEpisodeVisuals[episodeId] ?? visual("branch", "center", "50% 50%");
}
