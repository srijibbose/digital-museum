"use client";

import Image from "next/image";
import { useState, type CSSProperties } from "react";
import {
  dinosaurRange,
  earthMilestones,
  earthPosition,
  episodePlaces,
  humanShareOfEarthHistory,
  humanTimeWindows,
  mapPosition,
} from "@/content/becoming-human-atlas";
import {
  becomingHumanActs,
  becomingHumanEpisodes,
} from "@/content/becoming-human-story";
import styles from "./becoming-human-v2.module.css";

export type AtlasView = "time" | "place" | "story";

interface BecomingHumanAtlasProps {
  activeIndex: number;
  goTo: (index: number) => void;
  initialView: AtlasView;
}

function DeepTimeAtlas({ activeIndex, goTo }: Omit<BecomingHumanAtlasProps, "initialView">) {
  const activeEpisode = becomingHumanEpisodes[Math.min(activeIndex, becomingHumanEpisodes.length - 1)];
  const dinosaurStart = earthPosition(dinosaurRange.startYearsAgo);
  const dinosaurEnd = earthPosition(dinosaurRange.endYearsAgo);
  const humanStart = earthPosition(8_000_000);

  return (
    <div className={styles.timeAtlas}>
      <header className={styles.atlasHero}>
        <p>EARTH CONTEXT / TRUE LINEAR SCALE</p>
        <h2>Humans arrived<br />very recently.</h2>
        <p>Earth is about 4.54 billion years old. The eight-million-year span covered by this exhibit occupies only {humanShareOfEarthHistory.toFixed(2)}% of that history.</p>
      </header>

      <section aria-label="Earth history context" className={styles.earthHistory}>
        <div className={styles.earthScale}>
          <div className={styles.earthScaleLine} />
          <div
            className={styles.dinosaurRange}
            style={{ "--range-left": `${dinosaurStart}%`, "--range-width": `${dinosaurEnd - dinosaurStart}%` } as CSSProperties}
          >
            <span>{dinosaurRange.label}</span>
          </div>
          {earthMilestones.map((milestone, index) => (
            <div
              className={styles.earthMilestone}
              data-human={milestone.id === "human-lineage"}
              data-milestone={milestone.id}
              data-row={index % 2}
              key={milestone.id}
              style={{ "--earth-position": `${earthPosition(milestone.yearsAgo)}%` } as CSSProperties}
            >
              <i />
              <span>{milestone.label}<small>{milestone.date}</small></span>
            </div>
          ))}
          <span className={styles.earthNow}>TODAY</span>
        </div>
        <div className={styles.humanScaleCallout}>
          <span>THE HUMAN WINDOW</span>
          <i style={{ "--human-start": `${humanStart}%` } as CSSProperties} />
          <strong>THE FINAL {humanShareOfEarthHistory.toFixed(2)}%</strong>
        </div>
      </section>

      <section className={styles.humanTimeline}>
        <div className={styles.timelineHeading}>
          <div>
            <p>SELECTABLE HUMAN HISTORY</p>
            <h3>Four readable time windows</h3>
          </div>
          <p>The scale changes at each break so recent events remain readable. Every dated card opens that point in the exhibit.</p>
        </div>
        <div aria-label="Scrollable human evolution timeline" className={styles.timelineScroller}>
          {humanTimeWindows.map((window) => {
            const episodes = becomingHumanEpisodes.slice(window.startOrder - 1, window.endOrder);
            return (
              <section className={styles.timelineWindow} key={window.id}>
                <header><span>{window.label}</span><small>{window.range}</small></header>
                <div>
                  {episodes.map((episode) => {
                    const index = episode.order - 1;
                    return (
                      <button
                        aria-current={index === activeIndex ? "step" : undefined}
                        data-active={index === activeIndex}
                        key={episode.id}
                        onClick={() => goTo(index)}
                        type="button"
                      >
                        <span>{String(episode.order).padStart(2, "0")}</span>
                        <time>{episode.dateLabel}</time>
                        <strong>{episode.title}</strong>
                      </button>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
        <p className={styles.timelinePosition}>YOU ARE AT <strong>{activeEpisode.dateLabel}</strong> · {activeEpisode.title}</p>
      </section>
    </div>
  );
}

function PlaceAtlas({ activeIndex, goTo }: Omit<BecomingHumanAtlasProps, "initialView">) {
  const activeEpisode = becomingHumanEpisodes[Math.min(activeIndex, becomingHumanEpisodes.length - 1)];
  const activePlace = episodePlaces.find((place) => place.episodeId === activeEpisode.id) ?? episodePlaces[0];

  return (
    <div className={styles.placeAtlas}>
      <header className={styles.atlasHero}>
        <p>HUMAN GEOGRAPHY / 35 LOCATIONS</p>
        <h2>The story moves<br />across the planet.</h2>
        <p>These points show the main location associated with each episode. Some events happened in several regions; the map uses one anchor so the journey remains navigable.</p>
      </header>
      <figure className={styles.worldMap}>
        <Image alt="NASA Blue Marble map of Earth's land and oceans" fill sizes="(max-width: 760px) 100vw, 90vw" src="/media/becoming-human/nasa-world-map.png" />
        <div aria-label="Episode locations" className={styles.mapPoints}>
          {episodePlaces.map((place) => {
            const index = becomingHumanEpisodes.findIndex((episode) => episode.id === place.episodeId);
            const episode = becomingHumanEpisodes[index];
            const position = mapPosition(place.longitude, place.latitude);
            return (
              <button
                aria-label={`${String(episode.order).padStart(2, "0")} ${episode.title}, ${place.label}`}
                data-active={index === activeIndex}
                data-label-side={place.latitude > 35 ? "below" : "above"}
                key={place.episodeId}
                onClick={() => goTo(index)}
                style={{ "--map-left": `${position.left}%`, "--map-top": `${position.top}%` } as CSSProperties}
                type="button"
              >
                <i />
                <span>{String(episode.order).padStart(2, "0")} · {place.label}</span>
              </button>
            );
          })}
        </div>
        <figcaption>NASA / GODDARD SPACE FLIGHT CENTER · BLUE MARBLE · PUBLIC DOMAIN</figcaption>
      </figure>
      <div className={styles.mapReading}>
        <div><span>SELECTED PLACE</span><strong>{activePlace.label}</strong></div>
        <div><span>DATE</span><strong>{activeEpisode.dateLabel}</strong></div>
        <button onClick={() => goTo(activeEpisode.order - 1)} type="button">OPEN STEP {String(activeEpisode.order).padStart(2, "0")} →</button>
      </div>
    </div>
  );
}

function StoryAtlas({ activeIndex, goTo }: Omit<BecomingHumanAtlasProps, "initialView">) {
  return (
    <div className={styles.atlas}>
      <div className={styles.atlasIntro}>
        <p>THE COMPLETE STORY</p>
        <h2>Eight stages.<br />Thirty-five steps.</h2>
        <p>Follow the story in order, or jump to any step. Dates remain attached to every chapter so you always know where you are.</p>
      </div>
      <div className={styles.atlasActs}>
        {becomingHumanActs.map((act) => {
          const first = becomingHumanEpisodes.findIndex((episode) => episode.id === act.episodeIds[0]);
          const last = first + act.episodeIds.length - 1;
          const isActive = activeIndex >= first && activeIndex <= last;
          return (
            <section className={styles.atlasAct} data-active={isActive} key={act.id}>
              <button onClick={() => goTo(first)} type="button">
                <span>ACT {String(act.order).padStart(2, "0")}</span>
                <strong>{act.title}</strong>
                <small>{act.thesis}</small>
              </button>
              <ol>
                {act.episodeIds.map((episodeId) => {
                  const index = becomingHumanEpisodes.findIndex((episode) => episode.id === episodeId);
                  const episode = becomingHumanEpisodes[index];
                  return (
                    <li data-active={index === activeIndex} key={episodeId}>
                      <button onClick={() => goTo(index)} type="button">
                        <span>{String(episode.order).padStart(2, "0")}</span>
                        <span>{episode.title}</span>
                        <small>{episode.dateLabel}</small>
                      </button>
                    </li>
                  );
                })}
              </ol>
            </section>
          );
        })}
      </div>
    </div>
  );
}

export function BecomingHumanAtlas({ activeIndex, goTo, initialView }: BecomingHumanAtlasProps) {
  const [view, setView] = useState<AtlasView>(initialView);

  return (
    <div className={styles.atlasExplorer}>
      <nav aria-label="Explore the exhibit by">
        <button aria-pressed={view === "time"} onClick={() => setView("time")} type="button">TIME</button>
        <button aria-pressed={view === "place"} onClick={() => setView("place")} type="button">PLACE</button>
        <button aria-pressed={view === "story"} onClick={() => setView("story")} type="button">STORY</button>
      </nav>
      {view === "time" ? <DeepTimeAtlas activeIndex={activeIndex} goTo={goTo} /> : null}
      {view === "place" ? <PlaceAtlas activeIndex={activeIndex} goTo={goTo} /> : null}
      {view === "story" ? <StoryAtlas activeIndex={activeIndex} goTo={goTo} /> : null}
    </div>
  );
}
