export function LivingAtlasPoster() {
  return (
    <div className="poster-body" aria-hidden="true">
      <span className="poster-body__head" />
      <span className="poster-body__torso" />
      <span className="poster-body__core" />
      <span className="poster-body__ring poster-body__ring--one" />
      <span className="poster-body__ring poster-body__ring--two" />
      <span className="poster-body__pulse" />
      <div className="poster-body__vitals">
        <span className="vital-chip vital-chip--pulse">
          <span className="vital-dot" /> 72 BPM
        </span>
        <span className="vital-chip">SYNAPSE ACTIVE</span>
      </div>
    </div>
  );
}
