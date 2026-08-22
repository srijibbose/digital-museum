export const MARS_DEEP_TIME_MAX_MYA = 4100;
export const MARS_DEEP_TIME_ENTRY_MYA = 3700;

type MarsVisualParameters = {
  atmosphere: number;
  water: number;
  waterLine: number;
  ice: number;
  haze: number;
  oxidation: number;
};

export type MarsDeepTimeAnchor = MarsVisualParameters & {
  id: string;
  timeMya: number;
  period: string;
  title: string;
  description: string;
  evidenceSummary: string;
  reconstructionSummary: string;
  confidence: string;
  sourceIds: readonly string[];
};

export type MarsDeepTimeState = MarsVisualParameters & {
  timeMya: number;
  dateLabel: string;
  period: string;
  title: string;
  description: string;
  evidenceSummary: string;
  reconstructionSummary: string;
  confidence: string;
  sourceIds: readonly string[];
  authored: boolean;
  interpolationLabel: string;
  olderAnchorTimeMya: number;
  youngerAnchorTimeMya: number;
};

export const MARS_DEEP_TIME_ANCHORS = [
  {
    id: "early-record",
    timeMya: 4100,
    period: "Early Noachian",
    title: "Early record",
    description:
      "The oldest surviving crust records intense impacts and rapid resurfacing on a planet whose global appearance remains difficult to reconstruct.",
    evidenceSummary: "Ancient crust, impact record, and global geologic mapping.",
    reconstructionSummary: "Substantial atmosphere and limited topography-guided lowland water.",
    confidence: "Terrain is observed; water extent and atmospheric density are low-confidence hypotheses.",
    sourceIds: ["usgs-mars-global-map", "nasa-mars-mola", "nasa-maven"],
    atmosphere: 0.84,
    water: 0.38,
    waterLine: 0.34,
    ice: 0.18,
    haze: 0.72,
    oxidation: 0.28,
  },
  {
    id: "valley-networks",
    timeMya: 3800,
    period: "Late Noachian",
    title: "Valley networks",
    description:
      "Widespread branching valleys and altered minerals record repeated surface runoff and water-rock interaction across the ancient highlands.",
    evidenceSummary: "Mapped valley networks, lake basins, and water-altered minerals.",
    reconstructionSummary: "Peak hydrology signal with a denser modelled atmosphere and hazier limb.",
    confidence: "Landforms are observed; global climate and connected water extent remain model-dependent.",
    sourceIds: ["usgs-mars-global-map", "nasa-mars-mola", "nasa-maven"],
    atmosphere: 0.78,
    water: 0.92,
    waterLine: 0.48,
    ice: 0.12,
    haze: 0.82,
    oxidation: 0.38,
  },
  {
    id: "lake-worlds",
    timeMya: 3500,
    period: "Late Noachian–Early Hesperian",
    title: "Lake worlds",
    description:
      "Deltas, crater lakes, and enormous outflow channels preserve a complex history of standing water, river deposition, and episodic floods.",
    evidenceSummary: "Jezero delta and lake deposits, channels, and sedimentary rocks.",
    reconstructionSummary: "Regional lowland water with a declining carbon-dioxide atmosphere.",
    confidence: "Lake and delta evidence is strong; simultaneous global water coverage is not established.",
    sourceIds: ["nasa-perseverance-water", "usgs-mars-global-map", "nasa-maven"],
    atmosphere: 0.6,
    water: 0.72,
    waterLine: 0.42,
    ice: 0.2,
    haze: 0.58,
    oxidation: 0.52,
  },
  {
    id: "drying-world",
    timeMya: 3000,
    period: "Hesperian–Amazonian transition",
    title: "Drying world",
    description:
      "Long-lived surface water became less stable as atmospheric loss, cooling, volcanism, and episodic floods reshaped an increasingly arid planet.",
    evidenceSummary: "Younger volcanic plains, outflow channels, and declining resurfacing rates.",
    reconstructionSummary: "Retreating surface water, thinner haze, and increasingly oxidised terrain.",
    confidence: "The transition is well supported, but its absolute timing varies by crater chronology model.",
    sourceIds: ["usgs-mars-global-map", "nasa-maven"],
    atmosphere: 0.38,
    water: 0.24,
    waterLine: 0.28,
    ice: 0.32,
    haze: 0.36,
    oxidation: 0.68,
  },
  {
    id: "ice-cycles",
    timeMya: 1000,
    period: "Amazonian",
    title: "Ice cycles",
    description:
      "A cold desert persisted while orbital cycles repeatedly shifted ice between the poles and middle latitudes.",
    evidenceSummary: "Polar layered deposits, glacial landforms, and near-surface ice.",
    reconstructionSummary: "Present-like desert colour with a stronger modelled ice signal.",
    confidence: "Ice migration is supported; this global frame compresses many separate climate cycles.",
    sourceIds: ["usgs-mars-global-map", "nasa-mars-mola"],
    atmosphere: 0.15,
    water: 0.04,
    waterLine: 0.16,
    ice: 0.78,
    haze: 0.2,
    oxidation: 0.9,
  },
  {
    id: "present-day",
    timeMya: 0,
    period: "Late Amazonian",
    title: "Present day",
    description:
      "Modern Mars is a cold, oxidised desert with a thin carbon-dioxide atmosphere, polar caps, buried ice, and only transient brines considered possible.",
    evidenceSummary: "Orbital mapping, landers, rovers, and present atmospheric measurements.",
    reconstructionSummary: "No reconstructed surface water; the delivered Viking/MOLA world remains visible.",
    confidence: "Observed and processed present-day products provide the highest-confidence global state.",
    sourceIds: ["usgs-mars", "nasa-mars-mola", "nasa-maven"],
    atmosphere: 0.06,
    water: 0,
    waterLine: 0.08,
    ice: 0.42,
    haze: 0.1,
    oxidation: 1,
  },
] as const satisfies readonly MarsDeepTimeAnchor[];

const VISUAL_KEYS = [
  "atmosphere",
  "water",
  "waterLine",
  "ice",
  "haze",
  "oxidation",
] as const satisfies readonly (keyof MarsVisualParameters)[];

export function clampMarsTime(value: number) {
  if (!Number.isFinite(value)) return MARS_DEEP_TIME_ENTRY_MYA;
  return Math.max(0, Math.min(MARS_DEEP_TIME_MAX_MYA, value));
}

export function formatMarsTime(value: number) {
  const timeMya = clampMarsTime(value);
  if (timeMya === 0) return "Present day";
  if (timeMya >= 1000) {
    const billions = timeMya / 1000;
    return `${billions.toFixed(Number.isInteger(billions) ? 0 : 1)} billion years ago`;
  }
  return `${Math.round(timeMya)} million years ago`;
}

export function marsTimeToSlider(timeMya: number) {
  return MARS_DEEP_TIME_MAX_MYA - clampMarsTime(timeMya);
}

export function sliderToMarsTime(sliderValue: number) {
  return clampMarsTime(MARS_DEEP_TIME_MAX_MYA - sliderValue);
}

function mix(from: number, to: number, progress: number) {
  return from + (to - from) * progress;
}

export function resolveMarsDeepTimeState(value: number): MarsDeepTimeState {
  const timeMya = clampMarsTime(value);
  const exact = MARS_DEEP_TIME_ANCHORS.find((anchor) => anchor.timeMya === timeMya);
  let older: MarsDeepTimeAnchor = MARS_DEEP_TIME_ANCHORS[0];
  let younger: MarsDeepTimeAnchor = MARS_DEEP_TIME_ANCHORS.at(-1) ?? MARS_DEEP_TIME_ANCHORS[0];

  for (let index = 0; index < MARS_DEEP_TIME_ANCHORS.length - 1; index += 1) {
    const candidateOlder = MARS_DEEP_TIME_ANCHORS[index];
    const candidateYounger = MARS_DEEP_TIME_ANCHORS[index + 1];
    if (timeMya <= candidateOlder.timeMya && timeMya >= candidateYounger.timeMya) {
      older = candidateOlder;
      younger = candidateYounger;
      break;
    }
  }

  const span = older.timeMya - younger.timeMya;
  const progress = span === 0 ? 0 : (older.timeMya - timeMya) / span;
  const nearest = exact ?? (progress <= 0.5 ? older : younger);
  const parameters = Object.fromEntries(
    VISUAL_KEYS.map((key) => [key, mix(older[key], younger[key], progress)]),
  ) as MarsVisualParameters;

  return {
    ...parameters,
    timeMya,
    dateLabel: formatMarsTime(timeMya),
    period: nearest.period,
    title: nearest.title,
    description: nearest.description,
    evidenceSummary: nearest.evidenceSummary,
    reconstructionSummary: nearest.reconstructionSummary,
    confidence: nearest.confidence,
    sourceIds: nearest.sourceIds,
    authored: Boolean(exact),
    interpolationLabel: exact
      ? "Authored scientific state"
      : "Interpolated between authored states",
    olderAnchorTimeMya: older.timeMya,
    youngerAnchorTimeMya: younger.timeMya,
  };
}
