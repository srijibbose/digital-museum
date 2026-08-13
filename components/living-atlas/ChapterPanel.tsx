"use client";

import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import type { AnatomyChapter } from "@/lib/living-atlas/schema";

type ChapterPanelProps = {
  chapter: AnatomyChapter;
  previousTitle?: string;
  nextTitle?: string;
  onPrevious: () => void;
  onNext: () => void;
  onExplore: () => void;
};

export function ChapterPanel({
  chapter,
  previousTitle,
  nextTitle,
  onPrevious,
  onNext,
  onExplore,
}: ChapterPanelProps) {
  return (
    <article className="chapter-panel" aria-live="polite" aria-atomic="true">
      <p className="chapter-panel__eyebrow">
        {chapter.ordinal} · {chapter.eyebrow}
      </p>
      <h2>{chapter.hook}</h2>
      <p>{chapter.narration}</p>
      <blockquote>{chapter.takeaway}</blockquote>

      <div className="chapter-interaction">
        <button onClick={onExplore}>
          <Sparkles size={15} aria-hidden="true" /> {chapter.interactionLabel}
        </button>
        <span>{chapter.interactionHint}</span>
      </div>

      <div className="chapter-navigation">
        {previousTitle ? (
          <button aria-label={`Previous: ${previousTitle}`} onClick={onPrevious}>
            <ArrowLeft size={17} aria-hidden="true" />
            <span>{previousTitle}</span>
          </button>
        ) : (
          <span />
        )}
        <button
          className="chapter-navigation__next"
          aria-label={nextTitle ? `Next: ${nextTitle}` : "Complete the journey"}
          onClick={onNext}
        >
          <span>{nextTitle ?? "Complete"}</span>
          <ArrowRight size={17} aria-hidden="true" />
        </button>
      </div>
    </article>
  );
}
