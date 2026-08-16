export function JetEnginePoster() {
  return (
    <div className="poster-jet" aria-hidden="true">
      <div className="poster-jet__rings" />
      <div className="poster-jet__body">
        <div className="poster-jet__fan">
          {Array.from({ length: 16 }).map((_, index) => <i key={index} style={{ "--blade": index } as React.CSSProperties} />)}
        </div>
        <div className="poster-jet__compressor">{Array.from({ length: 5 }).map((_, index) => <i key={index} />)}</div>
        <div className="poster-jet__combustor" />
        <div className="poster-jet__turbine">{Array.from({ length: 4 }).map((_, index) => <i key={index} />)}</div>
        <div className="poster-jet__nozzle" />
      </div>
      <div className="poster-jet__stream">{Array.from({ length: 14 }).map((_, index) => <i key={index} style={{ "--stream": index } as React.CSSProperties} />)}</div>
      <span className="poster-jet__label poster-jet__label--in">AIR INTAKE</span>
      <span className="poster-jet__label poster-jet__label--out">THRUST</span>
    </div>
  );
}
