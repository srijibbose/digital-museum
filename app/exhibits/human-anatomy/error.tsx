"use client";

import Link from "next/link";
import styles from "@/components/anatomy/anatomy.module.css";

export default function HumanAnatomyError({ reset }: { reset: () => void }) {
  return (
    <main className={styles.routeError}>
      <span>Human Anatomy · renderer interruption</span>
      <h1>The reference model could not be prepared.</h1>
      <p>The source-linked text atlas remains available after retrying the route.</p>
      <div>
        <button type="button" onClick={reset}>Try again</button>
        <Link href="/">Return to Loupe</Link>
      </div>
    </main>
  );
}
