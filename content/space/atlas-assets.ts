import type { TextureAsset, WorldId } from "@/lib/space/atlas-schema";

export type AtlasAssetKey =
  | "sun-color"
  | "sun-171"
  | "sun-193"
  | "sun-304"
  | "mercury-color"
  | "mercury-bump"
  | "venus-atmosphere"
  | "venus-radar"
  | "venus-bump"
  | "earth-color"
  | "earth-bump"
  | "earth-clouds"
  | "earth-night"
  | "moon-color"
  | "moon-bump"
  | "mars-color"
  | "mars-bump"
  | "jupiter-color"
  | "saturn-color"
  | "saturn-rings"
  | "uranus-color"
  | "uranus-rings"
  | "neptune-color";

export type AtlasModelKey = Exclude<WorldId, "sun" | "moon">;

export type AtlasModelAsset = {
  path: string;
  sourceUrl: string;
  credit: string;
  processing: string;
};

const path = (name: AtlasAssetKey) => `/media/space/atlas/${name}.webp`;

export const atlasAssetPaths: Record<WorldId, {
  color: string;
  fallback: string;
  bump?: string;
  layers?: Record<string, string>;
}> = {
  sun: {
    color: path("sun-color"),
    fallback: path("sun-color"),
    layers: {
      "171": path("sun-171"),
      "193": path("sun-193"),
      "304": path("sun-304"),
    },
  },
  mercury: {
    color: path("mercury-color"),
    fallback: path("mercury-color"),
    bump: path("mercury-bump"),
  },
  venus: {
    color: path("venus-atmosphere"),
    fallback: path("venus-atmosphere"),
    bump: path("venus-bump"),
    layers: { radar: path("venus-radar") },
  },
  earth: {
    color: path("earth-color"),
    fallback: path("earth-color"),
    bump: path("earth-bump"),
    layers: {
      clouds: path("earth-clouds"),
      night: path("earth-night"),
    },
  },
  moon: {
    color: path("moon-color"),
    fallback: path("moon-color"),
    bump: path("moon-bump"),
  },
  mars: {
    color: path("mars-color"),
    fallback: path("mars-color"),
    bump: path("mars-bump"),
  },
  jupiter: {
    color: path("jupiter-color"),
    fallback: path("jupiter-color"),
  },
  saturn: {
    color: path("saturn-color"),
    fallback: path("saturn-color"),
    layers: { rings: path("saturn-rings") },
  },
  uranus: {
    color: path("uranus-color"),
    fallback: path("uranus-color"),
    layers: { rings: path("uranus-rings") },
  },
  neptune: {
    color: path("neptune-color"),
    fallback: path("neptune-color"),
  },
};

const texture = (
  key: AtlasAssetKey,
  asset: Omit<TextureAsset, "path" | "deliveredDimensions"> & {
    deliveredDimensions?: string;
  },
): TextureAsset => ({
  ...asset,
  path: path(key),
  deliveredDimensions: asset.deliveredDimensions ?? "4096x2048",
});

const nasaModelSource =
  "https://science.nasa.gov/3d-resources/";

export const atlasTextureLedger: Record<AtlasAssetKey, TextureAsset> = {
  "sun-color": texture("sun-color", {
    sourceUrl: "https://svs.gsfc.nasa.gov/4182/",
    credit: "NASA/GSFC/Solar Dynamics Observatory",
    evidence: "processed",
    processing: "AIA 304 angstrom full-disk observation recolored gold and mirrored into a seamless spherical map.",
    nativeDimensions: "4096x4096",
  }),
  "sun-171": texture("sun-171", {
    sourceUrl: "https://svs.gsfc.nasa.gov/3965/",
    credit: "NASA/GSFC/Solar Dynamics Observatory",
    evidence: "processed",
    processing: "AIA 171 angstrom full-disk observation mirrored into a seamless spherical map.",
    nativeDimensions: "4096x4096",
  }),
  "sun-193": texture("sun-193", {
    sourceUrl: "https://svs.gsfc.nasa.gov/3965/",
    credit: "NASA/GSFC/Solar Dynamics Observatory",
    evidence: "processed",
    processing: "AIA 193 angstrom full-disk observation mirrored into a seamless spherical map.",
    nativeDimensions: "4096x4096",
  }),
  "sun-304": texture("sun-304", {
    sourceUrl: "https://svs.gsfc.nasa.gov/4182/",
    credit: "NASA/GSFC/Solar Dynamics Observatory",
    evidence: "processed",
    processing: "AIA 304 angstrom full-disk observation mirrored into a seamless spherical map.",
    nativeDimensions: "4096x4096",
  }),
  "mercury-color": texture("mercury-color", {
    sourceUrl: "https://astrogeology.usgs.gov/search/map/mercury_messenger_clrmosaic_global_665m",
    credit: "USGS Astrogeology / NASA MESSENGER",
    evidence: "observed",
    processing: "Global color mosaic no-data specks median-filled, then resized and encoded as WebP.",
    nativeDimensions: "1024x512",
  }),
  "mercury-bump": texture("mercury-bump", {
    sourceUrl: "https://astrogeology.usgs.gov/search/map/mercury_messenger_dem_global_665m",
    credit: "USGS Astrogeology / NASA MESSENGER",
    evidence: "observed",
    processing: "Global digital elevation preview normalized to a material height range.",
    nativeDimensions: "1024x512",
  }),
  "venus-atmosphere": texture("venus-atmosphere", {
    sourceUrl: "https://science.nasa.gov/asset/hubble/venus-cloud-tops/",
    credit: "NASA/Hubble, L. Esposito",
    evidence: "processed",
    processing: "Illuminated ultraviolet cloud morphology cropped from the phase image, mirrored seamlessly, and false-colored.",
    nativeDimensions: "2000x2918",
  }),
  "venus-radar": texture("venus-radar", {
    sourceUrl: `${nasaModelSource}venus-3d-model/`,
    credit: "NASA Visualization Technology Applications and Development",
    evidence: "observed",
    processing: "Magellan radar surface texture extracted from the official NASA model and WebP encoded.",
    nativeDimensions: "4096x2048",
  }),
  "venus-bump": texture("venus-bump", {
    sourceUrl: `${nasaModelSource}venus-3d-model/`,
    credit: "NASA Visualization Technology Applications and Development",
    evidence: "processed",
    processing: "Official Magellan radar texture converted to a contrast-normalized relief material.",
    nativeDimensions: "4096x2048",
  }),
  "earth-color": texture("earth-color", {
    sourceUrl: "https://visibleearth.nasa.gov/collection/1484/blue-marble",
    credit: "NASA Earth Observatory / Blue Marble",
    evidence: "observed",
    processing: "Cloud-free topography and bathymetry mosaic reduced from the 21.6K NASA master.",
    nativeDimensions: "21600x10800",
  }),
  "earth-bump": texture("earth-bump", {
    sourceUrl: "https://visibleearth.nasa.gov/collection/1484/blue-marble",
    credit: "NASA Earth Observatory / Blue Marble",
    evidence: "processed",
    processing: "High-frequency relief isolated from NASA's topographically shaded Blue Marble mosaic.",
    nativeDimensions: "21600x10800",
  }),
  "earth-clouds": texture("earth-clouds", {
    sourceUrl: "https://svs.gsfc.nasa.gov/30763/",
    credit: "NASA/GSFC Suomi NPP VIIRS",
    evidence: "processed",
    processing: "Observed October 2015 cloud signal isolated into a transparent shell texture.",
    nativeDimensions: "10800x5400",
  }),
  "earth-night": texture("earth-night", {
    sourceUrl: "https://earthobservatory.nasa.gov/images/144898/earth-at-night-black-marble-2016",
    credit: "NASA Earth Observatory / Black Marble",
    evidence: "observed",
    processing: "Global Black Marble night-light composite resized and WebP encoded.",
    nativeDimensions: "3600x1800",
  }),
  "moon-color": texture("moon-color", {
    sourceUrl: "https://svs.gsfc.nasa.gov/4720/",
    credit: "NASA SVS / LRO Camera team",
    evidence: "observed",
    processing: "LROC natural-color global mosaic converted from 16-bit TIFF to browser WebP.",
    nativeDimensions: "4096x2048",
  }),
  "moon-bump": texture("moon-bump", {
    sourceUrl: "https://svs.gsfc.nasa.gov/4720/",
    credit: "NASA SVS / LRO LOLA team",
    evidence: "observed",
    processing: "LOLA global digital elevation map percentile-normalized to an 8-bit height material.",
    nativeDimensions: "5760x2880",
  }),
  "mars-color": texture("mars-color", {
    sourceUrl: "https://astrogeology.usgs.gov/search/map/mars_viking_clrmosaic_global_925m",
    credit: "USGS Astrogeology / NASA Viking",
    evidence: "observed",
    processing: "Viking global color mosaic resized with Lanczos filtering and encoded as WebP.",
    nativeDimensions: "1024x512",
  }),
  "mars-bump": texture("mars-bump", {
    sourceUrl: "https://svs.gsfc.nasa.gov/4436/",
    credit: "NASA SVS / Mars Global Surveyor MOLA",
    evidence: "observed",
    processing: "MOLA cylindrical elevation map normalized to a material height range.",
    nativeDimensions: "5760x2880",
  }),
  "jupiter-color": texture("jupiter-color", {
    sourceUrl: "https://science.nasa.gov/photojournal/cassinis-best-maps-of-jupiter-cylindrical-map/",
    credit: "NASA/JPL/Space Science Institute",
    evidence: "observed",
    processing: "Cassini cylindrical true-color map center-cropped to 2:1 and WebP encoded.",
    nativeDimensions: "3601x1801",
  }),
  "saturn-color": texture("saturn-color", {
    sourceUrl: "https://science.nasa.gov/photojournal/the-greatest-saturn-portrait-yet/",
    credit: "NASA/JPL/Space Science Institute",
    evidence: "observed",
    processing: "Cassini's 126-frame natural-color portrait fitted to a 2:1 non-WebGL fallback canvas.",
    nativeDimensions: "8888x4544",
  }),
  "saturn-rings": texture("saturn-rings", {
    sourceUrl: `${nasaModelSource}saturn-3d-model/`,
    credit: "NASA Visualization Technology Applications and Development",
    evidence: "observed",
    processing: "Official radial ring material enlarged vertically for stable anisotropic filtering.",
    nativeDimensions: "4096x16",
    deliveredDimensions: "4096x64",
  }),
  "uranus-color": texture("uranus-color", {
    sourceUrl: `${nasaModelSource}uranus-3d-model/`,
    credit: "NASA Visualization Technology Applications and Development",
    evidence: "processed",
    processing: "Official observational texture contrast-adjusted slightly and WebP encoded.",
    nativeDimensions: "1024x512",
  }),
  "uranus-rings": texture("uranus-rings", {
    sourceUrl: "https://science.nasa.gov/photojournal/uranus-rings/",
    credit: "NASA/JPL Voyager 2",
    evidence: "processed",
    processing: "Voyager ring observation denoised into a radial opacity profile for ring geometry.",
    nativeDimensions: "754x735",
    deliveredDimensions: "4096x64",
  }),
  "neptune-color": texture("neptune-color", {
    sourceUrl: `${nasaModelSource}neptune-3d-model/`,
    credit: "NASA Visualization Technology Applications and Development",
    evidence: "processed",
    processing: "Official observational texture contrast-adjusted slightly and WebP encoded.",
    nativeDimensions: "1024x512",
  }),
};

const modelPath = (world: AtlasModelKey) => `/models/space/atlas/${world}.glb`;

export const atlasModelPaths: Record<AtlasModelKey, string> = {
  mercury: modelPath("mercury"),
  venus: modelPath("venus"),
  earth: modelPath("earth"),
  mars: modelPath("mars"),
  jupiter: modelPath("jupiter"),
  saturn: modelPath("saturn"),
  uranus: modelPath("uranus"),
  neptune: modelPath("neptune"),
};

const model = (
  world: AtlasModelKey,
  sourceUrl: string,
): AtlasModelAsset => ({
  path: modelPath(world),
  sourceUrl,
  credit: "NASA Visualization Technology Applications and Development",
  processing: "Official binary glTF copied byte-for-byte for local, cacheable delivery.",
});

export const atlasModelLedger: Record<AtlasModelKey, AtlasModelAsset> = {
  mercury: model(
    "mercury",
    "https://assets.science.nasa.gov/content/dam/science/psd/solar/2023/09/m/Mercury_1_4878.glb",
  ),
  venus: model(
    "venus",
    "https://assets.science.nasa.gov/content/dam/science/psd/solar/2023/09/v/Venussurface_1_12103.glb",
  ),
  earth: model(
    "earth",
    "https://assets.science.nasa.gov/content/dam/science/psd/solar/2023/09/e/Earth_1_12756.glb",
  ),
  mars: model(
    "mars",
    "https://assets.science.nasa.gov/content/dam/science/psd/mars/resources/gltf_files/24881_Mars_1_6792.glb",
  ),
  jupiter: model(
    "jupiter",
    "https://assets.science.nasa.gov/content/dam/science/psd/solar/2023/09/j/Jupiter_1_142984.glb",
  ),
  saturn: model(
    "saturn",
    "https://assets.science.nasa.gov/content/dam/science/psd/solar/2023/09/s/Saturn_1_120536.glb",
  ),
  uranus: model(
    "uranus",
    "https://assets.science.nasa.gov/content/dam/science/psd/solar/2023/09/u/Uranus_1_51118.glb",
  ),
  neptune: model(
    "neptune",
    "https://assets.science.nasa.gov/content/dam/science/psd/solar/2023/09/n/Neptune_1_49528.glb",
  ),
};
