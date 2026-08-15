export function ThirteenMinutesPoster() {
  return (
    <div className="directory-poster directory-poster--apollo" aria-hidden="true">
      <span className="apollo-poster__moon" />
      <svg className="apollo-poster__trajectory" viewBox="0 0 800 520">
        <path d="M96 102 C258 82 356 173 430 248 C520 338 636 377 746 413" />
        <path className="apollo-poster__planned" d="M430 248 C546 311 641 322 738 332" />
        <circle cx="430" cy="248" r="7" />
      </svg>
      <div className="apollo-poster__lander">
        <span className="apollo-poster__cabin" />
        <span className="apollo-poster__deck" />
        <span className="apollo-poster__leg apollo-poster__leg--left" />
        <span className="apollo-poster__leg apollo-poster__leg--right" />
        <span className="apollo-poster__plume" />
      </div>
      <div className="apollo-poster__readout">
        <span>1202</span>
        <small>PROGRAM ALARM</small>
      </div>
    </div>
  );
}
