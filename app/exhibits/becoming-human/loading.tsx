import Image from "next/image";
import styles from "./loading.module.css";

export default function BecomingHumanLoading() {
  return (
    <main
      aria-busy="true"
      aria-label="Loading Becoming Human"
      className={styles.stage}
    >
      <Image
        alt=""
        className={styles.world}
        fill
        preload
        sizes="100vw"
        src="/media/becoming-human/chronicle/act-01-branches.webp"
      />

      <header aria-hidden="true" className={styles.chrome}>
        <span>LOUPE / ORIGINS &amp; FUTURES</span>
        <span>35 EPISODES / 8 GALLERIES</span>
      </header>

      <section className={styles.copy}>
        <p className={styles.eyebrow}>AN IMMERSIVE EXHIBIT</p>
        <h1>
          Becoming
          <span>Human</span>
        </h1>

        <div aria-live="polite" className={styles.status} role="status">
          <span aria-hidden="true" className={styles.track}>
            <span />
          </span>
          <span>Preparing the evidence atlas</span>
        </div>
      </section>

      <footer aria-hidden="true" className={styles.footer}>
        <span>8–6 MILLION YEARS AGO</span>
        <span>BODIES · CULTURE · SYSTEMS</span>
        <span>NOW</span>
      </footer>
    </main>
  );
}
