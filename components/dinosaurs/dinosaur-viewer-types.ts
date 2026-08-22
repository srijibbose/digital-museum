export type DinosaurCameraCommand = {
  id: number;
  type: "rotate-left" | "rotate-right" | "zoom-in" | "zoom-out" | "reset";
};

export type ExhibitTheme = "light" | "dark";
