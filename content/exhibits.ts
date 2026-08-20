export interface ExhibitWing {
  id: string;
  code: string;
  title: string;
  description: string;
}

export interface ExhibitVisualTheme {
  variant: "living-atlas" | "thirteen-minutes" | "jet-engine" | "becoming-human" | "generic";
  accentColor: string;
  badgeText: string;
  metrics: {
    label: string;
    value: string;
  }[];
}

export interface ExhibitDefinition {
  id: string;
  slug: string;
  exhibitNumber: string;
  wing: ExhibitWing;
  title: string;
  tagline: string;
  synopsis: string;
  curatorNote: string;
  readingTime: string;
  interactionType: string;
  tags: string[];
  route: string;
  enabled: boolean;
  featured?: boolean;
  order: number;
  visualTheme: ExhibitVisualTheme;
}

export const WINGS: Record<string, ExhibitWing> = {
  body: {
    id: "wing-01",
    code: "Wing 01",
    title: "The Body",
    description: "Biological systems, sensory perception, and internal architectures",
  },
  machines: {
    id: "wing-02",
    code: "Wing 02",
    title: "Systems & Machines",
    description: "Complex engineered systems, aerospace telemetry, and pivotal human decisions",
  },
  origins: {
    id: "wing-03",
    code: "Wing 03",
    title: "Origins & Futures",
    description: "Deep time, human evolution, cumulative culture, and the systems shaping what comes next",
  },
  space: {
    id: "wing-04",
    code: "Wing 04",
    title: "Space",
    description: "Real planetary imagery and mission data, explored as physical specimens",
  },
};

export const EXHIBIT_REGISTRY: ExhibitDefinition[] = [
  {
    id: "becoming-human",
    slug: "becoming-human",
    exhibitNumber: "EXH. 004",
    wing: WINGS.origins,
    title: "Becoming Human",
    tagline: "We did not inherit the world in a straight line.",
    synopsis:
      "Travel from the shared ape branch through walking, fire, hunting, settlement, writing, industry, networks, the computer in your hand, and tools that learn from our record.",
    curatorNote: "A 35-episode flagship journey grounded in fossil evidence, museum objects, archival photography, open research, and one Blender-composed geological scan.",
    readingTime: "Approx. 70 min complete",
    interactionType: "Cinematic Atlas · Evidence Lens · 35 Instruments",
    tags: ["Human Evolution", "Paleoanthropology", "Cumulative Culture", "AI & Society"],
    route: "/exhibits/becoming-human",
    enabled: true,
    featured: true,
    order: 1,
    visualTheme: {
      variant: "becoming-human",
      accentColor: "#c96b39",
      badgeText: "PREMIUM FLAGSHIP",
      metrics: [
        { label: "Deep Time", value: "8 MA" },
        { label: "Episodes", value: "35" },
        { label: "Clocks", value: "4" },
      ],
    },
  },
  {
    id: "living-atlas",
    slug: "living-atlas",
    exhibitNumber: "EXH. 001",
    wing: WINGS.body,
    title: "The Living Atlas",
    tagline: "One body. Many conversations.",
    synopsis:
      "Follow a touch, a breath, and a heartbeat through the intricate neural and vascular systems that keep a human body in constant conversation with itself.",
    curatorNote: "Features real-time heartbeat rhythm simulation and layered 3D anatomy visualization.",
    readingTime: "12–15 min read",
    interactionType: "Interactive Anatomy · Real-Time Audio",
    tags: ["Human Physiology", "Interactive 3D", "Bio-Mechanics", "Soundscape"],
    route: "/exhibits/living-atlas",
    enabled: true,
    featured: false,
    order: 1,
    visualTheme: {
      variant: "living-atlas",
      accentColor: "#e07a5f",
      badgeText: "BIOMETRIC EXPLORER",
      metrics: [
        { label: "Resting Pulse", value: "72 BPM" },
        { label: "Neural Speed", value: "120 m/s" },
        { label: "Vascular Span", value: "60k mi" },
      ],
    },
  },
  {
    id: "jet-engine",
    slug: "jet-engine",
    exhibitNumber: "EXH. 003",
    wing: WINGS.machines,
    title: "The Engine Is a River",
    tagline: "Follow air as it becomes flight.",
    synopsis: "A tactile, animated turbofan exhibit: wake the machine, trace the air, open the core, and tune your own flight profile.",
    curatorNote: "A simplified explanatory model of a high-bypass turbofan, built for exploration rather than live aircraft telemetry.",
    readingTime: "8–12 min experience",
    interactionType: "Animated Cutaway · 3D Inspection · Engine Playground",
    tags: ["Jet Propulsion", "Fluid Dynamics", "Interactive 3D", "Flight Systems"],
    route: "/exhibits/jet-engine",
    enabled: true,
    featured: true,
    order: 2,
    visualTheme: {
      variant: "jet-engine",
      accentColor: "#d86f3d",
      badgeText: "LIVE ENGINE STUDY",
      metrics: [
        { label: "Airflow", value: "74%" },
        { label: "Core Temp", value: "1,420 K" },
        { label: "Thrust", value: "136 kN" },
      ],
    },
  },
  {
    id: "thirteen-minutes",
    slug: "thirteen-minutes",
    exhibitNumber: "EXH. 002",
    wing: WINGS.machines,
    title: "Thirteen Minutes",
    tagline: "The last minutes of Apollo 11's descent, told as a systems story.",
    synopsis:
      "Step into the cockpit of the Lunar Module Eagle during the final thirteen minutes before touchdown as unexpected radar overloads trigger the legendary 1202 program alarm.",
    curatorNote: "Synchronized with historical NASA flight transcripts, telemetry logs, and low-poly Eagle lunar descent trajectory.",
    readingTime: "7–10 min read",
    interactionType: "3D Spacecraft · Telemetry HUD · Archival Audio",
    tags: ["Apollo 11", "Flight Telemetry", "Real-Time 3D", "1202 Program Alarm"],
    route: "/exhibits/thirteen-minutes",
    enabled: true,
    featured: true,
    order: 3,
    visualTheme: {
      variant: "thirteen-minutes",
      accentColor: "#48cae4",
      badgeText: "TELEMETRY ARCHIVE",
      metrics: [
        { label: "Initial Alt", value: "50,000 ft" },
        { label: "Descent Velocity", value: "3,700 mph" },
        { label: "Alarm Code", value: "PROG 1202" },
      ],
    },
  },
  {
    id: "moon",
    slug: "moon",
    exhibitNumber: "EXH. 005",
    wing: WINGS.space,
    title: "The Moon",
    tagline: "Real spacecraft imagery, not a sculpt.",
    synopsis:
      "Turn a globe built from actual Lunar Reconnaissance Orbiter photography, fly to Apollo and Chandrayaan-3 landing sites by their real coordinates, and see why the lunar 'seas' were never wet.",
    curatorNote: "Built from a real LRO/USGS photographic mosaic — no generated or sculpted geometry.",
    readingTime: "8–12 min experience",
    interactionType: "Interactive Globe · Real Coordinates · Mission Sites",
    tags: ["The Moon", "Apollo Program", "Chandrayaan-3", "Interactive 3D"],
    route: "/exhibits/moon",
    enabled: true,
    featured: true,
    order: 4,
    visualTheme: {
      variant: "generic",
      accentColor: "#cfd8e3",
      badgeText: "SPACE WING",
      metrics: [
        { label: "Mission Sites", value: "3" },
        { label: "Named Craters", value: "4" },
        { label: "Distance", value: "384,400 km" },
      ],
    },
  },
  {
    id: "earth",
    slug: "earth",
    exhibitNumber: "EXH. 006",
    wing: WINGS.space,
    title: "Earth",
    tagline: "One planet, seen the way satellites see it.",
    synopsis:
      "NASA's Blue Marble and Black Marble composites on a globe you can turn — from the Himalayas to the Mariana Trench, then flip to city lights after dark.",
    curatorNote: "Built from NASA's Blue Marble and Black Marble satellite composites.",
    readingTime: "8–12 min experience",
    interactionType: "Interactive Globe · Day/Night Toggle · Real Coordinates",
    tags: ["Earth", "Geography", "Satellite Imagery", "Interactive 3D"],
    route: "/exhibits/earth",
    enabled: true,
    featured: true,
    order: 5,
    visualTheme: {
      variant: "generic",
      accentColor: "#6fb8d9",
      badgeText: "SPACE WING",
      metrics: [
        { label: "Deepest Point", value: "10,935 m" },
        { label: "Highest Point", value: "8,849 m" },
        { label: "Fresh Water Locked", value: "60%" },
      ],
    },
  },
];

/**
 * Returns all active exhibits sorted by exhibition order.
 */
export function getActiveExhibits(): ExhibitDefinition[] {
  return EXHIBIT_REGISTRY.filter((exhibit) => exhibit.enabled).sort(
    (a, b) => a.order - b.order
  );
}

/**
 * Returns enabled exhibits selected for the museum lobby.
 */
export function getFeaturedExhibits(): ExhibitDefinition[] {
  return getActiveExhibits().filter((exhibit) => exhibit.featured);
}

/**
 * Lookup an exhibit by its URL slug.
 */
export function getExhibitBySlug(slug: string): ExhibitDefinition | undefined {
  return EXHIBIT_REGISTRY.find((exhibit) => exhibit.slug === slug);
}

/**
 * Check if a specific exhibit is enabled and currently showing.
 */
export function isExhibitEnabled(slug: string): boolean {
  const exhibit = getExhibitBySlug(slug);
  return Boolean(exhibit?.enabled);
}

/**
 * Returns all wings with active exhibit counts.
 */
export function getActiveWings(
  exhibits: readonly ExhibitDefinition[] = getActiveExhibits(),
): { wing: ExhibitWing; count: number }[] {
  const map = new Map<string, { wing: ExhibitWing; count: number }>();

  for (const exhibit of exhibits) {
    const existing = map.get(exhibit.wing.id);
    if (existing) {
      existing.count += 1;
    } else {
      map.set(exhibit.wing.id, { wing: exhibit.wing, count: 1 });
    }
  }

  return Array.from(map.values());
}
