import styles from "@/components/flowers/flowers.module.css";

export default function WorkOfFlowersLoading() {
  return (
    <main className={styles.routeLoading} aria-busy="true" aria-label="Loading The Work of Flowers">
      <div>
        <span>LOUPE · EXH. 007</span>
        <h1>The Work of Flowers</h1>
        <p>Preparing the observed specimen and its evidence-labelled sequence…</p>
      </div>
    </main>
  );
}
