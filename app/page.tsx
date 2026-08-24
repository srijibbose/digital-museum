import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { CompactExhibitCard } from "@/components/museum/CompactExhibitCard";
import { MuseumHeader } from "@/components/museum/MuseumHeader";
import { MuseumSearch } from "@/components/museum/MuseumSearch";
import { SurpriseMe } from "@/components/museum/SurpriseMe";
import { createExhibitSearchIndex } from "@/content/exhibit-discovery";
import {
  getActiveExhibits,
  getActiveWings,
  getFeaturedExhibits,
} from "@/content/exhibits";
import { createPageMetadata } from "@/lib/seo/metadata";
import styles from "./home.module.css";

export const metadata: Metadata = createPageMetadata({
  title: "A digital museum for exploring how the world works",
  description:
    "Enter interactive, source-grounded exhibits on the human body, machines, space, and human history.",
  pathname: "/",
  imagePath: "/social/museum/default",
  imageAlt: "Loupe Digital Museum",
});

const QUICK_PATHS = [
  { href: "/exhibits?duration=short", label: "Under 15 minutes" },
  { href: "/exhibits?format=interactive-3d", label: "Interactive 3D" },
  { href: "/exhibits?wing=space", label: "Explore Space" },
  { href: "/exhibits?featured=true", label: "Staff picks" },
] as const;

export default function MuseumLobby() {
  const activeExhibits = getActiveExhibits();
  const featuredExhibits = getFeaturedExhibits().slice(0, 5);
  const activeWings = getActiveWings(activeExhibits);
  const searchIndex = createExhibitSearchIndex(activeExhibits);
  const surpriseExhibits = activeExhibits.map(({ id, route, enabled }) => ({
    id,
    route,
    enabled,
  }));

  return (
    <main className={styles.home}>
      <MuseumHeader tone="paper" />

      <section className={styles.hero} aria-labelledby="lobby-title">
        <div className={styles.heroContent}>
          <p className={styles.eyebrow}>Loupe / Digital Museum</p>
          <h1 id="lobby-title">A digital museum for exploring how the world works.</h1>
          <p className={styles.heroIntro}>
            Enter interactive, source-grounded exhibits on the human body,
            machines, space, and human history.
          </p>
          <div className={styles.heroSearch}>
            <MuseumSearch exhibits={searchIndex} />
          </div>
          <div className={styles.heroActions}>
            <Link className={styles.primaryAction} href="/exhibits">
              Browse all exhibits
            </Link>
            <SurpriseMe exhibits={surpriseExhibits} />
          </div>
        </div>
        <div className="lobby-orbit lobby-orbit--one" aria-hidden="true" />
        <div className="lobby-orbit lobby-orbit--two" aria-hidden="true" />
      </section>

      <nav className={styles.quickPaths} aria-label="Quick ways to explore">
        <div className={styles.quickPathsInner}>
          <span className={styles.quickLabel}>Start somewhere</span>
          {QUICK_PATHS.map((path) => (
            <Link key={path.href} className={styles.quickPath} href={path.href}>
              <span>{path.label}</span>
              <ArrowUpRight size={16} strokeWidth={1.7} aria-hidden="true" />
            </Link>
          ))}
        </div>
      </nav>

      <section
        className={styles.featured}
        aria-label="Featured exhibits"
      >
        <div className={styles.sectionHeader}>
          <div>
            <p className={styles.sectionEyebrow}>Now showing</p>
            <h2 id="featured-title">Featured exhibits</h2>
          </div>
          <p className={styles.sectionHeaderCopy}>
            A small, changing selection from the museum. The complete catalog stays
            searchable as Loupe grows.
          </p>
        </div>
        <div className={styles.featuredGrid}>
          {featuredExhibits.map((exhibit) => (
            <CompactExhibitCard key={exhibit.id} exhibit={exhibit} />
          ))}
        </div>
        <div className={styles.featuredFooter}>
          <Link className={styles.textLink} href="/exhibits">
            See the full catalog
          </Link>
        </div>
      </section>

      <section
        className={styles.wings}
        id="wings"
        aria-label="Explore by wing"
      >
        <div className={styles.wingsHeader}>
          <p className={styles.sectionEyebrow}>Permanent gateways</p>
          <h2 id="wings-title">Explore by wing.</h2>
        </div>
        <div className={styles.wingGrid}>
          {activeWings.map(({ wing, count }) => (
            <Link
              key={wing.id}
              className={styles.wingCard}
              href={`/exhibits?wing=${wing.slug}`}
              aria-label={`${wing.title}, ${count} ${count === 1 ? "exhibit" : "exhibits"}`}
            >
              <span className={styles.wingCode}>{wing.code}</span>
              <div>
                <h3>{wing.title}</h3>
                <p>{wing.description}</p>
              </div>
              <span className={styles.wingCount}>{String(count).padStart(2, "0")}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className={styles.about} id="about" aria-labelledby="about-title">
        <div>
          <p className={styles.sectionEyebrow}>What Loupe is</p>
          <h2 id="about-title">A museum made to be entered, not scrolled past.</h2>
        </div>
        <div className={styles.aboutCopy}>
          <p>
            Loupe turns evidence, objects, scientific models, and archival records into
            interactive exhibits. Sources and reconstruction limits stay visible, so
            discovery never asks you to trade wonder for trust.
          </p>
          <div className={styles.aboutProof} aria-label="Museum principles">
            <div><span>Format</span><strong>Interactive exhibitions</strong></div>
            <div><span>Foundation</span><strong>Named, visible sources</strong></div>
            <div><span>Pace</span><strong>Explore in your own order</strong></div>
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <span>Loupe / Digital Museum</span>
        <span>Curated for curiosity, 2026</span>
      </footer>
    </main>
  );
}
