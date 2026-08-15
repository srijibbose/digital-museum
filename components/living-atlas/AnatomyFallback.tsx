"use client";

import type { AnatomyChapter } from "@/lib/living-atlas/schema";

export function AnatomyFallback({ chapter }: { chapter: AnatomyChapter }) {
  return (
    <div
      className={`anatomy-fallback anatomy-fallback--${chapter.id}`}
      role="img"
      aria-label={chapter.fallbackDescription}
      style={{ "--chapter-accent": chapter.accent } as React.CSSProperties}
    >
      <div className="fallback-aura" aria-hidden="true" />
      <div className="fallback-figure" aria-hidden="true">
        <span className="fallback-figure__head" />
        <span className="fallback-figure__neck" />
        <span className="fallback-figure__torso" />
        <span className="fallback-figure__arm fallback-figure__arm--left" />
        <span className="fallback-figure__arm fallback-figure__arm--right" />
        <span className="fallback-figure__leg fallback-figure__leg--left" />
        <span className="fallback-figure__leg fallback-figure__leg--right" />
        <span className="fallback-organ fallback-organ--brain" />
        <span className="fallback-organ fallback-organ--spine" />
        <span className="fallback-organ fallback-organ--lung-left" />
        <span className="fallback-organ fallback-organ--lung-right" />
        <span className="fallback-organ fallback-organ--heart" />
        <span className="fallback-organ fallback-organ--liver" />
        <span className="fallback-organ fallback-organ--stomach" />
      </div>
      <span className="fallback-mode-label">Simplified atlas</span>
    </div>
  );
}
