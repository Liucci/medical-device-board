"use client"

import { useState, useRef, useEffect } from "react"
import WardList from "./components/WardList"
import Stock from "./components/Stock"
import DeviceModal from "./components/DeviceModal"
import RoomAssignModal from "./components/RoomAssignModal"
import { Device, deviceModels, deviceTypes } from "./types/deviceTypes"
import { rooms as roomsMaster } from "./types/wards"

export default function Home() {
  const wardRefs = useRef<{ [key: number]: HTMLDivElement | null }>({})
  const stockRef = useRef<HTMLDivElement | null>(null)

  const [devices, setDevices] = useState<Device[]>([])
  const [draggingId, setDraggingId] = useState<number | null>(null)
  const [draggingRoomDevice, setDraggingRoomDevice] = useState<Device | null>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [pendingDrop, setPendingDrop] = useState<{ device: Device; wardId: number } | null>(null)

  const [openDeviceModal, setOpenDeviceModal] = useState(false)
  const [openAssignModal, setOpenAssignModal] = useState(false)
  const [menu, setMenu] = useState<{ x: number; y: number; deviceId: number } | null>(null)

  // -------------------------
  // Device 操作
  // -------------------------

  // DeviceModalから新しい機器をストックに追加
  //新規登録された機器のみを追加するため、addDevice関数を作成
  const addDevice = (device:Device) =>
    setDevices((prev) => [...prev, { ...device}])

  const deleteDevice = (id: number) => setDevices((prev) => prev.filter((d) => d.id !== id))
  const deleteRoomDevice = (id: number) => setDevices((prev) => prev.filter((d) => d.id !== id))
  // ドラッグ開始時の処理
  const startDrag = (e: React.MouseEvent, device: Device, isRoomDevice = false) => {
    if (isRoomDevice) setDraggingRoomDevice(device)
    else setDraggingId(device.id)
    setDragOffset({ x: e.clientX - (device.x || 0), y: e.clientY - (device.y || 0) })
  }
  // ドラッグ中の処理
  const handleMouseMove = (e: React.MouseEvent) => {
    if (draggingId !== null)
      setDevices((prev) =>
        prev.map((d) =>
          d.id === draggingId ? { ...d, x: e.clientX - dragOffset.x, y: e.clientY - dragOffset.y } : d
        )
      )

    if (draggingRoomDevice)
      setDevices((prev) =>
        prev.map((d) =>
          d.id === draggingRoomDevice.id ? { ...d, x: e.clientX - dragOffset.x, y: e.clientY - dragOffset.y } : d
        )
      )
  }

  const moveRoomDeviceToStock = (device: Device) => {
    setDevices((prev) => [...prev.filter((d) => d.id !== device.id), { ...device, x: 120, y: 120 }])
    setDraggingRoomDevice(null)
  }

  const handleCreateRoomDevice = (roomNumber: string, patientName: string) => {
    console.log("関数呼ばれた")
    if (!pendingDrop) return
    const newDevice = {
      id: Date.now(),
      type: pendingDrop.device.type,
      model: pendingDrop.device.model,
      assetType: pendingDrop.device.assetType,
      // 新しい病室に配置された機器のstatusを"room"に設定
      status: "room" as const,
      wardId: pendingDrop.wardId,
      roomNumber,
      patientName,
      device: pendingDrop.device,
      x: 10,
      y: 10,
    }
    console.log("配置された機器:", newDevice)

    setPendingDrop(null)
    setOpenAssignModal(false)
  }

  // -------------------------
  // ドロップ判定
  // -------------------------
  useEffect(() => {
    const handleMouseUp = (e: MouseEvent) => {
      if (!draggingId && !draggingRoomDevice) return
      // ドロップ位置の判定
      const mouseX = e.clientX
      const mouseY = e.clientY

      if (draggingRoomDevice && stockRef.current) {
        const rect = stockRef.current.getBoundingClientRect()
        if (mouseX >= rect.left && mouseX <= rect.right && mouseY >= rect.top && mouseY <= rect.bottom) {
          moveRoomDeviceToStock(draggingRoomDevice)
          return
        }
      }

      let hitWardId: number | null = null
      Object.entries(wardRefs.current).forEach(([id, el]) => {
        if (!el) return
        const rect = el.getBoundingClientRect()
        if (mouseX >= rect.left && mouseX <= rect.right && mouseY >= rect.top && mouseY <= rect.bottom) {
          hitWardId = Number(id)
        }
      })

      if (hitWardId !== null && draggingId !== null) {
        const device = devices.find((d) => d.id === draggingId)
        if (device) {
          setPendingDrop({ device, wardId: hitWardId })
          setOpenAssignModal(true)
        }
      }

      setDraggingId(null)
      setDraggingRoomDevice(null)
    }

    window.addEventListener("mouseup", handleMouseUp)
    return () => window.removeEventListener("mouseup", handleMouseUp)
  }, [draggingId, draggingRoomDevice, devices])

  return (
    <div className="flex h-screen" onMouseMove={handleMouseMove} onClick={() => setMenu(null)}>
      <WardList
        wardRefs={wardRefs}
        roomDevices={devices}
        startRoomDrag={(e, d) => startDrag(e, d, true)}
        deleteRoomDevice={deleteRoomDevice}
      />

      <div ref={stockRef} className="flex-1 p-4">
        <button
          onClick={() => setOpenDeviceModal(true)}
          className="mb-4 px-4 py-2 bg-green-500 text-white rounded"
        >
          機器登録
        </button>
        <Stock devices={devices.filter((d) => d.status === "stock")} startDrag={startDrag} deleteDevice={deleteDevice} />
      </div>

      {openDeviceModal && <DeviceModal onClose={() => setOpenDeviceModal(false)} onCreate={addDevice} />}
      {openAssignModal && pendingDrop && (
        <RoomAssignModal
          onClose={() => setOpenAssignModal(false)}
          onCreate={handleCreateRoomDevice}
          rooms={roomsMaster.filter((r) => r.wardId === pendingDrop.wardId).map((r) => r.name)}
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