import styles from "./dinosaurs-poster.module.css";

export function DinosaursPoster() {
  return (
    <div className={styles.poster} aria-hidden="true">
      <img
        className={styles.image}
        src="/media/dinosaurs/specimens/tyrannosaurus-life-3d.jpg"
        alt=""
      />
      <div className={styles.motionHalo} />
      <div className={styles.horizon} />
      <div className={styles.trackline} />
      <p className={styles.caption}>T. rex · 3D life reconstruction · illustrative</p>
    </div>
  );
}
