"use client";

import Link from "next/link";
import { RotateCcw } from "lucide-react";
import styles from "@/components/jet-engine/jet-engine.module.css";

export default function JetEngineError({ reset }: { reset: () => void }) {
  return (
    <main className={styles.errorState}>
      <p>LOUPE / EXH. 003</p>
      <span>Sectional laboratory unavailable</span>
      <h1>The flow has stopped.</h1>
      <p>
        The local exhibit could not be assembled. No remote engine asset is required, so retrying should restore
        the complete reconstruction and model.
      </p>
      <div>
        <button type="button" onClick={reset}><RotateCcw size={16} aria-hidden="true" />Retry exhibit</button>
        <Link href="/">Return to museum</Link>
      </div>
    </main>
  );
}
