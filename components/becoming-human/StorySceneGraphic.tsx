import Image from "next/image";
import type { EpisodeVisual, StoryVisualKind } from "@/content/becoming-human-visuals";
import styles from "./story-scene-graphic.module.css";

function HumanFigure({ x, y, scale = 1, stride = 0 }: { x: number; y: number; scale?: number; stride?: number }) {
  return (
    <g className={styles.human} transform={`translate(${x} ${y}) scale(${scale})`}>
      <ellipse cx="0" cy="-54" rx="11" ry="14" />
      <path d="M-8-38C-18-8-14 12-8 34L-19 88M7-38C18-6 14 15 8 35L20 88" />
      <path d={`M-12-24L${-35 - stride} 20M11-23L${34 + stride} 14`} />
      <path d="M-9-37Q0-45 9-37L14 27Q0 38-14 27Z" />
    </g>
  );
}

function VisualGlyph({ kind }: { kind: StoryVisualKind }) {
  if (kind === "branch" || kind === "lineage") {
    return (
      <svg className={styles.svg} viewBox="0 0 1200 760" aria-hidden="true">
        <g className={styles.branchLines}>
          <path d="M604 760C603 594 588 518 531 442C471 362 461 267 480 0" />
          <path d="M555 484C444 421 352 340 299 222C268 153 244 90 188 0" />
          <path d="M515 406C627 343 691 251 708 132C715 83 744 39 782 0" />
          <path d="M484 330C406 296 359 238 347 168C337 110 305 53 268 0" />
          <path d="M660 263C770 235 861 169 919 72C938 40 963 17 990 0" />
          <path d="M704 151C806 122 875 71 909 0" />
          <path d="M349 169C265 164 187 130 119 70C90 44 60 21 27 0" />
        </g>
        <g className={styles.branchTips}>
          <text x="24" y="38">GORILLA</text><text x="184" y="38">PAN</text><text x="447" y="38">HOMININS</text>
          <text x="765" y="38">HOMO</text><text x="970" y="38">US</text>
        </g>
      </svg>
    );
  }

  if (kind === "walker" || kind === "horizon") {
    return (
      <svg className={styles.svg} viewBox="0 0 1200 760" aria-hidden="true">
        <path className={styles.horizon} d="M0 545Q212 511 402 534T795 518T1200 535V760H0Z" />
        <path className={styles.windLine} d="M53 377C305 334 513 376 737 344S1053 322 1190 350" />
        <HumanFigure x={735} y={531} scale={1.15} stride={7} />
        <HumanFigure x={641} y={541} scale={0.72} stride={-4} />
        <path className={styles.rangeArc} d="M642 464Q812 287 1097 455" />
      </svg>
    );
  }

  if (kind === "fossil" || kind === "variation") {
    return (
      <svg className={styles.svg} viewBox="0 0 1200 760" aria-hidden="true">
        <g className={styles.cranialContours}>
          <path d="M755 105C643 98 567 183 579 286C588 370 649 397 675 448L676 546L817 546L827 454C882 420 915 355 907 274C897 169 850 107 755 105Z" />
          <path d="M656 279C690 252 730 242 770 255M806 255C839 249 864 260 881 283" />
          <path d="M774 252L763 357L811 372" />
          <path d="M720 417Q785 449 847 413" />
          <path d="M651 168Q766 104 876 184" />
        </g>
        {kind === "variation" ? <g className={styles.variationEcho}><path d="M247 492C201 443 204 349 252 310C296 275 360 288 394 337C425 381 421 461 384 501" /><path d="M393 492C357 441 363 360 407 326C452 291 516 303 547 352C576 398 567 464 531 501" /></g> : null}
      </svg>
    );
  }

  if (kind === "trackway") {
    return (
      <svg className={styles.svg} viewBox="0 0 1200 760" aria-hidden="true">
        <g className={styles.footprints}>
          <path d="M322 662C296 630 308 588 328 557C346 530 344 492 367 472C392 450 428 467 433 500C439 536 411 559 410 594C408 632 361 685 322 662Z" />
          <path d="M504 514C478 482 490 440 510 409C528 382 526 344 549 324C574 302 610 319 615 352C621 388 593 411 592 446C590 484 543 537 504 514Z" />
          <path d="M690 367C664 335 676 293 696 262C714 235 712 197 735 177C760 155 796 172 801 205C807 241 779 264 778 299C776 337 729 390 690 367Z" />
        </g>
        <path className={styles.trackLine} d="M363 623L553 470L741 318" />
      </svg>
    );
  }

  if (kind === "stone") {
    return (
      <svg className={styles.svg} viewBox="0 0 1200 760" aria-hidden="true">
        <g className={styles.stoneScars}>
          <path d="M640 95L829 225L781 542L602 669L401 525L424 235Z" />
          <path d="M640 95L605 319L424 235M605 319L829 225M605 319L781 542M605 319L602 669M605 319L401 525" />
          <path className={styles.strikeArc} d="M822 132Q910 225 841 320" />
          <path className={styles.flake} d="M838 310L931 347L867 448L795 377Z" />
        </g>
      </svg>
    );
  }

  if (kind === "fire") {
    return (
      <svg className={styles.svg} viewBox="0 0 1200 760" aria-hidden="true">
        <g className={styles.fire}>
          <path d="M603 650C444 628 404 498 479 394C518 340 527 292 506 229C590 260 620 332 611 391C693 315 714 219 689 131C833 235 862 399 785 522C745 586 681 637 603 650Z" />
          <path d="M610 632C539 597 529 531 561 480C584 444 592 405 583 367C663 412 702 485 675 552C662 586 639 612 610 632Z" />
        </g>
        <g className={styles.embers}>{Array.from({ length: 12 }, (_, index) => <circle key={index} cx={480 + index * 24} cy={340 - (index % 4) * 39} r={2 + (index % 3)} />)}</g>
      </svg>
    );
  }

  if (kind === "projectile") {
    return (
      <svg className={styles.svg} viewBox="0 0 1200 760" aria-hidden="true">
        <path className={styles.projectileArc} d="M160 570Q514 86 1034 491" />
        <path className={styles.spear} d="M483 252L865 432" />
        <path className={styles.spearHead} d="M865 432L823 383L903 448Z" />
        <g transform="translate(199 574)"><HumanFigure x={0} y={0} scale={1.05} stride={9} /></g>
      </svg>
    );
  }

  if (kind === "voice") {
    return (
      <svg className={styles.svg} viewBox="0 0 1200 760" aria-hidden="true">
        <path className={styles.profile} d="M328 571C260 496 244 400 275 316C302 242 362 197 442 183C473 178 493 191 499 215L514 277L557 331L511 354L505 411C500 457 467 488 421 488L404 583" />
        <g className={styles.waveform}>
          <path d="M555 335C628 313 662 369 720 345S804 305 866 337S978 368 1082 330" />
          <path d="M555 368C633 348 673 411 739 378S829 344 887 377S987 407 1085 366" />
          <path d="M555 303C621 282 657 328 712 311S806 271 866 302S972 332 1082 294" />
        </g>
      </svg>
    );
  }

  if (kind === "genome" || kind === "body-culture") {
    return (
      <svg className={styles.svg} viewBox="0 0 1200 760" aria-hidden="true">
        <g className={styles.helix}>
          <path d="M413 115C746 239 478 492 829 646" />
          <path d="M829 115C478 266 746 498 413 646" />
          {Array.from({ length: 10 }, (_, index) => <line key={index} x1={475 + ((index % 2) * 208)} y1={150 + index * 50} x2={767 - ((index % 2) * 208)} y2={150 + index * 50} />)}
        </g>
      </svg>
    );
  }

  if (kind === "mark" || kind === "tablet" || kind === "print") {
    return (
      <svg className={styles.svg} viewBox="0 0 1200 760" aria-hidden="true">
        <g className={styles.marks}>
          {Array.from({ length: 11 }, (_, index) => <path key={index} d={`M${270 + index * 55} ${520 - (index % 3) * 38}l${38 + (index % 4) * 8}-${128 + (index % 2) * 45}`} />)}
          <path d="M261 578Q588 489 922 569" />
          <path d="M297 620Q602 535 891 619" />
        </g>
      </svg>
    );
  }

  if (kind === "routes" || kind === "crossing" || kind === "navigation" || kind === "encounter") {
    return (
      <svg className={styles.svg} viewBox="0 0 1200 760" aria-hidden="true">
        <g className={styles.routes}>
          <path d="M286 429C385 329 484 328 575 386S733 494 913 358" />
          <path d="M321 489C445 413 518 444 603 491S753 544 976 437" />
          <path d="M601 382C704 292 782 275 921 313" />
          <path d="M573 489C657 553 765 603 921 571" />
          {["286,429", "575,386", "913,358", "603,491", "976,437", "921,571"].map((point) => { const [cx, cy] = point.split(","); return <circle key={point} cx={cx} cy={cy} r="7" />; })}
        </g>
        {kind === "crossing" || kind === "navigation" ? <path className={styles.boat} d="M462 610H712L665 653H511ZM496 600L581 486V600M581 487L672 592H581" /> : null}
      </svg>
    );
  }

  if (kind === "climate" || kind === "field" || kind === "household" || kind === "dense-life") {
    return (
      <svg className={styles.svg} viewBox="0 0 1200 760" aria-hidden="true">
        <g className={styles.settlement}>
          <path d="M0 619Q282 522 558 589T1200 536V760H0Z" />
          <path d="M584 474L720 359L856 474V611H584Z" />
          <path d="M616 474V397M824 474V397" />
          <path d="M746 611V517H802V611" />
          {Array.from({ length: 8 }, (_, index) => <path key={index} d={`M${70 + index * 132} 699Q${110 + index * 132} 572 ${150 + index * 132} 699`} />)}
        </g>
      </svg>
    );
  }

  if (kind === "instrument") {
    return (
      <svg className={styles.svg} viewBox="0 0 1200 760" aria-hidden="true">
        <g className={styles.instrument}>
          <circle cx="724" cy="378" r="211" /><circle cx="724" cy="378" r="151" /><circle cx="724" cy="378" r="72" />
          {Array.from({ length: 16 }, (_, index) => <line key={index} x1="724" y1="152" x2="724" y2="203" transform={`rotate(${index * 22.5} 724 378)`} />)}
          <path d="M724 378L859 272M511 378H937M724 165V591" />
        </g>
      </svg>
    );
  }

  if (kind === "energy" || kind === "electricity") {
    if (kind === "energy") {
      return (
        <svg className={styles.svg} viewBox="0 0 1200 760" aria-hidden="true">
          <g className={styles.energyMachine}>
            <circle cx="805" cy="433" r="188" />
            <circle cx="805" cy="433" r="41" />
            {Array.from({ length: 10 }, (_, index) => <line key={index} x1="805" y1="271" x2="805" y2="392" transform={`rotate(${index * 36} 805 433)`} />)}
            <path d="M805 433L623 513L509 454" />
            <path d="M323 357H507V553H323Z" />
            <path className={styles.piston} d="M354 454H492" />
            <path className={styles.steam} d="M363 357C334 311 375 290 353 246S370 184 348 141" />
            <path className={styles.steam} d="M428 357C398 326 445 288 418 257S444 198 427 166" />
            <path className={styles.powerStroke} d="M154 628H1060" />
          </g>
        </svg>
      );
    }
    return (
      <svg className={styles.svg} viewBox="0 0 1200 760" aria-hidden="true">
        <g className={styles.energy}>
          <path d="M0 618H253V501H333V618H480V405H561V618H719V463H799V618H1200" />
          <path d="M514 405V248H550V405M550 249C578 220 585 182 577 139" />
          <path className={styles.current} d="M51 559C264 512 411 537 580 503S887 474 1168 522" />
          {kind === "electricity" ? <g className={styles.lights}>{Array.from({ length: 14 }, (_, index) => <rect key={index} x={168 + index * 66} y={482 + (index % 3) * 48} width="10" height="10" />)}</g> : null}
        </g>
      </svg>
    );
  }

  if (kind === "computer" || kind === "network") {
    return (
      <svg className={styles.svg} viewBox="0 0 1200 760" aria-hidden="true">
        <g className={styles.circuit}>
          <path d="M81 178H337V292H506V171H751V315H1098" /><path d="M88 568H288V464H474V581H695V427H936V543H1121" /><path d="M337 292V464M751 315V427M506 171V581" />
          {["81,178", "337,292", "506,171", "751,315", "1098,315", "88,568", "288,464", "474,581", "695,427", "936,543", "1121,543"].map((point) => { const [cx, cy] = point.split(","); return <circle key={point} cx={cx} cy={cy} r="9" />; })}
        </g>
      </svg>
    );
  }

  if (kind === "phone") {
    return (
      <svg className={styles.svg} viewBox="0 0 1200 760" aria-hidden="true">
        <g className={styles.phone}>
          <path d="M468 66H730Q772 66 772 108V650Q772 694 730 694H468Q426 694 426 650V108Q426 66 468 66Z" />
          <path d="M537 102H660" /><path d="M599 640H600" />
          <g className={styles.phoneLayers}><path d="M802 156H1002" /><path d="M802 238H1092" /><path d="M802 320H1038" /><path d="M802 402H1120" /><path d="M802 484H988" /><path d="M802 566H1070" /></g>
        </g>
      </svg>
    );
  }

  return (
    <svg className={styles.svg} viewBox="0 0 1200 760" aria-hidden="true">
      <g className={styles.model}>
        {Array.from({ length: 28 }, (_, index) => <circle key={index} cx={190 + ((index * 157) % 830)} cy={130 + ((index * 83) % 480)} r={index % 3 === 0 ? 8 : 5} />)}
        <path d="M124 565C258 468 365 525 481 429S706 277 1089 235" />
        <path d="M154 617C321 567 483 605 642 523S878 362 1092 380" />
      </g>
    </svg>
  );
}

export function StorySceneGraphic({ visual }: { visual: EpisodeVisual }) {
  return (
    <div className={styles.root} data-composition={visual.composition} data-kind={visual.kind}>
      <VisualGlyph kind={visual.kind} />
      {visual.objectImage && visual.showObjectInScene !== false ? (
        <figure className={styles.artifact}>
          <div className={styles.artifactImage}>
            <Image alt={visual.objectAlt ?? "Historical evidence object"} fill loading="eager" quality={90} sizes="(max-width: 760px) 84vw, 48vw" src={visual.objectImage} />
          </div>
          <figcaption>
            {visual.objectSourceUrl ? <a href={visual.objectSourceUrl} rel="noreferrer" target="_blank">{visual.objectLabel ?? "RECORD"} ↗</a> : <span>{visual.objectLabel ?? "RECORD"}</span>}
            <span>{visual.objectCredit}</span>
          </figcaption>
        </figure>
      ) : null}
    </div>
  );
}
