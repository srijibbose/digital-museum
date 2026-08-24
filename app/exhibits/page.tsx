import type { Metadata } from "next";
import Link from "next/link";
import { CompactExhibitCard } from "@/components/museum/CompactExhibitCard";
import { MuseumHeader } from "@/components/museum/MuseumHeader";
import {
  buildCatalogHref,
  getCatalogPage,
  type CatalogSort,
  type DurationFilter,
  type ExhibitFilters,
  type ExhibitFormat,
} from "@/content/exhibit-discovery";
import {
  EXHIBIT_FORMAT_LABELS,
  getActiveExhibits,
  getActiveWings,
} from "@/content/exhibits";
import { createPageMetadata } from "@/lib/seo/metadata";
import styles from "./catalog.module.css";

type RawSearchParams = Record<string, string | string[] | undefined>;

type ExhibitsCatalogProps = {
  searchParams: Promise<RawSearchParams>;
};

const CATALOG_PAGE_SIZE = 12;
const DURATION_OPTIONS: { value: DurationFilter; label: string }[] = [
  { value: "all", label: "Any duration" },
  { value: "short", label: "15 minutes or less" },
  { value: "medium", label: "16–30 minutes" },
  { value: "deep", label: "More than 30 minutes" },
];
const SORT_OPTIONS: { value: CatalogSort; label: string }[] = [
  { value: "curated", label: "Curator order" },
  { value: "title", label: "Title A–Z" },
  { value: "duration", label: "Shortest first" },
];

export async function generateMetadata({
  searchParams,
}: ExhibitsCatalogProps): Promise<Metadata> {
  const params = await searchParams;

  return createPageMetadata({
    title: "Explore every exhibit",
    description:
      "Search every exhibition by subject, wing, format, or the time you have.",
    pathname: "/exhibits",
    imagePath: "/social/museum/default",
    index: !hasValidCatalogState(params),
  });
}

function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function isOneOf<T extends string>(value: string | undefined, options: readonly T[]): value is T {
  return Boolean(value && options.includes(value as T));
}

function parseFilters(params: RawSearchParams): ExhibitFilters {
  const q = firstValue(params.q);
  const wing = firstValue(params.wing);
  const duration = firstValue(params.duration);
  const format = firstValue(params.format);
  const sort = firstValue(params.sort);
  const rawPage = Number.parseInt(firstValue(params.page) ?? "1", 10);
  const activeWingSlugs = getActiveWings().map(({ wing: activeWing }) => activeWing.slug);
  const formats = Object.keys(EXHIBIT_FORMAT_LABELS) as ExhibitFormat[];

  return {
    q: q?.trim() || undefined,
    wing: activeWingSlugs.includes(wing ?? "") ? wing : undefined,
    duration: isOneOf(duration, ["short", "medium", "deep"] as const)
      ? duration
      : undefined,
    format: isOneOf(format, formats) ? format : undefined,
    featured: firstValue(params.featured) === "true",
    sort: isOneOf(sort, ["title", "duration"] as const) ? sort : "curated",
    page: Number.isFinite(rawPage) && rawPage > 0 ? rawPage : 1,
  };
}

function hasValidCatalogState(params: RawSearchParams): boolean {
  const q = firstValue(params.q)?.trim();
  const wing = firstValue(params.wing);
  const duration = firstValue(params.duration);
  const format = firstValue(params.format);
  const featured = firstValue(params.featured);
  const sort = firstValue(params.sort);
  const page = firstValue(params.page);
  const activeWingSlugs = getActiveWings().map(({ wing: activeWing }) => activeWing.slug);
  const formats = Object.keys(EXHIBIT_FORMAT_LABELS) as ExhibitFormat[];
  const pageNumber = Number(page);

  return Boolean(
    q ||
      wing === "all" ||
      activeWingSlugs.includes(wing ?? "") ||
      isOneOf(duration, ["all", "short", "medium", "deep"] as const) ||
      isOneOf(format, ["all", ...formats]) ||
      featured === "true" ||
      isOneOf(sort, ["curated", "title", "duration"] as const) ||
      (page && Number.isInteger(pageNumber) && pageNumber > 0),
  );
}

function resultLabel(total: number): string {
  return `${total} ${total === 1 ? "exhibit" : "exhibits"}`;
}

export default async function ExhibitsCatalog({ searchParams }: ExhibitsCatalogProps) {
  const filters = parseFilters(await searchParams);
  const activeExhibits = getActiveExhibits();
  const activeWings = getActiveWings(activeExhibits);
  const catalog = getCatalogPage(activeExhibits, filters, CATALOG_PAGE_SIZE);
  const normalizedFilters = { ...filters, page: catalog.page };

  return (
    <main className={styles.catalog}>
      <MuseumHeader tone="paper" />

      <header className={styles.intro}>
        <p className={styles.eyebrow}>Loupe / Museum catalog</p>
        <h1>All exhibits</h1>
        <p>
          Search every exhibition by subject, wing, format, or the time you have.
          The catalog stays useful whether Loupe holds five exhibits or five thousand.
        </p>
      </header>

      <form className={styles.filters} action="/exhibits" method="get" aria-label="Filter exhibits">
        <div className={styles.searchControl}>
          <label htmlFor="catalog-query">Search all exhibits</label>
          <input
            id="catalog-query"
            name="q"
            type="search"
            placeholder="Apollo, anatomy, planets, engines…"
            defaultValue={filters.q ?? ""}
          />
        </div>

        <label className={styles.selectControl}>
          <span>Wing</span>
          <select name="wing" defaultValue={filters.wing ?? "all"}>
            <option value="all">All wings</option>
            {activeWings.map(({ wing }) => (
              <option key={wing.id} value={wing.slug}>{wing.title}</option>
            ))}
          </select>
        </label>

        <label className={styles.selectControl}>
          <span>Duration</span>
          <select name="duration" defaultValue={filters.duration ?? "all"}>
            {DURATION_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </label>

        <label className={styles.selectControl}>
          <span>Format</span>
          <select name="format" defaultValue={filters.format ?? "all"}>
            <option value="all">All formats</option>
            {(Object.entries(EXHIBIT_FORMAT_LABELS) as [ExhibitFormat, string][]).map(
              ([value, label]) => <option key={value} value={value}>{label}</option>,
            )}
          </select>
        </label>

        <label className={styles.selectControl}>
          <span>Sort</span>
          <select name="sort" defaultValue={filters.sort ?? "curated"}>
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </label>

        <label className={styles.checkboxControl}>
          <input
            type="checkbox"
            name="featured"
            value="true"
            defaultChecked={Boolean(filters.featured)}
          />
          <span>Staff picks only</span>
        </label>

        <div className={styles.filterActions}>
          <button type="submit">Apply filters</button>
          <Link href="/exhibits">Reset</Link>
        </div>
      </form>

      <section className={styles.results} aria-label="Catalog results">
        <div className={styles.resultsHeader} aria-live="polite">
          <strong>{resultLabel(catalog.total)}</strong>
          <span>Page {catalog.page} of {catalog.totalPages}</span>
        </div>

        {catalog.items.length > 0 ? (
          <div className={styles.grid}>
            {catalog.items.map((exhibit) => (
              <CompactExhibitCard key={exhibit.id} exhibit={exhibit} />
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <p className={styles.eyebrow}>No match in the catalog</p>
            <h2>No exhibits found</h2>
            <p>Try a broader topic or remove one of the filters to widen the search.</p>
            <Link href="/exhibits">Clear all filters</Link>
          </div>
        )}

        {catalog.items.length > 0 && (
          <nav className={styles.pagination} aria-label="Catalog pages">
            {catalog.page > 1 ? (
              <Link
                href={buildCatalogHref({ ...normalizedFilters, page: catalog.page - 1 })}
                aria-label="Previous page"
              >
                ← Previous
              </Link>
            ) : <span />}
            <span>Page {catalog.page} of {catalog.totalPages}</span>
            {catalog.page < catalog.totalPages ? (
              <Link
                href={buildCatalogHref({ ...normalizedFilters, page: catalog.page + 1 })}
                aria-label="Next page"
              >
                Next →
              </Link>
            ) : <span />}
          </nav>
        )}
      </section>

      <footer className={styles.footer}>
        <Link href="/">Loupe / Museum home</Link>
        <span>{activeExhibits.length} exhibitions currently open</span>
      </footer>
    </main>
  );
}
