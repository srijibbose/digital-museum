export function FullThrottlePoster() {
  return (
    <div className="directory-poster directory-poster--engine" aria-hidden="true">
      <svg className="engine-poster__drawing" viewBox="0 0 860 520">
        <defs>
          <linearGradient id="engine-shell" x1="0" x2="1">
            <stop offset="0" stopColor="#f6f2e8" />
            <stop offset="0.55" stopColor="#aaa79f" />
            <stop offset="1" stopColor="#625f59" />
          </linearGradient>
          <linearGradient id="engine-flow" x1="0" x2="1">
            <stop offset="0" stopColor="#8bd8ec" />
            <stop offset="0.45" stopColor="#f7f1d6" />
            <stop offset="0.68" stopColor="#ff9b45" />
            <stop offset="1" stopColor="#f04a2f" stopOpacity="0.2" />
          </linearGradient>
        </defs>
        <path
          className="engine-poster__shell"
          d="M76 92 C180 54 630 56 780 169 L812 247 L780 335 C630 452 180 454 76 416 L38 330 L38 176 Z"
          fill="url(#engine-shell)"
        />
        <path className="engine-poster__cut" d="M76 256 L792 256 L768 342 C610 414 192 424 91 389 Z" />
        <path className="engine-poster__bypass" d="M104 169 C264 121 616 126 754 207" />
        <path className="engine-poster__flow" d="M86 252 C252 248 302 250 392 252 C492 255 606 259 772 260" />
        <g className="engine-poster__fan" transform="translate(156 254)">
          {Array.from({ length: 12 }, (_, index) => (
            <path key={index} d="M0 -13 C26 -39 31 -80 13 -115 L-8 -67 Z" transform={`rotate(${index * 30})`} />
          ))}
          <circle r="28" />
        </g>
        <g className="engine-poster__stages">
          {[270, 306, 344, 386, 438, 485, 548, 602, 664].map((x, index) => (
            <path
              key={x}
              className={index > 5 ? "engine-poster__hot-stage" : undefined}
              d={`M${x} 180 L${x + 12} 230 L${x + 12} 282 L${x} 330 M${x + 24} 194 L${x + 13} 232 L${x + 13} 280 L${x + 24} 316`}
            />
          ))}
        </g>
        <path className="engine-poster__shaft engine-poster__shaft--outer" d="M154 249 L678 249" />
        <path className="engine-poster__shaft engine-poster__shaft--inner" d="M300 261 L622 261" />
        <path className="engine-poster__combustor" d="M475 203 C520 188 559 190 586 213 L570 292 C535 309 501 307 474 290 Z" />
        <path className="engine-poster__nozzle" d="M684 202 L785 229 L775 296 L685 318 Z" />
      </svg>
      <span className="engine-poster__label engine-poster__label--fan">FAN</span>
      <span className="engine-poster__label engine-poster__label--core">CORE FLOW</span>
      <span className="engine-poster__label engine-poster__label--hot">CONTINUOUS BURN</span>
    </div>
  );
}
