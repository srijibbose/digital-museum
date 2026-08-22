"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import {
  advanceMotionPhase,
  getSolarMotionProfile,
  type SolarMotionProfile,
} from "@/lib/space/celestial-motion";
import {
  SOLAR_DISC_U_SCALE,
  SOLAR_DISC_V_SCALE,
} from "@/lib/space/solar-projection";

type SolarDynamicWorldProps = {
  texture: THREE.Texture;
  radius: number;
  modeId: string;
  enabled: boolean;
  reducedMotion: boolean;
};

const SOLAR_VERTEX_SHADER = `
  varying vec3 vNormalObject;
  varying vec3 vNormalView;
  varying vec3 vViewDirection;

  void main() {
    vNormalObject = normalize(normal);
    vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
    vNormalView = normalize(normalMatrix * normal);
    vViewDirection = normalize(-viewPosition.xyz);
    gl_Position = projectionMatrix * viewPosition;
  }
`;

const SOLAR_FRAGMENT_SHADER = `
  uniform sampler2D surfaceMap;
  uniform vec3 profileTint;
  uniform float phase;
  uniform float flowScale;
  uniform float flowSpeed;
  uniform float distortion;
  uniform float pulseSpeed;
  varying vec3 vNormalObject;
  varying vec3 vNormalView;
  varying vec3 vViewDirection;

  vec3 sampleObservedSurface(vec3 sourceNormal) {
    vec3 n = normalize(sourceNormal);
    vec3 blendWeight = pow(abs(n), vec3(4.0));
    blendWeight /= max(blendWeight.x + blendWeight.y + blendWeight.z, 0.0001);
    float signX = n.x < 0.0 ? -1.0 : 1.0;
    float signY = n.y < 0.0 ? -1.0 : 1.0;
    float signZ = n.z < 0.0 ? -1.0 : 1.0;
    vec2 solarUvX = vec2(
      0.5 + n.z * signX * ${SOLAR_DISC_U_SCALE.toFixed(3)},
      0.5 - n.y * ${SOLAR_DISC_V_SCALE.toFixed(3)}
    );
    vec2 solarUvY = vec2(
      0.5 + n.x * ${SOLAR_DISC_U_SCALE.toFixed(3)},
      0.5 - n.z * signY * ${SOLAR_DISC_V_SCALE.toFixed(3)}
    );
    vec2 solarUvZ = vec2(
      0.5 + n.x * signZ * ${SOLAR_DISC_U_SCALE.toFixed(3)},
      0.5 - n.y * ${SOLAR_DISC_V_SCALE.toFixed(3)}
    );
    return
      texture2D(surfaceMap, solarUvX).rgb * blendWeight.x +
      texture2D(surfaceMap, solarUvY).rgb * blendWeight.y +
      texture2D(surfaceMap, solarUvZ).rgb * blendWeight.z;
  }

  void main() {
    vec3 n = normalize(vNormalObject);
    vec3 referenceAxis = abs(n.y) < 0.92 ? vec3(0.0, 1.0, 0.0) : vec3(1.0, 0.0, 0.0);
    vec3 tangent = normalize(cross(referenceAxis, n));
    float flowPhase = phase * flowSpeed;
    float cellularA = sin((n.x + n.z * 0.72) * flowScale * 3.1 + flowPhase);
    float cellularB = sin((n.y - n.z * 0.38) * flowScale * 4.7 - flowPhase * 0.73);
    float granularFlow = (cellularA + cellularB) * 0.5;
    vec3 warpedNormal = normalize(n + tangent * granularFlow * distortion);
    vec3 observedSurface = sampleObservedSurface(warpedNormal);
    float slowPulse = sin(phase * pulseSpeed + n.y * 7.0 + n.x * 4.0);
    float limb = pow(1.0 - abs(dot(normalize(vNormalView), normalize(vViewDirection))), 2.2);
    float sourceLift = 1.0 + granularFlow * 0.052 + slowPulse * 0.028 + limb * 0.042;
    vec3 calibrated = pow(max(observedSurface, vec3(0.0)), vec3(0.56)) * 1.44;
    vec3 restrainedTint = mix(vec3(1.0), profileTint, 0.11);
    gl_FragColor = vec4(calibrated * restrainedTint * sourceLift, 1.0);
  }
`;

function SolarSurface({
  texture,
  radius,
  profile,
  enabled,
}: {
  texture: THREE.Texture;
  radius: number;
  profile: SolarMotionProfile;
  enabled: boolean;
}) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const phaseRef = useRef(0);
  const uniforms = useMemo(
    () => ({
      surfaceMap: { value: texture },
      profileTint: { value: new THREE.Color(profile.tint) },
      phase: { value: 0 },
      flowScale: { value: profile.flowScale },
      flowSpeed: { value: profile.flowSpeed },
      distortion: { value: profile.distortion },
      pulseSpeed: { value: profile.pulseSpeed },
    }),
    [profile, texture],
  );

  useFrame((_, delta) => {
    const nextPhase = advanceMotionPhase(phaseRef.current, delta, enabled);
    phaseRef.current = nextPhase;
    if (materialRef.current) {
      materialRef.current.uniforms.phase.value = nextPhase;
    }
  });

  return (
    <mesh renderOrder={4}>
      <sphereGeometry args={[radius * 1.006, 144, 144]} />
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={SOLAR_VERTEX_SHADER}
        fragmentShader={SOLAR_FRAGMENT_SHADER}
        side={THREE.FrontSide}
        depthWrite
      />
    </mesh>
  );
}

export function SolarDynamicWorld({
  texture,
  radius,
  modeId,
  enabled,
  reducedMotion,
}: SolarDynamicWorldProps) {
  const profile = getSolarMotionProfile(modeId);

  if (!profile) return null;

  return (
    <SolarSurface
      texture={texture}
      radius={radius}
      profile={profile}
      enabled={enabled && !reducedMotion}
    />
  );
}
