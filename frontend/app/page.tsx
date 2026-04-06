"use client"

import styles from "./page.module.css"
import StockAreas from "./components/StockArea"
import WardArea from "./components/WardArea"
import ButtonPanel from "./components/ButtonPanel"
import DragLayer from "./components/DragLayer"
import { Device } from "./types/deviceTypes"
import { useState } from "react"

export default function Page() {

  const [deviceList, setDeviceList] = useState<Device[]>([])
  const [draggingDevice, setDraggingDevice] = useState<Device | null>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })


  const addDevice = (device: Device) => {
    setDeviceList((prev) => [...prev, { ...device, x: 0, y: 0 }])
    console.log("Added device:", device)
    console.log("x,y:", device.x, device.y)
  }
const startDrag = (e: React.MouseEvent, device: Device) => {

  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()

  setDragOffset({
                  x: e.clientX - rect.left,
                  y: e.clientY - rect.top
                })
  setMousePos({
                x: e.clientX,
                y: e.clientY
              })

/*   setDeviceList(prev =>
    prev.map(d =>
      d.id === device.id
        ? { ...d, x: rect.left, y: rect.top }
        : d
    )
  )
 */
  setDraggingDevice(device)
}
    // ドラッグ中の処理
  const handleMouseMove = (e: React.MouseEvent) => {
    //console.log("mouse move", draggingDevice)
    //draggingDeviceがnullの場合は何もしない
    if (!draggingDevice) return
    //DragLayerのマウス位置情報のMousePosを更新する
        setMousePos({
          x: e.clientX, 
          y: e.clientY 
        })

/*     // ドラッグ中は機器の位置を更新する
        //idが一致するDeviceListのdeviceのx,yを更新する
    setDeviceList(prev =>
      prev.map(d =>
        d.id === draggingDevice.id
          ? {
              ...d,
              x: e.clientX - dragOffset.x,
              y: e.clientY - dragOffset.y,
            }
          : d
      )
    )
 */    
  }

  const handleMouseUp = () => {
    setDraggingDevice(null)
    
  }

  const deleteDevice = (id: number) => {
    setDeviceList((prev) => prev.filter(d => d.id !== id))
  }

  return (
      <div
        //page.module.cssのlayoutクラスと
        // draggingDeviceが存在する場合はdraggingクラスを呼び出す
        className={`${styles.layout} ${draggingDevice ? styles.dragging : ""}`}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
      {/* 病棟エリア */}
      <div className={styles.ward}>
        <WardArea/>
      </div>

      {/* 在庫エリア */}
      <div className={styles.stock}>
        <StockAreas
          devices={deviceList}
          startDrag={startDrag}
          handleMouseMove={handleMouseMove}
          deleteDevice={deleteDevice}
          draggingDevice={draggingDevice}
        />
      </div>      

      {/* ボタンパネル */}
      <div className={styles.button}>
        <ButtonPanel addDevice={addDevice}/>
      </div>

            {/* drag layer */}
      <div className={styles.dragLayer}>
        <DragLayer
          draggingDevice={draggingDevice}
          mousePos={mousePos}
        />
      </div>

    </div>
  )
}