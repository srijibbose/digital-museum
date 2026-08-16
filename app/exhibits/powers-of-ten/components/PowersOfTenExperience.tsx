"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { SCALE_STOPS, exhibitIntro } from "../content";
import { indexToProgress, progressToIndex } from "../scale-state";
import { ScaleScene } from "./ScaleScene";
import styles from "../powers-of-ten.module.css";

export function PowersOfTenExperience() {
  const [progress, setProgress] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [interacted, setInteracted] = useState(false);
  const activeIndex = progressToIndex(progress, SCALE_STOPS.length);
  const stop = SCALE_STOPS[activeIndex];
  const progressStops = useMemo(() => SCALE_STOPS.map((_, i) => indexToProgress(i, SCALE_STOPS.length)), []);

  useEffect(() => { const media = window.matchMedia("(prefers-reduced-motion: reduce)"); const update = () => setReducedMotion(media.matches); update(); media.addEventListener("change", update); return () => media.removeEventListener("change", update); }, []);
  useEffect(() => { const onScroll = () => { const max = document.documentElement.scrollHeight - window.innerHeight; setProgress(max > 0 ? window.scrollY / max : 0); setInteracted(true); }; window.addEventListener("scroll", onScroll, { passive: true }); onScroll(); return () => window.removeEventListener("scroll", onScroll); }, []);
  useEffect(() => { const onKey = (event: KeyboardEvent) => { const keys = ["ArrowDown", "PageDown", "ArrowUp", "PageUp"]; if (!keys.includes(event.key)) return; event.preventDefault(); setInteracted(true); const direction = event.key === "ArrowUp" || event.key === "PageUp" ? -1 : 1; window.scrollTo({ top: indexToProgress(Math.min(SCALE_STOPS.length - 1, Math.max(0, activeIndex + direction)), SCALE_STOPS.length) * (document.documentElement.scrollHeight - window.innerHeight), behavior: reducedMotion ? "auto" : "smooth" }); }; window.addEventListener("keydown", onKey); return () => window.removeEventListener("keydown", onKey); }, [activeIndex, reducedMotion]);

  return <main className={styles.page}><a className={styles.skip} href="#scale-content">Skip to scale stops</a><div className={styles.experience}><section className={styles.stage} aria-label="Continuous zoom from the human scale to the observable universe"><div className={styles.canvas}><ScaleScene progress={progress} reducedMotion={reducedMotion} /></div><div className={styles.veil} /><div className={styles.grain} /><div className={styles.topline}><Link className={styles.mark} href="/" aria-label="Loupe museum home"><span className={styles.markDot} aria-hidden="true" />Loupe</Link><span>Space &amp; Science · Exhibit 003</span></div><div className={styles.counter} aria-live="polite"><strong>10<sup>{stop.exponent}</sup></strong><span>metres · {activeIndex + 1} / {SCALE_STOPS.length}</span></div><div className={styles.copy}><p className={styles.eyebrow}>{exhibitIntro.subtitle}</p><h1 className={styles.title}>{activeIndex === 0 ? exhibitIntro.title : stop.title}</h1><p className={styles.subtitle}>{stop.comparison}</p></div><p className={styles.caption}><strong>{stop.caption}</strong>{stop.scale}</p><nav className={styles.rail} aria-label="Scale stops">{progressStops.map((value, i) => <button key={SCALE_STOPS[i].id} aria-label={`Go to ${SCALE_STOPS[i].title}`} aria-current={i === activeIndex} onClick={() => { setInteracted(true); window.scrollTo({ top: value * (document.documentElement.scrollHeight - window.innerHeight), behavior: reducedMotion ? "auto" : "smooth" }); }} />)}</nav><p className={`${styles.cue} ${interacted ? styles.cueHidden : ""}`}>{exhibitIntro.instruction} ↓</p></section></div><section id="scale-content" className={styles.fallback} aria-labelledby="scale-list-title"><p className={styles.eyebrow}>A map of the journey</p><h2 id="scale-list-title">Every distance is still you.</h2><div className={styles.fallbackList}>{SCALE_STOPS.map((item) => <article className={styles.fallbackItem} key={item.id}><span>{item.scale}</span><strong>{item.title}</strong><span>{item.ariaLabel}</span></article>)}</div></section></main>;
}
