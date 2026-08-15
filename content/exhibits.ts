export type ExhibitStatus = "active" | "hidden" | "coming-soon";
export type ExhibitPosterKind =
  | "living-atlas"
  | "thirteen-minutes"
  | "full-throttle";

export type ExhibitWing = {
  id: string;
  title: string;
};

export type ExhibitMetric = {
  label: string;
  value: string;
};

export type ExhibitRecord = {
  id: string;
  number: string;
  title: string;
  tagline: string;
  synopsis: string;
  href: `/exhibits/${string}`;
  wing: ExhibitWing;
  duration: string;
  status: ExhibitStatus;
  poster: ExhibitPosterKind;
  theme: string;
  metrics: readonly [ExhibitMetric, ExhibitMetric, ExhibitMetric];
};

const systemsAndMachines = {
  id: "systems-and-machines",
  title: "Systems & Machines",
} as const;

export const EXHIBITS: readonly ExhibitRecord[] = [
  {
    id: "thirteen-minutes",
    number: "002",
    title: "Thirteen Minutes",
    tagline: "Apollo 11's descent, told through the systems that nearly ran out of time.",
    synopsis:
      "Follow Eagle from powered descent to touchdown while the computer overloads, the landing site slips long, and Mission Control decides what still matters.",
    href: "/exhibits/thirteen-minutes",
    wing: systemsAndMachines,
    duration: "10–15 min",
    status: "active",
    poster: "thirteen-minutes",
    theme: "Descent record",
    metrics: [
      { label: "Altitude", value: "50,000 → 0 ft" },
      { label: "System", value: "AGC priority" },
      { label: "Outcome", value: "Touchdown" },
    ],
  },
  {
    id: "full-throttle",
    number: "003",
    title: "Full Throttle",
    tagline: "Pull a jet engine apart, trace one breath of air, then take control.",
    synopsis:
      "Meet the seven parts inside a high-bypass turbofan and discover how two nested shafts turn continuous fire into an elegant, self-feeding loop.",
    href: "/exhibits/full-throttle",
    wing: systemsAndMachines,
    duration: "8 min",
    status: "active",
    poster: "full-throttle",
    theme: "Living machine",
    metrics: [
      { label: "Components", value: "7 parts" },
      { label: "Architecture", value: "2 spools" },
      { label: "Finale", value: "Live throttle" },
    ],
  },
  {
    id: "living-atlas",
    number: "001",
    title: "The Living Atlas",
    tagline: "A body in conversation with itself.",
    synopsis:
      "Follow touch, breath, pulse, and fuel through the systems that keep a human body in continuous conversation.",
    href: "/exhibits/living-atlas",
    wing: { id: "the-body", title: "The Body" },
    duration: "12–15 min",
    status: "hidden",
    poster: "living-atlas",
    theme: "Anatomy cutaway",
    metrics: [
      { label: "Systems", value: "5 chapters" },
      { label: "Format", value: "3D anatomy" },
      { label: "State", value: "Hidden" },
    ],
  },
] as const;

export function getActiveExhibits() {
  return EXHIBITS.filter((exhibit) => exhibit.status === "active");
}

export function getExhibitById(id: string) {
  return EXHIBITS.find((exhibit) => exhibit.id === id);
}

export function getActiveWings() {
  const wings = new Map<string, { wing: ExhibitWing; count: number }>();

  for (const exhibit of getActiveExhibits()) {
    const entry = wings.get(exhibit.wing.id);
    if (entry) entry.count += 1;
    else wings.set(exhibit.wing.id, { wing: exhibit.wing, count: 1 });
  }

  return Array.from(wings.values());
}
