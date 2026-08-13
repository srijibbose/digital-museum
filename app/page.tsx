import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { MuseumHeader } from "@/components/museum/MuseumHeader";

export default function MuseumLobby() {
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
          Immersive, ten-minute stories about the systems we live inside but
          rarely stop to see.
        </p>
        <a className="round-link" href="#exhibits" aria-label="Enter the museum">
          <span>Enter</span>
          <span aria-hidden="true">↓</span>
        </a>
        <div className="lobby-orbit lobby-orbit--one" aria-hidden="true" />
        <div className="lobby-orbit lobby-orbit--two" aria-hidden="true" />
      </section>

      <section className="exhibit-index" id="exhibits" aria-labelledby="exhibit-heading">
        <div className="section-label">
          <span>Now showing</span>
          <span>Wing 01 — The body</span>
        </div>
        <h2 id="exhibit-heading">One body. Many conversations.</h2>
        <Link className="exhibit-card" href="/exhibits/living-atlas">
          <div className="exhibit-card__visual" aria-hidden="true">
            <div className="poster-body">
              <span className="poster-body__head" />
              <span className="poster-body__torso" />
              <span className="poster-body__core" />
              <span className="poster-body__ring poster-body__ring--one" />
              <span className="poster-body__ring poster-body__ring--two" />
            </div>
            <span className="exhibit-card__number">EXH. 001</span>
          </div>
          <div className="exhibit-card__copy">
            <p>Interactive anatomy · 12–15 minutes</p>
            <h3>The Living Atlas</h3>
            <p>
              Follow a touch, a breath, and a heartbeat through the systems
              that keep a human body in conversation with itself.
            </p>
            <span className="exhibit-card__cta">
              Enter the exhibit <ArrowUpRight size={18} aria-hidden="true" />
            </span>
          </div>
        </Link>
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
        <span>Made for curiosity, 2026</span>
      </footer>
    </main>
  );
}
