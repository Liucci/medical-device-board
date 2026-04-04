"use client"

import styles from "./page.module.css"
import StockAreas from "./components/StockArea"
import WardArea from "./components/WardArea"
import ButtonPanel from "./components/ButtonPanel"
import { Device } from "./types/deviceTypes"
import { useState } from "react"

export default function Page() {

  const [deviceList, setDeviceList] = useState<Device[]>([])

  const addDevice = (device: Device) => {
    setDeviceList((prev) => [...prev, { ...device }])
    console.log("Added device:", device)
  }

  const startDrag = (e: React.MouseEvent, device: Device) => {
    console.log("drag start", device)
  }

  const deleteDevice = (id: number) => {
    setDeviceList((prev) => prev.filter(d => d.id !== id))
  }

  return (
    <div className={styles.layout}>

      {/* 病棟エリア */}
      <div className={styles.ward}>
        <WardArea/>
      </div>

      {/* CE室 / 在庫エリア */}
      <div className={styles.stock}>
        <StockAreas
          devices={deviceList}
          startDrag={startDrag}
          deleteDevice={deleteDevice}
        />
      </div>      

      {/* ボタンパネル */}
      <div className={styles.button}>
        <ButtonPanel addDevice={addDevice}/>
      </div>

    </div>
  )
}