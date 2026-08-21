export const SOLAR_DISC_U_SCALE = 0.142;
export const SOLAR_DISC_V_SCALE = 0.276;

export const SOLAR_DISC_VERTEX_SHADER = `
  varying vec3 vNormalView;
  void main() {
    vNormalView = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export function solarDiscUv(normalX: number, normalY: number) {
  return {
    u: Number((0.5 + normalX * SOLAR_DISC_U_SCALE).toFixed(3)),
    v: Number((0.5 - normalY * SOLAR_DISC_V_SCALE).toFixed(3)),
  };
}

export function solarFlowPulse(elapsedSeconds: number) {
  const pulse = Math.sin(elapsedSeconds * 0.8);

  return {
    scale: Number((1.004 + pulse * 0.0015).toFixed(4)),
    opacity: Number((0.12 + pulse * 0.02).toFixed(3)),
  };
}
