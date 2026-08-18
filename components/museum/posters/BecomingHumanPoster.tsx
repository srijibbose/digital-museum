export function BecomingHumanPoster() {
  return (
    <div className="poster-becoming-human" aria-hidden="true">
      <div className="poster-bh__time"><span>8 MA</span><i /><span>NOW</span></div>
      <div className="poster-bh__artifact">
        <div className="poster-bh__strata">{Array.from({ length: 6 }, (_, index) => <i key={index} />)}</div>
        <div className="poster-bh__core" />
        <div className="poster-bh__ring poster-bh__ring--one" />
        <div className="poster-bh__ring poster-bh__ring--two" />
        <div className="poster-bh__ember" />
      </div>
    </div>
  );
}
