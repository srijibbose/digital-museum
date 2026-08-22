export type DinosaurEvidenceStatus =
  | "observed"
  | "measured"
  | "inferred"
  | "comparative"
  | "historical";

export type DinosaurModeId = "skeleton" | "life" | "trace" | "anatomy" | "lineage";
export type DinosaurSpeciesId =
  | "tyrannosaurus"
  | "triceratops"
  | "diplodocus"
  | "plateosaurus"
  | "protoceratops"
  | "psittacosaurus"
  | "allosaurus"
  | "archaeopteryx";

export type DinosaurSource = {
  id: string;
  publisher: string;
  title: string;
  url: string;
  kind: "specimen" | "museum" | "research" | "reconstruction";
  note: string;
};

export type DinosaurBoneRegion = {
  id: string;
  label: string;
  note: string;
  status: DinosaurEvidenceStatus;
};

export type DinosaurAnatomySystem = {
  id: "respiration" | "circulation" | "digestion";
  label: string;
  note: string;
  status: DinosaurEvidenceStatus;
};

export type DinosaurLifeModel = {
  speciesId: DinosaurSpeciesId;
  title: string;
  creator: string;
  sketchfabUid: string;
  preview: string;
  sourceId: string;
  sourceUrl: string;
  license: string;
  licenseUrl: string;
  note: string;
};

export type DinosaurSpecies = {
  id: DinosaurSpeciesId;
  order: string;
  commonName: string;
  shortName: string;
  scientificName: string;
  clade: string;
  interval: string;
  lived: string;
  locality: string;
  formation: string;
  title: string;
  hook: string;
  accent: string;
  diet: string;
  dietEvidence: string;
  ageRecord: string;
  ageNote: string;
  length: string;
  locomotion: string;
  traits: string[];
  specimen: {
    institution: string;
    catalogue: string;
    recordType: string;
    recordNote: string;
    license: string;
    licenseUrl: string;
    sourceUrl: string;
    modelPath?: string;
    sketchfabUid: string;
    preview: string;
    provider: "local" | "sketchfab";
  };
  boneRegions: DinosaurBoneRegion[];
  trace: { title: string; note: string; caution: string };
  anatomy: DinosaurAnatomySystem[];
  lineage: { path: string[]; note: string; livingReference: string };
  sourceIds: string[];
};

export const dinosaurModes: {
  id: DinosaurModeId;
  label: string;
  eyebrow: string;
  description: string;
  status: DinosaurEvidenceStatus;
}[] = [
  {
    id: "skeleton",
    label: "Skeleton",
    eyebrow: "Museum scan · osteology",
    description:
      "Inspect a documented mount or fossil cast, then use the numbered regions to connect interpretation to specific anatomy.",
    status: "observed",
  },
  {
    id: "life",
    label: "Life model",
    eyebrow: "3D reconstruction · interpretive",
    description:
      "Compare the fossil record with a credited fleshed reconstruction. Proportions are constrained by bone; muscles, skin, colour, and display structures remain interpretations.",
    status: "comparative",
  },
  {
    id: "trace",
    label: "Trace",
    eyebrow: "Behavioural evidence",
    description:
      "Tracks record contact with sediment, not a species portrait. Stride and print geometry support cautious motion inferences.",
    status: "inferred",
  },
  {
    id: "anatomy",
    label: "Anatomy",
    eyebrow: "Soft-tissue inference",
    description:
      "Organs are reconstructed through skeletal correlates and living archosaurs. Exact soft-tissue shapes are not preserved here.",
    status: "comparative",
  },
  {
    id: "lineage",
    label: "Lineage",
    eyebrow: "Evolutionary relationship",
    description:
      "Place the specimen on a branching family tree. Birds are the living dinosaur lineage, not a separate sequel.",
    status: "comparative",
  },
];

export const dinosaurSources: DinosaurSource[] = [
  {
    id: "field-sue-model",
    publisher: "Field Museum of Natural History",
    title: "SUE 3D model · FMNH PR 2081",
    url: "https://mm.fieldmuseum.org/b363f2cf-2958-4229-88fa-6b9e7a2e8bc7",
    kind: "specimen",
    note: "Full-cast scan published by the Field Museum under CC BY-NC 4.0.",
  },
  {
    id: "field-sue-science",
    publisher: "Field Museum of Natural History",
    title: "SUE 3D annotations",
    url: "https://www.fieldmuseum.org/page/sue-3d-model",
    kind: "museum",
    note: "Museum interpretation of pathologies in SUE's ribs, jaw, limbs, and vertebrae.",
  },
  {
    id: "smithsonian-triceratops",
    publisher: "Smithsonian National Museum of Natural History",
    title: "Triceratops horridus · USNM PAL500000",
    url: "https://www.si.edu/object/3d/triceratops-horridus-marsh-1889%3Ad8c623be-4ebc-11ea-b77f-2e728ce88125",
    kind: "specimen",
    note: "CC0 3D record of the complete mounted skeleton collected by John B. Hatcher in 1890.",
  },
  {
    id: "nhmw-diplodocus",
    publisher: "Natural History Museum Vienna",
    title: "Diplodocus carnegii · NHMW-GEO-1909/0004/0003",
    url: "https://sketchfab.com/3d-models/diplodocus-carnegii-nhmw-geo-190900040003-1d07ae9e002f4e8ab930dc92d07eb078",
    kind: "specimen",
    note: "Museum scan of a historic cast of Carnegie's Dippy, CC BY-NC 4.0.",
  },
  {
    id: "nhmw-plateosaurus",
    publisher: "Natural History Museum Vienna",
    title: "Plateosaurus skeleton",
    url: "https://sketchfab.com/3d-models/plateosaurus-skeleton-80683eb568cc46caac0649e395fa5a1b",
    kind: "specimen",
    note: "Scan combining original bones and documented 3D-print reconstructions, CC BY-NC 4.0.",
  },
  {
    id: "nhmw-protoceratops",
    publisher: "Natural History Museum Vienna",
    title: "Protoceratops andrewsi · NHMW-GEO-2015/0404/0001",
    url: "https://sketchfab.com/3d-models/protoceratops-andrewsi-nhmw-geo-201504040001-ed6e419065af422eaaa07294f55b8be1",
    kind: "specimen",
    note: "Artec scan assembled by NHMW from the Mongolian specimen, CC BY-NC 4.0.",
  },
  {
    id: "nhmw-psittacosaurus",
    publisher: "Natural History Museum Vienna",
    title: "Psittacosaurus mongoliensis · NHMW-GEO-1998/0064/0001",
    url: "https://sketchfab.com/3d-models/psittacosaurus-mongoliensisnhmw-geo199800641-f25dc41ec23242a588772f2205410722",
    kind: "specimen",
    note: "Museum surface scan of a Mongolian specimen, CC BY-NC 4.0.",
  },
  {
    id: "osaka-allosaurus",
    publisher: "Osaka Museum of Natural History",
    title: "Allosaurus replica mount",
    url: "https://sketchfab.com/3d-models/allosaurus-900868a0aa0b47e58571f5f5ae20094c",
    kind: "specimen",
    note: "CC BY scan of a 1974 replica whose tail-dragging pose records a superseded convention.",
  },
  {
    id: "corrected-allosaurus",
    publisher: "Olof Moleman · derived from Osaka Museum scan",
    title: "Allosaurus skeleton · corrected low-poly interpretation",
    url: "https://sketchfab.com/3d-models/allosaurus-skeleton-2193dcd84b694f659719b4b99c91228b",
    kind: "reconstruction",
    note: "CC BY-NC correction of the Osaka scan with a horizontal tail, revised shoulder position, furcula, skull, and caudal count. These changes are interpretive rather than original fossil geometry.",
  },
  {
    id: "arion-tyrannosaurus-life",
    publisher: "Arion Digital",
    title: "Tyrannosaurus rex · licensed 3D life reconstruction",
    url: "https://sketchfab.com/3d-models/tyrannosaurus-rex-a3384b114989470fb60f0500aeaae903",
    kind: "reconstruction",
    note: "CC BY 4.0 digital life reconstruction used as an explicitly interpretive life model, never as preserved anatomical evidence.",
  },
  {
    id: "jayqui-triceratops-life",
    publisher: "Jay Qui",
    title: "Triceratops horridus · 3D life reconstruction",
    url: "https://sketchfab.com/3d-models/triceratops-horridus-473e1ea1309247dcaf0c62fae47b04ba",
    kind: "reconstruction",
    note: "NoAI-labelled public 3D viewer. Anatomy is interpretive; colour and proposed sexual display are not preserved evidence.",
  },
  {
    id: "vfb-diplodocus-life",
    publisher: "vfb_paleoart",
    title: "Diplodocus carnegii · 3D life reconstruction",
    url: "https://sketchfab.com/3d-models/diplodocus-carnegii-4b297e56e95c476e98bce119e260a834",
    kind: "reconstruction",
    note: "Public paleoart viewer used for a clearly labelled life comparison; surface texture and colour remain interpretive.",
  },
  {
    id: "joanamaria-plateosaurus-life",
    publisher: "Joana Maria Pupeter · Paleontological Museum Munich project",
    title: "Plateosaurus · animated 3D reconstruction",
    url: "https://sketchfab.com/3d-models/plateosaurus-46547f78490c44bbad5a2e507334f734",
    kind: "reconstruction",
    note: "NoAI-labelled public viewer linked to the Paleontological Museum Munich; pose and surface appearance remain reconstruction.",
  },
  {
    id: "kyanos-protoceratops-life",
    publisher: "Kyan0s",
    title: "Protoceratops andrewsi · animated 3D reconstruction",
    url: "https://sketchfab.com/3d-models/protoceratops-andrewsi-eaa2fb15ce48486c8c5f6f824af26e0c",
    kind: "reconstruction",
    note: "NoAI-labelled Blender reconstruction shown through its public viewer; skin, colour, and motion are illustrative.",
  },
  {
    id: "dinoraul-psittacosaurus-life",
    publisher: "Raul Lunia (Dinoraul) · hosted by Sammy the Citipati",
    title: "Psittacosaurus · 3D life reconstruction",
    url: "https://sketchfab.com/3d-models/dinorauls-psittacosaurus-30aa2293038c4a71b8231f0fa7cec398",
    kind: "reconstruction",
    note: "CC BY 4.0 paleoart model. The known tail filaments constrain part of the silhouette; colour remains interpretive.",
  },
  {
    id: "nhmw-allosaurus-life",
    publisher: "Natural History Museum Vienna",
    title: "Allosaurus fragilis · 3D life reconstruction",
    url: "https://sketchfab.com/3d-models/allosaurus-fragilis-reconstruction-42c85d54a8374d249e220c18d45e5be8",
    kind: "reconstruction",
    note: "NoAI-labelled museum reconstruction based on the NHMW skeleton; its skin treatment is explicitly inspired by the museum's moving figure.",
  },
  {
    id: "khata-archaeopteryx-life",
    publisher: "khata",
    title: "Archaeopteryx · feathered 3D study",
    url: "https://sketchfab.com/3d-models/archaeopteryx-cbec5591c584438392824d13fbef401b",
    kind: "reconstruction",
    note: "CC BY 4.0 XGen feather study whose creator identifies it as incomplete; it is used to compare a possible living silhouette, not to close debates about flight.",
  },
  {
    id: "dundee-archaeopteryx",
    publisher: "University of Dundee Museum Collections",
    title: "Archaeopteryx fossil cast · DUNUC 2704",
    url: "https://sketchfab.com/3d-models/archaeopteryx-fossil-cast-eea4d66eaad34adb80969d9939835d05",
    kind: "specimen",
    note: "CC0 surface scan of a cast taken from the Berlin Archaeopteryx specimen.",
  },
  {
    id: "amnh-tracks",
    publisher: "American Museum of Natural History",
    title: "Who was that dinosaur?",
    url: "https://www.amnh.org/exhibitions/dinosaurs-ancient-fossils/trackways/who-was-that-dinosaur",
    kind: "museum",
    note: "What footprint geometry can and cannot identify about a trackmaker and its speed.",
  },
  {
    id: "nhm-methods",
    publisher: "Natural History Museum, London",
    title: "What scientists can learn about dinosaurs",
    url: "https://www.nhm.ac.uk/discover/what-can-scientists-learn-about-dinosaurs-and-how.html",
    kind: "museum",
    note: "Bone histology, growth lines, soft-tissue evidence, and reconstruction limits.",
  },
  {
    id: "archosaur-respiration",
    publisher: "Philosophical Transactions of the Royal Society B",
    title: "Respiratory evolution in archosaurs",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC7017431/",
    kind: "research",
    note: "Peer-reviewed review of skeletal correlates and comparative evidence for lungs and air sacs.",
  },
  {
    id: "nhm-birds",
    publisher: "Natural History Museum, London",
    title: "How dinosaurs evolved into birds",
    url: "https://www.nhm.ac.uk/discover/how-dinosaurs-evolved-into-birds.html",
    kind: "museum",
    note: "Theropod-to-bird evolution and the evidential role of feathered fossils.",
  },
  {
    id: "nhm-archaeopteryx",
    publisher: "Natural History Museum, London",
    title: "Archaeopteryx",
    url: "https://www.nhm.ac.uk/discover/dino-directory/archaeopteryx.html",
    kind: "museum",
    note: "Species record covering body size, diet, feathers, age, and unresolved flight capability.",
  },
];

export const dinosaurLifeModels: Record<DinosaurSpeciesId, DinosaurLifeModel> = {
  tyrannosaurus: {
    speciesId: "tyrannosaurus",
    title: "Tyrannosaurus rex",
    creator: "Arion Digital",
    sketchfabUid: "a3384b114989470fb60f0500aeaae903",
    preview: "/media/dinosaurs/specimens/tyrannosaurus-life-3d.jpg",
    sourceId: "arion-tyrannosaurus-life",
    sourceUrl: "https://sketchfab.com/3d-models/tyrannosaurus-rex-a3384b114989470fb60f0500aeaae903",
    license: "CC BY 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
    note: "Body volume is constrained by the skeleton. Lip coverage, skin detail, and colour are reconstructive choices.",
  },
  triceratops: {
    speciesId: "triceratops",
    title: "Triceratops horridus",
    creator: "Jay Qui",
    sketchfabUid: "473e1ea1309247dcaf0c62fae47b04ba",
    preview: "https://media.sketchfab.com/models/473e1ea1309247dcaf0c62fae47b04ba/thumbnails/63591ddfa9d0440dbf68747033ef282a/8b6b95907c5947269b57030df75ea5ee.jpeg",
    sourceId: "jayqui-triceratops-life",
    sourceUrl: "https://sketchfab.com/3d-models/triceratops-horridus-473e1ea1309247dcaf0c62fae47b04ba",
    license: "Public viewer · creator copyright",
    licenseUrl: "https://sketchfab.com/3d-models/triceratops-horridus-473e1ea1309247dcaf0c62fae47b04ba",
    note: "The horns and frill are fossil-constrained. Colour and any proposed display pattern are not preserved in this specimen.",
  },
  diplodocus: {
    speciesId: "diplodocus",
    title: "Diplodocus carnegii",
    creator: "vfb_paleoart",
    sketchfabUid: "4b297e56e95c476e98bce119e260a834",
    preview: "https://media.sketchfab.com/models/4b297e56e95c476e98bce119e260a834/thumbnails/d3e059cf4c1042088a3e1e47af077a9c/dc50215b06874ff0aae969786772160a.jpeg",
    sourceId: "vfb-diplodocus-life",
    sourceUrl: "https://sketchfab.com/3d-models/diplodocus-carnegii-4b297e56e95c476e98bce119e260a834",
    license: "Public viewer · creator copyright",
    licenseUrl: "https://sketchfab.com/3d-models/diplodocus-carnegii-4b297e56e95c476e98bce119e260a834",
    note: "The axial skeleton constrains the long, low profile. Skin texture and soft-tissue volume remain interpretive.",
  },
  plateosaurus: {
    speciesId: "plateosaurus",
    title: "Plateosaurus",
    creator: "Joana Maria Pupeter",
    sketchfabUid: "46547f78490c44bbad5a2e507334f734",
    preview: "https://media.sketchfab.com/models/46547f78490c44bbad5a2e507334f734/thumbnails/372770082067440b97d5bfc34236e202/245fd7260f9343d798570bce8b46939b.jpeg",
    sourceId: "joanamaria-plateosaurus-life",
    sourceUrl: "https://sketchfab.com/3d-models/plateosaurus-46547f78490c44bbad5a2e507334f734",
    license: "Public viewer · creator copyright · NoAI",
    licenseUrl: "https://sketchfab.com/3d-models/plateosaurus-46547f78490c44bbad5a2e507334f734",
    note: "Limb proportions constrain stance. Exact gait, external tissue, and colour are reconstructed rather than observed.",
  },
  protoceratops: {
    speciesId: "protoceratops",
    title: "Protoceratops andrewsi",
    creator: "Kyan0s",
    sketchfabUid: "eaa2fb15ce48486c8c5f6f824af26e0c",
    preview: "https://media.sketchfab.com/models/eaa2fb15ce48486c8c5f6f824af26e0c/thumbnails/6f5af22914894c2d9570bc30fb86ad07/b12867c46f4c43008de27570801678ef.jpeg",
    sourceId: "kyanos-protoceratops-life",
    sourceUrl: "https://sketchfab.com/3d-models/protoceratops-andrewsi-eaa2fb15ce48486c8c5f6f824af26e0c",
    license: "Public viewer · creator copyright · NoAI",
    licenseUrl: "https://sketchfab.com/3d-models/protoceratops-andrewsi-eaa2fb15ce48486c8c5f6f824af26e0c",
    note: "The beak and frill follow the skull. Cheeks, skin texture, colour, and movement remain interpretive.",
  },
  psittacosaurus: {
    speciesId: "psittacosaurus",
    title: "Psittacosaurus",
    creator: "Raul Lunia (Dinoraul)",
    sketchfabUid: "30aa2293038c4a71b8231f0fa7cec398",
    preview: "https://media.sketchfab.com/models/30aa2293038c4a71b8231f0fa7cec398/thumbnails/d8305a42e502491192993d51716d5221/9b621764eb0e4e4f9c35b49e1b302b12.jpeg",
    sourceId: "dinoraul-psittacosaurus-life",
    sourceUrl: "https://sketchfab.com/3d-models/dinorauls-psittacosaurus-30aa2293038c4a71b8231f0fa7cec398",
    license: "CC BY 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
    note: "Fossil skin and tail filaments constrain more than usual. Colour pattern and most soft-tissue volume are still reconstructed.",
  },
  allosaurus: {
    speciesId: "allosaurus",
    title: "Allosaurus fragilis",
    creator: "Natural History Museum Vienna · FH Hagenberg Digital Arts",
    sketchfabUid: "42c85d54a8374d249e220c18d45e5be8",
    preview: "https://media.sketchfab.com/models/42c85d54a8374d249e220c18d45e5be8/thumbnails/4832b335e5fd4ca787651dacbf90b873/375d6105c01843c2b5625a45c5248494.jpeg",
    sourceId: "nhmw-allosaurus-life",
    sourceUrl: "https://sketchfab.com/3d-models/allosaurus-fragilis-reconstruction-42c85d54a8374d249e220c18d45e5be8",
    license: "Public museum viewer · creator copyright · NoAI",
    licenseUrl: "https://sketchfab.com/3d-models/allosaurus-fragilis-reconstruction-42c85d54a8374d249e220c18d45e5be8",
    note: "This museum model begins with the skeleton; its reconstructed skin appearance is inspired by NHMW's moving exhibit figure and is not fossil skin evidence.",
  },
  archaeopteryx: {
    speciesId: "archaeopteryx",
    title: "Archaeopteryx",
    creator: "khata",
    sketchfabUid: "cbec5591c584438392824d13fbef401b",
    preview: "https://media.sketchfab.com/models/cbec5591c584438392824d13fbef401b/thumbnails/d34cf59d13de4296ac8e670369cacdd8/a6305b203c604be4aee2db6708468ce8.jpeg",
    sourceId: "khata-archaeopteryx-life",
    sourceUrl: "https://sketchfab.com/3d-models/archaeopteryx-cbec5591c584438392824d13fbef401b",
    license: "CC BY 4.0 · incomplete study",
    licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
    note: "Feathers are directly evidenced, but this XGen study is identified by its creator as incomplete. Colour, posture, and flight behaviour remain open.",
  },
};

const theropodAnatomy: DinosaurAnatomySystem[] = [
  {
    id: "respiration",
    label: "Lungs & air sacs",
    note: "Air-filled spaces in parts of the skeleton can support an air-sac inference. Exact sacs and airflow are not preserved.",
    status: "inferred",
  },
  {
    id: "circulation",
    label: "Heart",
    note: "A four-chambered heart is a comparative archosaur inference. No heart outline is claimed from this skeleton.",
    status: "comparative",
  },
  {
    id: "digestion",
    label: "Digestive tract",
    note: "Teeth and jaw mechanics constrain diet more strongly than the exact shape of the unpreserved gut.",
    status: "inferred",
  },
];

const herbivoreAnatomy: DinosaurAnatomySystem[] = [
  {
    id: "respiration",
    label: "Lungs & air sacs",
    note: "Respiration is reconstructed from skeletal correlates and living archosaurs; organ boundaries are not preserved.",
    status: "comparative",
  },
  {
    id: "circulation",
    label: "Heart",
    note: "The four-chambered archosaur condition is a comparison, not recovered soft tissue.",
    status: "comparative",
  },
  {
    id: "digestion",
    label: "Plant-processing gut",
    note: "A large fermentation gut is plausible, but its chambering, microbiome, and exact volume cannot be read from bone.",
    status: "inferred",
  },
];

export const dinosaurSpecies: DinosaurSpecies[] = [
  {
    id: "tyrannosaurus",
    order: "01",
    commonName: "Tyrannosaurus rex",
    shortName: "T. rex",
    scientificName: "Tyrannosaurus rex",
    clade: "Tyrannosauridae · Theropoda",
    interval: "Late Cretaceous · Maastrichtian",
    lived: "about 68–66 million years ago",
    locality: "South Dakota, USA",
    formation: "Hell Creek Formation",
    title: "Damage becomes biography.",
    hook: "SUE's skeleton records healed ribs, joint disease, infection, and survival—evidence about one animal, not a generic monster.",
    accent: "#8b4a31",
    diet: "Carnivore · hunter and scavenger",
    dietEvidence: "Serrated teeth, bite mechanics, and damaged bone support meat-eating; one feeding strategy need not exclude the other.",
    ageRecord: "Species lifespan unknown",
    ageNote: "Bone histology estimates SUE died at roughly 28 years old. That is an age-at-death, not a maximum species lifespan.",
    length: "SUE mount · about 12.3 m",
    locomotion: "Obligate biped",
    traits: ["deep skull with robust teeth", "two-fingered forelimbs", "healed and active pathologies"],
    specimen: {
      institution: "Field Museum of Natural History",
      catalogue: "FMNH PR 2081 · SUE",
      recordType: "Full cast 3D scan",
      recordNote: "The object is a scan of the museum's full cast. Scientific annotations refer to SUE's fossil skeleton.",
      license: "CC BY-NC 4.0",
      licenseUrl: "https://creativecommons.org/licenses/by-nc/4.0/",
      sourceUrl: "https://mm.fieldmuseum.org/b363f2cf-2958-4229-88fa-6b9e7a2e8bc7",
      modelPath: "/models/dinosaurs/institutional/field-sue-pr2081.glb",
      sketchfabUid: "0a5025394e994c34b85ebef144bc6e6a",
      preview: "/media/dinosaurs/specimens/tyrannosaurus.jpg",
      provider: "local",
    },
    boneRegions: [
      { id: "jaw", label: "Jaw", note: "Perforations around SUE's jaw were interpreted by the museum as severe infection.", status: "observed" },
      { id: "ribs", label: "Ribs", note: "Nine ribs show healed fractures or disease; remodeled bone records survival.", status: "observed" },
      { id: "fibula", label: "Fibula", note: "Extensive extra bone is consistent with a major infection following injury.", status: "observed" },
      { id: "tail", label: "Tail vertebrae", note: "Arthritic changes preserve disease at joints in the tail.", status: "observed" },
    ],
    trace: {
      title: "A track names a body plan, rarely a species.",
      note: "Large three-toed theropod tracks constrain hip height, direction, and relative speed. A track alone is usually not a secure T. rex identification.",
      caution: "No footprint here is claimed to have been made by SUE.",
    },
    anatomy: theropodAnatomy,
    lineage: {
      path: ["Dinosauria", "Saurischia", "Theropoda", "Coelurosauria", "Tyrannosauridae"],
      note: "T. rex and birds share theropod ancestry; birds did not descend from Tyrannosaurus itself.",
      livingReference: "Birds · the surviving theropod branch",
    },
    sourceIds: ["field-sue-model", "field-sue-science", "arion-tyrannosaurus-life", "amnh-tracks", "nhm-methods", "archosaur-respiration", "nhm-birds"],
  },
  {
    id: "triceratops",
    order: "02",
    commonName: "Triceratops",
    shortName: "Triceratops",
    scientificName: "Triceratops horridus",
    clade: "Ceratopsidae · Ornithischia",
    interval: "Late Cretaceous · Maastrichtian",
    lived: "about 68–66 million years ago",
    locality: "Niobrara County, Wyoming, USA",
    formation: "Lance-age rocks",
    title: "A skull can carry a social argument.",
    hook: "Horn cores and a broad frill are bone. Their keratin coverings, colour, display, and moment-to-moment use remain reconstructed.",
    accent: "#6d7250",
    diet: "Herbivore",
    dietEvidence: "A cropping beak and dental battery support intensive plant processing; exact plants and seasonal diet are rarely preserved.",
    ageRecord: "Species lifespan unknown",
    ageNote: "Growth can be studied from bone tissue, but this display does not turn one individual's histology into a species lifespan.",
    length: "Adult body · roughly 8–9 m",
    locomotion: "Quadruped",
    traits: ["three facial horn cores", "expanded neck frill", "dense shearing dental battery"],
    specimen: {
      institution: "Smithsonian NMNH",
      catalogue: "USNM PAL500000",
      recordType: "Complete mounted skeleton · updated",
      recordNote: "Collected by John B. Hatcher in 1890. Mounting and restoration remain part of the display object's history.",
      license: "CC0 · public domain",
      licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/",
      sourceUrl: "https://www.si.edu/object/3d/triceratops-horridus-marsh-1889%3Ad8c623be-4ebc-11ea-b77f-2e728ce88125",
      modelPath: "/models/dinosaurs/institutional/smithsonian-triceratops-pal500000.glb",
      sketchfabUid: "e9c507f179ed4455aac3b208c9e6c973",
      preview: "/media/dinosaurs/specimens/triceratops.jpg",
      provider: "local",
    },
    boneRegions: [
      { id: "brow-horns", label: "Brow horns", note: "The bony cores are preserved; a living keratin sheath extended beyond them.", status: "inferred" },
      { id: "frill", label: "Frill", note: "The frill is skeletal. Display, defence, recognition, and heat exchange remain interpretations.", status: "inferred" },
      { id: "beak", label: "Beak", note: "The rostral bone anchors a keratinous beak not preserved in this mount.", status: "inferred" },
      { id: "teeth", label: "Dental battery", note: "Columns of replacing teeth formed repeated shearing surfaces for plant food.", status: "observed" },
    ],
    trace: {
      title: "Four feet leave unequal signatures.",
      note: "Ceratopsian tracks can preserve broad hind prints and smaller fore prints, but an isolated track is not a secure Triceratops identification.",
      caution: "Trackmaker identity is a match among anatomy, age, place, and print geometry.",
    },
    anatomy: herbivoreAnatomy,
    lineage: {
      path: ["Dinosauria", "Ornithischia", "Ceratopsia", "Ceratopsidae", "Triceratops"],
      note: "Its 'bird-hipped' branch does not make Triceratops the ancestor of birds.",
      livingReference: "No living ceratopsian lineage",
    },
    sourceIds: ["smithsonian-triceratops", "amnh-tracks", "nhm-methods", "archosaur-respiration", "nhm-birds"],
  },
  {
    id: "diplodocus",
    order: "03",
    commonName: "Diplodocus",
    shortName: "Diplodocus",
    scientificName: "Diplodocus carnegii",
    clade: "Diplodocidae · Sauropoda",
    interval: "Late Jurassic",
    lived: "about 150 million years ago",
    locality: "Sheep Creek, Wyoming, USA",
    formation: "Morrison Formation",
    title: "Scale is an anatomical problem.",
    hook: "A long neck, immense gut volume, air-filled vertebrae, and columnar limbs solved different constraints of terrestrial gigantism.",
    accent: "#6b766c",
    diet: "Herbivore · non-chewing cropper",
    dietEvidence: "Peg-like teeth cropped vegetation; processing likely depended heavily on the digestive tract rather than oral chewing.",
    ageRecord: "Species lifespan unknown",
    ageNote: "Bone growth lines estimate individual age and rate, but do not justify one universal sauropod lifespan.",
    length: "Historic Dippy cast · about 25 m",
    locomotion: "Quadruped",
    traits: ["elongate whip-like tail", "pneumatized vertebrae", "columnar weight-bearing limbs"],
    specimen: {
      institution: "Natural History Museum Vienna",
      catalogue: "NHMW-GEO-1909/0004/0003",
      recordType: "3D scan of a skeleton cast",
      recordNote: "A 1909 cast of Carnegie's Dippy—not one excavated individual in Vienna. It preserves a historic museum object.",
      license: "CC BY-NC 4.0",
      licenseUrl: "https://creativecommons.org/licenses/by-nc/4.0/",
      sourceUrl: "https://sketchfab.com/3d-models/diplodocus-carnegii-nhmw-geo-190900040003-1d07ae9e002f4e8ab930dc92d07eb078",
      sketchfabUid: "1d07ae9e002f4e8ab930dc92d07eb078",
      preview: "/media/dinosaurs/specimens/diplodocus.jpg",
      provider: "sketchfab",
    },
    boneRegions: [
      { id: "cervicals", label: "Neck vertebrae", note: "Complex vertebrae reduced mass while supporting an elongated neck.", status: "observed" },
      { id: "tail", label: "Tail", note: "Slender distal caudals form a whip-like sequence; exact motion needs biomechanical testing.", status: "observed" },
      { id: "feet", label: "Manus & pes", note: "Fore and hind feet differ in shape and leave unequal track impressions.", status: "observed" },
      { id: "skull", label: "Skull", note: "Peg-like teeth show cropping anatomy, not the full digestive strategy.", status: "observed" },
    ],
    trace: {
      title: "A trackway measures a moving column.",
      note: "Large rounded hind prints and smaller fore prints can reveal gait width, stride, and direction without a skeleton.",
      caution: "A trackway may identify a sauropod body plan without identifying Diplodocus.",
    },
    anatomy: herbivoreAnatomy,
    lineage: {
      path: ["Dinosauria", "Saurischia", "Sauropodomorpha", "Sauropoda", "Diplodocidae"],
      note: "Diplodocus and theropods share saurischian ancestry, then diverge into radically different body plans.",
      livingReference: "No living sauropod lineage",
    },
    sourceIds: ["nhmw-diplodocus", "amnh-tracks", "nhm-methods", "archosaur-respiration", "nhm-birds"],
  },
  {
    id: "plateosaurus",
    order: "04",
    commonName: "Plateosaurus",
    shortName: "Plateosaurus",
    scientificName: "Plateosaurus trossingensis",
    clade: "Plateosauridae · Sauropodomorpha",
    interval: "Late Triassic",
    lived: "about 214–204 million years ago",
    locality: "Central Europe",
    formation: "Trossingen-type assemblages",
    title: "Before giants, a body plan in transition.",
    hook: "A small skull, long neck, powerful hindlimbs, and mobile hands expose an early sauropodomorph experiment.",
    accent: "#846a45",
    diet: "Predominantly herbivorous",
    dietEvidence: "Leaf-shaped teeth support plant feeding; occasional omnivory is harder to exclude from anatomy alone.",
    ageRecord: "Individual growth varied",
    ageNote: "Histology suggests flexible growth among individuals. A precise species lifespan is not established.",
    length: "Adults · roughly 5–8 m",
    locomotion: "Primarily bipedal interpretation",
    traits: ["grasping hand and thumb claw", "long neck and tail", "variable adult body size"],
    specimen: {
      institution: "Natural History Museum Vienna",
      catalogue: "Hall 7 mounted skeleton",
      recordType: "Original bones plus 3D-print reconstructions",
      recordNote: "NHMW documents both original and printed parts. A complete mount is not the same as one complete fossil skeleton.",
      license: "CC BY-NC 4.0",
      licenseUrl: "https://creativecommons.org/licenses/by-nc/4.0/",
      sourceUrl: "https://sketchfab.com/3d-models/plateosaurus-skeleton-80683eb568cc46caac0649e395fa5a1b",
      sketchfabUid: "80683eb568cc46caac0649e395fa5a1b",
      preview: "/media/dinosaurs/specimens/plateosaurus.jpg",
      provider: "sketchfab",
    },
    boneRegions: [
      { id: "hand", label: "Hand", note: "A mobile hand and enlarged first digit differ from later sauropod columns.", status: "observed" },
      { id: "pelvis", label: "Pelvis", note: "Pelvic and hindlimb proportions anchor reconstructions of support and gait.", status: "observed" },
      { id: "neck", label: "Neck", note: "Elongation is present, but not at later sauropod proportions.", status: "observed" },
      { id: "mount", label: "Restored elements", note: "Some visible parts are documented prints rather than original fossil.", status: "historical" },
    ],
    trace: {
      title: "Posture is tested against the ground.",
      note: "Trackways and joint ranges can test whether a proposed mount could move without impossible foot placement.",
      caution: "No trackway is assigned to this exact mounted individual.",
    },
    anatomy: herbivoreAnatomy,
    lineage: {
      path: ["Dinosauria", "Saurischia", "Sauropodomorpha", "Plateosauridae"],
      note: "Plateosaurus is an early relative, not a miniature Diplodocus or necessarily its direct ancestor.",
      livingReference: "No living sauropodomorph lineage",
    },
    sourceIds: ["nhmw-plateosaurus", "amnh-tracks", "nhm-methods", "archosaur-respiration", "nhm-birds"],
  },
  {
    id: "protoceratops",
    order: "05",
    commonName: "Protoceratops",
    shortName: "Protoceratops",
    scientificName: "Protoceratops andrewsi",
    clade: "Protoceratopsidae · Ceratopsia",
    interval: "Late Cretaceous",
    lived: "about 75–71 million years ago",
    locality: "Mongolia",
    formation: "Gobi Desert deposits",
    title: "The frill arrives before the horns.",
    hook: "A parrot-like beak and frill appear within a diverse Asian radiation—not a simple march toward Triceratops.",
    accent: "#9a7859",
    diet: "Herbivore",
    dietEvidence: "A keratin-covered beak is inferred from its bony core; cheek teeth processed fibrous plant material.",
    ageRecord: "Species lifespan unknown",
    ageNote: "Growth series compare juveniles and adults, but no maximum lifespan is established.",
    length: "Adult · roughly 1.8–2 m",
    locomotion: "Quadruped",
    traits: ["deep beak", "modest neck frill", "no giant brow horns"],
    specimen: {
      institution: "Natural History Museum Vienna",
      catalogue: "NHMW-GEO-2015/0404/0001",
      recordType: "3D scan of a skeleton",
      recordNote: "Found in Mongolia, acquired in 1998, scanned with Artec instruments, and assembled by museum staff.",
      license: "CC BY-NC 4.0",
      licenseUrl: "https://creativecommons.org/licenses/by-nc/4.0/",
      sourceUrl: "https://sketchfab.com/3d-models/protoceratops-andrewsi-nhmw-geo-201504040001-ed6e419065af422eaaa07294f55b8be1",
      sketchfabUid: "ed6e419065af422eaaa07294f55b8be1",
      preview: "/media/dinosaurs/specimens/protoceratops.jpg",
      provider: "sketchfab",
    },
    boneRegions: [
      { id: "frill", label: "Frill", note: "A shorter frill shows ceratopsian diversity, not an unfinished later animal.", status: "observed" },
      { id: "beak", label: "Rostral beak", note: "Bone supports a keratin covering whose exact outline is inferred.", status: "inferred" },
      { id: "limbs", label: "Limbs", note: "Robust limbs support a terrestrial quadrupedal body plan.", status: "observed" },
      { id: "skull", label: "Skull openings", note: "Attachment surfaces inform jaw-muscle reconstruction without preserving muscles.", status: "inferred" },
    ],
    trace: {
      title: "A small ceratopsian still leaves uncertainty.",
      note: "Print size and foot anatomy narrow candidates, but close relatives can leave overlapping trace shapes.",
      caution: "Tracks often receive their own trace-fossil name rather than a body-species name.",
    },
    anatomy: herbivoreAnatomy,
    lineage: {
      path: ["Dinosauria", "Ornithischia", "Ceratopsia", "Protoceratopsidae"],
      note: "A close ceratopsian relative outside Ceratopsidae—not simply a juvenile Triceratops.",
      livingReference: "No living ceratopsian lineage",
    },
    sourceIds: ["nhmw-protoceratops", "amnh-tracks", "nhm-methods", "archosaur-respiration", "nhm-birds"],
  },
  {
    id: "psittacosaurus",
    order: "06",
    commonName: "Psittacosaurus",
    shortName: "Psittacosaurus",
    scientificName: "Psittacosaurus mongoliensis",
    clade: "Psittacosauridae · Ceratopsia",
    interval: "Early Cretaceous",
    lived: "about 125–105 million years ago",
    locality: "Mongolia",
    formation: "Cretaceous Asian deposits",
    title: "Ceratopsia began small and bipedal.",
    hook: "A compact body, deep beak, and two-legged stance unsettle the idea that every horned-dinosaur relative resembled Triceratops.",
    accent: "#707b66",
    diet: "Herbivore with possible opportunism",
    dietEvidence: "Beak and teeth support plant processing; exact foods and occasional animal matter are not preserved here.",
    ageRecord: "Species lifespan unknown",
    ageNote: "Juvenile and adult specimens reveal growth, but this object does not establish maximum lifespan.",
    length: "Adult · roughly 1–2 m",
    locomotion: "Bipedal",
    traits: ["deep parrot-like beak", "short skull frill", "tail bristles known in other specimens"],
    specimen: {
      institution: "Natural History Museum Vienna",
      catalogue: "NHMW-GEO-1998/0064/0001",
      recordType: "3D surface scan",
      recordNote: "Found in Mongolia and acquired in 1998. Bristles known from other fossils are not added to this scan.",
      license: "CC BY-NC 4.0",
      licenseUrl: "https://creativecommons.org/licenses/by-nc/4.0/",
      sourceUrl: "https://sketchfab.com/3d-models/psittacosaurus-mongoliensisnhmw-geo199800641-f25dc41ec23242a588772f2205410722",
      sketchfabUid: "f25dc41ec23242a588772f2205410722",
      preview: "/media/dinosaurs/specimens/psittacosaurus.jpg",
      provider: "sketchfab",
    },
    boneRegions: [
      { id: "beak", label: "Beak core", note: "The rostral bone anchors keratin that is not preserved with this skeleton.", status: "inferred" },
      { id: "hindlimb", label: "Hindlimb", note: "Limb proportions support a primarily bipedal reconstruction.", status: "observed" },
      { id: "skull", label: "Skull", note: "Ceratopsian identity appears without giant horns and a broad frill.", status: "observed" },
      { id: "tail", label: "Tail", note: "Bristle-like covering is known from exceptional specimens, not this digital mount.", status: "comparative" },
    ],
    trace: {
      title: "Small tracks are vulnerable evidence.",
      note: "A bipedal print series preserves direction and pace, but small related trackmakers can be confused.",
      caution: "Body covering and colour cannot be read from an ordinary footprint.",
    },
    anatomy: herbivoreAnatomy,
    lineage: {
      path: ["Dinosauria", "Ornithischia", "Ceratopsia", "Psittacosauridae"],
      note: "An early-diverging ceratopsian relative that reveals how varied the group became.",
      livingReference: "No living ceratopsian lineage",
    },
    sourceIds: ["nhmw-psittacosaurus", "amnh-tracks", "nhm-methods", "archosaur-respiration", "nhm-birds"],
  },
  {
    id: "allosaurus",
    order: "07",
    commonName: "Allosaurus",
    shortName: "Allosaurus",
    scientificName: "Allosaurus sp.",
    clade: "Allosauridae · Theropoda",
    interval: "Late Jurassic",
    lived: "about 151–145 million years ago",
    locality: "Utah, USA",
    formation: "Morrison Formation",
    title: "A correction makes interpretation visible.",
    hook: "This digital reconstruction begins with Osaka's 1974 scan, then documents the revised tail, shoulder, furcula, skull, and vertebral count instead of presenting an old mount as neutral fact.",
    accent: "#795a4d",
    diet: "Carnivore",
    dietEvidence: "Serrated teeth and a large predatory skull support meat-eating; group hunting is a separate question.",
    ageRecord: "Species lifespan uncertain",
    ageNote: "Histology can estimate individual growth and age-at-death; this replica is not lifespan evidence.",
    length: "Adult body · roughly 8.5–9.7 m",
    locomotion: "Biped · tail held clear of ground",
    traits: ["three-fingered forelimbs", "paired crests above eyes", "digitally corrected skeletal pose"],
    specimen: {
      institution: "Olof Moleman · Osaka Museum source scan",
      catalogue: "Derived correction of Osaka's 1974 replica",
      recordType: "Scientifically corrected digital mount",
      recordNote: "This 180k-triangle interpretation is derived from Osaka's openly licensed scan. Reposed and resculpted regions are reconstruction; the original historical mount remains linked in provenance.",
      license: "CC BY-NC 4.0",
      licenseUrl: "https://creativecommons.org/licenses/by-nc/4.0/",
      sourceUrl: "https://sketchfab.com/3d-models/allosaurus-skeleton-2193dcd84b694f659719b4b99c91228b",
      sketchfabUid: "2193dcd84b694f659719b4b99c91228b",
      preview: "/media/dinosaurs/specimens/allosaurus.jpg",
      provider: "sketchfab",
    },
    boneRegions: [
      { id: "pose", label: "Mounted spine", note: "The corrected torso is balanced over the hips; this is a documented reinterpretation of the older mount.", status: "historical" },
      { id: "hands", label: "Hands", note: "Three functional fingers contrast with Tyrannosaurus.", status: "observed" },
      { id: "skull", label: "Skull", note: "Crests and lighter construction differ from later tyrannosaurids.", status: "observed" },
      { id: "tail", label: "Tail", note: "Trackways generally lack continuous tail drags, testing old poses.", status: "inferred" },
    ],
    trace: {
      title: "The missing tail mark changed the mount.",
      note: "Narrow theropod trackways with no continuous drag support a body balanced over the hips.",
      caution: "Tracks can falsify a posture even when they cannot name the species.",
    },
    anatomy: theropodAnatomy,
    lineage: {
      path: ["Dinosauria", "Saurischia", "Theropoda", "Allosauroidea", "Allosauridae"],
      note: "Allosaurus is a theropod outside the coelurosaur branch containing Tyrannosaurus and birds.",
      livingReference: "Birds preserve the surviving theropod branch",
    },
    sourceIds: ["corrected-allosaurus", "osaka-allosaurus", "amnh-tracks", "nhm-methods", "archosaur-respiration", "nhm-birds"],
  },
  {
    id: "archaeopteryx",
    order: "08",
    commonName: "Archaeopteryx",
    shortName: "Archaeopteryx",
    scientificName: "Archaeopteryx siemensii",
    clade: "Avialae · Theropoda",
    interval: "Late Jurassic",
    lived: "about 149–145 million years ago",
    locality: "Solnhofen, Germany",
    formation: "Solnhofen Limestone",
    title: "The boundary between bird and dinosaur dissolves.",
    hook: "Feather impressions coexist with teeth, clawed fingers, and a long bony tail—a mosaic, not a half-made bird.",
    accent: "#596f78",
    diet: "Carnivore · likely small prey",
    dietEvidence: "Small pointed teeth support animal food; insects or small vertebrates remain plausible reconstructions.",
    ageRecord: "Species lifespan unknown",
    ageNote: "The cast records anatomy and feather impressions, not population lifespan. Flight capability remains debated.",
    length: "About 0.5 m",
    locomotion: "Biped · flight or gliding debated",
    traits: ["asymmetrical flight feathers", "teeth and clawed fingers", "long bony tail"],
    specimen: {
      institution: "University of Dundee Museum Collections",
      catalogue: "DUNUC 2704",
      recordType: "Surface scan of a fossil cast",
      recordNote: "The cast was taken from the Berlin specimen. It is a surface record, not the original fossil in Dundee.",
      license: "CC0 · public domain",
      licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/",
      sourceUrl: "https://sketchfab.com/3d-models/archaeopteryx-fossil-cast-eea4d66eaad34adb80969d9939835d05",
      sketchfabUid: "eea4d66eaad34adb80969d9939835d05",
      preview: "/media/dinosaurs/specimens/archaeopteryx.jpg",
      provider: "sketchfab",
    },
    boneRegions: [
      { id: "feathers", label: "Feather impressions", note: "The slab preserves traces of long, complex feathers.", status: "observed" },
      { id: "tail", label: "Bony tail", note: "A long vertebral tail differs from the fused tail of living birds.", status: "observed" },
      { id: "hands", label: "Clawed fingers", note: "Three separate clawed digits coexist with a feathered wing.", status: "observed" },
      { id: "teeth", label: "Teeth", note: "Small teeth are absent in living birds.", status: "observed" },
    ],
    trace: {
      title: "Feathers can be surface traces.",
      note: "Fine limestone preserved impressions around the skeleton, recording structure more directly than tracks record appearance.",
      caution: "Powered flight, assisted flapping, and gliding remain debated.",
    },
    anatomy: [
      { id: "respiration", label: "Lungs & air sacs", note: "A bird-like condition is comparative, not preserved organs in this cast.", status: "comparative" },
      { id: "circulation", label: "Heart", note: "The heart is not preserved; four chambers are an archosaur comparison.", status: "comparative" },
      { id: "digestion", label: "Digestive tract", note: "Teeth support small prey, but the organ layout is not visible.", status: "inferred" },
    ],
    lineage: {
      path: ["Dinosauria", "Saurischia", "Theropoda", "Paraves", "Avialae"],
      note: "Close to avialan origins, but not necessarily the direct ancestor of living birds.",
      livingReference: "More than 10,000 living bird species continue the lineage",
    },
    sourceIds: ["dundee-archaeopteryx", "nhm-archaeopteryx", "nhm-methods", "archosaur-respiration", "nhm-birds"],
  },
];

export function getDinosaurSpecies(id: string | null | undefined): DinosaurSpecies {
  return dinosaurSpecies.find((species) => species.id === id) ?? dinosaurSpecies[0];
}

export function getDinosaurMode(id: string | null | undefined) {
  return dinosaurModes.find((mode) => mode.id === id) ?? dinosaurModes[0];
}

export function getDinosaurLifeModel(id: DinosaurSpeciesId): DinosaurLifeModel {
  return dinosaurLifeModels[id];
}

export function getDinosaurSources(ids: readonly string[]): DinosaurSource[] {
  return ids
    .map((id) => dinosaurSources.find((source) => source.id === id))
    .filter((source): source is DinosaurSource => Boolean(source));
}

export function isDinosaurSpeciesId(id: string | null): id is DinosaurSpeciesId {
  return dinosaurSpecies.some((species) => species.id === id);
}

export function isDinosaurModeId(id: string | null): id is DinosaurModeId {
  return dinosaurModes.some((mode) => mode.id === id);
}
