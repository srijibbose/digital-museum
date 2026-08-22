"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import {
  advanceMotionPhase,
  getJovianMotionProfile,
  type JovianMotionProfile,
} from "@/lib/space/celestial-motion";

type JovianDynamicWorldProps = {
  texture: THREE.Texture;
  radius: number;
  modeId: string;
  enabled: boolean;
  reducedMotion: boolean;
};

const JOVIAN_VERTEX_SHADER = `
  varying vec2 vUv;
  varying vec3 vNormalObject;
  varying vec3 vNormalView;
  varying vec3 vViewDirection;

  void main() {
    vUv = uv;
    vNormalObject = normalize(normal);
    vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
    vNormalView = normalize(normalMatrix * normal);
    vViewDirection = normalize(-viewPosition.xyz);
    gl_Position = projectionMatrix * viewPosition;
  }
`;

function JovianAtmosphere({
  texture,
  radius,
  profile,
  enabled,
}: {
  texture: THREE.Texture;
  radius: number;
  profile: JovianMotionProfile;
  enabled: boolean;
}) {
  const material = useRef<THREE.ShaderMaterial>(null);
  const phase = useRef(0);
  const uniforms = useMemo(() => ({
    surfaceMap: { value: texture },
    motionPhase: { value: 0 },
    jetSpeed: { value: profile.jetSpeed },
    warpStrength: { value: profile.warpStrength },
    vortexStrength: { value: profile.vortexStrength },
    wakeStrength: { value: profile.wakeStrength },
  }), [profile, texture]);

  useFrame((_, delta) => {
    phase.current = advanceMotionPhase(phase.current, delta, enabled);
    if (material.current) material.current.uniforms.motionPhase.value = phase.current;
  });

  return (
    <mesh>
      <sphereGeometry args={[radius, 160, 112]} />
      <shaderMaterial
        ref={material}
        uniforms={uniforms}
        vertexShader={JOVIAN_VERTEX_SHADER}
        toneMapped={false}
        fragmentShader={`
          uniform sampler2D surfaceMap;
          uniform float motionPhase;
          uniform float jetSpeed;
          uniform float warpStrength;
          uniform float vortexStrength;
          uniform float wakeStrength;
          varying vec2 vUv;
          varying vec3 vNormalObject;
          varying vec3 vNormalView;
          varying vec3 vViewDirection;

          const float PI = 3.141592653589793;
          const vec2 RED_SPOT_CENTRE = vec2(0.6083, 0.4);

          float wrappedDelta(float value, float centre) {
            return mod(value - centre + 0.5, 1.0) - 0.5;
          }

          void main() {
            float latitude = (vUv.y - 0.5) * PI;
            float jet = sin((latitude + radians(4.5)) * 20.0)
              * (0.28 + 0.72 * pow(cos(latitude), 2.0));
            float bandTexture = sin(latitude * 58.0 - motionPhase * 0.38);
            float fineShear = sin(latitude * 117.0 + motionPhase * 0.24);
            float boundedAdvection = sin(motionPhase * 0.78)
              + sin(motionPhase * 0.31 + 1.4) * 0.42;
            float jetOffset = boundedAdvection * jetSpeed * 0.015 * jet
              + warpStrength * (bandTexture * 0.038 + fineShear * 0.014);
            vec2 jetUv = vec2(fract(vUv.x + jetOffset + 1.0), vUv.y);

            float spotDeltaU = wrappedDelta(vUv.x, RED_SPOT_CENTRE.x);
            float southTropicalZone = exp(-pow((vUv.y - RED_SPOT_CENTRE.y) / 0.072, 2.0));
            float trailingWake = exp(-pow((spotDeltaU + 0.09) / 0.105, 2.0)) * southTropicalZone;
            float wakeWave = sin(spotDeltaU * 92.0 - motionPhase * 1.18 + latitude * 21.0);
            jetUv.x = fract(jetUv.x + wakeWave * trailingWake * wakeStrength * 0.0045 + 1.0);
            jetUv.y = clamp(jetUv.y + cos(spotDeltaU * 68.0 + motionPhase * 0.56)
              * trailingWake * wakeStrength * 0.0018, 0.001, 0.999);

            vec2 elliptical = vec2(spotDeltaU / 0.07, (vUv.y - RED_SPOT_CENTRE.y) / 0.045);
            float radiusSquared = dot(elliptical, elliptical);
            float vortexInfluence = pow(1.0 - smoothstep(0.0, 1.0, radiusSquared), 2.0);
            float angle = motionPhase * 0.36 * vortexStrength * vortexInfluence;
            float cosine = cos(angle);
            float sine = sin(angle);
            vec2 rotated = vec2(
              elliptical.x * cosine - elliptical.y * sine,
              elliptical.x * sine + elliptical.y * cosine
            );
            vec2 vortexUv = vec2(
              fract(RED_SPOT_CENTRE.x + rotated.x * 0.07 + 1.0),
              clamp(RED_SPOT_CENTRE.y + rotated.y * 0.045, 0.001, 0.999)
            );
            vec2 finalUv = mix(jetUv, vortexUv, vortexInfluence);
            vec3 deliveredMap = texture2D(surfaceMap, finalUv).rgb;

            float localLift = 1.0 + wakeWave * trailingWake * wakeStrength * 0.018;
            float limb = pow(1.0 - abs(dot(normalize(vNormalView), normalize(vViewDirection))), 2.0);
            vec3 calibrated = deliveredMap * localLift * (1.0 + limb * 0.015);
            gl_FragColor = vec4(calibrated, 1.0);
          }
        `}
      />
    </mesh>
  );
}

function JovianAuroras({
  radius,
  strength,
  enabled,
}: {
  radius: number;
  strength: number;
  enabled: boolean;
}) {
  const material = useRef<THREE.ShaderMaterial>(null);
  const phase = useRef(0);
  const uniforms = useMemo(() => ({
    motionPhase: { value: 0 },
    auroraStrength: { value: strength },
    northColor: { value: new THREE.Color("#35e7d0") },
    southColor: { value: new THREE.Color("#7289ff") },
  }), [strength]);

  useFrame((_, delta) => {
    phase.current = advanceMotionPhase(phase.current, delta, enabled);
    if (material.current) material.current.uniforms.motionPhase.value = phase.current;
  });

  return (
    <mesh scale={1.022} renderOrder={2}>
      <sphereGeometry args={[radius, 128, 88]} />
      <shaderMaterial
        ref={material}
        uniforms={uniforms}
        vertexShader={JOVIAN_VERTEX_SHADER}
        transparent
        blending={THREE.NormalBlending}
        depthWrite={false}
        toneMapped={false}
        fragmentShader={`
          uniform float motionPhase;
          uniform float auroraStrength;
          uniform vec3 northColor;
          uniform vec3 southColor;
          varying vec3 vNormalObject;
          varying vec3 vNormalView;
          varying vec3 vViewDirection;

          void main() {
            vec3 n = normalize(vNormalObject);
            float absolutePole = abs(n.y);
            float polarGate = smoothstep(0.7, 0.79, absolutePole);
            float oval = exp(-pow((absolutePole - 0.86) / 0.095, 2.0));
            float longitude = atan(n.z, n.x);
            float broadCurtain = 0.5 + 0.5 * sin(longitude * 13.0 - motionPhase * 0.34 + n.y * 5.0);
            float fineCurtain = 0.5 + 0.5 * sin(longitude * 29.0 + motionPhase * 0.21);
            float curtain = 0.32 + broadCurtain * 0.46 + fineCurtain * 0.22;
            float limb = 0.35 + 0.65 * pow(1.0 - abs(dot(normalize(vNormalView), normalize(vViewDirection))), 1.6);
            float alpha = min(0.34, polarGate * oval * curtain * limb * auroraStrength * 0.58);
            vec3 auroraColor = mix(southColor, northColor, step(0.0, n.y));
            gl_FragColor = vec4(auroraColor * (0.72 + curtain * 0.56), alpha);
          }
        `}
      />
    </mesh>
  );
}

export function JovianDynamicWorld({
  texture,
  radius,
  modeId,
  enabled,
  reducedMotion,
}: JovianDynamicWorldProps) {
  const profile = getJovianMotionProfile(modeId);

  if (!profile) return null;

  const active = enabled && !reducedMotion;

  return (
    <group>
      <JovianAtmosphere
        texture={texture}
        radius={radius}
        profile={profile}
        enabled={active}
      />
      {profile.auroraStrength > 0 ? (
        <JovianAuroras radius={radius} strength={profile.auroraStrength} enabled={active} />
      ) : null}
    </group>
  );
}
