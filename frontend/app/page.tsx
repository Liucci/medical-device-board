import styles from "./page.module.css"

import WardArea from "./components/WardArea"
import StockArea from "./components/StockArea"
import ButtonPanel from "./components/ButtonPanel"

export default function Page() {

  return (

    <div className={styles.layout}>

      <div className={styles.ward}>
        <WardArea/>
      </div>

      <div className={styles.stock}>
        <StockArea/>
      </div>

      <div className={styles.button}>
        <ButtonPanel/>
      </div>

    </div>

  )
}