import type { ExhibitDefinition, ExhibitFormat } from "./exhibits";

export interface ExhibitSearchItem {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  route: string;
  wing: { title: string };
  order: number;
  searchText: string;
}

type SearchableExhibit = ExhibitDefinition | ExhibitSearchItem;

export type DurationFilter = "all" | "short" | "medium" | "deep";
export type CatalogSort = "curated" | "title" | "duration";

export interface ExhibitFilters {
  q?: string;
  wing?: string;
  duration?: DurationFilter;
  format?: ExhibitFormat | "all";
  featured?: boolean;
  sort?: CatalogSort;
  page?: number;
}

export interface CatalogPage {
  items: ExhibitDefinition[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

function normalize(value: string): string {
  return value.trim().toLocaleLowerCase().replace(/\s+/g, " ");
}

function searchableText(exhibit: SearchableExhibit): string {
  if ("searchText" in exhibit) return exhibit.searchText;

  return normalize(
    [
      exhibit.title,
      exhibit.tagline,
      exhibit.synopsis,
      exhibit.curatorNote,
      exhibit.wing.title,
      exhibit.interactionType,
      ...exhibit.tags,
    ].join(" "),
  );
}

export function createExhibitSearchIndex(
  exhibits: readonly ExhibitDefinition[],
): ExhibitSearchItem[] {
  return exhibits.map((exhibit) => ({
    id: exhibit.id,
    slug: exhibit.slug,
    title: exhibit.title,
    tagline: exhibit.tagline,
    route: exhibit.route,
    wing: { title: exhibit.wing.title },
    order: exhibit.order,
    searchText: searchableText(exhibit),
  }));
}

function matchesDuration(
  minutes: number,
  duration: DurationFilter | undefined,
): boolean {
  if (!duration || duration === "all") return true;
  if (duration === "short") return minutes <= 15;
  if (duration === "medium") return minutes > 15 && minutes <= 30;
  return minutes > 30;
}

export function filterExhibits(
  exhibits: readonly ExhibitDefinition[],
  filters: ExhibitFilters = {},
): ExhibitDefinition[] {
  const queryTokens = normalize(filters.q ?? "").split(" ").filter(Boolean);
  const format = filters.format && filters.format !== "all" ? filters.format : undefined;

  const matches = exhibits.filter((exhibit) => {
    const haystack = searchableText(exhibit);
    return (
      queryTokens.every((token) => haystack.includes(token)) &&
      (!filters.wing || filters.wing === "all" || exhibit.wing.slug === filters.wing) &&
      matchesDuration(exhibit.durationMinutes, filters.duration) &&
      (!format || exhibit.formats.includes(format)) &&
      (!filters.featured || Boolean(exhibit.featured))
    );
  });

  return [...matches].sort((left, right) => {
    if (filters.sort === "title") return left.title.localeCompare(right.title);
    if (filters.sort === "duration") {
      return left.durationMinutes - right.durationMinutes || left.order - right.order;
    }
    return left.order - right.order;
  });
}

export function getCatalogPage(
  exhibits: readonly ExhibitDefinition[],
  filters: ExhibitFilters = {},
  pageSize = 12,
): CatalogPage {
  const matches = filterExhibits(exhibits, filters);
  const totalPages = Math.max(1, Math.ceil(matches.length / pageSize));
  const page = Math.min(Math.max(1, filters.page ?? 1), totalPages);
  const start = (page - 1) * pageSize;

  return {
    items: matches.slice(start, start + pageSize),
    total: matches.length,
    page,
    pageSize,
    totalPages,
  };
}

export function buildCatalogHref(filters: ExhibitFilters = {}): string {
  const params = new URLSearchParams();
  const query = filters.q?.trim();

  if (query) params.set("q", query);
  if (filters.wing && filters.wing !== "all") params.set("wing", filters.wing);
  if (filters.duration && filters.duration !== "all") {
    params.set("duration", filters.duration);
  }
  if (filters.format && filters.format !== "all") params.set("format", filters.format);
  if (filters.featured) params.set("featured", "true");
  if (filters.sort && filters.sort !== "curated") params.set("sort", filters.sort);
  if (filters.page && filters.page > 1) params.set("page", String(filters.page));

  const queryString = params.toString();
  return queryString ? `/exhibits?${queryString}` : "/exhibits";
}

export function getSearchSuggestions<T extends SearchableExhibit>(
  exhibits: readonly T[],
  query: string,
  limit = 4,
): T[] {
  const normalizedQuery = normalize(query);
  if (!normalizedQuery) return [];

  return exhibits
    .filter((exhibit) => searchableText(exhibit).includes(normalizedQuery))
    .sort((left, right) => {
      const leftTitle = normalize(left.title);
      const rightTitle = normalize(right.title);
      const leftStarts = leftTitle.startsWith(normalizedQuery) ? 0 : 1;
      const rightStarts = rightTitle.startsWith(normalizedQuery) ? 0 : 1;
      return leftStarts - rightStarts || left.order - right.order;
    })
    .slice(0, Math.max(0, limit));
}

export function pickSurpriseExhibit<T extends { enabled: boolean }>(
  exhibits: readonly T[],
  random: () => number = Math.random,
): T | undefined {
  const enabled = exhibits.filter((exhibit) => exhibit.enabled);
  if (enabled.length === 0) return undefined;
  const index = Math.min(enabled.length - 1, Math.max(0, Math.floor(random() * enabled.length)));
  return enabled[index];
}

export type { ExhibitFormat };
