import styles from "./flower-poster.module.css";

export function FlowerPoster() {
  return (
    <div className={styles.poster} aria-hidden="true">
      <div className={styles.grid} />
      <div className={styles.copy}>
        <span>Living mechanism · 01</span>
        <strong>The flower<br />is an event.</strong>
        <i />
      </div>
      <img
        src="/media/flowers/phalaenopsis-scan-fallback.png"
        alt=""
        decoding="async"
      />
      <div className={styles.section}>
        <span />
        <span />
        <span />
      </div>
      <div className={styles.sequence}>
        <span>Form</span>
        <span>Inside</span>
        <span>Transfer</span>
        <span>Fertilisation</span>
        <span>Outcome</span>
      </div>
    </div>
  );
}
