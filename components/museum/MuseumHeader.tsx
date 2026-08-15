import Link from "next/link";

export function MuseumHeader({ quiet = false }: { quiet?: boolean }) {
  return (
    <header className={quiet ? "museum-header museum-header--quiet" : "museum-header"}>
      <Link className="museum-mark" href="/" aria-label="Loupe museum home">
        <span className="museum-mark__orb" aria-hidden="true" />
        <span>LOUPE</span>
      </Link>
      {!quiet && (
        <nav className="museum-nav" aria-label="Museum navigation">
          <a href="#exhibits">Exhibits</a>
          <a href="#manifesto">About</a>
        </nav>
      )}
    </header>
  );
}
