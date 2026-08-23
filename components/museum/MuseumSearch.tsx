"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import { useId, useState } from "react";
import {
  getSearchSuggestions,
  type ExhibitSearchItem,
} from "@/content/exhibit-discovery";
import styles from "./discovery.module.css";

export function MuseumSearch({
  exhibits,
}: {
  exhibits: ExhibitSearchItem[];
}) {
  const suggestionsId = useId();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const suggestions = query.trim().length >= 2
    ? getSearchSuggestions(exhibits, query, 4)
    : [];

  return (
    <form
      action="/exhibits"
      method="get"
      role="search"
      aria-label="Search the museum"
      className={styles.searchForm}
    >
      <div className={styles.searchField}>
        <Search size={23} strokeWidth={1.6} aria-hidden="true" />
        <label className={styles.visuallyHidden} htmlFor={`${suggestionsId}-input`}>
          Search exhibits
        </label>
        <input
          id={`${suggestionsId}-input`}
          type="search"
          role="combobox"
          name="q"
          value={query}
          placeholder="Search exhibits, topics, missions, systems…"
          autoComplete="off"
          aria-expanded={isOpen && suggestions.length > 0}
          aria-controls={suggestionsId}
          aria-autocomplete="list"
          onChange={(event) => {
            setQuery(event.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={(event) => {
            if (event.key === "Escape") setIsOpen(false);
          }}
        />
        <button type="submit" className={styles.searchSubmit}>
          Search
        </button>
      </div>

      {isOpen && suggestions.length > 0 && (
        <div
          id={suggestionsId}
          role="listbox"
          aria-label="Exhibit suggestions"
          className={styles.suggestions}
        >
          {suggestions.map((exhibit) => (
            <Link
              key={exhibit.id}
              href={exhibit.route}
              role="option"
              aria-selected="false"
              className={styles.suggestion}
            >
              <span>{exhibit.title}</span>
              <small>{exhibit.wing.title} · {exhibit.tagline}</small>
            </Link>
          ))}
        </div>
      )}
    </form>
  );
}
