"use client"

import styles from "./page.module.css"
import StockAreas from "./components/StockArea"
import WardArea from "./components/WardArea"
import ButtonPanel from "./components/ButtonPanel"
import DragLayer from "./components/DragLayer"
import RoomModal from "./components/RoomModal"
import { Device,stockAreas} from "./types/deviceTypes"
import { rooms as initialRooms,Room} from "./types/wards"
import { useEffect, useState } from "react"

export default function Page() {

  const [deviceList, setDeviceList] = useState<Device[]>([])
  const [draggingDevice, setDraggingDevice] = useState<Device | null>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  //病室の情報を管理するstate,初期値はinitialRoomsから
  const [rooms, setRooms] = useState<Room[]>(initialRooms)  
  //roomModalを開くためのstate
  const [roomModalOpen, setRoomModalOpen] = useState(false)
  //どのデバイスをどの病棟に落としたかを保存するstate
  const [pendingDevice, setPendingDevice] = useState<Device | null>(null)
  const [targetWardId, setTargetWardId] = useState<number | null>(null)
//新規登録時stockAreaIDは1のCE室に固定。ドラッグで移動させる前提。
  const addDevice = (device: Device) => {
    setDeviceList((prev) => [...prev, { 
                                        ...device,
                                         x: 0,
                                         y: 0,
                                         stockAreaID: 1
                                        }])
    console.log("Added device:", device)
    console.log("x,y,stockAreaID:", device.x, device.y, device.stockAreaID)
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
      //draggingDeviceの状態が変わるたびにコンソールに出力する
      useEffect(() => {
        console.log("selected draggingDevice", draggingDevice)
      }, [draggingDevice])

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
  //dragLayerのマウス位置情報を更新するため、handleMouseMove内でsetMousePosを呼び出すように変更
  const handleMouseUp = (e: React.MouseEvent) => {
    const x = e.clientX
    const y = e.clientY

    console.log("drop position", x, y)

    setDraggingDevice(null)
  }


  

  const handleDropToStock = (device: Device, stockAreaId: number) => {
    setDeviceList(prev =>
      prev.map(d =>
        d.id === device.id
          ? {
              ...d,
              status: "stock",
              stockAreaID: stockAreaId,
              wardId: undefined,
              roomId: undefined
            }
          : d
      )
    )
  }
  const handleDropToWard = (device: Device, wardId: number) => {  
  
    setPendingDevice(device)
    setTargetWardId(wardId)
    setRoomModalOpen(true)
  }
  //roomModalで病室名と患者名を入力して確定ボタンを押したときの処理
  const handleRoomSubmit = (roomID: number, patientName: string) => {
    if (!pendingDevice) return

    // Deviceを選択されたRoomに更新する
    setDeviceList(prev =>
      prev.map(d =>
        d.id === pendingDevice.id
          ? {
              ...d,
              status: "room",
              roomId: roomID
            }
          : d
      )
    )

    // RoomにroomIDと患者名を格納する
    setRooms(prev =>
      prev.map(r =>
        r.id === roomID
          ? { ...r, patientName }
          : r
      )
    )

    setRoomModalOpen(false)
    setPendingDevice(null)
    setTargetWardId(null)
  } 
  
  
  
    // Device削除関数
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
        <WardArea
          devices={deviceList}
          startDrag={startDrag}
          deleteDevice={deleteDevice}
          draggingDevice={draggingDevice}
          pendingDevice={pendingDevice}
          onDrop={handleDropToWard} 
          rooms={rooms}
        />
      </div>
      {/* 病室モーダル表示 */}
      <RoomModal
        isOpen={roomModalOpen}
        onClose={() => setRoomModalOpen(false)}
        onSubmit={handleRoomSubmit}
        wardId={targetWardId}
        rooms={rooms}
        
      />

      {/* 在庫エリア */}
      <div className={styles.stock}>
        <StockAreas
          devices={deviceList}
          startDrag={startDrag}
          handleMouseMove={handleMouseMove}
          deleteDevice={deleteDevice}
          draggingDevice={draggingDevice}
          pendingDevice={pendingDevice}
          onDrop={handleDropToStock}
          
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