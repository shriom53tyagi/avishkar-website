import styles from "./Roll.module.css";

/** Button/link label with the text-roll hover. Use inside an <a> or <button>. */
export function Roll({ children }: { children: string }) {
  return (
    <span className={styles.roll} data-roll>
      <span className={styles.rollText}>{children}</span>
    </span>
  );
}
