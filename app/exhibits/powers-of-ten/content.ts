import type { ScaleStop } from "./types";

export const SCALE_STOPS: ScaleStop[] = [
  { id: "skin", exponent: -2, scale: "10⁻² m", title: "The hand", comparison: "A fingertip: the first landscape you ever learned.", caption: "Skin folds hold the memory of touch.", ariaLabel: "A detailed human fingertip with layered skin ridges and a translucent nail", scene: "hand" },
  { id: "cell", exponent: -5, scale: "10⁻⁵ m", title: "One living cell", comparison: "A single cell, a room-sized machine in miniature.", caption: "The membrane is a border, not a wall.", ariaLabel: "A cross-section of a living cell showing a nucleus, mitochondria, membrane, and organelles", scene: "cell" },
  { id: "room", exponent: 0, scale: "10⁰ m", title: "The room", comparison: "The scale of a body, a chair, a breath.", caption: "A room is an instrument for human proportion.", ariaLabel: "A furnished room seen from above with a chair, lamp, table, and window light", scene: "room" },
  { id: "city", exponent: 3, scale: "10³ m", title: "The city block", comparison: "A few minutes on foot become a map of motion.", caption: "Traffic turns private lives into a pattern.", ariaLabel: "A detailed city block with roads, buildings, trees, and moving light traces", scene: "city" },
  { id: "earth", exponent: 7, scale: "10⁷ m", title: "Earth", comparison: "One blue world, wrapped in a thin atmosphere.", caption: "Everything familiar is held in this blue line.", ariaLabel: "Earth with cloud bands, atmospheric rim light, and a night-side terminator", scene: "earth" },
  { id: "moon", exponent: 9, scale: "10⁹ m", title: "The Earth–Moon system", comparison: "A world and its companion, connected by empty distance.", caption: "Even orbit is a kind of relationship.", ariaLabel: "Earth and Moon separated by their orbital distance with a fine orbital arc", scene: "moon" },
  { id: "solar", exponent: 12, scale: "10¹² m", title: "The solar system", comparison: "The Sun carries almost all the mass, and everything moves around it.", caption: "Gravity makes a family from separate worlds.", ariaLabel: "A lit solar system with the Sun, planetary orbits, and small planets at different distances", scene: "solar" },
  { id: "galaxy", exponent: 20, scale: "10²⁰ m", title: "The Milky Way", comparison: "A hundred billion stars, held in one slow spiral.", caption: "Our address is a dust lane in a larger shape.", ariaLabel: "A detailed spiral galaxy disk with dust lanes, star clusters, and a luminous core", scene: "galaxy" },
  { id: "web", exponent: 23, scale: "10²³ m", title: "The cosmic web", comparison: "Galaxies gather along filaments, like dew on an invisible net.", caption: "Emptiness has architecture too.", ariaLabel: "A three-dimensional cosmic web of luminous filaments and galaxy nodes", scene: "web" },
  { id: "universe", exponent: 26, scale: "10²⁶ m", title: "The observable universe", comparison: "The horizon of everything light has had time to show us.", caption: "You are not outside the scale. You are inside it.", ariaLabel: "A deep field of galaxies fading toward the edge of the observable universe", scene: "universe" },
];

export const exhibitIntro = {
  title: "Powers of Ten",
  subtitle: "You, scaled to the universe.",
  instruction: "Scroll to zoom out",
};
