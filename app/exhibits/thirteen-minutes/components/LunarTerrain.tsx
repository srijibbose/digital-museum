"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import { BufferAttribute, BufferGeometry, InstancedMesh, Object3D } from "three";
import { createTerrain } from "../terrain";

type LunarTerrainProps = {
  reveal: number;
  dust: number;
};

export function LunarTerrain({ reveal, dust }: LunarTerrainProps) {
  const terrain = useMemo(() => createTerrain(11, "high"), []);
  const rocks = useRef<InstancedMesh>(null);
  const geometry = useMemo(() => {
    const next = new BufferGeometry();
    next.setAttribute("position", new BufferAttribute(terrain.positions, 3));
    next.setIndex(new BufferAttribute(terrain.indices, 1));
    next.computeVertexNormals();
    return next;
  }, [terrain.indices, terrain.positions]);

  useLayoutEffect(() => {
    if (!rocks.current) return;
    const dummy = new Object3D();
    terrain.boulders.forEach((boulder, index) => {
      dummy.position.set(...boulder.position);
      dummy.rotation.set(...boulder.rotation);
      dummy.scale.set(...boulder.scale);
      dummy.updateMatrix();
      rocks.current?.setMatrixAt(index, dummy.matrix);
    });
    rocks.current.instanceMatrix.needsUpdate = true;
  }, [terrain.boulders]);

  return (
    <group>
      <mesh geometry={geometry} receiveShadow>
        <meshStandardMaterial
          color="#393a36"
          metalness={0.02}
          opacity={0.58 + reveal * 0.42}
          roughness={0.98}
          transparent={reveal < 0.99}
        />
      </mesh>
      <instancedMesh
        args={[undefined, undefined, terrain.boulders.length]}
        castShadow
        count={terrain.boulders.length}
        ref={rocks}
        receiveShadow
      >
        <icosahedronGeometry args={[1, 0]} />
        <meshStandardMaterial color="#43443f" roughness={1} />
      </instancedMesh>
      {dust > 0.05 && (
        <mesh position={[11.5, -0.83, -13]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[2.4 + dust * 2.8, 48]} />
          <meshBasicMaterial
            color="#8c887e"
            depthWrite={false}
            opacity={0.035 + dust * 0.07}
            transparent
          />
        </mesh>
      )}
    </group>
  );
}
