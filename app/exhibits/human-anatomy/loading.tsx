import styles from "@/components/anatomy/anatomy.module.css";

export default function HumanAnatomyLoading() {
  return (
    <main className={styles.routeLoading} aria-busy="true" aria-label="Loading Human Anatomy">
      <span>LOUPE · HUMAN ANATOMY</span>
      <div aria-hidden="true" />
      <p>Preparing registered anatomy…</p>
    </main>
  );
}
