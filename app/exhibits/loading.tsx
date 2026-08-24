import styles from "./catalog.module.css";

export default function ExhibitsCatalogLoading() {
  return (
    <main className={styles.catalog} aria-busy="true">
      <div className={styles.emptyState}>
        <p className={styles.eyebrow}>Loupe / Museum catalog</p>
        <h2>Preparing the catalog…</h2>
        <p>Gathering exhibitions and their discovery details.</p>
      </div>
    </main>
  );
}
