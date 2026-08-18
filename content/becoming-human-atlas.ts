export interface EarthMilestone {
  id: string;
  label: string;
  date: string;
  yearsAgo: number;
  sourceUrl: string;
}

export interface HumanTimeWindow {
  id: string;
  label: string;
  range: string;
  startOrder: number;
  endOrder: number;
}

export interface EpisodePlace {
  episodeId: string;
  label: string;
  latitude: number;
  longitude: number;
}

export const earthAgeYears = 4_540_000_000;

export const earthMilestones: EarthMilestone[] = [
  {
    id: "earth-forms",
    label: "Earth forms",
    date: "4.54 billion years ago",
    yearsAgo: earthAgeYears,
    sourceUrl: "https://pubs.usgs.gov/gip/geotime/age.html",
  },
  {
    id: "early-life",
    label: "Early evidence of life",
    date: "at least 3.5 billion years ago",
    yearsAgo: 3_500_000_000,
    sourceUrl: "https://www.nps.gov/subjects/fossils/fossils-through-geologic-time.htm",
  },
  {
    id: "animal-life",
    label: "Animal life expands",
    date: "about 541 million years ago",
    yearsAgo: 541_000_000,
    sourceUrl: "https://www.nps.gov/subjects/fossils/fossils-through-geologic-time.htm",
  },
  {
    id: "dinosaurs-end",
    label: "Non-avian dinosaurs disappear",
    date: "66 million years ago",
    yearsAgo: 66_000_000,
    sourceUrl: "https://naturalhistory.si.edu/exhibits/last-american-dinosaurs-discovering-lost-world",
  },
  {
    id: "human-lineage",
    label: "This exhibit begins",
    date: "about 8–6 million years ago",
    yearsAgo: 8_000_000,
    sourceUrl: "https://humanorigins.si.edu/education/introduction-human-evolution",
  },
];

export const dinosaurRange = {
  startYearsAgo: 230_000_000,
  endYearsAgo: 66_000_000,
  label: "DINOSAURS · ABOUT 230–66 MILLION YEARS AGO",
};

export const humanShareOfEarthHistory = (8_000_000 / earthAgeYears) * 100;

export const humanTimeWindows: HumanTimeWindow[] = [
  { id: "deep-ancestry", label: "Deep ancestry", range: "8–1 million years ago", startOrder: 1, endOrder: 9 },
  { id: "pleistocene", label: "Pleistocene people", range: "1 million–12,000 years ago", startOrder: 10, endOrder: 20 },
  { id: "settled-worlds", label: "Settled societies", range: "12,000 years ago–1450 CE", startOrder: 21, endOrder: 28 },
  { id: "planetary-systems", label: "Planetary systems", range: "1450 CE–today", startOrder: 29, endOrder: 35 },
];

export const episodePlaces: EpisodePlace[] = [
  { episodeId: "shared-branch", label: "Africa", latitude: 4, longitude: 20 },
  { episodeId: "skull-at-threshold", label: "Chad", latitude: 13, longitude: 18 },
  { episodeId: "woodland-walker", label: "Ethiopia", latitude: 9, longitude: 40 },
  { episodeId: "trackmakers", label: "Laetoli, Tanzania", latitude: -3, longitude: 35.35 },
  { episodeId: "before-homo-broken-stone", label: "Lomekwi, Kenya", latitude: 4, longitude: 36.2 },
  { episodeId: "repeatable-edge", label: "Olduvai, Tanzania", latitude: -3, longitude: 35.35 },
  { episodeId: "bodies-built-for-ground", label: "East Africa", latitude: 1, longitude: 36 },
  { episodeId: "five-skulls-dmanisi", label: "Dmanisi, Georgia", latitude: 41.33, longitude: 44.3 },
  { episodeId: "handaxe-idea", label: "Africa and Eurasia", latitude: 23, longitude: 28 },
  { episodeId: "three-histories-fire", label: "Africa and western Asia", latitude: 18, longitude: 35 },
  { episodeId: "projectiles-and-hunt", label: "Schöningen, Germany", latitude: 52.14, longitude: 10.78 },
  { episodeId: "language-no-fossil", label: "Africa", latitude: 2, longitude: 25 },
  { episodeId: "lineage-no-birthday", label: "Africa", latitude: -1, longitude: 22 },
  { episodeId: "neanderthal-lives", label: "Europe and western Asia", latitude: 46, longitude: 22 },
  { episodeId: "genome-before-face", label: "Denisova Cave, Siberia", latitude: 51.4, longitude: 84.68 },
  { episodeId: "we-met-others", label: "Eurasia", latitude: 38, longitude: 48 },
  { episodeId: "marks-missing-meanings", label: "Blombos Cave, South Africa", latitude: -34.42, longitude: 21.22 },
  { episodeId: "many-departures", label: "Africa into Eurasia", latitude: 22, longitude: 45 },
  { episodeId: "water-crossing", label: "Sahul", latitude: -15, longitude: 130 },
  { episodeId: "holocene-possibilities", label: "Worldwide", latitude: 12, longitude: -5 },
  { episodeId: "farming-more-than-once", label: "Several world regions", latitude: 31, longitude: 44 },
  { episodeId: "river-household", label: "Jordan Valley", latitude: 31.8, longitude: 35.5 },
  { episodeId: "bodies-respond-culture", label: "Europe and western Asia", latitude: 47, longitude: 12 },
  { episodeId: "dense-life", label: "Mesopotamia", latitude: 32, longitude: 45 },
  { episodeId: "memory-leaves-brain", label: "Mesopotamia", latitude: 30, longitude: 47 },
  { episodeId: "islands-connected", label: "Remote Pacific", latitude: -16, longitude: 167 },
  { episodeId: "shore-two-sides", label: "Atlantic Ocean", latitude: 22, longitude: -34 },
  { episodeId: "page-becomes-thousands", label: "Mainz, Europe", latitude: 50, longitude: 8.27 },
  { episodeId: "extending-senses", label: "Europe and wider precedents", latitude: 44, longitude: 14 },
  { episodeId: "fossil-energy", label: "Britain and industrial regions", latitude: 53, longitude: -2 },
  { episodeId: "night-infrastructure", label: "Growing electrical grids", latitude: 40, longitude: -18 },
  { episodeId: "instructions-machinery", label: "Philadelphia, United States", latitude: 39.95, longitude: -75.17 },
  { episodeId: "planetary-machine", label: "Geneva to a global network", latitude: 46.2, longitude: 6.14 },
  { episodeId: "computer-enters-hand", label: "California and global supply chains", latitude: 37.32, longitude: -122.03 },
  { episodeId: "learned-patterns", label: "Worldwide", latitude: 4, longitude: -5 },
];

export function earthPosition(yearsAgo: number) {
  return ((earthAgeYears - yearsAgo) / earthAgeYears) * 100;
}

export function mapPosition(longitude: number, latitude: number) {
  return {
    left: ((longitude + 180) / 360) * 100,
    top: ((90 - latitude) / 180) * 100,
  };
}
