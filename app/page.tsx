import { MuseumHeader } from "@/components/museum/MuseumHeader";
import { ExhibitCard } from "@/components/museum/ExhibitCard";
import { getActiveWings, getFeaturedExhibits } from "@/content/exhibits";

export default function MuseumLobby() {
  const activeExhibits = getFeaturedExhibits();
  const activeWings = getActiveWings(activeExhibits);

  return (
    <main className="lobby">
      <MuseumHeader />
      <section className="lobby-hero" aria-labelledby="lobby-title">
        <p className="kicker">A digital museum for the quietly curious</p>
        <h1 id="lobby-title">
          Look closer.
          <span>The ordinary is full of hidden worlds.</span>
        </h1>
        <p className="lobby-hero__intro">
          Immersive, interactive stories about the systems we live inside and
          the machines we build to explore beyond.
        </p>
        <a className="round-link" href="#exhibits" aria-label="Explore the exhibits">
          <span>Enter</span>
          <span aria-hidden="true">↓</span>
        </a>
        <div className="lobby-orbit lobby-orbit--one" aria-hidden="true" />
        <div className="lobby-orbit lobby-orbit--two" aria-hidden="true" />
      </section>

      <section
        className="exhibit-index"
        id="exhibits"
        aria-labelledby="exhibit-heading"
      >
        <div className="section-label">
          <span>Exhibits Directory</span>
          <span>
            {activeExhibits.length} Active{" "}
            {activeExhibits.length === 1 ? "Exhibition" : "Exhibitions"} ·{" "}
            {activeWings.map((w) => w.wing.title).join(" & ")}
          </span>
        </div>

        <div className="exhibit-index__header">
          <h2 id="exhibit-heading">Preserved in motion.</h2>
          <p className="exhibit-index__subtext">
            Choose an exhibition below to step inside high-fidelity interactive
            visualizations, archival audio, and systems simulations.
          </p>
        </div>

        <div className="exhibit-gallery">
          {activeExhibits.map((exhibit, index) => (
            <ExhibitCard key={exhibit.id} exhibit={exhibit} index={index} />
          ))}
        </div>
      </section>

      <section
        className="manifesto"
        id="manifesto"
        aria-labelledby="manifesto-title"
      >
        <p className="kicker">Our point of view</p>
        <h2 id="manifesto-title">Information should feel like discovery.</h2>
        <p>
          Loupe is a collection of bounded, interactive stories. No grades, no
          feeds, no endless course. Wander in curious; leave seeing one thing
          differently.
        </p>
      </section>

      <footer className="museum-footer">
        <span>Loupe / Digital Museum</span>
        <span>Curated for curiosity, 2026</span>
      </footer>
    </main>
  );
}
