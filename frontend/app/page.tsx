import styles from "./page.module.css"

export default function Page() {

  return (

    <div className={styles.layout}>

      <div className={styles.ward}>
        病棟エリア
      </div>

      <div className={styles.stock}>
        ストックエリア
      </div>

      <div className={styles.button}>
        ボタン
      </div>

    </div>

  )
}