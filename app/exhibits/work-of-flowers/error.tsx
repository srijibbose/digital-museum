"use client";

import Link from "next/link";
import styles from "@/components/flowers/flowers.module.css";

export default function WorkOfFlowersError({ reset }: { reset: () => void }) {
  return (
    <main className={styles.routeError}>
      <div role="alert">
        <span>EXH. 007 · Sequence interrupted</span>
        <h1>The specimen could not be prepared.</h1>
        <p>
          No biological state has been substituted. Retry the local exhibit, or return to the
          museum while the sourced model remains unavailable.
        </p>
        <div>
          <button type="button" onClick={reset}>Retry exhibit</button>
          <Link href="/">Return to Loupe</Link>
        </div>
      </div>
    </main>
  );
}
