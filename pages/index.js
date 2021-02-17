import styles from "../styles/Home.module.css";

export default function Home() {
  return (
    <>
      <div className={styles.wrapper}>
        <div className={styles.message}>
          <a>Welcome to VRSUS</a>
          <p>VRSUS is a simple tool for sharing and hosting tournaments.</p>
          <p>Click Browse or Create to get started.</p>
        </div>
      </div>
    </>
  )
}