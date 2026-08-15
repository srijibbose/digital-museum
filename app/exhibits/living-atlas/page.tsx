import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LivingAtlasExperience } from "@/components/living-atlas/LivingAtlasExperience";
import { livingAtlasChapters, livingAtlasSources } from "@/content/living-atlas";
import { isExhibitEnabled } from "@/content/exhibits";

export const metadata: Metadata = {
  title: "The Living Atlas",
  description:
    "An immersive journey through the systems that make a human body a coordinated whole.",
};

export default function LivingAtlasPage() {
  if (!isExhibitEnabled("living-atlas")) {
    notFound();
  }

  return (
    <main className="atlas-page">
      <a className="skip-link" href="#atlas-transcript">
        Skip interactive experience
      </a>
      <LivingAtlasExperience />
      <section className="atlas-transcript" id="atlas-transcript" aria-labelledby="transcript-title">
        <p className="kicker">Accessible edition</p>
        <h2 id="transcript-title">The complete journey, in text</h2>
        <div className="transcript-grid">
          {livingAtlasChapters.map((chapter) => (
            <article key={chapter.id}>
              <span>{chapter.ordinal}</span>
              <h3>{chapter.title}</h3>
              <p>{chapter.narration}</p>
              <strong>{chapter.takeaway}</strong>
            </article>
          ))}
        </div>
        <div className="source-panel">
          <div>
            <p className="kicker">Sources & context</p>
            <h2>Built for wonder, checked for clarity.</h2>
            <p>
              This exhibit offers general educational information. It is not
              medical advice, diagnosis, or treatment guidance. The 3D figure
              is a deliberately simplified spatial illustration.
            </p>
          </div>
          <ol>
            {livingAtlasSources.map((source) => (
              <li key={source.id}>
                <a href={source.url} target="_blank" rel="noreferrer">
                  {source.title}
                  <span>{source.publisher}</span>
                </a>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </main>
  );
}
