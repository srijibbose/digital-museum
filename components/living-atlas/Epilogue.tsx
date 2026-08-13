"use client";

import Link from "next/link";
import { ArrowLeft, RotateCcw } from "lucide-react";

export function Epilogue({ onRestart }: { onRestart: () => void }) {
  return (
    <section className="atlas-epilogue" aria-labelledby="epilogue-title">
      <div className="epilogue-constellation" aria-hidden="true">
        {Array.from({ length: 18 }, (_, index) => (
          <i key={index} style={{ "--i": index } as React.CSSProperties} />
        ))}
      </div>
      <div className="epilogue-copy">
        <p className="kicker">The living whole</p>
        <h2 id="epilogue-title">You are a conversation.</h2>
        <p>
          Every thought, breath, and step is a conversation between systems
          that never stop listening to one another.
        </p>
        <div>
          <button className="primary-button" onClick={onRestart}>
            <RotateCcw size={16} aria-hidden="true" /> Restart journey
          </button>
          <Link className="text-button" href="/">
            <ArrowLeft size={16} aria-hidden="true" /> Return to the museum
          </Link>
        </div>
      </div>
    </section>
  );
}
