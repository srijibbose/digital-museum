export type EvidenceConfidence =
  | "DIRECT EVIDENCE"
  | "STRONG INFERENCE"
  | "DEBATED"
  | "ARTISTIC RECONSTRUCTION";

export type ChapterInteraction =
  | "deep-time"
  | "grip"
  | "branches"
  | "anatomy"
  | "stone"
  | "stride"
  | "fire"
  | "migration"
  | "contemporaries"
  | "species"
  | "admixture"
  | "reveal"
  | "adaptation"
  | "settlement"
  | "memory"
  | "flows"
  | "print"
  | "measure"
  | "energy"
  | "grid"
  | "logic"
  | "network"
  | "model";

export interface BecomingHumanChapter {
  id: string;
  index: number;
  navTitle: string;
  eyebrow: string;
  hero: string;
  narrative: [string, string];
  interaction?: ChapterInteraction;
  interactionLabel?: string;
  evidence: {
    claim: string;
    confidence: EvidenceConfidence;
    observed: string;
    inferred: string;
    unknown: string;
    sourceLabel: string;
    sourceUrl: string;
  };
  sceneDescription: string;
  palette: {
    world: string;
    glow: string;
    light: string;
  };
  era: "biology" | "culture" | "systems";
}

export const becomingHumanChapters: BecomingHumanChapter[] = [
  {
    id: "you-are-here",
    index: 0,
    navTitle: "You Are Here",
    eyebrow: "NOW → 66 MILLION YEARS AGO",
    hero: "BECOMING HUMAN",
    narrative: [
      "Cities, writing, farming—even our own species—arrive almost at the end of Earth’s timeline. The human story runs on two clocks: the slow clock of biology and the much faster clock of culture.",
      "Move backward. Thousands of years become millions. Familiar history disappears.",
    ],
    interaction: "deep-time",
    interactionLabel: "COMPRESS DEEP TIME",
    evidence: {
      claim: "Geological, fossil and archaeological dates describe very different scales of the past.",
      confidence: "DIRECT EVIDENCE",
      observed: "Dated strata, fossils and artifacts place events within measured ranges.",
      inferred: "Timelines synthesize many dating methods; visual compression is an explanatory model.",
      unknown: "Dates can shift as methods improve and new material is discovered.",
      sourceLabel: "Smithsonian Human Origins — Introduction to Human Evolution",
      sourceUrl: "https://humanorigins.si.edu/education/introduction-human-evolution",
    },
    sceneDescription: "An abstract column of strata, stone, ember, marks and branching signals compresses into a single object against darkness.",
    palette: { world: "#080705", glow: "#b7612f", light: "#eee4d5" },
    era: "biology",
  },
  {
    id: "after-impact",
    index: 1,
    navTitle: "After the Impact",
    eyebrow: "~66 MILLION YEARS AGO",
    hero: "AN ENDING, LONG BEFORE US.",
    narrative: [
      "The Chicxulub impact is associated with a mass extinction that erased the non-avian dinosaurs and many other forms of life. Birds survived. So did mammals.",
      "The impact did not create humans. It changed ecosystems. Across immense spans of time, mammal lineages diversified into new ecological opportunities.",
    ],
    evidence: {
      claim: "The K–Pg extinction preceded hominins by tens of millions of years.",
      confidence: "DIRECT EVIDENCE",
      observed: "A globally identifiable boundary layer, impact markers and a major fossil turnover occur about 66 million years ago.",
      inferred: "Changed ecosystems opened ecological opportunities used by surviving lineages.",
      unknown: "The ecological pathway from survival to later diversification was complex and uneven.",
      sourceLabel: "Natural History Museum — What killed the dinosaurs?",
      sourceUrl: "https://www.nhm.ac.uk/discover/how-an-asteroid-caused-extinction-of-dinosaurs.html",
    },
    sceneDescription: "A sulfur-orange glow sinks into a pale geological boundary across a dark stratigraphic base.",
    palette: { world: "#100704", glow: "#f06425", light: "#e8d4bc" },
    era: "biology",
  },
  {
    id: "into-canopy",
    index: 2,
    navTitle: "Into the Canopy",
    eyebrow: "~60–25 MILLION YEARS AGO",
    hero: "A WORLD BUILT IN THREE DIMENSIONS.",
    narrative: [
      "Among primates, grasping hands and feet, flexible limbs, forward-facing vision, learning and social life evolved in many combinations.",
      "No single trait switched intelligence on. Bodies, senses and social learning accumulated as a mosaic.",
    ],
    interaction: "grip",
    interactionLabel: "TRY THE GRIP",
    evidence: {
      claim: "Primate traits occur in combinations across living and fossil lineages.",
      confidence: "STRONG INFERENCE",
      observed: "Skeletons, teeth and comparative anatomy preserve evidence of grasping and sensory orientation.",
      inferred: "Behavior and social learning are reconstructed from converging fossil and living-primate evidence.",
      unknown: "Modern primates are comparison points, not frozen versions of ancestors.",
      sourceLabel: "Smithsonian Human Origins — Human Characteristics",
      sourceUrl: "https://humanorigins.si.edu/human-characteristics",
    },
    sceneDescription: "Moss-green light reveals flexible arcs like branches wrapped around the central stone.",
    palette: { world: "#06100b", glow: "#3e8a5a", light: "#d8e1cf" },
    era: "biology",
  },
  {
    id: "family-branches",
    index: 3,
    navTitle: "The Family Branches",
    eyebrow: "OUR FAMILY TREE",
    hero: "THERE WAS NEVER A LADDER.",
    narrative: [
      "Humans did not evolve from the chimpanzees alive today. Our lineage and theirs trace back to ancestral populations in the deep past.",
      "Our own branch is not one species replacing the next. Multiple kinds of humans and close relatives overlapped for long stretches.",
    ],
    interaction: "branches",
    interactionLabel: "BREAK THE LADDER",
    evidence: {
      claim: "Evolutionary history branches; surviving species occupy tips, not higher rungs.",
      confidence: "STRONG INFERENCE",
      observed: "Fossil ages and anatomy reveal overlapping taxa and shared traits.",
      inferred: "Branching diagrams are testable hypotheses about relationships, not photographs of ancestry.",
      unknown: "The placement of several early hominins remains debated.",
      sourceLabel: "Smithsonian Human Origins — Introduction to Human Evolution",
      sourceUrl: "https://humanorigins.si.edu/education/introduction-human-evolution",
    },
    sceneDescription: "An asymmetric network branches above the artifact, with no central or highest endpoint.",
    palette: { world: "#05080a", glow: "#5db3bd", light: "#e4e5df" },
    era: "biology",
  },
  {
    id: "two-feet",
    index: 4,
    navTitle: "Two Feet",
    eyebrow: "~7–3 MILLION YEARS AGO",
    hero: "BEFORE BIGGER BRAINS, TWO FEET.",
    narrative: [
      "Upright walking did not arrive in one instant. Early hominins combined skull, pelvis, knee and foot traits in different ways while some climbing adaptations remained.",
      "Bipedalism is a mosaic, not a single savanna story and not a clean break from life in trees.",
    ],
    interaction: "anatomy",
    interactionLabel: "WALK THE EVIDENCE",
    evidence: {
      claim: "Australopithecus afarensis combined strong bipedal evidence with climbing-related anatomy.",
      confidence: "STRONG INFERENCE",
      observed: "Pelvis, femur, foot and trackway evidence record weight-bearing and locomotor anatomy.",
      inferred: "Soft tissue, gait details and appearance extend beyond what fossils directly preserve.",
      unknown: "No single cause for the emergence of habitual bipedalism is settled.",
      sourceLabel: "Smithsonian Human Origins — Walking Upright",
      sourceUrl: "https://humanorigins.si.edu/human-characteristics/walking-upright",
    },
    sceneDescription: "Bone-white fragments align around a grounded stone while a footprint-like ring rests over layered earth.",
    palette: { world: "#0f0c08", glow: "#bd8c52", light: "#eadfce" },
    era: "biology",
  },
  {
    id: "stone-remembers",
    index: 5,
    navTitle: "Stone Remembers",
    eyebrow: "TOOLMAKING BY ~3.3 MILLION YEARS AGO",
    hero: "STONE REMEMBERS THE STRIKE.",
    narrative: [
      "A sharp edge can be accidental. Repeated patterns of cores, flakes, angles and scars preserve sequences of action.",
      "The earliest known stone tools predate the oldest currently known members of our genus. Toolmaking is not a border between ape and human.",
    ],
    interaction: "stone",
    interactionLabel: "MAKE AN EDGE",
    evidence: {
      claim: "Lithic scars and refits can preserve how stone was worked.",
      confidence: "DIRECT EVIDENCE",
      observed: "Cores, flakes, platforms and bulbs of percussion record fracture events.",
      inferred: "Archaeologists infer technique and selection through pattern, context and experiment.",
      unknown: "The makers of the earliest known tools are uncertain.",
      sourceLabel: "Smithsonian Human Origins — The Early Human Tool Kit",
      sourceUrl: "https://humanorigins.si.edu/education/fun-facts/early-human-tool-kit",
    },
    sceneDescription: "A faceted graphite stone rotates under a narrow copper raking light, its broken planes clearly visible.",
    palette: { world: "#080807", glow: "#b17a45", light: "#e7dfd1" },
    era: "biology",
  },
  {
    id: "traveler",
    index: 6,
    navTitle: "A New Kind of Traveler",
    eyebrow: "FROM ~1.9 MILLION YEARS AGO",
    hero: "A BODY BUILT TO GO FARTHER.",
    narrative: [
      "With Homo erectus, the fossil record shows relatively long legs and body proportions increasingly suited to long-distance terrestrial life.",
      "A body, a tool kit and social knowledge moved together through environments that kept changing.",
    ],
    interaction: "stride",
    interactionLabel: "COMPARE THE STRIDE",
    evidence: {
      claim: "Homo erectus shows human-like limb proportions and a wide, long-lived distribution.",
      confidence: "STRONG INFERENCE",
      observed: "Postcranial fossils preserve limb and body proportions.",
      inferred: "Endurance, thermoregulation and mobility hypotheses integrate anatomy with ecology.",
      unknown: "Taxonomic boundaries and particular behavioral associations remain actively studied.",
      sourceLabel: "Smithsonian Human Origins — Homo erectus",
      sourceUrl: "https://humanorigins.si.edu/evidence/human-fossils/species/homo-erectus",
    },
    sceneDescription: "The sculpture leans toward a long ochre horizon, with rings stretching into an implied path.",
    palette: { world: "#120c07", glow: "#c58c43", light: "#eee1c8" },
    era: "biology",
  },
  {
    id: "fire-problem",
    index: 7,
    navTitle: "The Fire Problem",
    eyebrow: "A TECHNOLOGY WITH A LONG PREHISTORY",
    hero: "USING FIRE IS NOT MAKING IT.",
    narrative: [
      "A burned surface proves that something burned. It does not automatically prove that people lit the fire.",
      "Finding, maintaining and deliberately making fire are different evidential claims—and they demand different traces.",
    ],
    interaction: "fire",
    interactionLabel: "EVIDENCE OR INFERENCE?",
    evidence: {
      claim: "Evidence reported at Barnham supports deliberate fire-making about 400,000 years ago.",
      confidence: "STRONG INFERENCE",
      observed: "Heated sediments, fire-cracked flint and rare pyrite occur together at the site.",
      inferred: "The association is interpreted as deliberate ignition rather than only natural burning.",
      unknown: "Fire use has a longer, uneven and often difficult-to-interpret record.",
      sourceLabel: "Davis et al., Nature (2026) — Earliest evidence of making fire",
      sourceUrl: "https://doi.org/10.1038/s41586-025-09855-6",
    },
    sceneDescription: "A controlled ember glows within the stone while three concentric rings distinguish finding, keeping and making fire.",
    palette: { world: "#120401", glow: "#ff4b12", light: "#f2cfad" },
    era: "biology",
  },
  {
    id: "out-of-africa-one",
    index: 8,
    navTitle: "Out of Africa I",
    eyebrow: "BY ~1.8 MILLION YEARS AGO",
    hero: "THE RANGE EXPANDS.",
    narrative: [
      "For the first several million years of hominin evolution, the evidence is African. By around 1.8 million years ago, early humans were present near Dmanisi in the Caucasus.",
      "Do not imagine one migration arrow. Populations moved, paused, disappeared and moved again as climates and landscapes changed.",
    ],
    interaction: "migration",
    interactionLabel: "SCRUB THE EVIDENCE",
    evidence: {
      claim: "Early humans were present beyond Africa by around 1.8 million years ago.",
      confidence: "DIRECT EVIDENCE",
      observed: "Fossils and artifacts occur at dated sites outside Africa.",
      inferred: "Movement corridors are broad hypotheses, not exact routes.",
      unknown: "Many movements left no preserved or discovered trace.",
      sourceLabel: "Smithsonian Human Origins — Dmanisi fossil record",
      sourceUrl: "https://humanorigins.si.edu/evidence/human-fossils/fossils/d2282",
    },
    sceneDescription: "Pale points and wide translucent bands orbit the artifact like sites and uncertain movement corridors.",
    palette: { world: "#071013", glow: "#4c9fb0", light: "#d9e7e8" },
    era: "biology",
  },
  {
    id: "world-of-humans",
    index: 9,
    navTitle: "A World of Humans",
    eyebrow: "THE PLEISTOCENE",
    hero: "“HUMAN” WAS PLURAL.",
    narrative: [
      "Neanderthals, Denisovans, Homo erectus and other lineages occupied overlapping worlds and times.",
      "They were not unfinished versions of us. Each population carried its own evolutionary history.",
    ],
    interaction: "contemporaries",
    interactionLabel: "MEET THE CONTEMPORARIES",
    evidence: {
      claim: "Several human lineages coexisted during the Pleistocene.",
      confidence: "DIRECT EVIDENCE",
      observed: "Fossils, artifacts and ancient DNA place different lineages in overlapping date ranges.",
      inferred: "Ranges have fuzzy edges and reflect the current evidence record.",
      unknown: "Denisovan fossil and taxonomic interpretation continues to change.",
      sourceLabel: "Natural History Museum — Who were the Neanderthals?",
      sourceUrl: "https://www.nhm.ac.uk/discover/who-were-the-neanderthals.html",
    },
    sceneDescription: "Several parallel curtains of cold light surround the core at equal visual status.",
    palette: { world: "#07090c", glow: "#7f96b6", light: "#e0e2e5" },
    era: "biology",
  },
  {
    id: "sapiens-emerges",
    index: 10,
    navTitle: "Our Lineage Takes Shape",
    eyebrow: "AT LEAST ~300,000 YEARS AGO",
    hero: "A SPECIES HAS NO BIRTHDAY.",
    narrative: [
      "Fossils such as those from Jebel Irhoud preserve mosaics of traits associated with early members of our lineage.",
      "Homo sapiens emerged through populations and time across Africa—not as one first person stepping over an invisible line.",
    ],
    interaction: "species",
    interactionLabel: "MOVE THE BOUNDARY",
    evidence: {
      claim: "Early Homo sapiens evidence reaches to about 300,000 years ago.",
      confidence: "STRONG INFERENCE",
      observed: "Dated fossils preserve combinations of cranial and facial traits.",
      inferred: "Species names summarize gradual, patchy population change.",
      unknown: "Anatomical, genetic and taxonomic boundaries do not resolve to one instant.",
      sourceLabel: "Natural History Museum — How did Homo sapiens evolve?",
      sourceUrl: "https://www.nhm.ac.uk/discover/modern-humans-homo-sapiens-when-where-how-did-we-evolve.html",
    },
    sceneDescription: "Fragmentary planes gather into a coherent field but never fuse into a single first face.",
    palette: { world: "#100907", glow: "#bf745a", light: "#ead8cf" },
    era: "biology",
  },
  {
    id: "we-met-others",
    index: 11,
    navTitle: "We Met the Others",
    eyebrow: "CONTACT · MIGRATION · GENE FLOW",
    hero: "SOME OF THE OTHERS NEVER FULLY LEFT.",
    narrative: [
      "As Homo sapiens populations moved beyond Africa, they encountered other humans. Ancient DNA shows that some encounters included interbreeding.",
      "Neanderthal and Denisovan ancestry persists in varying patterns. Extinction did not mean complete genetic disappearance.",
    ],
    interaction: "admixture",
    interactionLabel: "TRACE A SEGMENT",
    evidence: {
      claim: "Ancient DNA supports gene flow among Homo sapiens, Neanderthal and Denisovan populations.",
      confidence: "STRONG INFERENCE",
      observed: "Sequenced genomes contain shared segments in patterns unlikely without admixture.",
      inferred: "Models estimate contact windows and ancestry histories from those patterns.",
      unknown: "Population averages are not identity or purity scores.",
      sourceLabel: "Natural History Museum — Neanderthal and Homo sapiens interbreeding",
      sourceUrl: "https://www.nhm.ac.uk/discover/news/2024/december/neanderthals-homo-sapiens-interbred-within-past-50000-years.html",
    },
    sceneDescription: "Two patterned signal paths cross and exchange a small segment without collapsing into one uniform strand.",
    palette: { world: "#09070f", glow: "#9a7dca", light: "#e6e1ef" },
    era: "biology",
  },
  {
    id: "worlds-in-mind",
    index: 12,
    navTitle: "Worlds in the Mind",
    eyebrow: "SYMBOLS ACCUMULATE OVER DEEP TIME",
    hero: "A MARK CAN OUTLIVE ITS MAKER.",
    narrative: [
      "Pigments, ornaments, engravings and images preserve signs that material culture carried meanings beyond immediate utility.",
      "The record is scattered and meaning is hard to recover. There was no single cave where imagination suddenly switched on.",
    ],
    interaction: "reveal",
    interactionLabel: "MOVE THE LIGHT",
    evidence: {
      claim: "Objects can preserve evidence of symbolic and social behavior, but their exact meanings rarely survive.",
      confidence: "STRONG INFERENCE",
      observed: "Pigment use, ornaments and engravings occur in archaeological context.",
      inferred: "Repeated production and placement can support social or symbolic interpretation.",
      unknown: "The specific concepts or stories attached to most marks are unrecoverable.",
      sourceLabel: "Smithsonian Human Origins — Language & Symbols",
      sourceUrl: "https://humanorigins.si.edu/human-characteristics/language-symbols",
    },
    sceneDescription: "Copper marks emerge from near-black rock under a movable pool of mineral-orange light.",
    palette: { world: "#0e0804", glow: "#dc6b2c", light: "#ebd1ad" },
    era: "culture",
  },
  {
    id: "every-horizon",
    index: 13,
    navTitle: "Across Every Horizon",
    eyebrow: "THE LAST ~70,000 YEARS AND EARLIER MOVEMENTS",
    hero: "ONE SPECIES. MANY WAYS TO LIVE.",
    narrative: [
      "Humans occupied coasts, deserts, forests, high latitudes and islands through learned combinations of clothing, shelter, fire, tools, food knowledge and exchange.",
      "Culture can move between minds faster than bodies genetically adapt to every new place.",
    ],
    interaction: "adaptation",
    interactionLabel: "CHANGE THE TOOLKIT",
    evidence: {
      claim: "Cultural flexibility supported occupation of radically different environments.",
      confidence: "STRONG INFERENCE",
      observed: "Sites preserve regionally specific tools, food remains, structures and materials.",
      inferred: "Many routes remain broad reconstructions, especially where submerged coastlines hide evidence.",
      unknown: "Arrival dates and pathways continue to be revised region by region.",
      sourceLabel: "Natural History Museum — Human dispersal out of Africa",
      sourceUrl: "https://www.nhm.ac.uk/discover/when-how-did-modern-humans-homo-sapiens-spread-out-of-africa.html",
    },
    sceneDescription: "The same central artifact is relit by coast-blue, dry ochre and cold-white horizons in sequence.",
    palette: { world: "#071012", glow: "#4499a4", light: "#e1e4dc" },
    era: "culture",
  },
  {
    id: "settlement-bargain",
    index: 14,
    navTitle: "The Settlement Bargain",
    eyebrow: "WITHIN THE LAST ~12,000 YEARS",
    hero: "FARMING CHANGES THE TERMS.",
    narrative: [
      "Domestication emerged through different processes in multiple regions. Settlement could support storage, growth and specialization.",
      "It could also deepen dependency, reshape disease exposure, intensify labor and transform ecosystems. This was a bargain, not a universal upgrade.",
    ],
    interaction: "settlement",
    interactionLabel: "ALLOCATE A SEASON",
    evidence: {
      claim: "Agriculture developed independently and produced both benefits and costs.",
      confidence: "STRONG INFERENCE",
      observed: "Seeds, bones, storage pits, settlement layers and isotopes record changing lifeways.",
      inferred: "Population, labor and health consequences varied across places and times.",
      unknown: "No one conceptual simulation represents a real village.",
      sourceLabel: "Smithsonian Human Origins — Humans Change the World",
      sourceUrl: "https://humanorigins.si.edu/human-characteristics/humans-change-world",
    },
    sceneDescription: "Seasonal paths settle into a warm rectilinear field while other paths remain mobile beyond it.",
    palette: { world: "#101006", glow: "#8ea847", light: "#e8dfbd" },
    era: "culture",
  },
  {
    id: "external-memory",
    index: 15,
    navTitle: "Memory Outside the Brain",
    eyebrow: "WRITING & RECORD SYSTEMS",
    hero: "A MEMORY THAT OUTLIVES THE SPEAKER.",
    narrative: [
      "Spoken knowledge depends on people carrying it. Durable marks can survive absence, distance and death.",
      "Writing systems emerged in different contexts. Shared symbols became infrastructure for counting, commanding, trading, praying, arguing and remembering.",
    ],
    interaction: "memory",
    interactionLabel: "LEAVE A RECORD",
    evidence: {
      claim: "Durable record systems externalize memory and scale coordination.",
      confidence: "DIRECT EVIDENCE",
      observed: "Tablets, inscriptions and documents preserve marks in archaeological context.",
      inferred: "How particular systems were learned, controlled and understood is reconstructed from context.",
      unknown: "Many early record systems remain partially deciphered or locally specific.",
      sourceLabel: "The Metropolitan Museum of Art — Cuneiform in Ancient Mesopotamia",
      sourceUrl: "https://www.metmuseum.org/essays/cuneiform-in-ancient-mesopotamia",
    },
    sceneDescription: "Three incised copper marks hold position while the surrounding world fades, emphasizing persistence.",
    palette: { world: "#100b06", glow: "#c77634", light: "#e9d8c1" },
    era: "culture",
  },
  {
    id: "cities-networks",
    index: 16,
    navTitle: "Cities, States, Networks",
    eyebrow: "COORDINATION AT SCALE",
    hero: "STRANGERS DEPEND ON STRANGERS.",
    narrative: [
      "Dense settlements concentrate people, food, labor, information, infrastructure and power. Routes connect communities that never meet face-to-face.",
      "The same network that moves grain can move ideas, pathogens, conflict and shocks.",
    ],
    interaction: "flows",
    interactionLabel: "ONE NETWORK. FOUR FLOWS.",
    evidence: {
      claim: "Connectivity increases both capability and interdependence.",
      confidence: "STRONG INFERENCE",
      observed: "Roads, goods, records and settlement patterns show large-scale flows.",
      inferred: "Network reconstructions model how systems linked places and people.",
      unknown: "Power and access were uneven within every network.",
      sourceLabel: "The Metropolitan Museum of Art — Heilbrunn Timeline of Art History",
      sourceUrl: "https://www.metmuseum.org/toah/",
    },
    sceneDescription: "A branching signal network brightens as different flows travel through the same topology.",
    palette: { world: "#070b0b", glow: "#55a692", light: "#dce5df" },
    era: "culture",
  },
  {
    id: "knowledge-multiplies",
    index: 17,
    navTitle: "Knowledge Multiplies",
    eyebrow: "REPRODUCTION CHANGES INFORMATION",
    hero: "ONE PAGE BECOMES A THOUSAND.",
    narrative: [
      "Societies developed different printing traditions, materials and mechanisms across long histories.",
      "When a stable form produces repeated copies, information becomes easier to distribute, compare, contest and preserve.",
    ],
    interaction: "print",
    interactionLabel: "SET · INK · PRESS",
    evidence: {
      claim: "Printing is a distributed history of systems, materials and adoption—not one isolated invention.",
      confidence: "DIRECT EVIDENCE",
      observed: "Printed artifacts, blocks, type and presses preserve production techniques.",
      inferred: "Economic and cultural consequences depended on paper, literacy and distribution institutions.",
      unknown: "The effect of cheaper copying differed across societies.",
      sourceLabel: "Library of Congress — The Books That Shaped America",
      sourceUrl: "https://www.loc.gov/exhibits/books-that-shaped-america/",
    },
    sceneDescription: "One copper mark repeats in measured rows, each impression sharing the same origin form.",
    palette: { world: "#0c0906", glow: "#a96f39", light: "#eee8da" },
    era: "culture",
  },
  {
    id: "measuring-invisible",
    index: 18,
    navTitle: "Measuring the Invisible",
    eyebrow: "INSTRUMENTS · METHODS · REPLICATION",
    hero: "OUR SENSES GET EXTENSIONS.",
    narrative: [
      "Lenses reveal scales the unaided eye cannot resolve. Clocks, balances and shared measures turn impressions into quantities others can test.",
      "Science is a family of methods, instruments, records and communities that makes some claims more accountable to evidence.",
    ],
    interaction: "measure",
    interactionLabel: "RUN IT AGAIN",
    evidence: {
      claim: "Measurement and replication make observations more comparable and testable.",
      confidence: "DIRECT EVIDENCE",
      observed: "Instruments and recorded trials preserve procedures and results.",
      inferred: "Models link repeated measurements to explanations while making uncertainty visible.",
      unknown: "No method removes every source of bias or error.",
      sourceLabel: "Smithsonian Institution — History of Science collections",
      sourceUrl: "https://www.si.edu/spotlight/science",
    },
    sceneDescription: "Time rings align into a calibrated optical instrument with a quiet, repeatable pulse.",
    palette: { world: "#060b0e", glow: "#579bb5", light: "#e1e7e8" },
    era: "systems",
  },
  {
    id: "energy-leap",
    index: 19,
    navTitle: "The Energy Leap",
    eyebrow: "INDUSTRIALIZATION",
    hero: "ENERGY MULTIPLIES WORK.",
    narrative: [
      "Concentrated fossil energy changed scale: heat drove pressure, pressure drove motion, and motion moved goods and production at new rates.",
      "The same leap accelerated extraction, pollution and greenhouse-gas emissions. Capability and consequence grew together.",
    ],
    interaction: "energy",
    interactionLabel: "REVEAL THE COSTS",
    evidence: {
      claim: "Industrialization increased energy and material throughput while intensifying environmental costs.",
      confidence: "DIRECT EVIDENCE",
      observed: "Machines, production records and atmospheric measurements preserve changes in output and emissions.",
      inferred: "Causal histories connect energy systems, institutions, labor and adoption.",
      unknown: "Benefits and burdens were distributed profoundly unevenly.",
      sourceLabel: "Our World in Data — Energy Production and Consumption",
      sourceUrl: "https://ourworldindata.org/energy-production-consumption",
    },
    sceneDescription: "The ember expands into an iron-orange mechanical pulse while soot-dark rings rotate around it.",
    palette: { world: "#100603", glow: "#d45425", light: "#e7d4c2" },
    era: "systems",
  },
  {
    id: "night-becomes-day",
    index: 20,
    navTitle: "Night Becomes Day",
    eyebrow: "THE ELECTRIC AGE",
    hero: "THE BREAKTHROUGH IS A SYSTEM.",
    narrative: [
      "A lamp is useful only when power can be generated, distributed and controlled. Electrification joins generators, wires, standards, businesses, devices and users.",
      "Electric light is the hook; shared infrastructure is the transformation.",
    ],
    interaction: "grid",
    interactionLabel: "BRING UP THE GRID",
    evidence: {
      claim: "Electrification depended on coordinated generation, distribution, standards and loads.",
      confidence: "DIRECT EVIDENCE",
      observed: "Generators, grids, meters, patents and adoption records preserve system development.",
      inferred: "No one bulb or inventor explains electrification as a social infrastructure.",
      unknown: "Access, cost and grid reliability remain uneven globally.",
      sourceLabel: "Smithsonian — Lighting a Revolution",
      sourceUrl: "https://americanhistory.si.edu/lighting/",
    },
    sceneDescription: "A thin warm filament lifts from darkness, then powers multiple branching lines instead of shining alone.",
    palette: { world: "#080706", glow: "#ffc66d", light: "#f8edd2" },
    era: "systems",
  },
  {
    id: "thinking-machines",
    index: 21,
    navTitle: "Thinking in Machines",
    eyebrow: "PROGRAMMABLE COMPUTATION",
    hero: "A MACHINE FOLLOWS A REPRESENTATION.",
    narrative: [
      "Calculation becomes programmable when instructions and data can be represented in forms a machine manipulates.",
      "Mechanical devices, relays, electronic switches, transistors and circuits form a cumulative history—not one instant computer.",
    ],
    interaction: "logic",
    interactionLabel: "BUILD A DECISION",
    evidence: {
      claim: "General-purpose computation combines representation, logic, memory and control.",
      confidence: "DIRECT EVIDENCE",
      observed: "Machines, source programs, circuits and documents preserve implementation histories.",
      inferred: "Layering many simple operations enables complex behavior.",
      unknown: "Technical capability alone does not determine social use.",
      sourceLabel: "Computer History Museum — Timeline of Computer History",
      sourceUrl: "https://www.computerhistory.org/timeline/",
    },
    sceneDescription: "Binary signal nodes switch across a graphite circuit landscape while the stone becomes a processor-like core.",
    palette: { world: "#04090a", glow: "#43b9bd", light: "#dff0ed" },
    era: "systems",
  },
  {
    id: "planet-of-minds",
    index: 22,
    navTitle: "A Planet of Minds",
    eyebrow: "NETWORKS",
    hero: "DISTANCE COLLAPSES. INFRASTRUCTURE DOES NOT.",
    narrative: [
      "A message that feels weightless still travels through radios, cables, routers, data centers and machines owned and operated somewhere.",
      "Networks amplify collaboration and access—and also attention competition, misinformation, surveillance and systemic dependence.",
    ],
    interaction: "network",
    interactionLabel: "SEND ONE MESSAGE",
    evidence: {
      claim: "Digital communication depends on physical infrastructure and layered protocols.",
      confidence: "DIRECT EVIDENCE",
      observed: "Cables, radios, routers, servers and route records make network paths material.",
      inferred: "Simplified route diagrams explain dependencies without reproducing a live traceroute.",
      unknown: "The path, processing and ownership behind any one message can be opaque to its sender.",
      sourceLabel: "Internet Society — How the Internet Works",
      sourceUrl: "https://www.internetsociety.org/internet/how-it-works/",
    },
    sceneDescription: "Signal lines leave the object, cross a globe-like ring and return through a visibly physical route.",
    palette: { world: "#04080d", glow: "#538fe5", light: "#e1e8ef" },
    era: "systems",
  },
  {
    id: "tools-that-model-us",
    index: 23,
    navTitle: "Tools That Model Us",
    eyebrow: "NOW",
    hero: "THE TOOL LEARNS FROM THE RECORD.",
    narrative: [
      "Machine-learning systems infer statistical structure from examples. Their capabilities depend on human-created data, algorithms, hardware, energy, infrastructure, labor, evaluation and institutions.",
      "AI is not a biological species above Homo sapiens. It belongs to the fast cultural layer humans built on top of slow biological evolution.",
    ],
    interaction: "model",
    interactionLabel: "TEACH A TINY MODEL",
    evidence: {
      claim: "Modern AI systems are engineered statistical tools embedded in human technical and institutional systems.",
      confidence: "DIRECT EVIDENCE",
      observed: "Training procedures, evaluations, hardware and datasets document engineered model development.",
      inferred: "A tiny classifier can illustrate learning from examples but is not a miniature production model.",
      unknown: "Capability, limitations and social effects change quickly and require ongoing evaluation.",
      sourceLabel: "NIST — AI Risk Management Framework",
      sourceUrl: "https://www.nist.gov/itl/ai-risk-management-framework",
    },
    sceneDescription: "Every prior motif—stone, ember, mark, ring and signal—returns as one stacked instrument whose layers change at different rates.",
    palette: { world: "#050508", glow: "#a47bea", light: "#f0edf2" },
    era: "systems",
  },
];

export const becomingHumanStack = [
  ["GENES", "Inherited change across generations."],
  ["BODIES", "Anatomy and physiology shaped across evolutionary time."],
  ["CULTURE", "Learned behavior copied, changed and taught."],
  ["EXTERNAL MEMORY", "Stone, marks, writing, print and digital storage."],
  ["NETWORKS & INSTITUTIONS", "Coordination beyond the individual."],
  ["MACHINES", "Energy and information amplified."],
] as const;

export const becomingHumanMotifs = [
  "FOOTPRINT",
  "FLAKE",
  "EMBER",
  "MARK",
  "TABLET",
  "PAGE",
  "FILAMENT",
  "BIT",
  "TOKEN",
] as const;
