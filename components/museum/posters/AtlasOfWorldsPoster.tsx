import styles from "./atlas-of-worlds-poster.module.css";

export function AtlasOfWorldsPoster() {
  return (
    <div className={styles.poster} aria-hidden="true">
      <img
        className={styles.backdrop}
        src="/media/space/atlas/saturn-color.webp"
        alt=""
      />
      <div className={styles.specimen}>
        <img src="/media/space/atlas/moon-color.webp" alt="" />
      </div>
      <div className={styles.earth}>
        <img src="/media/space/atlas/earth-color.webp" alt="" />
      </div>
      <div className={styles.sun}>
        <img src="/media/space/atlas/sun-color.webp" alt="" />
      </div>
      <p className={styles.caption}>Comparative planetary instrument · NASA / USGS</p>
    </div>
  );
}
