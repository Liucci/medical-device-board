"use client"

import { useState, useRef, useEffect } from "react"
import WardList from "./components/WardList"
import RoomDeviceList from "./components/RoomDeviceList"
import Stock from "./components/Stock"
import DeviceModal from "./components/DeviceModal"
import RoomAssignModal from "./components/RoomAssignModal"
import { Device, deviceModels, deviceTypes } from "./types/deviceTypes"
import { rooms as roomsMaster } from "./types/wards"
import { getDevicePosition } from "./utils/deviceLayout"

export default function Home() {
  const wardRefs = useRef<{ [key: number]: HTMLDivElement | null }>({})
  const stockRef = useRef<HTMLDivElement | null>(null)

  const [deviceList, setDeviceList] = useState<Device[]>([])
  const [draggingDevice, setDraggingDevice] = useState<Device | null>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [pendingDrop, setPendingDrop] = useState(false)
  const [droppedDevice, setDroppedDevice] = useState<Device | null>(null)
  const [HitwardID, setHitWardID] = useState<number | null>(null)


  const [openDeviceModal, setOpenDeviceModal] = useState(false)
  const [openAssignModal, setOpenAssignModal] = useState(false)
  const [menu, setMenu] = useState<{ x: number; y: number; deviceId: number } | null>(null)

  // -------------------------
  // Device 操作
  // -------------------------

  // DeviceModalから新しい機器をストックに追加
  //新規登録された機器のみを追加するため、addDevice関数を作成
  const addDevice = (device:Device) =>
    {setDeviceList((prev) => [...prev, { ...device}])
    console.log("Added device:", device)
    }

  const deleteDevice = (id: number) => setDeviceList((prev) => prev.filter((d) => d.id !== id))
  const deleteRoomDevice = (id: number) => setDeviceList((prev) => prev.filter((d) => d.id !== id))
  
  // ドラッグ開始時の処理
  //ドラッグした機器をDragingDeviceにセットし、マウス位置と機器位置の差分をDragOffsetにセットする
  const startDrag = (e: React.MouseEvent, device: Device) => {
    setDraggingDevice(device)
    console.log("drag start", device)
    setDragOffset({ x: e.clientX - (device.x || 0), y: e.clientY - (device.y || 0) })
  }
  // ドラッグ中の処理
  const handleMouseMove = (e: React.MouseEvent) => {
    //draggingDeviceがnullの場合は何もしない
    if (!draggingDevice) return
    // ドラッグ中は機器の位置を更新する
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
  }

  // -------------------------
  // ドロップ判定
  // -------------------------
  //useEffect(() => {
  const handleMouseUp = (e: React.MouseEvent) => {

      if (!draggingDevice) return
    //dragingDeviceの座標を取得
      const mouseX =e.clientX
      const mouseY = e.clientY
      console.log("Mouse up at:", mouseX, mouseY)

      // ドロップ位置がどの病棟か判定
      let hitWardId: number | null = null
      //wardrefs.currentに格納された病棟のDOM要素をループして、病棟の座標を取得
      //マウス位置が病棟座標内にあれば、その病棟IDをhitWardIdにセット
      Object.entries(wardRefs.current).forEach(([id, el]) => {
        if (!el) return
        const rect = el.getBoundingClientRect()
        if (mouseX >= rect.left && mouseX <= rect.right && mouseY >= rect.top && mouseY <= rect.bottom) {
          hitWardId = Number(id)
          console.log("Hit ward ID:", hitWardId)
        }
      })
      //hitwardIDが存在すれば、assignModalを開く
      if (hitWardId !== null ) {
        if (hitWardId !== null) {
          setHitWardID(hitWardId)
          setPendingDrop(true)
          setOpenAssignModal(true)
        }} else {
        setDraggingDevice(null)
        } 
        //病棟にドロップした機器情報をdropedDeviceにセット
        //draggingDeviceをnullにしてドラッグ状態を終了
        setDroppedDevice(draggingDevice)
        console.log("Dropped device:", draggingDevice)
        setDraggingDevice(null) 
    }
    //マウスボタンを離したらhandlemouseupが呼ばれるように、windowにイベントリスナーを登録
/*     window.addEventListener("mouseup", handleMouseUp)
    return () => window.removeEventListener("mouseup", handleMouseUp)
  }, [draggingDevice, deviceList])
 */
  //AssignModalの情報をdevicesに反映させる関数
  const handleCreateRoomDevice = (roomNumber: string, patientName: string) => {

    console.log("draggingDevice:", draggingDevice)
    console.log("HitwardID:", HitwardID)

    if (pendingDrop === false) return

    setDeviceList(prev => {

      // 同じ病室の機器数を取得
      const sameRoomDevices = prev.filter(
        d => d.roomNumber === roomNumber && d.wardId === HitwardID
      )
      // 同じ病室に配置されている機器数が6台以上の場合は配置できないようにする
      const index = sameRoomDevices.length

      if (index >= 6) {
        alert("この病室には6台まで配置できます")
        return prev
      }

      const pos = getDevicePosition(index)

      const updated = prev.map(d => {

        if (d.id === droppedDevice?.id) {
          return {
            ...d,
            status: "room" as const,
            wardId: HitwardID,
            roomNumber,
            patientName,

            // 自動配置座標
            x: pos.x,
            y: pos.y
          }
        }

        return d
      })
      return updated
    })
    setPendingDrop(false)
    setOpenAssignModal(false)
  }

  return (
    <div className="flex h-screen"
     onMouseMove={handleMouseMove}
     onMouseUp={handleMouseUp}
     onClick={() => setMenu(null)}
     
     >
      <WardList
      //wardListに４つのpropsを渡す
        wardRefs={wardRefs}
        roomDevices={deviceList}
        startDrag={startDrag}
        deleteRoomDevice={deleteRoomDevice}
      />
      <div ref={stockRef} className="flex-1 p-4">
        <button
          onClick={() => setOpenDeviceModal(true)}
          className="mb-4 px-4 py-2 bg-green-500 text-white rounded"
        >
          機器登録
        </button>
        <Stock devices={deviceList.filter((d) => d.status === "stock")} startDrag={startDrag} deleteDevice={deleteDevice} />
      </div>

      {openDeviceModal && <DeviceModal onClose={() => setOpenDeviceModal(false)} onCreate={addDevice} />}
      {openAssignModal && pendingDrop && (
        <RoomAssignModal
        //RoomAssignModalのonCreateでhandleCreateRoomDeviceを呼び出す
          onClose={() => setOpenAssignModal(false)}
          onCreate={handleCreateRoomDevice}
          rooms={roomsMaster
            .filter((r) => r.wardId === HitwardID)
            .map((r) => r.name)}
        />
      )}
      {menu && (
        <div
          onClick={(e) => e.stopPropagation()}
          style={{ position: "fixed", top: menu.y, left: menu.x }}
          className="bg-white border shadow p-2 rounded"
        >
          <button
            onClick={(e) => {
              e.stopPropagation()
              deleteDevice(menu.deviceId)
            }}
            className="text-red-500"
          >
            削除
          </button>
        </div>
      )}
    </div>
  )
}