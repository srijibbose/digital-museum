export function ThirteenMinutesPoster() {
  return (
    <div className="poster-apollo" aria-hidden="true">
      {/* Background Starfield and Lunar Atmosphere Grid */}
      <div className="poster-apollo__stars">
        <span className="star star--1" />
        <span className="star star--2" />
        <span className="star star--3" />
        <span className="star star--4" />
        <span className="star star--5" />
      </div>

      {/* Orbit & Descent Trajectory Arc */}
      <svg
        className="poster-apollo__trajectory-svg"
        viewBox="0 0 400 300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M 20,40 Q 140,70 230,150 T 360,260"
          stroke="rgba(72, 202, 228, 0.45)"
          strokeWidth="2"
          strokeDasharray="4 4"
          className="trajectory-path"
        />
        <circle cx="20" cy="40" r="3.5" fill="#48cae4" />
        <circle cx="175" cy="100" r="4.5" fill="#f4a261" className="alarm-node" />
        <circle cx="360" cy="260" r="4" fill="#64dfdf" />
      </svg>

      {/* Stylized Lunar Module Silhouette */}
      <div className="poster-apollo__craft">
        <svg
          viewBox="0 0 100 100"
          className="poster-apollo__lm-icon"
          fill="none"
          stroke="currentColor"
        >
          {/* Ascent Stage */}
          <polygon
            points="50,15 68,28 68,48 50,54 32,48 32,28"
            fill="rgba(213, 180, 156, 0.2)"
            stroke="#eee9dc"
            strokeWidth="1.5"
          />
          {/* Triangular Cockpit Windows */}
          <polygon points="44,28 38,36 44,36" fill="#48cae4" />
          <polygon points="56,28 62,36 56,36" fill="#48cae4" />
          {/* Descent Stage Octagon */}
          <polygon
            points="28,52 72,52 78,72 68,80 32,80 22,72"
            fill="rgba(244, 162, 97, 0.35)"
            stroke="#f4a261"
            strokeWidth="1.5"
          />
          {/* Landing Gear Struts */}
          <line x1="28" y1="72" x2="10" y2="92" stroke="#eee9dc" strokeWidth="1.5" />
          <line x1="72" y1="72" x2="90" y2="92" stroke="#eee9dc" strokeWidth="1.5" />
          <line x1="38" y1="80" x2="30" y2="92" stroke="#eee9dc" strokeWidth="1.2" />
          <line x1="62" y1="80" x2="70" y2="92" stroke="#eee9dc" strokeWidth="1.2" />
          {/* Footpads */}
          <circle cx="10" cy="92" r="3" fill="#eee9dc" />
          <circle cx="90" cy="92" r="3" fill="#eee9dc" />
          <circle cx="30" cy="92" r="2.5" fill="#eee9dc" />
          <circle cx="70" cy="92" r="2.5" fill="#eee9dc" />
          {/* Engine Bell Plume */}
          <path
            d="M 45,80 L 50,96 L 55,80 Z"
            fill="url(#engine-glow)"
            opacity="0.85"
            className="engine-fire"
          />
          <defs>
            <linearGradient id="engine-glow" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#f4a261" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Lunar Horizon */}
      <div className="poster-apollo__horizon">
        <div className="crater crater--one" />
        <div className="crater crater--two" />
      </div>

      {/* Telemetry Overlays */}
      <div className="poster-apollo__hud">
        <div className="hud-pill hud-pill--alarm">
          <span className="hud-dot" />
          <span>PROG 1202 · GO</span>
        </div>
        <div className="hud-pill hud-pill--radar">
          <span>DESCENT RADAR: LOCK</span>
        </div>
        <div className="hud-pill hud-pill--alt">
          <span>ALT: 33,500 FT</span>
        </div>
      </div>
    </div>
  );
}
