import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <section className={styles.Sidebar}>
        <h2 className={styles.NavbarTitle}>FakeAwake Discord Bot</h2>
        <nav className={styles.Nav}>
          <button className={styles.NavButton}>
            <span className={styles.material_symbols_rounded}>home</span>
            <span>Overview</span>
          </button>
          <button className={styles.NavButton}>
            <span></span>
            <span>Console</span>
          </button>
          <button className={styles.NavButton}>
            <span></span>
            <span>Bot Settings</span>
          </button>
        </nav>
      </section>
      <section></section>
    </main>
  );
}
