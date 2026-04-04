"use client"
import styles from "./page.module.css"

import WardArea from "./components/WardArea"
import StockArea from "./components/StockArea"
import ButtonPanel from "./components/ButtonPanel"
import DeviceModal from "./components/DeviceModal"
import { Device } from "./types/deviceTypes"
import { useState } from "react"


export default function Page() {
  const [modalOpen, setModalOpen] = useState(false)
  const [deviceList, setDeviceList] = useState<Device[]>([])
  // DeviceModalから新しい機器をストックに追加
  //新規登録された機器のみを追加するため、addDevice関数を作成
  const addDevice = (device: Device) => {
    setDeviceList((prev) => [...prev, { ...device }])
    console.log("Added device:", device)
  }

  return (
    <>
       <div className={styles.layout}>
        <div className={styles.ward}>
          <WardArea/>
        </div>

      
       <div className={styles.stock}>
          <StockArea/>
        </div>

        <div className={styles.button}>
          {/* //ButtonPanelにaddDevice関数を渡す */}
          <ButtonPanel addDevice={addDevice} />
        </div>
       </div>
      
    </>
  )
}