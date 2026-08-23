import styles from "@/components/jet-engine/jet-engine.module.css";

export default function JetEngineLoading() {
  return (
    <section className={styles.loadingShell} aria-label="Loading the interactive 3D jet engine laboratory">
      <header><span /><i /><i /></header>
      <div>
        <aside>{Array.from({ length: 7 }).map((_, index) => <i key={index} />)}</aside>
        <main>
          <p />
          <h1 />
          <div className={styles.loadingDrawing}>
            <span />
            <span />
            <span />
          </div>
          <footer />
        </main>
        <aside><h2 /><p /><p /><p /></aside>
      </div>
    </section>
  );
}
