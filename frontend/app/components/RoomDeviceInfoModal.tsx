"use client"

import { Device, deviceModels, deviceTypes } from "../types/deviceTypes"
import {wards,rooms} from "../types/wards"

import { useState, useEffect } from "react"
import { createPortal } from "react-dom"

type Props = {
  isOpen: boolean
  device: Device | null
  onSubmit: (data: {
    id: number
    managementNumber: string
    serialNumber: string
    note: string
  }) => void
  onCancel: () => void
}

export default function RoomDeviceInfoModal({
  isOpen,
  device,
  onSubmit,
  onCancel
}: Props) {
  const [managementNumber, setManagementNumber] = useState("")
  const [serialNumber, setSerialNumber] = useState("")
  const [note, setNote] = useState("")

  // deviceが変わったら初期化
  useEffect(() => {
    if (device) {
      setManagementNumber("")
      setSerialNumber("")
      setNote("")
    }
  }, [device])
  //console.log("RoomDeviceinfoModalのdevice", device)
  if (!isOpen || !device) return null

  const typeName =
    deviceTypes.find(t => t.typeID === device.type)?.name ?? "不明"

  const modelName =
    deviceModels.find(m => m.modelID === device.model)?.name ?? "不明"
  const roomName =
    rooms.find(r => r.id === device.roomId)?.roomName ?? "不明"
  const patientName =
  rooms.find(r => r.id === device.roomId)?.patientName ?? ""
    return createPortal(
  <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
    <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-8">

      <h2 className="text-2xl font-bold mb-6 text-center">
        機器情報（Stock）
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
        <div className="font-bold">{patientName}</div>
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
              note
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