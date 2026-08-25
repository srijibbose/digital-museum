export function JetEnginePoster() {
  return (
    <div className="poster-jet" aria-hidden="true">
      <div className="poster-jet__topline">
        <span>SECTIONAL LABORATORY</span>
        <span>NASA STATIONS 0—8</span>
      </div>
      <svg viewBox="0 0 720 430" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="poster-metal" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#b8bbb6" />
            <stop offset="1" stopColor="#555d5d" />
          </linearGradient>
          <pattern id="poster-grid" width="32" height="32" patternUnits="userSpaceOnUse">
            <path d="M32 0H0V32" fill="none" stroke="rgba(238,233,220,.045)" />
          </pattern>
        </defs>
        <rect width="720" height="430" fill="url(#poster-grid)" />
        <path className="poster-jet__datum" d="M28 220 H694" />
        <g className="poster-jet__case">
          <path d="M46 134 C96 107 147 101 209 101 H566 C604 101 638 116 681 145 L661 163 C620 143 592 137 555 137 H221 C151 137 102 148 61 169 Z" fill="url(#poster-metal)" />
          <path d="M46 306 C96 333 147 339 209 339 H566 C604 339 638 324 681 295 L661 277 C620 297 592 303 555 303 H221 C151 303 102 292 61 271 Z" fill="url(#poster-metal)" />
          <path d="M46 134 C31 166 26 191 26 220 C26 249 31 274 46 306" />
          <path d="M215 173 C302 163 349 167 401 188 H474 C523 173 566 177 631 195 L665 209 H233 Z" fill="#747b78" />
          <path d="M215 267 C302 277 349 273 401 252 H474 C523 267 566 263 631 245 L665 231 H233 Z" fill="#515958" />
        </g>
        <g className="poster-jet__spinner">
          <path d="M96 220 C128 184 164 178 202 184 V256 C164 262 128 256 96 220 Z" fill="#858c89" />
          <path d="M96 220 H646" />
        </g>
        <g className="poster-jet__fan">
          <rect x="200" y="108" width="14" height="224" rx="7" />
          {[0, 1, 2, 3, 4].map((index) => (
            <g key={index}>
              <path d={`M207 ${123 + index * 17} C229 ${132 + index * 17} 240 ${156 + index * 15} 245 ${178 + index * 12} L220 ${174 + index * 12} C218 ${151 + index * 15} 212 ${133 + index * 17} 207 ${123 + index * 17} Z`} />
              <path d={`M207 ${317 - index * 17} C229 ${308 - index * 17} 240 ${284 - index * 15} 245 ${262 - index * 12} L220 ${266 - index * 12} C218 ${289 - index * 15} 212 ${307 - index * 17} 207 ${317 - index * 17} Z`} />
            </g>
          ))}
        </g>
        <g className="poster-jet__compressor">
          {[296, 321, 347, 374].map((x, index) => (
            <g key={x}>
              <path d={`M${x} 216 L${x + 10} ${172 + index * 6} L${x + 17} 215 Z`} />
              <path d={`M${x} 224 L${x + 10} ${268 - index * 6} L${x + 17} 225 Z`} />
            </g>
          ))}
        </g>
        <g className="poster-jet__combustor">
          <path d="M400 188 L427 199 H472 L500 183 L514 204 L481 217 H422 L393 205 Z" />
          <path d="M400 252 L427 241 H472 L500 257 L514 236 L481 223 H422 L393 235 Z" />
        </g>
        <g className="poster-jet__turbine">
          {[523, 551, 581].map((x, index) => (
            <g key={x}>
              <path d={`M${x} 216 L${x + 11} ${178 - index * 6} L${x + 19} 213 Z`} />
              <path d={`M${x} 224 L${x + 11} ${262 + index * 6} L${x + 19} 227 Z`} />
            </g>
          ))}
        </g>
        <g className="poster-jet__flow">
          <path d="M24 179 C106 177 144 173 189 174" />
          <path d="M239 154 C371 130 513 136 684 179" />
          <path d="M239 286 C371 310 513 304 684 261" />
          <path className="poster-jet__flow--core" d="M242 207 C360 204 427 212 505 205 C568 199 614 210 695 218" />
          <path className="poster-jet__flow--core" d="M242 233 C360 236 427 228 505 235 C568 241 614 230 695 222" />
        </g>
        <g className="poster-jet__stations">
          {[
            [44, "0"], [205, "2"], [390, "3"], [501, "4"], [596, "5"], [672, "8"],
          ].map(([x, label]) => (
            <g key={label} transform={`translate(${x} 0)`}>
              <path d="M0 73 V353" />
              <circle cx="0" cy="74" r="12" />
              <text x="0" y="78">{label}</text>
            </g>
          ))}
        </g>
      </svg>
      <div className="poster-jet__caption">
        <span>COOL BYPASS</span>
        <i />
        <span>HOT CORE</span>
      </div>
    </div>
  );
}
