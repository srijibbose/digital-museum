export type StoryClock = "biology" | "gene-culture" | "culture" | "technology";
export type StoryThread = "bodies" | "making" | "cooperation" | "mobility" | "symbolic-life" | "food-systems" | "external-memory" | "exchange" | "measurement" | "energy" | "computation" | "networks" | "machine-learning";
export type EvidenceStatus = "direct" | "strong-inference" | "contested" | "interpretive-model";
export type InteractionKind = "compare" | "sort-evidence" | "assemble" | "simulate" | "trace" | "reveal" | "perspective" | "system" | "tiny-model";

export interface StorySource {
  label: string;
  url: string;
  kind: "research" | "museum" | "institution" | "primary-record";
}

export interface BecomingHumanEpisode {
  id: string;
  order: number;
  actId: string;
  title: string;
  dateLabel: string;
  location: string;
  clock: StoryClock;
  thread: StoryThread;
  capability: string;
  hook: string;
  story: string;
  evidence: { object: string; status: EvidenceStatus; uncertainty: string };
  sources: StorySource[];
  interaction: {
    kind: InteractionKind;
    config: { prompt: string; options: string[]; disclaimer?: string };
  };
  mediaSearchTerms: string[];
}

export interface BecomingHumanAct {
  id: string;
  order: number;
  title: string;
  clockFocus: StoryClock[];
  environment: string;
  thesis: string;
  episodeIds: string[];
}

export interface BecomingHumanFinale {
  id: "what-changed-fastest";
  title: string;
  hook: string;
  story: string;
  layers: Array<{ label: string; clock: StoryClock; description: string }>;
  interaction: BecomingHumanEpisode["interaction"];
  sources: StorySource[];
}

const src = (label: string, url: string, kind: StorySource["kind"] = "institution"): StorySource => ({ label, url, kind });
const S = {
  intro: src("Smithsonian Human Origins — Introduction to Human Evolution", "https://humanorigins.si.edu/education/introduction-human-evolution", "museum"),
  walking: src("Smithsonian Human Origins — Walking Upright", "https://humanorigins.si.edu/human-characteristics/walking-upright", "museum"),
  fossils: src("Smithsonian Human Origins — Human Fossils", "https://humanorigins.si.edu/evidence/human-fossils", "museum"),
  characteristics: src("Smithsonian Human Origins — Human Characteristics", "https://humanorigins.si.edu/human-characteristics", "museum"),
  lomekwi: src("Harmand et al. — Lomekwi 3 stone tools", "https://doi.org/10.1038/nature14464", "research"),
  toolkit: src("Smithsonian — The Early Human Tool Kit", "https://humanorigins.si.edu/education/fun-facts/early-human-tool-kit", "museum"),
  erectus: src("Smithsonian — Homo erectus", "https://humanorigins.si.edu/evidence/human-fossils/species/homo-erectus", "museum"),
  dmanisi: src("Smithsonian — Dmanisi D2282", "https://humanorigins.si.edu/evidence/human-fossils/fossils/d2282", "museum"),
  fire: src("Davis et al. — Earliest evidence of making fire", "https://doi.org/10.1038/s41586-025-09855-6", "research"),
  language: src("Smithsonian — Language & Symbols", "https://humanorigins.si.edu/human-characteristics/language-symbols", "museum"),
  sapiens: src("Natural History Museum — How did Homo sapiens evolve?", "https://www.nhm.ac.uk/discover/modern-humans-homo-sapiens-when-where-how-did-we-evolve.html", "museum"),
  neanderthal: src("Natural History Museum — Who were the Neanderthals?", "https://www.nhm.ac.uk/discover/who-were-the-neanderthals.html", "museum"),
  denisova: src("Max Planck Institute — Denisova Genome Project", "https://www.eva.mpg.de/genetics/genome-projects/denisova/"),
  admixture: src("Natural History Museum — Neanderthal and sapiens interbreeding", "https://www.nhm.ac.uk/discover/news/2024/december/neanderthals-homo-sapiens-interbred-within-past-50000-years.html", "museum"),
  dispersal: src("Natural History Museum — Human dispersal out of Africa", "https://www.nhm.ac.uk/discover/when-how-did-modern-humans-homo-sapiens-spread-out-of-africa.html", "museum"),
  sahul: src("Clarkson et al. — Madjedbebe occupation", "https://doi.org/10.1038/nature22968", "research"),
  agriculture: src("Smithsonian — Humans Change the World", "https://humanorigins.si.edu/human-characteristics/humans-change-world", "museum"),
  lactase: src("Evershed et al. — Dairying and lactase persistence", "https://doi.org/10.1038/s41586-022-05010-7", "research"),
  met: src("The Met — Heilbrunn Timeline of Art History", "https://www.metmuseum.org/toah/", "museum"),
  writing: src("The Met — Cuneiform in Ancient Mesopotamia", "https://www.metmuseum.org/essays/cuneiform-in-ancient-mesopotamia", "museum"),
  austronesian: src("Nature — Genomic insights into Austronesian expansion", "https://doi.org/10.1038/s41586-021-04108-8", "research"),
  encounter: src("National Park Service — The Columbian Exchange", "https://www.nps.gov/articles/000/columbian-exchange.htm"),
  printing: src("UNESCO Memory of the World — Jikji", "https://www.unesco.org/en/memory-world/jikji"),
  science: src("Smithsonian — History of Science collections", "https://www.si.edu/spotlight/science", "museum"),
  energy: src("Our World in Data — Energy Production and Consumption", "https://ourworldindata.org/energy-production-consumption", "research"),
  electricity: src("Smithsonian — Lighting a Revolution", "https://americanhistory.si.edu/lighting/", "museum"),
  computing: src("Computer History Museum — Timeline", "https://www.computerhistory.org/timeline/", "museum"),
  web: src("CERN — The birth of the Web", "https://home.cern/science/computing/birth-web"),
  internet: src("Internet Society — How the Internet works", "https://www.internetsociety.org/internet/how-it-works/"),
  iphone: src("Apple — Apple Reinvents the Phone", "https://www.apple.com/newsroom/2007/01/09Apple-Reinvents-the-Phone/", "primary-record"),
  ai: src("NIST — AI Risk Management Framework", "https://www.nist.gov/itl/ai-risk-management-framework"),
} satisfies Record<string, StorySource>;

const e = (episode: BecomingHumanEpisode) => episode;
export const becomingHumanEpisodes: BecomingHumanEpisode[] = [
  e({
    id: "shared-branch", order: 1, actId: "body-made-in-branches", title: "The Human Lineage Begins", dateLabel: "ABOUT 8–6 MILLION YEARS AGO", location: "Africa", clock: "biology", thread: "bodies", capability: "A new evolutionary lineage began—long before Homo sapiens existed.",
    hook: "An African ape population split into different lineages. One eventually led to humans; another led to chimpanzees and bonobos.",
    story: "Humans, chimpanzees, bonobos, gorillas and orangutans are living tips on a branching ape family tree. Genetic comparisons place the split between the lineages leading to humans and to chimpanzees and bonobos within a broad range, not at one photographed instant. The ancestral populations were not modern chimpanzees, and no fossil can yet be crowned as the single common ancestor. This opening removes the ladder before the journey begins: evolution produces populations, branches, overlap and extinction, while every species alive today has traveled the same amount of time.",
    evidence: { object: "Branching ape phylogeny with genetic divergence ranges", status: "strong-inference", uncertainty: "Divergence dates and fossil placements near the split remain debated." }, sources: [S.intro, S.fossils],
    interaction: { kind: "compare", config: { prompt: "Rotate the family tree and inspect every living tip.", options: ["living tips", "shared populations", "date ranges"] } }, mediaSearchTerms: ["ape phylogeny scientific diagram", "African Miocene forest", "branching evolution sculpture"],
  }),
  e({
    id: "skull-at-threshold", order: 2, actId: "body-made-in-branches", title: "Possible Early Upright Walking", dateLabel: "ABOUT 7–6 MILLION YEARS AGO", location: "Toros-Menalla, Chad", clock: "biology", thread: "bodies", capability: "Standing and walking upright may have begun very early in the human lineage.",
    hook: "A skull from Chad may show that an early hominin held its head above an upright spine. The evidence is limited, so scientists still debate how it moved.",
    story: "Sahelanthropus tchadensis is known chiefly from cranial remains recovered far from the East African sites that once dominated popular accounts. The position and orientation of the opening where the spinal cord enters the skull have contributed to arguments about upright posture. Yet a skull cannot provide a complete walking cycle, and researchers continue to debate locomotion and evolutionary placement. The exhibit treats the fossil as a question at the threshold of the hominin story: a powerful piece of evidence whose missing body prevents a simple verdict.",
    evidence: { object: "Sahelanthropus cranial evidence proxy", status: "contested", uncertainty: "Locomotion and exact phylogenetic placement cannot be settled from the cranium alone." }, sources: [S.walking, S.fossils],
    interaction: { kind: "reveal", config: { prompt: "Separate preserved anatomy from reconstruction and debate.", options: ["survives", "reconstructed", "debated"] } }, mediaSearchTerms: ["Sahelanthropus cranium cast", "foramen magnum comparison", "Chad fossil landscape"],
  }),
  e({
    id: "woodland-walker", order: 3, actId: "body-made-in-branches", title: "Walking Upright While Still Climbing", dateLabel: "4.4 MILLION YEARS AGO", location: "Middle Awash, Ethiopia", clock: "biology", thread: "bodies", capability: "The body combined walking on the ground with continued movement in trees.",
    hook: "Ardipithecus could move on two legs on the ground and still climb trees. Upright walking developed in stages, not in one sudden change.",
    story: "Ardipithecus ramidus lived in a wooded environment and preserves a mosaic of locomotor traits. Its pelvis and other anatomy have informed arguments for terrestrial bipedality, while its grasping foot and upper body retained adaptations useful in trees. The combination matters more than a march toward modern form. Different parts of a body can respond to different pressures and functions at different rates. By keeping branches overhead and uneven ground below, this episode replaces the old single-cause savanna story with a body navigating several dimensions.",
    evidence: { object: "Pelvis, foot and environmental-context comparison", status: "strong-inference", uncertainty: "The frequency and mechanics of different locomotor behaviors remain reconstructed from incomplete anatomy." }, sources: [S.walking],
    interaction: { kind: "compare", config: { prompt: "Compare anatomical demands on a branch and on the ground.", options: ["pelvis", "foot", "upper limb", "habitat"] } }, mediaSearchTerms: ["Ardipithecus reconstruction", "Ethiopian woodland paleoenvironment", "primate grasping foot"],
  }),
  e({
    id: "trackmakers", order: 4, actId: "body-made-in-branches", title: "Footprints Prove Two-Legged Walking", dateLabel: "3.66 MILLION YEARS AGO", location: "Laetoli, Tanzania", clock: "biology", thread: "bodies", capability: "Two-legged walking was established before large human brains evolved.",
    hook: "Footprints preserved in volcanic ash show several hominins walking upright across the same ground in Tanzania.",
    story: "At Laetoli, hominins crossed a surface that preserved footprints beneath later volcanic deposits. The trackways provide direct traces of moving bodies rather than isolated bones, but even footprints require interpretation: surface moisture, speed, body size and later deformation affect their shape. Australopithecus afarensis is a plausible maker because its fossils occur in the region and period, not because a name is written beside the trail. The Trackmakers remain anonymous, allowing their ordinary act of walking to carry the scene without invented biography.",
    evidence: { object: "Laetoli trackway elevation and footprint comparisons", status: "direct", uncertainty: "The exact makers, group relationship, speed and circumstances are not known." }, sources: [S.walking],
    interaction: { kind: "compare", config: { prompt: "Overlay measurements, then remove every interpretive label.", options: ["surface scan", "modern comparison", "gait inference"] } }, mediaSearchTerms: ["Laetoli G1-37 scan", "volcanic ash trackway", "Australopithecus walking"],
  }),
  e({
    id: "before-homo-broken-stone", order: 5, actId: "hands-distance-fire-voice", title: "The First Known Stone Tools", dateLabel: "3.3 MILLION YEARS AGO", location: "Lomekwi 3, Kenya", clock: "biology", thread: "making", capability: "Deliberately breaking stone created sharp edges for tasks the hands could not do alone.",
    hook: "Someone in Kenya deliberately struck stones to make usable edges. These tools are older than the earliest fossils currently assigned to Homo.",
    story: "Large cores, flakes and anvils at Lomekwi preserve repeated force applied to stone about 3.3 million years ago. Their age predates the oldest fossils currently assigned to Homo, breaking the convenient equation between our genus and technology. Archaeologists can study fracture surfaces, impact points and spatial context, but the maker’s species and intended tasks remain uncertain. The object is therefore both an achievement and a warning: material sequences can survive for millions of years while the mind and identity behind them disappear.",
    evidence: { object: "Lomekwian core, flake and anvil relationships", status: "direct", uncertainty: "Maker identity, exact use and the breadth of the tradition remain unknown." }, sources: [S.lomekwi],
    interaction: { kind: "assemble", config: { prompt: "Refit detached flakes to recover a sequence of impacts.", options: ["core", "flake", "impact point", "anvil"] } }, mediaSearchTerms: ["Lomekwi stone tools", "West Turkana landscape", "stone fracture macro"],
  }),
  e({
    id: "repeatable-edge", order: 6, actId: "hands-distance-fire-voice", title: "Toolmaking Becomes a Learned Skill", dateLabel: "FROM ABOUT 2.6 MILLION YEARS AGO", location: "Africa, later beyond", clock: "gene-culture", thread: "making", capability: "Toolmaking techniques could be copied, taught, and carried across generations.",
    hook: "Early humans repeatedly struck stone cores to produce sharp flakes. The repeated patterns show that toolmaking had become a learned tradition.",
    story: "Oldowan technologies include recurring ways of striking cores to produce sharp flakes. A single broken stone might be accidental; patterned assemblages, refits and experimental replication reveal ordered manufacture. The deeper transformation is social. A technique can persist only when attention, practice and access to suitable material connect one learner to others. This episode introduces cumulative culture without pretending that archaeologists can hear a lesson or identify its teacher. The visitor experiences how much easier a sequence becomes after watching another set of hands.",
    evidence: { object: "Oldowan cores, flakes, refits and experimental comparison", status: "strong-inference", uncertainty: "Teaching method, language use and individual intentions are not preserved." }, sources: [S.toolkit],
    interaction: { kind: "simulate", config: { prompt: "Repeat a demonstrated strike sequence.", options: ["platform", "angle", "force"], disclaimer: "Authored outcomes explain fracture principles, not real-time stone physics." } }, mediaSearchTerms: ["Oldowan core flakes", "experimental knapping", "toolmaking hands"],
  }),
  e({
    id: "bodies-built-for-ground", order: 7, actId: "hands-distance-fire-voice", title: "Early Humans Travel Farther", dateLabel: "FROM ABOUT 1.9 MILLION YEARS AGO", location: "Africa and Eurasia", clock: "biology", thread: "mobility", capability: "Bodies suited to long-distance walking expanded the range of human populations.",
    hook: "Homo erectus had longer legs and body proportions suited to sustained movement on the ground, helping populations travel through larger territories.",
    story: "Homo erectus sensu lato combined relatively long legs, human-like body proportions and an exceptionally broad, long-lived distribution. Those traits made extended terrestrial movement increasingly important, but bodies never travel alone. Water knowledge, food, tools, cooperation, climate and learned routes shaped where populations could persist across variable terrain. Thermoregulation and endurance hypotheses remain valuable research questions rather than a single explanation for humanity. A small walking figure against a large horizon makes the capability legible without turning migration into heroic conquest.",
    evidence: { object: "Discrete limb-proportion and body-form comparisons", status: "strong-inference", uncertainty: "Soft tissue, behavior and the relative importance of endurance remain inferred." }, sources: [S.erectus],
    interaction: { kind: "compare", config: { prompt: "Match forward speed across separately labelled bodies.", options: ["limb proportions", "stride", "heat model", "range"] } }, mediaSearchTerms: ["Homo erectus body reconstruction", "East African horizon", "hominin stride anatomy"],
  }),
  e({
    id: "five-skulls-dmanisi", order: 8, actId: "hands-distance-fire-voice", title: "Early Humans Reach Eurasia", dateLabel: "ABOUT 1.85–1.77 MILLION YEARS AGO", location: "Dmanisi, Georgia", clock: "biology", thread: "bodies", capability: "Human populations were already mobile and physically varied.",
    hook: "Early humans had reached present-day Georgia by about 1.8 million years ago. Five skulls from Dmanisi show wide variation within one population.",
    story: "Dmanisi preserves several early Homo crania from a narrow place and time, yet their shapes vary strikingly. The assemblage became central to debates about how researchers distinguish species, regional populations, age, sex and individual variation in a sparse fossil record. It does not erase taxonomic diversity elsewhere, nor does it offer a final family tree. Instead, it lets visitors feel the classification problem before seeing a label: how much difference should separate branches when the sample is small and every fossil is incomplete?",
    evidence: { object: "Five Dmanisi cranial forms in shared context", status: "direct", uncertainty: "The taxonomic implications of the variation remain debated." }, sources: [S.dmanisi, S.fossils],
    interaction: { kind: "sort-evidence", config: { prompt: "Group the specimens, then change your assumptions.", options: ["variation", "population", "species", "insufficient evidence"] } }, mediaSearchTerms: ["Dmanisi five skulls", "Georgia archaeological site", "early Homo variation"],
  }),
  e({
    id: "handaxe-idea", order: 9, actId: "hands-distance-fire-voice", title: "Humans Make Standardized Handaxes", dateLabel: "FROM ABOUT 1.76 MILLION YEARS AGO", location: "Africa and parts of Eurasia", clock: "gene-culture", thread: "making", capability: "People could plan a useful shape, repeat the steps, and pass the technique onward.",
    hook: "Humans began shaping stone on both sides to make durable cutting tools. Similar handaxes appeared across wide regions for more than a million years.",
    story: "Acheulean cutting tools recur across immense spans of time and geography. Their bifacial forms reveal planning, material knowledge and repeated reduction, but resemblance does not prove that every tool served one purpose or descended through an unbroken cultural line. Raw stone, resharpening, task and local practice all shape the final object across distinct communities. By aligning several artifacts and then restoring their original irregular orientations, the scene shows both a shared technical constraint and the diversity hidden by clean textbook silhouettes.",
    evidence: { object: "Bifacial tools from several places and periods", status: "direct", uncertainty: "Function, learning pathway and connections between distant traditions vary by context." }, sources: [S.toolkit],
    interaction: { kind: "compare", config: { prompt: "Align, rotate and inspect several handaxes without ranking them.", options: ["raw material", "flake scars", "edge", "cortex"] } }, mediaSearchTerms: ["Acheulean handaxe collection", "biface raking light", "lithic comparison"],
  }),
  e({
    id: "three-histories-fire", order: 10, actId: "hands-distance-fire-voice", title: "Humans Learn to Control Fire", dateLabel: "EVIDENCE FROM ABOUT 1 MILLION TO 400,000 YEARS AGO", location: "Wonderwerk Cave; Barnham; wider sites", clock: "gene-culture", thread: "cooperation", capability: "Controlled fire gradually added warmth, protection, food preparation, and a place to gather.",
    hook: "Early humans first used available fire, later kept it burning, and eventually learned to produce it deliberately. These abilities developed at different times.",
    story: "Fire has no single invention date. Burned material deep inside Wonderwerk Cave supports very early fire use around one million years ago, while hearths and recurring burned contexts elsewhere vary in strength and interpretation. Evidence reported from Barnham provides an unusually strong case for deliberate fire-making around 400,000 years ago. The exhibit separates harvesting natural flame, maintaining controlled fire and producing ignition. Each requires different evidence, knowledge and coordination. Warmth, protection, food transformation and social gathering are possible consequences, not a list proven at every site.",
    evidence: { object: "Burned sediment, hearth pattern and pyrite–flint ignition evidence", status: "strong-inference", uncertainty: "Earlier traces do not always distinguish natural fire, maintenance or ignition." }, sources: [S.fire],
    interaction: { kind: "sort-evidence", config: { prompt: "Decide what each trace can establish.", options: ["found", "maintained", "made", "cannot tell"] } }, mediaSearchTerms: ["Wonderwerk fire evidence", "Barnham pyrite", "Pleistocene hearth"],
  }),
  e({
    id: "projectiles-and-hunt", order: 11, actId: "hands-distance-fire-voice", title: "Spears and Bows Change Hunting", dateLabel: "WOODEN SPEARS BY ABOUT 300,000 YEARS AGO; BOWS LATER", location: "Schöningen; Sibudu; wider contexts", clock: "gene-culture", thread: "cooperation", capability: "Hunting at a distance required planning, skilled toolmaking, and cooperation.",
    hook: "Humans hunted with carefully made wooden spears by about 300,000 years ago. Much later, some groups developed bows and arrows for greater range.",
    story: "The Schöningen spears show carefully worked wooden weapons capable of distance use around 300,000 years ago. Much later African evidence contributes to debates over stone-tipped projectiles and bow-and-arrow technology, including finds associated with Sibudu. The chronology is not a clean progression from thrusting spear to bow, and hunting was never the whole human diet. Gathering, fishing, scavenging, plant knowledge, food sharing and care remain present. The focus is how balance, hafting, stored energy, anticipation and group coordination extend action beyond the hand.",
    evidence: { object: "Wooden spear replicas, hafted points and impact-wear comparisons", status: "strong-inference", uncertainty: "Delivery systems and specific hunting behavior are often inferred from wear, fracture and context." }, sources: [S.characteristics, S.toolkit],
    interaction: { kind: "compare", config: { prompt: "Compare thrusting, throwing and stored-energy projectiles.", options: ["balance", "hafting", "range", "impact evidence", "diet context"] } }, mediaSearchTerms: ["Schöningen spears", "Sibudu arrow evidence", "prehistoric bow archaeology"],
  }),
  e({
    id: "language-no-fossil", order: 12, actId: "hands-distance-fire-voice", title: "Language Expands Cooperation", dateLabel: "DEVELOPED GRADUALLY; NO SINGLE START DATE", location: "Multiple populations and regions", clock: "gene-culture", thread: "symbolic-life", capability: "Knowledge could move between minds with far greater detail.",
    hook: "Spoken language leaves no fossil, so it has no known invention date. It gradually allowed people to share plans, teach skills, and preserve group knowledge.",
    story: "Speech, sign and language are not identical, and none leaves a direct fossil. Researchers combine vocal anatomy, hearing, genetics, symbolic artifacts, social learning and comparisons with living communication, but no line of evidence supplies a birthday. FOXP2 participates in several biological processes and is not a language gene. Rather than reconstructing first words, the episode asks what increasingly flexible communication changes: plans can be revised, absent things discussed, categories taught and obligations remembered. The scene remains an experiment in information transfer, not a performance of an unknowable ancestral language.",
    evidence: { object: "Hyoid, auditory, genetic and symbolic evidence constellation", status: "contested", uncertainty: "The timing, form and stages of language remain among the least directly recoverable questions." }, sources: [S.language],
    interaction: { kind: "simulate", config: { prompt: "Pass one technical sequence through different channels.", options: ["gesture", "sound", "shared convention", "feedback"], disclaimer: "This does not reconstruct a prehistoric language." } }, mediaSearchTerms: ["hominin hyoid anatomy", "gesture teaching", "language evolution evidence"],
  }),
  e({
    id: "lineage-no-birthday", order: 13, actId: "world-of-humans", title: "Homo sapiens Emerges in Africa", dateLabel: "BY AT LEAST 315,000–300,000 YEARS AGO", location: "Africa", clock: "biology", thread: "bodies", capability: "Our species developed across connected African populations, not from one first person.",
    hook: "Homo sapiens developed gradually across populations in Africa. Fossils show different modern human traits appearing in different combinations over time.",
    story: "Fossils from Jebel Irhoud and other African sites preserve different combinations of traits associated with early Homo sapiens. They do not identify a single birthplace, founding couple or instant when one species became another. Genetic, fossil and environmental evidence increasingly favors connected and sometimes separated populations across Africa. Species names remain useful summaries, but nature did not draw their boundaries in advance. The visitor moves a threshold across a field of changing populations and discovers that every position creates borderline cases rather than a first fully modern individual.",
    evidence: { object: "African fossil localities and mosaics of cranial traits", status: "strong-inference", uncertainty: "Population connections, taxonomy and the geographic pattern of emergence continue to be revised." }, sources: [S.sapiens, S.fossils],
    interaction: { kind: "simulate", config: { prompt: "Move a species boundary through gradual population change.", options: ["anatomy", "time", "gene flow", "geography"], disclaimer: "The threshold is a taxonomic tool, not a natural birthday." } }, mediaSearchTerms: ["Jebel Irhoud fossils", "African Middle Pleistocene map", "population network visualization"],
  }),
  e({
    id: "neanderthal-lives", order: 14, actId: "world-of-humans", title: "Neanderthals Live Across Eurasia", dateLabel: "ABOUT 400,000–40,000 YEARS AGO", location: "Europe and western Asia", clock: "biology", thread: "cooperation", capability: "More than one human lineage adapted successfully to difficult environments.",
    hook: "Neanderthals lived across Europe and western Asia for hundreds of thousands of years. They made tools, controlled fire, hunted, and cared for injured group members.",
    story: "Neanderthals lived across changing cold and temperate environments for hundreds of millennia. Their record includes sophisticated stone technologies, controlled fire, hunting, adhesives, care for injured individuals and evidence sometimes interpreted as symbolic behavior. None of this makes every Neanderthal community identical, and it does not require measuring them against sapiens as a standard. Their disappearance as distinct populations around forty thousand years ago was not simple failure, while ancestry from encounters survives in many living people. The scene presents a lived camp, not a brutish stereotype.",
    evidence: { object: "Tools, hearths, healed injuries and skull-cast comparison", status: "strong-inference", uncertainty: "Behavior varied across time and place; particular symbolic interpretations remain debated." }, sources: [S.neanderthal],
    interaction: { kind: "assemble", config: { prompt: "Build only the camp supported by evidence.", options: ["fire", "tools", "food", "care", "shelter", "unsupported cliché"] } }, mediaSearchTerms: ["Neanderthal camp reconstruction", "Mousterian tools", "healed Neanderthal injury"],
  }),
  e({
    id: "genome-before-face", order: 15, actId: "world-of-humans", title: "DNA Reveals the Denisovans", dateLabel: "DISCOVERED THROUGH DNA IN 2010", location: "Denisova Cave and wider Asia", clock: "biology", thread: "bodies", capability: "Ancient DNA can reveal human groups even when very few fossils survive.",
    hook: "DNA from a small finger bone revealed a previously unknown human group called the Denisovans. Their ancestry survives in some living populations.",
    story: "DNA recovered from a small finger-bone fragment at Denisova Cave revealed a human lineage distinct from both sampled Neanderthals and living humans. Additional teeth, bones and genetic traces have expanded the picture, but the fossil record remains sparse and taxonomy continues to develop. Denisovans therefore enter without a confident reconstructed face. Their episode is about method: a tiny physical fragment can contain molecular evidence of population history, while genetic similarity cannot automatically supply appearance, language, society or a complete geographic range.",
    evidence: { object: "Denisova phalanx, molar and genome relationships", status: "direct", uncertainty: "Appearance, population structure, range and taxonomic naming remain incompletely known." }, sources: [S.denisova],
    interaction: { kind: "reveal", config: { prompt: "Build knowledge outward from fragments without inventing a portrait.", options: ["bone", "molecule", "relationship", "unknown appearance"] } }, mediaSearchTerms: ["Denisova Cave finger bone", "Denisovan molar", "ancient DNA laboratory"],
  }),
  e({
    id: "we-met-others", order: 16, actId: "world-of-humans", title: "Different Human Groups Interbreed", dateLabel: "REPEATED CONTACT, INCLUDING ABOUT 60,000–45,000 YEARS AGO", location: "Africa and Eurasia", clock: "biology", thread: "cooperation", capability: "Neanderthal and Denisovan ancestry still survives in many people today.",
    hook: "Homo sapiens met and had children with Neanderthals and Denisovans. Human history is a story of contact and mixing, not total replacement.",
    story: "Ancient genomes show that Homo sapiens, Neanderthal and Denisovan populations did not remain sealed branches. Some encounters included interbreeding, and inherited segments persist in varying patterns among living people. The result is a braided history, not a purity chart. Population averages do not define an individual’s culture, worth or identity, and ancestry percentages are not evolutionary rankings. This episode closes the main biological-lineage arc by following one segment through contact, inheritance, recombination and loss instead of blending several human forms into a triumphant final body.",
    evidence: { object: "Ancient-genome segments and population models", status: "strong-inference", uncertainty: "The number, location and social circumstances of encounters are reconstructed statistically." }, sources: [S.admixture, S.denisova],
    interaction: { kind: "trace", config: { prompt: "Follow one inherited segment without turning it into identity.", options: ["contact", "inheritance", "recombination", "present variation"] } }, mediaSearchTerms: ["ancient DNA admixture diagram", "Neanderthal Denisovan genome", "braided population history"],
  }),
  e({
    id: "marks-missing-meanings", order: 17, actId: "world-of-humans", title: "Humans Make Symbols and Ornaments", dateLabel: "AT LEAST 100,000–70,000 YEARS AGO", location: "Africa and later worldwide contexts", clock: "gene-culture", thread: "symbolic-life", capability: "Shared signs helped people express identity, memory, and belonging.",
    hook: "Engraved ochre, beads, and pigments show that humans were making durable signs. Their exact meanings are lost, but the behavior was clearly social.",
    story: "Pigments, shell beads, engravings and later images show that objects could carry information beyond immediate mechanical use. Repetition, placement, wear and archaeological context support interpretations involving identity, exchange, memory or symbolism, but the exact concepts are rarely recoverable. There was no single cave where imagination switched on, and symbolic behavior did not belong exclusively to one human lineage. A moving light reveals marks gradually while labels distinguish the physical trace from the stories researchers can responsibly infer and the meanings that remain permanently open.",
    evidence: { object: "Ochre, beads and engraved surfaces in archaeological context", status: "strong-inference", uncertainty: "Specific messages, rituals, identities and maker intentions usually do not survive." }, sources: [S.language],
    interaction: { kind: "reveal", config: { prompt: "Move light across the object and separate trace from interpretation.", options: ["material", "manufacture", "context", "possible meaning", "unknown"] } }, mediaSearchTerms: ["Blombos ochre engraving", "prehistoric shell beads", "cave pigment macro"],
  }),
  e({
    id: "many-departures", order: 18, actId: "world-of-humans", title: "Homo sapiens Spreads Across Continents", dateLabel: "MAJOR EXPANSIONS ABOUT 70,000–50,000 YEARS AGO AND LATER", location: "Africa, Eurasia and connected regions", clock: "gene-culture", thread: "mobility", capability: "Learned routes, tools, food knowledge, and cooperation opened new environments.",
    hook: "Homo sapiens left Africa in several movements, not one single migration. Populations expanded through Asia, Europe, and eventually most of the world.",
    story: "Homo sapiens populations moved within and beyond Africa through repeated dispersals, contacts, contractions and replacements. Coastlines, rivers, deserts and climatic windows changed which paths were possible, while clothing, shelter, fire, exchange and food knowledge made unfamiliar environments livable. Much coastal evidence now lies underwater, and arrival dates continue to move as sites are found and re-dated. Broad translucent corridors replace conquering arrows. The map shows uncertainty as part of the evidence rather than converting complex family movement into territorial inevitability.",
    evidence: { object: "Dated sites, paleoclimate layers and probabilistic route corridors", status: "strong-inference", uncertainty: "Many pathways, departure pulses and population relationships remain unresolved." }, sources: [S.dispersal],
    interaction: { kind: "simulate", config: { prompt: "Change sea level and climate to expose different possible routes.", options: ["coast", "river", "desert window", "submerged evidence"], disclaimer: "Routes are evidence-weighted corridors, not recorded itineraries." } }, mediaSearchTerms: ["human dispersal paleomap", "Pleistocene coastline", "migration corridor visualization"],
  }),
  e({
    id: "water-crossing", order: 19, actId: "world-of-humans", title: "People Cross Open Water", dateLabel: "SAHUL REACHED BY AT LEAST 65,000–50,000 YEARS AGO", location: "Island Southeast Asia and Sahul", clock: "gene-culture", thread: "mobility", capability: "Watercraft and group planning made deliberate sea crossings possible.",
    hook: "People reached Sahul—the joined Ice Age landmass of Australia and New Guinea—only by crossing stretches of open sea.",
    story: "Reaching Sahul required crossing stretches of water even when lower sea levels joined Australia and New Guinea into one landmass. The evidence does not preserve the first vessels or the conversations around departure, but the crossing implies watercraft, observation, provisioning and social continuity beyond a lone accidental castaway. Coastal Kin appear as an evidence-based composite carrying children, tools and shared obligations rather than as heroic explorers. Competing chronologies and route models remain visible, while occupation evidence at Madjedbebe anchors the episode’s lower date range.",
    evidence: { object: "Madjedbebe occupation layers and reconstructed paleocoastlines", status: "strong-inference", uncertainty: "Exact routes, vessel forms, group sizes and first-arrival dates remain debated." }, sources: [S.sahul],
    interaction: { kind: "simulate", config: { prompt: "Plan a conceptual crossing under uncertain visibility and currents.", options: ["water", "weather", "provisions", "group continuity"], disclaimer: "This is a planning model, not a reconstruction of one voyage." } }, mediaSearchTerms: ["Madjedbebe excavation", "Sahul paleocoastline", "prehistoric sea crossing"],
  }),
  e({
    id: "holocene-possibilities", order: 20, actId: "settlement-bargain", title: "The Ice Age Ends", dateLabel: "THE HOLOCENE BEGINS 11,700 YEARS AGO", location: "Worldwide", clock: "culture", thread: "food-systems", capability: "A warmer but variable climate created new possibilities for settlement and food production.",
    hook: "As the last Ice Age ended, climates, coastlines, plants, and animals changed. Communities responded with new mixtures of hunting, gathering, fishing, storage, and cultivation.",
    story: "As the last glacial period ended, climates, coastlines, plants and animal communities changed unevenly around the world. People responded through many viable combinations of mobility, fishing, gathering, hunting, storage and cultivation. The Holocene did not order humanity to become farmers, and settled or intensified lifeways began at different times for different reasons. Pollen, animal remains, grinding stones and storage features let visitors compare strategies without scoring one as advanced. The crucial shift is ecological knowledge accumulated across seasons, not an inevitable road toward the city.",
    evidence: { object: "Pollen cores, fauna, grinding stones and storage features", status: "strong-inference", uncertainty: "Local climate effects and the causes of changing subsistence strategies varied widely." }, sources: [S.agriculture],
    interaction: { kind: "compare", config: { prompt: "Compare three seasonal strategies without ranking them.", options: ["mobile", "stored wild foods", "cultivation", "mixed strategy"] } }, mediaSearchTerms: ["Holocene pollen core", "Mesolithic fishing settlement", "prehistoric storage pit"],
  }),
  e({
    id: "farming-more-than-once", order: 21, actId: "settlement-bargain", title: "Farming Begins in Several Regions", dateLabel: "MAINLY 12,000–8,000 YEARS AGO AND LATER", location: "Multiple independent regions", clock: "gene-culture", thread: "food-systems", capability: "Producing food locally supported larger and more settled populations.",
    hook: "Communities in several parts of the world independently began domesticating plants and animals. Farming was not invented once or spread from one source.",
    story: "Cultivation and domestication emerged through different processes in Southwest Asia, China, New Guinea, Africa, the Americas and other regions. Some changes were gradual relationships between people and species rather than deliberate invention. Seed size, seed-head structure, animal age profiles, settlement context and genetics reveal domestication over generations. Parallel regional timelines prevent one origin from becoming the source of all civilization. Farming could support storage and population growth, but it also created labor demands, dependencies, ecological transformation and new exposure to crop failure and disease.",
    evidence: { object: "Seeds, rachis morphology, animal profiles and regional timelines", status: "direct", uncertainty: "Timing, intentionality and the boundary between management and domestication differ by species and region." }, sources: [S.agriculture],
    interaction: { kind: "trace", config: { prompt: "Follow several domestication processes in parallel.", options: ["Southwest Asia", "China", "New Guinea", "Africa", "Americas"] } }, mediaSearchTerms: ["early domesticated seeds", "animal domestication age profile", "independent agriculture map"],
  }),
  e({
    id: "river-household", order: 22, actId: "settlement-bargain", title: "Families Build Permanent Homes", dateLabel: "DURING THE LAST 10,000 YEARS", location: "Evidence-based multi-region composite", clock: "culture", thread: "food-systems", capability: "Housing and storage tied daily life to one place and created new divisions of work.",
    hook: "Settled families built houses, stored harvests, divided seasonal labor, and cared for more children. Permanent life also concentrated waste, disease, and property.",
    story: "The River Household follows sowing, water, harvest, storage, hunger season, childcare, repair and illness across one conceptual year. It is not a reconstruction of a named village or a universal family structure. Archaeological houses, storage pits, teeth, bones, plant remains and isotopes reveal benefits and burdens that varied by place and status. Permanent housing can protect stores and support dense cooperation while also concentrating waste, pathogens, property claims and labor. Visitors allocate time, then discover the dependencies hidden behind every apparently successful season.",
    evidence: { object: "House plans, storage pits, plant remains, teeth and isotopes", status: "interpretive-model", uncertainty: "No one household represents the diversity of early settled communities." }, sources: [S.agriculture],
    interaction: { kind: "system", config: { prompt: "Allocate a season, then reveal every dependency.", options: ["housing", "water", "food", "care", "repair", "waste"] } }, mediaSearchTerms: ["Neolithic house excavation", "grain storage pit", "river settlement reconstruction"],
  }),
  e({
    id: "bodies-respond-culture", order: 23, actId: "settlement-bargain", title: "Culture Changes Human Biology", dateLabel: "WITHIN THE LAST 10,000 YEARS", location: "Multiple populations", clock: "gene-culture", thread: "bodies", capability: "New diets and settlements changed which inherited traits were advantageous.",
    hook: "Farming and herding changed food, disease exposure, and daily life. In some populations, these cultural changes favored traits such as digesting milk in adulthood.",
    story: "Dairying, settlement, diet and pathogen exposure altered environments that humans themselves helped create. Lactase persistence offers a well-studied example, but its history differs among populations and cannot be reduced to one mutation spreading because milk was simply beneficial. Ancient DNA, residues and demographic models reveal selection interacting with migration, disease, drift and cultural practice. This episode reconnects biology to cultural history without reviving hierarchy: recent adaptations are local responses within one interconnected species, not evidence that any living population is more evolved than another.",
    evidence: { object: "Ancient DNA frequencies, dairy residues and demographic models", status: "strong-inference", uncertainty: "Selective pressures and cultural practices differed across regions and periods." }, sources: [S.lactase],
    interaction: { kind: "simulate", config: { prompt: "Change culture, migration, drift and selection together.", options: ["dairying", "pathogens", "migration", "drift", "selection"], disclaimer: "A conceptual population model cannot reproduce one real population history." } }, mediaSearchTerms: ["ancient DNA lactase persistence", "pottery lipid residue", "gene culture coevolution"],
  }),
  e({
    id: "dense-life", order: 24, actId: "settlement-bargain", title: "Villages Grow into Cities", dateLabel: "SETTLEMENTS FROM ABOUT 10,000 YEARS AGO; CITIES ESPECIALLY AFTER 4000 BCE", location: "Multiple world regions", clock: "culture", thread: "cooperation", capability: "Dense populations required roads, water systems, rules, specialists, and government.",
    hook: "As settlements grew, strangers had to coordinate food, water, waste, trade, defense, and authority. Cities increased opportunity, inequality, and the spread of disease.",
    story: "Dense settlements connect water, food, waste, housing, craft, exchange, authority, conflict and care. No single ingredient creates a city, and societies did not all pass through the same sequence. Composite plans draw from several regions without pretending to reconstruct one site. Infrastructure can support specialization and public works while amplifying inequality, coercion, disease and systemic fragility. Toggling each layer reveals that urban life depends on continuous maintenance by people who are often absent from monumental histories. Density is a network condition, not a civilizational rank.",
    evidence: { object: "Settlement plans, infrastructure traces and household variation", status: "interpretive-model", uncertainty: "The composite explains dependencies but is not a literal ancient city." }, sources: [S.met],
    interaction: { kind: "system", config: { prompt: "Reveal the systems beneath dense life.", options: ["water", "food", "waste", "care", "authority", "exchange"] } }, mediaSearchTerms: ["ancient settlement plan", "archaeological water system", "urban household excavation"],
  }),
  e({
    id: "memory-leaves-brain", order: 25, actId: "settlement-bargain", title: "Writing Stores Knowledge Outside the Mind", dateLabel: "WRITING ABOUT 3400–3200 BCE IN MESOPOTAMIA; OTHER SYSTEMS DEVELOPED INDEPENDENTLY", location: "Mesopotamia and parallel world regions", clock: "culture", thread: "external-memory", capability: "Records allowed accounts, laws, and instructions to outlast the people who made them.",
    hook: "Writing turned spoken information into durable records. Administrations could track goods and obligations, while later texts preserved laws, stories, and technical knowledge.",
    story: "Clay tokens and early tablets in Mesopotamia show records becoming durable infrastructure for quantities, obligations and institutions. Writing later carried law, story, prayer, science, dissent and private memory, but Mesopotamia was not the source of every script. Egyptian, Chinese, Mesoamerican and other systems developed through their own histories. Durable records expand coordination while concentrating power in conventions, archives and literate specialists. The visitor invents a tiny notation, loses the original instruction and discovers that external memory works only when a community shares how marks should be read.",
    evidence: { object: "Tokens, proto-cuneiform tablets and parallel writing traditions", status: "direct", uncertainty: "Early marks vary in function, and the transition from accounting to writing is not one universal sequence." }, sources: [S.writing, S.met],
    interaction: { kind: "assemble", config: { prompt: "Encode an inventory, hide the instruction, then decode it.", options: ["quantity", "kind", "destination", "shared convention"] } }, mediaSearchTerms: ["proto cuneiform tablet", "clay accounting tokens", "early writing systems comparison"],
  }),
  e({
    id: "islands-connected", order: 26, actId: "oceans-encounters-copies", title: "Seafaring Connects Distant Islands", dateLabel: "AUSTRONESIAN EXPANSIONS FROM ABOUT 3000 BCE; REMOTE PACIFIC SETTLEMENT LATER", location: "Island Southeast Asia and the Pacific", clock: "culture", thread: "mobility", capability: "Navigation knowledge let communities settle and trade across enormous ocean distances.",
    hook: "Austronesian-speaking communities used boats, stars, winds, waves, birds, and inherited route knowledge to move through Island Southeast Asia and the Pacific.",
    story: "Austronesian-speaking communities carried maritime technologies, crops, languages and relationships through Island Southeast Asia and into the Pacific over many generations. Remote-ocean navigation joined vessel building, stars, swell, wind, birds, memory and social organization. Genomic and linguistic patterns illuminate movement and encounter, but neither turns a diverse history into one migrating people or one route. The Navigator is shown with the communities at both departure and arrival. Seafaring becomes accumulated knowledge held across generations, not the intuition of a solitary heroic discoverer.",
    evidence: { object: "Vessel technology, settlement dates, linguistics and genomic distributions", status: "strong-inference", uncertainty: "Routes, timings, population mixtures and navigational practices varied across expansions." }, sources: [S.austronesian],
    interaction: { kind: "simulate", config: { prompt: "Read swell, stars and birds after modern charts disappear.", options: ["swell", "wind", "stars", "birds", "memory"], disclaimer: "A teaching model cannot reconstruct one historical voyage." } }, mediaSearchTerms: ["Austronesian outrigger vessel", "Pacific wayfinding stars", "Lapita seafaring archaeology"],
  }),
  e({
    id: "shore-two-sides", order: 27, actId: "oceans-encounters-copies", title: "1492 Begins a Violent Global Exchange", dateLabel: "ESPECIALLY AFTER 1492", location: "Atlantic worlds and the Americas", clock: "culture", thread: "exchange", capability: "The world became more connected through profoundly unequal power.",
    hook: "European voyages permanently linked the Americas, Africa, and Eurasia. Crops and animals moved, but so did invasion, epidemic disease, enslavement, extraction, and resistance.",
    story: "Transatlantic encounters after 1492 connected ecosystems and societies while unleashing invasion, epidemic disease, enslavement, forced conversion, extraction and demographic catastrophe. Indigenous peoples were not passive scenery before European arrival or vanished victims afterward; communities resisted, adapted and remain present. Crops, animals and pathogens moved in several directions, but exchange is not a neutral word for unequal power. Rotating the same episode among ship, shore, household and descendant viewpoints prevents discovery language from centering the newcomer and makes survival part of the historical record.",
    evidence: { object: "Accounts, objects, crop transfers, pathogen evidence and demographic ranges", status: "strong-inference", uncertainty: "Population estimates and the relative effects of disease, violence and disruption vary by region." }, sources: [S.encounter],
    interaction: { kind: "perspective", config: { prompt: "Turn one encounter through several positions.", options: ["ship", "shore", "household", "enslaved person", "descendant community"] } }, mediaSearchTerms: ["Indigenous Atlantic encounter objects", "Columbian exchange crop map", "1492 encounter multiple perspectives"],
  }),
  e({
    id: "page-becomes-thousands", order: 28, actId: "oceans-encounters-copies", title: "Printing Copies Knowledge at Scale", dateLabel: "WOODBLOCK FROM THE 600s; MOVABLE TYPE FROM THE 1000s; EUROPEAN PRESSES IN THE 1400s", location: "China, Korea, Europe and wider printing worlds", clock: "culture", thread: "external-memory", capability: "Ideas, instructions, and arguments could reach far more readers.",
    hook: "Different societies developed woodblock printing, movable type, and mechanical presses. Reusable forms made it much faster to reproduce the same information.",
    story: "Woodblock printing, movable type and press systems emerged through distinct material and linguistic settings. Bi Sheng’s ceramic type, Korean metal type, East Asian woodblock traditions and later European press workshops belong in parallel rather than as preliminaries to one winner. Reusable forms lower some costs of copying and make comparison, administration, propaganda, education and dissent easier, but effects depend on paper, literacy, distribution and power. Setting, inking, pressing and reusing one form lets visitors feel why reproduction can accelerate without pretending that information automatically becomes true or equally accessible.",
    evidence: { object: "Woodblocks, movable type, Jikji and press mechanisms", status: "direct", uncertainty: "Adoption, economics and cultural effects differed by script, material, institution and region." }, sources: [S.printing],
    interaction: { kind: "assemble", config: { prompt: "Set, ink, press and reuse a form.", options: ["woodblock", "ceramic type", "metal type", "paper", "distribution"] } }, mediaSearchTerms: ["Jikji movable metal type", "Chinese woodblock printing", "historic printing press workshop"],
  }),
  e({
    id: "extending-senses", order: 29, actId: "instruments-energy-infrastructure", title: "Instruments Standardize Observation", dateLabel: "MAINLY THE 1500s–1700s, WITH EARLIER GLOBAL PRECEDENTS", location: "Interconnected observatories, workshops and archives", clock: "culture", thread: "measurement", capability: "Measurements could be compared, checked, and repeated across distance.",
    hook: "Lenses, clocks, balances, maps, and written records made observation more precise. Researchers could record a result and let other people test it.",
    story: "Astrolabes, lenses, clocks, balances, maps, mathematical models and written records belong to long, cross-cultural histories. During early modern transformations, instruments and institutions increasingly connected claims to measurements that other people could inspect or repeat. Science is not a rigid five-step ritual or a parade of lone European geniuses; it is a changing family of social and technical methods. Repeating one measurement reveals noise, calibration, judgment and record keeping. Instruments extend senses, but communities still decide what to measure, whose testimony counts and how uncertainty is reported.",
    evidence: { object: "Astrolabe, lens, clock, balance and repeatable observation record", status: "direct", uncertainty: "No instrument or method removes every source of bias, error or institutional exclusion." }, sources: [S.science],
    interaction: { kind: "simulate", config: { prompt: "Repeat and record one noisy measurement.", options: ["calibrate", "observe", "record", "compare", "revise"], disclaimer: "The exercise demonstrates reproducibility, not one universal scientific method." } }, mediaSearchTerms: ["historic astrolabe", "early microscope workshop", "scientific measurement notebook"],
  }),
  e({
    id: "fossil-energy", order: 30, actId: "instruments-energy-infrastructure", title: "Fossil Fuels Multiply Human Power", dateLabel: "ACCELERATING FROM THE LATE 1700s", location: "Britain first, then uneven global industrialization", clock: "technology", thread: "energy", capability: "Coal and steam powered factories and transport while sharply increasing pollution and carbon emissions.",
    hook: "Coal-powered steam engines produced far more mechanical work than human or animal muscle. They drove factories, mines, railways, and rapid industrial growth.",
    story: "Coal-powered heat, steam pressure and machinery expanded production and transport at scales that human and animal muscle could not match. Industrialization joined mines, mills, rail, finance, patents, colonial supply chains, coerced and wage labor, cities and states. It brought material capabilities and severe, uneven costs together: dangerous work, dispossession, local pollution and greenhouse emissions. The Worker remains visible beside the piston. Revealing fuel, material, labor and emissions alongside output prevents the machine from becoming a self-moving hero and makes energy throughput a social as well as mechanical system.",
    evidence: { object: "Piston mechanism, production ledgers, labor records and emissions data", status: "direct", uncertainty: "Timing, benefits and burdens varied sharply by place, class, empire and industry." }, sources: [S.energy],
    interaction: { kind: "system", config: { prompt: "Reveal everything required for rising output.", options: ["fuel", "materials", "labor", "land", "emissions", "capital"] } }, mediaSearchTerms: ["steam piston cutaway", "industrial workers archive", "coal rail factory landscape"],
  }),
  e({
    id: "night-infrastructure", order: 31, actId: "instruments-energy-infrastructure", title: "Electricity Becomes Public Infrastructure", dateLabel: "EXPANDING FROM THE LATE 1800s", location: "Uneven global electrification", clock: "technology", thread: "energy", capability: "Electrical grids changed work, communication, transport, medicine, streets, and homes.",
    hook: "Electric light depended on an entire system: generators, wires, standards, meters, maintenance, and paying customers. Motors and communications expanded its impact.",
    story: "Electric light provides a vivid hook, but a bulb works only within a system of generation, transmission, distribution, standards, switches, meters, capital, maintenance and users. Motors and communications widened the grid’s effects beyond illumination. Electrification developed through many contributors and competing systems rather than one inventor’s flash of insight. Bringing up a city district in dependency order reveals infrastructure, while unlit districts keep unequal access visible. The Maintainer stands beside the generator because reliability is continuous labor, not a one-time invention.",
    evidence: { object: "Generator, switchgear, meter, wiring and lamp system", status: "direct", uncertainty: "Adoption, affordability, reliability and ownership remain uneven across and within countries." }, sources: [S.electricity],
    interaction: { kind: "system", config: { prompt: "Connect the grid in dependency order.", options: ["generation", "transmission", "distribution", "load", "maintenance", "access"] } }, mediaSearchTerms: ["early electrical grid", "generator switchboard", "city electrification night"],
  }),
  e({
    id: "instructions-machinery", order: 32, actId: "representations-machines", title: "Machines Begin Following Programs", dateLabel: "PUNCHED CONTROLS IN THE 1800s; ELECTRONIC COMPUTERS IN THE 1940s", location: "Europe, North America and connected engineering networks", clock: "technology", thread: "computation", capability: "One general machine could perform different tasks when its instructions changed.",
    hook: "Punched cards, relays, vacuum tubes, and stored programs turned instructions into machine-readable information. Computing became programmable rather than fixed to one task.",
    story: "Punched media, mechanical calculators, relays, vacuum tubes, memory and stored programs belong to a cumulative history of representing operations physically. No single device instantly became the modern computer, and conceptual work depended on manufacturing, institutions, operators and maintenance. The same tiny machine runs two instruction sequences so visitors can see programmability as the changing layer. Women and other historically obscured operators remain present, while gears and glowing tubes never substitute for the labor that encoded problems, found faults and kept room-scale systems working.",
    evidence: { object: "Punched media, relay, vacuum tube and stored-program comparison", status: "direct", uncertainty: "Claims about the first computer depend on definitions of programmability, electronic operation and general purpose." }, sources: [S.computing],
    interaction: { kind: "simulate", config: { prompt: "Run different instructions on the same mechanism.", options: ["representation", "logic", "memory", "control", "operator"], disclaimer: "The small machine is a conceptual model of programmability." } }, mediaSearchTerms: ["punched card computer", "relay computer room", "1940s computer operators"],
  }),
  e({
    id: "planetary-machine", order: 33, actId: "representations-machines", title: "The Internet Connects Computers Worldwide", dateLabel: "TRANSISTOR 1947 · ARPANET 1969 · WEB PROPOSED 1989", location: "Physical networks worldwide", clock: "technology", thread: "networks", capability: "Information could travel between billions of devices through cables, routers, and shared protocols.",
    hook: "Transistors made computers smaller, networks let machines exchange data, and the World Wide Web made linked information easier to publish and find.",
    story: "Transistors made electronic systems smaller and more reliable; packet networks connected machines; the World Wide Web later linked information through open standards. These are related layers, not one invention. A Message travels through device, local radio or cable, router, long-haul fiber, landing station, data center and server before any globe appears. Latency, ownership, energy and maintenance become visible along the route. Networks expand collaboration and access while also enabling surveillance, misinformation, concentration and systemic dependence. Distance feels lighter because infrastructure does heavy work.",
    evidence: { object: "Transistor, early network map, fiber cross-section and server route", status: "direct", uncertainty: "Any real message may follow changing routes whose processing and ownership are opaque to its sender." }, sources: [S.computing, S.web, S.internet],
    interaction: { kind: "trace", config: { prompt: "Follow one message through its physical route.", options: ["device", "local network", "long haul", "data center", "server", "return"] } }, mediaSearchTerms: ["ARPANET map", "fiber optic cable cutaway", "subsea cable landing station"],
  }),
  e({
    id: "computer-enters-hand", order: 34, actId: "representations-machines", title: "The Smartphone Puts a Computer in the Hand", dateLabel: "IPHONE ANNOUNCED AND RELEASED IN 2007", location: "Designed, manufactured and networked globally", clock: "technology", thread: "networks", capability: "Computing, cameras, GPS, software, and the internet became an always-carried interface.",
    hook: "The 2007 iPhone brought existing technologies together in an influential touch-screen device. It depended on earlier smartphones, chips, satellites, networks, batteries, and global labor.",
    story: "The iPhone is presented as a memorable convergence point, not the invention of the smartphone or mobile computing. Capacitive touch, cellular standards, earlier smartphones, GPS, cameras, batteries, semiconductor fabrication, software distribution, mineral extraction and global labor already formed much of its stack. Its 2007 launch accelerated particular interface and platform patterns while depending on infrastructures no product keynote could contain. Removing one layer at a time turns the polished object into a planetary system and keeps precursor devices, workers, maintainers and supply chains inside the history.",
    evidence: { object: "Exploded smartphone stack with dated precursor systems", status: "direct", uncertainty: "The cultural importance assigned to one product depends on how innovation, adoption and platform power are defined." }, sources: [S.iphone, S.computing],
    interaction: { kind: "system", config: { prompt: "Remove one dependency until the single object cannot function.", options: ["network", "satellites", "chips", "battery", "software", "minerals", "labor"] } }, mediaSearchTerms: ["original iPhone 2007", "smartphone exploded view", "semiconductor supply chain"],
  }),
  e({
    id: "learned-patterns", order: 35, actId: "tools-that-model-us", title: "AI Learns from Human Data", dateLabel: "AI NAMED IN 1956 · RAPID GROWTH IN THE 2010s–2020s", location: "Global technical and institutional systems", clock: "technology", thread: "machine-learning", capability: "Software can now classify and generate by learning statistical patterns from examples.",
    hook: "Modern AI systems learn patterns from human-made data. People still choose the data, goals, evaluations, deployment, and limits—and provide the chips, energy, and labor.",
    story: "Artificial intelligence includes changing traditions of symbolic reasoning, statistical machine learning, neural networks and generative models. Modern systems depend on human-created data, mathematics, software, evaluation, chips, energy, institutions and labor. They can produce striking outputs without becoming a biological species or proving consciousness. The Visitor’s Trace enters a tiny classifier whose boundary changes when examples change, making error and bias visible. The model remains transparent and deliberately small. Behind it, data centers and people prevent the interface from appearing autonomous, weightless or inevitable.",
    evidence: { object: "Training examples, evaluation set, model card and compute stack", status: "direct", uncertainty: "Capabilities, limitations and social effects change quickly; consciousness claims are not established by output fluency." }, sources: [S.ai, S.computing],
    interaction: { kind: "tiny-model", config: { prompt: "Change the examples and inspect the boundary, errors and uncertainty.", options: ["examples", "features", "boundary", "false positive", "false negative"], disclaimer: "This is a teaching model, not a miniature ChatGPT or a diagram of every AI system." } }, mediaSearchTerms: ["machine learning classifier visualization", "AI data center workers", "training data model card"],
  }),
];

export const becomingHumanActs: BecomingHumanAct[] = [
  { id: "body-made-in-branches", order: 1, title: "From Apes to Upright Walkers", clockFocus: ["biology"], environment: "Forest canopy opening into mixed woodland and a trackway.", thesis: "The human lineage began in Africa after a population split. Over millions of years, some descendants became regular two-legged walkers.", episodeIds: becomingHumanEpisodes.slice(0, 4).map(({ id }) => id) },
  { id: "hands-distance-fire-voice", order: 2, title: "Tools, Travel, Fire, and Language", clockFocus: ["biology", "gene-culture"], environment: "Ground-level woodland, stone outcrop, widening horizon and firelit shelter.", thesis: "Early humans learned to make tools, travel farther, control fire, hunt cooperatively, and share knowledge.", episodeIds: becomingHumanEpisodes.slice(4, 12).map(({ id }) => id) },
  { id: "world-of-humans", order: 3, title: "Homo sapiens and Other Human Groups", clockFocus: ["biology", "gene-culture"], environment: "Several contemporaneous camps under one Pleistocene sky.", thesis: "Our species evolved in Africa while Neanderthals, Denisovans, and other humans lived elsewhere. Some groups met and had children.", episodeIds: becomingHumanEpisodes.slice(12, 19).map(({ id }) => id) },
  { id: "settlement-bargain", order: 4, title: "Farming, Permanent Homes, and Cities", clockFocus: ["culture", "gene-culture"], environment: "A river household across seasons, expanding into parallel settlements and archives.", thesis: "After the last Ice Age, some communities farmed, settled, stored food, built towns, and created writing.", episodeIds: becomingHumanEpisodes.slice(19, 25).map(({ id }) => id) },
  { id: "oceans-encounters-copies", order: 5, title: "Ocean Travel, Global Encounters, and Printing", clockFocus: ["culture"], environment: "Shorelines and vessel interiors become a multi-tradition printing workshop.", thesis: "Navigation connected islands and continents. Conquest reshaped societies, while printing copied knowledge at a new scale.", episodeIds: becomingHumanEpisodes.slice(25, 28).map(({ id }) => id) },
  { id: "instruments-energy-infrastructure", order: 6, title: "Science, Industry, and Electricity", clockFocus: ["culture", "technology"], environment: "Observatory workshop expands into factory, generator and unequal electric night.", thesis: "Standard measurement, fossil fuels, and electrical grids multiplied what societies could observe, build, and power.", episodeIds: becomingHumanEpisodes.slice(28, 31).map(({ id }) => id) },
  { id: "representations-machines", order: 7, title: "Computers, the Internet, and Smartphones", clockFocus: ["technology"], environment: "Mechanical calculation becomes computer room, cable landing and pocket device.", thesis: "Programmable machines became global networks, then entered everyday life through the smartphone.", episodeIds: becomingHumanEpisodes.slice(31, 34).map(({ id }) => id) },
  { id: "tools-that-model-us", order: 8, title: "Artificial Intelligence", clockFocus: ["technology"], environment: "The visitor’s trace enters a transparent teaching model backed by people and hardware.", thesis: "AI systems learn patterns from human-made data. They are tools built by people, not a new human species.", episodeIds: becomingHumanEpisodes.slice(34, 35).map(({ id }) => id) },
];

export const becomingHumanFinale: BecomingHumanFinale = {
  id: "what-changed-fastest",
  title: "How Humans Reached the Present",
  hook: "Our bodies changed slowly. Shared knowledge, institutions, energy, and machines changed much faster.",
  story: "Human evolution did not stop, but biological change usually takes many generations. Cultural change can happen within one lifetime. Tools let skills survive in objects; writing let knowledge survive its authors; institutions coordinated strangers; fossil fuels and electricity multiplied physical work; computers and networks multiplied information work. AI is the latest layer in that history: an engineered tool built from human data, labor, hardware, energy, and choices. The future is therefore not a predetermined final stage. People still decide how these systems are built, who benefits, who carries the costs, and which responsibilities cannot be delegated to a machine.",
  layers: [
    { label: "Genes", clock: "biology", description: "Inherited population change across generations." },
    { label: "Bodies", clock: "biology", description: "Anatomy and physiology shaped over evolutionary time." },
    { label: "Learned culture", clock: "gene-culture", description: "Behavior copied, taught and revised among people." },
    { label: "External memory", clock: "culture", description: "Objects and records that outlive individual minds." },
    { label: "Institutions and networks", clock: "culture", description: "Coordination, power and dependence beyond face-to-face groups." },
    { label: "Energy and machines", clock: "technology", description: "Amplified physical and informational work." },
    { label: "Learned models", clock: "technology", description: "Engineered systems that infer patterns from human-made records." },
  ],
  interaction: { kind: "reveal", config: { prompt: "Compare the clocks, then erase the temporary trace.", options: ["rate", "dependency", "power", "responsibility", "delete"] } },
  sources: [S.intro, S.agriculture, S.ai],
};

export const becomingHumanClockTransition = {
  afterEpisodeId: "water-crossing",
  label: "Biological evolution continues. The story’s dominant clock now changes: learned systems can transform within a lifetime.",
} as const;
