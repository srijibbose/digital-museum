import Link from "next/link";

type MuseumHeaderProps = {
  quiet?: boolean;
  tone?: "ink" | "paper";
};

const NAV_ITEMS = [
  { href: "/exhibits", label: "Browse all" },
  { href: "/#wings", label: "Wings" },
  { href: "/#about", label: "About" },
] as const;

export function MuseumHeader({ quiet = false, tone = "ink" }: MuseumHeaderProps) {
  const headerClassName = [
    "museum-header",
    quiet ? "museum-header--quiet" : "",
    tone === "paper" ? "museum-header--paper" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <header className={headerClassName}>
      <Link className="museum-mark" href="/" aria-label="Loupe museum home">
        <span className="museum-mark__orb" aria-hidden="true" />
        <span>LOUPE</span>
      </Link>
      {!quiet && (
        <>
          <nav className="museum-nav" aria-label="Museum navigation">
            {NAV_ITEMS.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>
          <details className="museum-menu">
            <summary>Menu</summary>
            <nav aria-label="Mobile museum navigation">
              {NAV_ITEMS.map((item) => (
                <Link key={item.href} href={item.href}>
                  {item.label}
                </Link>
              ))}
            </nav>
          </details>
        </>
      )}
    </header>
  );
}
