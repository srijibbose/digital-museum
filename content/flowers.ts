export type FlowerEvidenceKind =
  | "observed-scan"
  | "source-constrained-reconstruction"
  | "explanatory-reconstruction"
  | "time-compressed-reconstruction";

export type FlowerChapterId =
  | "form"
  | "inside"
  | "transfer"
  | "fertilisation"
  | "outcome";

export interface FlowerChapter {
  id: FlowerChapterId;
  index: string;
  title: string;
  shortTitle: string;
  subtitle: string;
  thesis: string;
  action: string;
  evidence: FlowerEvidenceKind;
  evidenceLabel: string;
  evidenceDetail: string;
  scale: string;
  clock: string;
  observations: string[];
}
export interface FlowerSource {
  id: string;
  title: string;
  publisher: string;
  url: string;
  rights: string;
  use: string;
}

export const flowerExhibit = {
  title: "The Work of Flowers",
  curatorialThesis:
    "A flower is not a still ornament. It is a temporary reproductive machine that changes scale, recruits another animal, and reorganises itself after one successful contact.",
  visitorPromise:
    "Follow one orchid from visible form to hidden anatomy, pollen transfer, fertilisation, and fruit set without losing where you are—or what kind of evidence you are seeing.",
  specimen: {
    commonName: "White moth orchid",
    scientificName: "Phalaenopsis amabilis",
    accession: "Smithsonian Gardens 2019-0352A",
    modelPath: "/models/flowers/phalaenopsis-amabilis-smithsonian.glb",
    capture: "Photogrammetric surface model",
    pollinationSyndrome: "Carpenter bee (Xylocopa), nectar deception",
    rights: "CC0",
    sourceId: "smithsonian-model",
  },
  chapters: [
    {
      id: "form",
      index: "01",
      title: "A flower built for an encounter",
      shortTitle: "Form",
      subtitle: "The visible surface",
      thesis:
        "Bilateral symmetry, a landing-like labellum, and a central column organise the visitor's approach.",
      action: "Drag to orbit the recorded bloom. Scroll to begin the section.",
      evidence: "observed-scan",
      evidenceLabel: "Observed surface scan",
      evidenceDetail:
        "The textured geometry records the exterior of one cultivated Smithsonian Gardens bloom. It does not record internal tissue.",
      scale: "10 cm bloom",
      clock: "Anthesis",
      observations: [
        "One dorsal and two lateral sepals frame the bloom.",
        "Two petals and the specialised labellum create bilateral symmetry.",
        "The column combines the flower's male and female structures.",
      ],
    },
    {
      id: "inside",
      index: "02",
      title: "The surface is only the entrance",
      shortTitle: "Inside",
      subtitle: "A longitudinal section",
      thesis:
        "The column, stigma, style, ovary, and many ovules form one continuous reproductive route.",
      action: "Continue scrolling to move the section plane through the flower.",
      evidence: "source-constrained-reconstruction",
      evidenceLabel: "Source-constrained reconstruction",
      evidenceDetail:
        "Internal geometry is a conventional 3D reconstruction aligned to the scan and constrained by published orchid micro-CT and histology. It is not a CT scan of this Smithsonian specimen.",
      scale: "Centimetres → millimetres",
      clock: "Before pollination",
      observations: [
        "The receptive stigma sits beneath the pollinia-bearing anther cap.",
        "The style connects the stigma to an inferior ovary behind the bloom.",
        "Orchid ovaries can contain many thousands of ovules awaiting successful pollination.",
      ],
    },
    {
      id: "transfer",
      index: "03",
      title: "The visitor completes the mechanism",
      shortTitle: "Transfer",
      subtitle: "Pollinia in motion",
      thesis:
        "The flower guides contact so an entire pollen package can leave on one animal and arrive at another stigma.",
      action: "Scrub or scroll through the reconstructed carpenter-bee visit.",
      evidence: "source-constrained-reconstruction",
      evidenceLabel: "Behavioural reconstruction",
      evidenceDetail:
        "The bee, flight path, contact, and pollinia transfer are conventional real-time 3D animation based on the Smithsonian pollination-syndrome record. They are not footage of this individual bloom.",
      scale: "Centimetres",
      clock: "Seconds",
      observations: [
        "The bee approaches the labellum and is channelled toward the column.",
        "Contact can attach the pollinarium to the visitor.",
        "A later visit can place pollinia against a receptive stigma.",
      ],
    },
    {
      id: "fertilisation",
      index: "04",
      title: "One contact starts a much slower journey",
      shortTitle: "Fertilisation",
      subtitle: "From stigma to ovule",
      thesis:
        "Pollination is not fertilisation: pollen must hydrate, germinate, and extend tubes through the style before sperm cells reach ovules.",
      action: "Scroll through the declared scale boundary into the microscopic reconstruction.",
      evidence: "explanatory-reconstruction",
      evidenceLabel: "Microscopic reconstruction",
      evidenceDetail:
        "Pollen hydration, tube growth, and ovule contact are explanatory 3D geometry informed by orchid reproductive studies. Time and scale are compressed and explicitly labelled.",
      scale: "Millimetres → micrometres",
      clock: "24 hours and beyond",
      observations: [
        "Orchid pollinia do not necessarily germinate immediately after transfer.",
        "Pollen tubes grow from the stigma through the style toward the ovary.",
        "Female development in some orchids continues after compatible pollination.",
      ],
    },
    {
      id: "outcome",
      index: "05",
      title: "The flower becomes a fruit",
      shortTitle: "Outcome",
      subtitle: "Investment after contact",
      thesis:
        "After successful pollination, the display is dismantled while the ovary becomes a seed capsule.",
      action: "Scroll to advance the compressed developmental clock; drag at any point to inspect.",
      evidence: "time-compressed-reconstruction",
      evidenceLabel: "Time-compressed reconstruction",
      evidenceDetail:
        "Wilting, ovary enlargement, and capsule formation are conventional 3D developmental states, not registered time-lapse scans of this specimen.",
      scale: "Centimetres",
      clock: "Months",
      observations: [
        "Petals and sepals lose their signalling role after successful pollination.",
        "The inferior ovary enlarges into a capsule.",
        "Phalaenopsis fruit and seed maturity can take months rather than days.",
      ],
    },
  ] satisfies FlowerChapter[],
  sources: [
    {
      id: "smithsonian-model",
      title: "Phalaenopsis amabilis: Bloom",
      publisher: "Smithsonian Gardens / Smithsonian 3D",
      url: "https://3d.si.edu/object/3d/phalaenopsis-amabilis-bloom:2249ec68-8cfc-464d-b7d7-60657464164a",
      rights: "CC0",
      use: "Exterior specimen geometry, texture, accession metadata, range, and pollination-syndrome record.",
    },
    {
      id: "kew-taxon",
      title: "Phalaenopsis amabilis (L.) Blume",
      publisher: "Royal Botanic Gardens, Kew — Plants of the World Online",
      url: "https://powo.science.kew.org/taxon/urn:lsid:ipni.org:names:650501-1/general-information",
      rights: "Taxonomic and descriptive reference; page-specific terms apply",
      use: "Accepted name, distribution, ecology, and visible floral morphology.",
    },
    {
      id: "orchid-pollinia",
      title: "Types of Pollen Dispersal Units in Orchids, and their Consequences for Germination and Fertilization",
      publisher: "Annals of Botany / PubMed Central",
      url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC4233844/",
      rights: "Open-access scholarly article",
      use: "Pollinia, pollen hydration, delayed germination, pollen-tube timing, and ovule context.",
    },
    {
      id: "orchid-microct",
      title: "Histological and Micro-CT Evidence of Stigmatic Rostellum Receptivity Promoting Auto-Pollination in a Madagascan Orchid",
      publisher: "PLOS ONE / PubMed Central",
      url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC3742538/",
      rights: "CC BY",
      use: "Reference method and evidence for orchid longitudinal micro-CT and gynostemium anatomy; not a scan of the exhibited species.",
    },
    {
      id: "phalaenopsis-breeding",
      title: "Breeding of ornamental orchids with focus on Phalaenopsis",
      publisher: "Plant Biotechnology Reports / PubMed Central",
      url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC10997592/",
      rights: "Open-access scholarly review",
      use: "Hand pollination sequence and the multi-month range for fruit and seed maturity.",
    },
  ] satisfies FlowerSource[],
} as const;

export function getFlowerChapter(id: FlowerChapterId): FlowerChapter {
  return flowerExhibit.chapters.find((chapter) => chapter.id === id)
    ?? flowerExhibit.chapters[0];
}
