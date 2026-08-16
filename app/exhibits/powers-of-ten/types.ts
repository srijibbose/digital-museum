export type ScaleStop = {
  id: string;
  exponent: number;
  scale: string;
  title: string;
  comparison: string;
  caption: string;
  ariaLabel: string;
  scene: "hand" | "cell" | "room" | "city" | "earth" | "moon" | "solar" | "galaxy" | "web" | "universe";
};

export type ScaleSceneProps = { progress: number; reducedMotion: boolean };

export type ScaleState = {
  progress: number;
  activeIndex: number;
  interacted: boolean;
};
