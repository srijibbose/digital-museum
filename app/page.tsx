import { MuseumHeader } from "@/components/museum/MuseumHeader";
import { ExhibitCard } from "@/components/museum/ExhibitCard";
import { getActiveExhibits, getActiveWings } from "@/content/exhibits";

export default function MuseumLobby() {
  const activeExhibits = getActiveExhibits();
  const activeWings = getActiveWings();

  return (
    <main className="lobby">
      <MuseumHeader />
      <section className="lobby-hero" aria-labelledby="lobby-title">
        <div className="lobby-hero__lens" aria-hidden="true">
          <span className="lobby-hero__lens-core" />
          <span className="lobby-hero__lens-line lobby-hero__lens-line--one" />
          <span className="lobby-hero__lens-line lobby-hero__lens-line--two" />
        </div>
        <div className="lobby-hero__content">
          <p className="kicker">A digital museum for the quietly curious</p>
          <h1 id="lobby-title">
            Look closer.
            <span>The ordinary is full of hidden worlds.</span>
          </h1>
          <div className="lobby-hero__footer">
            <p className="lobby-hero__intro">
              Immersive stories about the systems we live inside and the machines
              we trust without ever seeing.
            </p>
            <a className="lobby-hero__action" href="#exhibits">
              <span>Explore the exhibitions</span>
              <span aria-hidden="true">↓</span>
            </a>
          </div>
        </div>
        <p className="lobby-hero__collection">
          {String(activeExhibits.length).padStart(2, "0")} active exhibits
        </p>
        <div className="lobby-orbit lobby-orbit--one" aria-hidden="true" />
        <div className="lobby-orbit lobby-orbit--two" aria-hidden="true" />
      </section>

      <section className="exhibit-index" id="exhibits" aria-labelledby="exhibit-heading">
        <div className="section-label">
          <span>Exhibits directory</span>
          <span>
            {activeExhibits.length} active exhibitions ·{" "}
            {activeWings.map(({ wing }, index) => (
              <span key={wing.id}>
                {index > 0 ? " & " : ""}
                {wing.title}
              </span>
            ))}
          </span>
        </div>
        <div className="exhibit-index__header">
          <h2 id="exhibit-heading">Machines, caught in the act.</h2>
          <p>
            Two self-contained stories. Enter one, touch the system, and leave
            seeing an ordinary machine differently.
          </p>
        </div>
        <div className="museum-exhibit-gallery">
          {activeExhibits.map((exhibit, index) => (
            <ExhibitCard exhibit={exhibit} index={index} key={exhibit.id} />
          ))}
        </div>
      </section>

      <section className="manifesto" id="manifesto" aria-labelledby="manifesto-title">
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
