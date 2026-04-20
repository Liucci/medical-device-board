"use client"

import { Device } from "../types/deviceTypes"
import type { Room } from "../types/wards"
import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
//page.tsxからdeviceとroomsをpropsで受け取る
type Props = {
  isOpen: boolean
  device: Device | null
  deviceTypes: any[]
  deviceModels: any[]
  onSubmit: (data: {
    id: number
    managementNumber: string
    serialNumber: string
    note: string
    patientName:string
    roomId: number 
  }) => void
  onCancel: () => void
  rooms: any[]
}

export default function RoomDeviceInfoModal({
  isOpen,
  device,
  deviceTypes,
  deviceModels,
  onSubmit,
  onCancel,
  rooms
}: Props) {
  const [managementNumber, setManagementNumber] = useState("")
  const [serialNumber, setSerialNumber] = useState("")
  const [note, setNote] = useState("")
  const [patientName, setPatientName] = useState("")

  useEffect(() => {
    if (!isOpen || !device) return

    setManagementNumber(device.managementNumber ?? "")
    setSerialNumber(device.serialNumber ?? "")
    setNote(device.note ?? "")

    const room = rooms.find(r => r.id === device.roomId)
    setPatientName(room?.patientName ?? "")
  }, [device, isOpen, rooms]) 

  if (!isOpen || !device) return null

  const typeName =
    deviceTypes.find(t => t.id === device.type)?.name ?? "不明"

  const modelName =
    deviceModels.find(m => m.id === device.model)?.name ?? "不明"
  const roomName =
    rooms.find(r => r.id === device.roomId)?.name ?? "不明"
  //roomのidから患者名を取得する
  console.log("device.roomId", device.roomId)
  console.log("rooms", rooms)
  console.log("patientName", patientName)

  return createPortal(
  <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
    <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-8">

      <h2 className="text-2xl font-bold mb-6 text-center">
        病棟機器情報（room）
      </h2>

      {/* 🔽 参照情報 */}
      <div className="mb-4">
        <div className="text-sm text-gray-500">機種名</div>
        <div className="font-bold">{typeName}</div>
      </div>

      <div className="mb-4">
        <div className="text-sm text-gray-500">型式</div>
        <div className="font-bold">{modelName}</div>
      </div>

      <div className="mb-4">
        <div className="text-sm text-gray-500">病室</div>
        <div className="font-bold">{roomName}</div>
      </div>

      <div className="mb-4">
        <div className="text-sm text-gray-500">状態</div>
        <div className="font-bold">{device.status}</div>
      </div>

      <div className="mb-4">
        <div className="text-sm text-gray-500">患者</div>
        <input
          className="border p-2 w-full"
          value={patientName}
          onChange={(e) => setPatientName(e.target.value)}
        />
      </div>

      {/* 🔽 入力 */}
      <div className="mb-4">
        <div className="text-sm text-gray-500">管理番号</div>
        <input
          className="border p-2 w-full"
          value={managementNumber}
          onChange={(e) => setManagementNumber(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <div className="text-sm text-gray-500">シリアル</div>
        <input
          className="border p-2 w-full"
          value={serialNumber}
          onChange={(e) => setSerialNumber(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <div className="text-sm text-gray-500">備考</div>
        <textarea
          className="border p-2 w-full"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </div>

      {/* 🔽 ボタン */}
      <div className="flex justify-end gap-2">
        <button onClick={onCancel}>キャンセル</button>

        <button
          onClick={() =>
            onSubmit({
              id: device.id,
              managementNumber,
              serialNumber,
              note,
              patientName,
              //device内にroomIdは必ず存在する意味の「!」
              roomId: device.roomId!
            })
          }
          className="bg-blue-500 text-white px-3 py-1 rounded"
        >
          保存
        </button>
      </div>

    </div>
  </div>,
  document.body
)}

// 簡易スタイル
const overlayStyle: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center"
}

const modalStyle: React.CSSProperties = {
  background: "#fff",
  padding: 20,
  borderRadius: 8,
  width: 300
}