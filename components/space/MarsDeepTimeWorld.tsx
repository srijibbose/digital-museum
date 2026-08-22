"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import type { MarsDeepTimeState } from "@/lib/space/mars-deep-time";
import { resolveMarsDeepTimeRender } from "@/lib/space/mars-deep-time-render";

type MarsDeepTimeWorldProps = {
  radius: number;
  colorTexture: THREE.Texture;
  elevationTexture: THREE.Texture;
  topographyTexture: THREE.Texture;
  state: MarsDeepTimeState;
  bumpScale: number;
};

function WaterLayer({
  radius,
  elevationTexture,
  opacity,
  radiusScale,
  waterLevel,
}: {
  radius: number;
  elevationTexture: THREE.Texture;
  opacity: number;
  radiusScale: number;
  waterLevel: number;
}) {
  const material = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(() => ({
    elevationMap: { value: elevationTexture },
    waterOpacity: { value: opacity },
    waterLevel: { value: waterLevel },
  }), [elevationTexture]);

  useEffect(() => {
    if (!material.current) return;
    material.current.uniforms.waterOpacity.value = opacity;
    material.current.uniforms.waterLevel.value = waterLevel;
  }, [opacity, waterLevel]);

  return (
    <mesh scale={radiusScale} renderOrder={2}>
      <sphereGeometry args={[radius, 160, 112]} />
      <shaderMaterial
        ref={material}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        toneMapped={false}
        blending={THREE.NormalBlending}
        vertexShader={`
          varying vec2 vUv;
          varying vec3 vNormalView;
          varying vec3 vViewDirection;
          void main() {
            vUv = uv;
            vNormalView = normalize(normalMatrix * normal);
            vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
            vViewDirection = normalize(-viewPosition.xyz);
            gl_Position = projectionMatrix * viewPosition;
          }
        `}
        fragmentShader={`
          uniform sampler2D elevationMap;
          uniform float waterOpacity;
          uniform float waterLevel;
          varying vec2 vUv;
          varying vec3 vNormalView;
          varying vec3 vViewDirection;
          float smoothedElevation(vec2 uv) {
            vec2 texel = vec2(1.0 / 1440.0, 1.0 / 720.0);
            float elevation = texture2D(elevationMap, uv).r * 0.2;
            elevation += texture2D(elevationMap, uv + vec2(texel.x * 4.0, 0.0)).r * 0.12;
            elevation += texture2D(elevationMap, uv - vec2(texel.x * 4.0, 0.0)).r * 0.12;
            elevation += texture2D(elevationMap, uv + vec2(0.0, texel.y * 3.0)).r * 0.12;
            elevation += texture2D(elevationMap, uv - vec2(0.0, texel.y * 3.0)).r * 0.12;
            elevation += texture2D(elevationMap, uv + texel * vec2(3.0, 2.0)).r * 0.08;
            elevation += texture2D(elevationMap, uv + texel * vec2(-3.0, 2.0)).r * 0.08;
            elevation += texture2D(elevationMap, uv + texel * vec2(3.0, -2.0)).r * 0.08;
            elevation += texture2D(elevationMap, uv - texel * vec2(3.0, 2.0)).r * 0.08;
            return elevation;
          }
          void main() {
            float elevation = smoothedElevation(vUv);
            float lowland = 1.0 - smoothstep(waterLevel - 0.018, waterLevel + 0.018, elevation);
            float shoreline = smoothstep(0.12, 0.48, lowland) * (1.0 - smoothstep(0.52, 0.88, lowland));
            vec3 normalView = normalize(vNormalView);
            vec3 viewDirection = normalize(vViewDirection);
            float fresnel = pow(1.0 - max(dot(normalView, viewDirection), 0.0), 3.0);
            float specular = pow(max(dot(normalView, normalize(vec3(-0.34, 0.42, 1.0))), 0.0), 48.0);
            float alpha = waterOpacity * lowland * (0.76 + fresnel * 0.15) + shoreline * waterOpacity * 0.1;
            vec3 deepWater = vec3(0.035, 0.18, 0.26);
            vec3 shallowWater = vec3(0.08, 0.38, 0.46);
            vec3 water = mix(deepWater, shallowWater, min(1.0, fresnel * 0.7 + shoreline * 0.48));
            water += vec3(0.82, 0.84, 0.72) * specular * 0.72;
            if (alpha < 0.004) discard;
            gl_FragColor = vec4(water, alpha);
          }
        `}
      />
    </mesh>
  );
}

function IceLayer({
  radius,
  elevationTexture,
  opacity,
}: {
  radius: number;
  elevationTexture: THREE.Texture;
  opacity: number;
}) {
  const material = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(() => ({
    elevationMap: { value: elevationTexture },
    iceOpacity: { value: opacity },
  }), [elevationTexture]);

  useEffect(() => {
    if (material.current) material.current.uniforms.iceOpacity.value = opacity;
  }, [opacity]);

  return (
    <mesh scale={1.011} renderOrder={3}>
      <sphereGeometry args={[radius, 128, 84]} />
      <shaderMaterial
        ref={material}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        vertexShader={`
          varying vec2 vUv;
          varying vec3 vNormalObject;
          void main() {
            vUv = uv;
            vNormalObject = normalize(normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          uniform sampler2D elevationMap;
          uniform float iceOpacity;
          varying vec2 vUv;
          varying vec3 vNormalObject;
          void main() {
            float latitude = abs(vNormalObject.y);
            float elevation = texture2D(elevationMap, vUv).r;
            float polarIce = smoothstep(0.62 - iceOpacity * 0.18, 0.87 - iceOpacity * 0.08, latitude);
            float terrainEdge = smoothstep(0.1, 0.42, elevation);
            float alpha = min(0.72, iceOpacity * 1.45) * polarIce * (0.82 + terrainEdge * 0.18);
            if (alpha < 0.004) discard;
            gl_FragColor = vec4(vec3(0.83, 0.89, 0.88), alpha);
          }
        `}
      />
    </mesh>
  );
}

function AtmosphericLayers({
  radius,
  atmosphereOpacity,
  hazeOpacity,
}: {
  radius: number;
  atmosphereOpacity: number;
  hazeOpacity: number;
}) {
  const material = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(() => ({
    atmosphereOpacity: { value: atmosphereOpacity },
    hazeOpacity: { value: hazeOpacity },
  }), []);

  useEffect(() => {
    if (!material.current) return;
    material.current.uniforms.atmosphereOpacity.value = atmosphereOpacity;
    material.current.uniforms.hazeOpacity.value = hazeOpacity;
  }, [atmosphereOpacity, hazeOpacity]);

  return (
    <>
      <mesh scale={1.045} renderOrder={5}>
        <sphereGeometry args={[radius, 112, 72]} />
        <shaderMaterial
          ref={material}
          uniforms={uniforms}
          transparent
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
          vertexShader={`
            varying vec3 vNormalView;
            varying vec3 vViewDirection;
            void main() {
              vNormalView = normalize(normalMatrix * normal);
              vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
              vViewDirection = normalize(-viewPosition.xyz);
              gl_Position = projectionMatrix * viewPosition;
            }
          `}
          fragmentShader={`
            uniform float atmosphereOpacity;
            uniform float hazeOpacity;
            varying vec3 vNormalView;
            varying vec3 vViewDirection;
            void main() {
              float limb = pow(1.0 - abs(dot(normalize(vNormalView), normalize(vViewDirection))), 2.35);
              vec3 clearAir = vec3(0.74, 0.39, 0.2);
              vec3 dustyAir = vec3(0.94, 0.61, 0.32);
              vec3 atmosphere = mix(clearAir, dustyAir, hazeOpacity);
              gl_FragColor = vec4(atmosphere, atmosphereOpacity * (0.025 + limb * 0.975));
            }
          `}
        />
      </mesh>
    </>
  );
}

export function MarsDeepTimeWorld({
  radius,
  colorTexture,
  elevationTexture,
  topographyTexture,
  state,
  bumpScale,
}: MarsDeepTimeWorldProps) {
  const render = resolveMarsDeepTimeRender(state);

  useEffect(() => {
    topographyTexture.wrapS = THREE.RepeatWrapping;
    topographyTexture.minFilter = THREE.LinearMipmapLinearFilter;
    topographyTexture.magFilter = THREE.LinearFilter;
    topographyTexture.needsUpdate = true;
  }, [topographyTexture]);

  return (
    <group>
      <mesh>
        <sphereGeometry args={[radius, 160, 112]} />
        <meshStandardMaterial
          map={colorTexture}
          bumpMap={elevationTexture}
          bumpScale={bumpScale}
          color={render.surfaceTint}
          roughness={0.92}
          metalness={0}
        />
      </mesh>
      <WaterLayer
        radius={radius}
        elevationTexture={topographyTexture}
        opacity={render.waterOpacity}
        radiusScale={render.waterRadiusScale}
        waterLevel={render.waterLevel}
      />
      <IceLayer radius={radius} elevationTexture={topographyTexture} opacity={render.iceOpacity} />
      <AtmosphericLayers
        radius={radius}
        atmosphereOpacity={render.atmosphereOpacity}
        hazeOpacity={render.hazeOpacity}
      />
    </group>
  );
}
