export function SceneLighting() {
  return (
    <>
      <ambientLight color="#7d8581" intensity={0.22} />
      <directionalLight
        castShadow
        color="#f0d6a4"
        intensity={4.1}
        position={[-18, 22, 12]}
        shadow-bias={-0.00035}
        shadow-mapSize-height={1024}
        shadow-mapSize-width={1024}
      />
      <directionalLight color="#77857f" intensity={1.15} position={[12, 8, 18]} />
      <hemisphereLight args={["#9ba29c", "#111413", 0.34]} />
    </>
  );
}
