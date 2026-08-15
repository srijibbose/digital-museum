export type Telemetry = {
  met: string;
  altitude: string;
  fuel: string;
};

export type Vec3 = readonly [number, number, number];

export type SceneCamera = {
  position: Vec3;
  target: Vec3;
  fov: number;
};

export type SceneKeyframe = {
  beatId: string;
  progress: number;
  altitudeFeet: number;
  landerPosition: Vec3;
  landerRotation: Vec3;
  camera: SceneCamera;
  terrainReveal: number;
  trajectoryReveal: number;
  computerLoad: number;
  dust: number;
};

export type SceneState = SceneKeyframe & {
  nextBeatId: string;
};

export type ExhibitBeat = Telemetry & {
  id: string;
  label: string;
  body: string;
  quote: string | null;
};

export type RelatedExhibit = {
  slug: string;
  title: string;
  status: string;
};

export type ExhibitContent = {
  id: string;
  title: string;
  subtitle: string;
  wing: string;
  estimatedMinutes: number;
  hook: { text: string };
  context: { text: string };
  beats: ExhibitBeat[];
  takeaway: { text: string };
  telemetryNote: string;
  goDeeper: { label: string; note: string };
  relatedExhibits: RelatedExhibit[];
};
