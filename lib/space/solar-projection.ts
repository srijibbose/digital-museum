export const SOLAR_DISC_U_SCALE = 0.142;
export const SOLAR_DISC_V_SCALE = 0.276;

export function solarDiscUv(normalX: number, normalY: number) {
  return {
    u: Number((0.5 + normalX * SOLAR_DISC_U_SCALE).toFixed(3)),
    v: Number((0.5 - normalY * SOLAR_DISC_V_SCALE).toFixed(3)),
  };
}
