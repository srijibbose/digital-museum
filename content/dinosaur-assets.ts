export type DinosaurAssetEvidence =
  | "specimen-scan"
  | "cast-scan"
  | "mount-scan"
  | "reference-image"
  | "life-reconstruction";

export type DinosaurAssetRecord = {
  id: string;
  localPath: string;
  sourceUrl: string;
  institution: string;
  specimen: string;
  license: string;
  licenseUrl: string;
  evidence: DinosaurAssetEvidence;
  processing: string;
};

export const dinosaurAssetManifest: DinosaurAssetRecord[] = [
  {
    id: "field-sue-pr2081-model",
    localPath: "/models/dinosaurs/institutional/field-sue-pr2081.glb",
    sourceUrl: "https://fm-digital-assets.fieldmuseum.org/2450/144/sue_3d_v4_color.glb",
    institution: "Field Museum of Natural History",
    specimen: "FMNH PR 2081 · full cast of SUE",
    license: "CC BY-NC 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-nc/4.0/",
    evidence: "cast-scan",
    processing: "Copied byte-for-byte from the Field Museum delivery; no geometry or texture changes.",
  },
  {
    id: "smithsonian-triceratops-model",
    localPath: "/models/dinosaurs/institutional/smithsonian-triceratops-pal500000.glb",
    sourceUrl:
      "https://3d-api.si.edu/content/document/3d_package:d8c623be-4ebc-11ea-b77f-2e728ce88125/Triceratops-100k-2048_std_draco.glb",
    institution: "Smithsonian National Museum of Natural History",
    specimen: "USNM PAL500000 · complete mounted Triceratops horridus",
    license: "CC0 1.0",
    licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/",
    evidence: "mount-scan",
    processing: "Copied byte-for-byte from the Smithsonian Open Access 3D API; no geometry or texture changes.",
  },
  {
    id: "tyrannosaurus-preview",
    localPath: "/media/dinosaurs/specimens/tyrannosaurus.jpg",
    sourceUrl: "https://sketchfab.com/3d-models/sue-the-t-rex-0a5025394e994c34b85ebef144bc6e6a",
    institution: "Field Museum of Natural History",
    specimen: "FMNH PR 2081 · SUE viewer thumbnail",
    license: "CC BY-NC 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-nc/4.0/",
    evidence: "reference-image",
    processing: "Downloaded from the institution's Sketchfab model metadata and delivered unchanged.",
  },
  {
    id: "tyrannosaurus-life-reconstruction",
    localPath: "/media/dinosaurs/specimens/tyrannosaurus-life-3d.jpg",
    sourceUrl: "https://sketchfab.com/3d-models/tyrannosaurus-rex-a3384b114989470fb60f0500aeaae903",
    institution: "Arion Digital",
    specimen: "Tyrannosaurus rex · illustrative 3D life reconstruction",
    license: "CC BY 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
    evidence: "life-reconstruction",
    processing: "Downloaded from the creator's Sketchfab metadata and delivered unchanged; never presented as specimen evidence.",
  },
  {
    id: "triceratops-preview",
    localPath: "/media/dinosaurs/specimens/triceratops.jpg",
    sourceUrl: "https://sketchfab.com/3d-models/triceratops-horridus-marsh-e9c507f179ed4455aac3b208c9e6c973",
    institution: "Smithsonian Institution",
    specimen: "USNM PAL500000 viewer thumbnail",
    license: "CC0 1.0",
    licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/",
    evidence: "reference-image",
    processing: "Downloaded from the institution's Sketchfab model metadata and delivered unchanged.",
  },
  ...[
    ["diplodocus", "Natural History Museum Vienna", "NHMW-GEO-1909/0004/0003", "https://sketchfab.com/3d-models/diplodocus-carnegii-nhmw-geo-190900040003-1d07ae9e002f4e8ab930dc92d07eb078", "CC BY-NC 4.0", "https://creativecommons.org/licenses/by-nc/4.0/", "cast-scan"],
    ["plateosaurus", "Natural History Museum Vienna", "Hall 7 Plateosaurus skeleton", "https://sketchfab.com/3d-models/plateosaurus-skeleton-80683eb568cc46caac0649e395fa5a1b", "CC BY-NC 4.0", "https://creativecommons.org/licenses/by-nc/4.0/", "mount-scan"],
    ["protoceratops", "Natural History Museum Vienna", "NHMW-GEO-2015/0404/0001", "https://sketchfab.com/3d-models/protoceratops-andrewsi-nhmw-geo-201504040001-ed6e419065af422eaaa07294f55b8be1", "CC BY-NC 4.0", "https://creativecommons.org/licenses/by-nc/4.0/", "specimen-scan"],
    ["psittacosaurus", "Natural History Museum Vienna", "NHMW-GEO-1998/0064/0001", "https://sketchfab.com/3d-models/psittacosaurus-mongoliensisnhmw-geo199800641-f25dc41ec23242a588772f2205410722", "CC BY-NC 4.0", "https://creativecommons.org/licenses/by-nc/4.0/", "specimen-scan"],
    ["allosaurus", "Olof Moleman · Osaka Museum source scan", "Corrected low-poly Allosaurus mount", "https://sketchfab.com/3d-models/allosaurus-skeleton-2193dcd84b694f659719b4b99c91228b", "CC BY-NC 4.0", "https://creativecommons.org/licenses/by-nc/4.0/", "mount-scan"],
    ["archaeopteryx", "University of Dundee Museum Collections", "DUNUC 2704 · Berlin specimen cast", "https://sketchfab.com/3d-models/archaeopteryx-fossil-cast-eea4d66eaad34adb80969d9939835d05", "CC0 1.0", "https://creativecommons.org/publicdomain/zero/1.0/", "cast-scan"],
  ].map(([id, institution, specimen, sourceUrl, license, licenseUrl, evidence]) => ({
    id: `${id}-preview`,
    localPath: `/media/dinosaurs/specimens/${id}.jpg`,
    sourceUrl,
    institution,
    specimen,
    license,
    licenseUrl,
    evidence: evidence as DinosaurAssetEvidence,
    processing: "Downloaded from the institution's Sketchfab model metadata and delivered unchanged.",
  })),
];
