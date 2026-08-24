import {
  becomingHumanActs,
  becomingHumanEpisodes,
  becomingHumanFinale,
  type BecomingHumanEpisode,
  type StoryClock,
} from "@/content/becoming-human-story";
import { getExhibitBySlug } from "@/content/exhibits";
import type { ReactNode } from "react";
import styles from "./becoming-human-reading.module.css";

type BecomingHumanReadingEditionProps = {
  headingLevel?: 1 | 2;
};

type HeadingLevel = 1 | 2 | 3 | 4 | 5;

function Heading({
  children,
  id,
  level,
}: {
  children: ReactNode;
  id: string;
  level: HeadingLevel;
}) {
  const HeadingTag = `h${level}` as "h1" | "h2" | "h3" | "h4" | "h5";
  return <HeadingTag id={id}>{children}</HeadingTag>;
}

const exhibitDefinition = getExhibitBySlug("becoming-human")!;
const episodesById = new Map(
  becomingHumanEpisodes.map((episode) => [episode.id, episode]),
);

const clockLabels: Record<StoryClock, string> = {
  biology: "Biology",
  "gene-culture": "Gene + culture",
  culture: "Culture",
  technology: "Technology",
};

function EpisodeSources({
  episode,
  headingLevel,
}: {
  episode: BecomingHumanEpisode;
  headingLevel: 4 | 5;
}) {
  return (
    <section aria-labelledby={`${episode.id}-sources`} className={styles.sources}>
      <Heading id={`${episode.id}-sources`} level={headingLevel}>Sources</Heading>
      <ul>
        {episode.sources.map((source) => (
          <li key={`${episode.id}-${source.url}`}>
            <a data-source-link="true" href={source.url}>
              {source.label}
            </a>
            <span>{source.kind.replace("-", " ")}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function EpisodeArticle({
  episode,
  headingLevel,
}: {
  episode: BecomingHumanEpisode;
  headingLevel: 3 | 4;
}) {
  const detailHeadingLevel = (headingLevel + 1) as 4 | 5;

  return (
    <article
      aria-labelledby={`${episode.id}-title`}
      className={styles.episode}
      data-episode-id={episode.id}
    >
      <header className={styles.episodeHeader}>
        <div className={styles.episodeOrdinal} aria-hidden="true">
          <span>{String(episode.order).padStart(2, "0")}</span>
        </div>
        <div className={styles.episodeIdentity}>
          <p className={styles.episodeMeta}>
            <span>{episode.dateLabel}</span>
            <span>{episode.location}</span>
          </p>
          <Heading id={`${episode.id}-title`} level={headingLevel}>{episode.title}</Heading>
          <p className={styles.hook}>{episode.hook}</p>
        </div>
      </header>

      <div className={styles.episodeBody}>
        <div className={styles.account}>
          <p className={styles.capability}>{episode.capability}</p>
          <p>{episode.story}</p>
          <a
            className={styles.recordLink}
            href={`/research/becoming-human/${episode.id}`}
          >
            Read research record
            <span aria-hidden="true"> ↗</span>
          </a>
        </div>

        <aside aria-label={`${episode.title} evidence and limits`} className={styles.evidenceCard}>
          <p className={styles.cardKicker}>Evidence register</p>
          <dl>
            <div>
              <dt>Object</dt>
              <dd>{episode.evidence.object}</dd>
            </div>
            <div>
              <dt>Status</dt>
              <dd data-evidence-status={episode.evidence.status}>
                {episode.evidence.status.replace("-", " ")}
              </dd>
            </div>
            <div>
              <dt>Uncertainty / limits</dt>
              <dd>{episode.evidence.uncertainty}</dd>
            </div>
          </dl>
        </aside>

        <section aria-labelledby={`${episode.id}-inquiry`} className={styles.inquiry}>
          <div>
            <p className={styles.cardKicker}>{episode.interaction.kind.replace("-", " ")}</p>
            <Heading id={`${episode.id}-inquiry`} level={detailHeadingLevel}>
              Inquiry in the cinematic atlas
            </Heading>
            <p>{episode.interaction.config.prompt}</p>
          </div>
          <ul aria-label="Inspection choices">
            {episode.interaction.config.options.map((option) => (
              <li key={option}>{option}</li>
            ))}
          </ul>
          {episode.interaction.config.disclaimer ? (
            <p className={styles.disclaimer}>
              <strong>Interaction limit</strong>
              {episode.interaction.config.disclaimer}
            </p>
          ) : null}
        </section>

        <EpisodeSources episode={episode} headingLevel={detailHeadingLevel} />
      </div>
    </article>
  );
}

function ReadingBoundaryNavigation({
  label,
  next,
  previous,
}: {
  label: string;
  next: { href: string; title: string };
  previous: { href: string; title: string };
}) {
  return (
    <nav aria-label={label} className={styles.boundaryNav}>
      <ul>
        <li>
          <a href={previous.href}><span>Previous</span><strong>{previous.title}</strong></a>
        </li>
        <li>
          <a href="#becoming-human-edition-index"><span>Edition index</span><strong>Eight acts</strong></a>
        </li>
        <li>
          <a href={next.href}><span>Next</span><strong>{next.title}</strong></a>
        </li>
      </ul>
    </nav>
  );
}

export function BecomingHumanPublicIdentity() {
  return (
    <header
      aria-label="Becoming Human exhibit identity"
      className={styles.policyIdentity}
      role="banner"
    >
      <p className={styles.eyebrow}>{exhibitDefinition.exhibitNumber} · {exhibitDefinition.wing.title}</p>
      <h1>{exhibitDefinition.title}</h1>
      <p className={styles.identityTagline}>{exhibitDefinition.tagline}</p>
      <p>{exhibitDefinition.synopsis}</p>
      <nav aria-label="Becoming Human public edition">
        <a href="#becoming-human-reading-edition">Read the complete research edition</a>
        <a href="#becoming-human-member-content">Member access</a>
      </nav>
    </header>
  );
}

export function BecomingHumanReadingEdition({
  headingLevel = 1,
}: BecomingHumanReadingEditionProps = {}) {
  const sectionHeadingLevel = (headingLevel + 1) as 2 | 3;
  const episodeHeadingLevel = (headingLevel + 2) as 3 | 4;
  const detailHeadingLevel = (headingLevel + 2) as 3 | 4;

  return (
    <section
      aria-label="Becoming Human public research edition"
      className={styles.edition}
      data-becoming-human-edition
      id="becoming-human-reading-edition"
      tabIndex={-1}
    >
      <header className={styles.masthead}>
        <div className={styles.titleBlock}>
          <p className={styles.eyebrow}>Public research edition · 35 episodes</p>
          <Heading id="becoming-human-edition-title" level={headingLevel}>
            {exhibitDefinition.title}
          </Heading>
          <p className={styles.tagline}>{exhibitDefinition.tagline}</p>
        </div>
        <div className={styles.thesis}>
          <p>{exhibitDefinition.synopsis}</p>
          <p>{exhibitDefinition.curatorNote}</p>
        </div>
      </header>

      <nav aria-label="Becoming Human edition index" className={styles.actIndex} id="becoming-human-edition-index">
        <p>Eight acts · one changing clock</p>
        <ol>
          {becomingHumanActs.map((act) => (
            <li key={act.id}>
              <a href={`#act-${act.id}`}>
                <span>{String(act.order).padStart(2, "0")}</span>
                {act.title}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <aside aria-labelledby="becoming-human-unknowns" className={styles.uncertaintyNote}>
        <p className={styles.eyebrow}>Evidence before certainty</p>
        <Heading id="becoming-human-unknowns" level={sectionHeadingLevel}>
          What we still do not know
        </Heading>
        <p>
          Every episode keeps its authored uncertainty beside the evidence, and every
          reconstructed interaction retains its stated limit.
        </p>
      </aside>

      <div className={styles.acts}>
        {becomingHumanActs.map((act, actIndex) => {
          const actEpisodes = act.episodeIds.map((episodeId) => {
            const episode = episodesById.get(episodeId);
            if (!episode) throw new Error(`Unknown Becoming Human episode: ${episodeId}`);
            return episode;
          });

          return (
            <section
              aria-labelledby={`act-${act.id}-title`}
              className={styles.act}
              data-act-id={act.id}
              id={`act-${act.id}`}
              key={act.id}
            >
              <header className={styles.actHeader}>
                <div>
                  <p className={styles.actNumber}>Act {String(act.order).padStart(2, "0")}</p>
                  <Heading id={`act-${act.id}-title`} level={sectionHeadingLevel}>
                    {act.title}
                  </Heading>
                </div>
                <div className={styles.actThesis}>
                  <p>{act.thesis}</p>
                  <dl>
                    <div>
                      <dt>Clock</dt>
                      <dd>{act.clockFocus.map((clock) => clockLabels[clock]).join(" · ")}</dd>
                    </div>
                    <div>
                      <dt>Environment</dt>
                      <dd>{act.environment}</dd>
                    </div>
                  </dl>
                </div>
              </header>

              <ol className={styles.episodeList} start={actEpisodes[0]?.order}>
                {actEpisodes.map((episode) => (
                  <li key={episode.id}>
                    <EpisodeArticle episode={episode} headingLevel={episodeHeadingLevel} />
                  </li>
                ))}
              </ol>
              <ReadingBoundaryNavigation
                label={`Act ${act.order} reading navigation`}
                next={actIndex < becomingHumanActs.length - 1
                  ? {
                      href: `#act-${becomingHumanActs[actIndex + 1]!.id}`,
                      title: becomingHumanActs[actIndex + 1]!.title,
                    }
                  : { href: "#becoming-human-finale", title: "Coda" }}
                previous={actIndex > 0
                  ? {
                      href: `#act-${becomingHumanActs[actIndex - 1]!.id}`,
                      title: becomingHumanActs[actIndex - 1]!.title,
                    }
                  : { href: "#becoming-human-edition-title", title: "Introduction" }}
              />
            </section>
          );
        })}
      </div>

      <section
        aria-labelledby="becoming-human-finale-title"
        className={styles.finale}
        id="becoming-human-finale"
      >
        <header>
          <p className={styles.eyebrow}>Coda · What changed fastest?</p>
          <Heading id="becoming-human-finale-title" level={sectionHeadingLevel}>
            {becomingHumanFinale.title}
          </Heading>
          <p className={styles.finaleHook}>{becomingHumanFinale.hook}</p>
        </header>
        <p className={styles.finaleStory}>{becomingHumanFinale.story}</p>

        <ol aria-label="Layers of human change" className={styles.layers}>
          {becomingHumanFinale.layers.map((layer, index) => (
            <li key={layer.label}>
              <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
              <div>
                <p>{layer.label}</p>
                <small>{clockLabels[layer.clock]}</small>
              </div>
              <p>{layer.description}</p>
            </li>
          ))}
        </ol>

        <section aria-labelledby="becoming-human-finale-inquiry" className={styles.finaleInquiry}>
          <div>
            <p className={styles.cardKicker}>{becomingHumanFinale.interaction.kind}</p>
            <Heading id="becoming-human-finale-inquiry" level={detailHeadingLevel}>
              Final inquiry
            </Heading>
            <p>{becomingHumanFinale.interaction.config.prompt}</p>
          </div>
          <ul>
            {becomingHumanFinale.interaction.config.options.map((option) => (
              <li key={option}>{option}</li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="becoming-human-finale-sources" className={styles.finaleSources}>
          <Heading id="becoming-human-finale-sources" level={detailHeadingLevel}>
            Coda sources
          </Heading>
          <ul>
            {becomingHumanFinale.sources.map((source) => (
              <li key={`${becomingHumanFinale.id}-${source.url}`}>
                <a data-source-link="true" href={source.url}>{source.label}</a>
                <span>{source.kind.replace("-", " ")}</span>
              </li>
            ))}
          </ul>
        </section>
        <ReadingBoundaryNavigation
          label="Coda reading navigation"
          next={{ href: "/research", title: "Research library" }}
          previous={{
            href: `#act-${becomingHumanActs[becomingHumanActs.length - 1]!.id}`,
            title: becomingHumanActs[becomingHumanActs.length - 1]!.title,
          }}
        />
      </section>
    </section>
  );
}
