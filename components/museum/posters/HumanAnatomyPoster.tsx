import styles from "./human-anatomy-poster.module.css";

export function HumanAnatomyPoster() {
  return (
    <div className={styles.poster} aria-hidden="true">
      <img
        src="/media/anatomy/thorax-reference-render.png"
        alt=""
      />
      <div className={styles.index}>
        <span>01 / 08</span>
        <p>Registered systems</p>
      </div>
      <p className={styles.caption}>Human Reference Atlas · HuBMAP / NIH</p>
    </div>
  );
}
