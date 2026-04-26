"use client"

import { Device } from "../types/deviceTypes"
import { useState, useEffect } from "react"
import { createPortal } from "react-dom"

//
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
    patientName: string
    roomId: number
  }) => void
  onCancel: () => void
  wards: any[]
  rooms: any[]
  tasks: any[]                 // ← 追加
  maintenanceTypes: any[]      // ← 追加
  onCompleteTask: (taskId: number) => void  // ← 追加
}

export default function RoomDeviceInfoModal({
  isOpen,
  device,
  deviceTypes,
  deviceModels,
  onSubmit,
  onCancel,
  wards,
  rooms,
  tasks,
  maintenanceTypes,
  onCompleteTask
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

  const room = rooms.find(r => r.id === device.roomId)
  const roomName = room?.name ?? "不明"
  const wardName =
    wards.find(w => w.id === room?.ward_id)?.name ?? "不明"
  // 🔽 共通表示行
  const InfoRow = ({
                    label,
                    value,
                    onEdit
                    }: {
                          label: string
                          value: string
                          onEdit: () => void
                        }) => (
                                <div className="flex items-center justify-between py-2">
                                  <div>
                                    <span className="text-sm text-gray-500">{label}：</span>
                                    <span className="ml-2 font-medium">
                                      {value || "情報なし"}
                                    </span>
                                  </div>

                                  <button
                                    onClick={onEdit}
                                    className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                                  >
                                    ✏
                                  </button>
                                </div>
                          )
  // 🔽 期限表示関数
  const getStatus = (due_at: string) => {
    const now = new Date()
    const diff = new Date(due_at).getTime() - now.getTime()
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24))

    if (days < 0) return { label: `期限切れ（${Math.abs(days)}日）`, color: "red" }
    if (days <= 2) return { label: `残り${days}日`, color: "yellow" }
    return { label: `残り${days}日`, color: "green" }
  }
                          
  return createPortal(
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 space-y-4">

        {/* 🔽 タイトル */}
        <h2 className="text-xl font-bold text-center">
          病棟機器情報
        </h2>

        {/* 🔽 機種 + 型式 */}
        <div>
          <div className="text-lg font-bold">
            {typeName}　{modelName}
          </div>

          <div className="text-gray-600">
            {wardName}　{roomName}
          </div>
        </div>

        {/* 🔽 情報 */}
        <div className="border-t pt-2 space-y-1">

          {/* 患者 */}
          <InfoRow
            label="患者"
            value={patientName}
            onEdit={() => {
              const val = prompt("患者名を入力", patientName)
              if (val !== null) setPatientName(val)
            }}
          />

          {/* シリアル */}
          <InfoRow
            label="シリアル"
            value={serialNumber}
            onEdit={() => {
              const val = prompt("シリアル番号を入力", serialNumber)
              if (val !== null) setSerialNumber(val)
            }}
          />

          {/* 備考 */}
          <InfoRow
            label="備考"
            value={note}
            onEdit={() => {
              const val = prompt("備考を入力", note)
              if (val !== null) setNote(val)
            }}
          />
        </div>
            {/* 🔽 メンテナンス */}
          <div className="border-t pt-4 mt-2">
            <div className="font-bold mb-2">メンテナンス</div>

            {tasks.length === 0 && (
              <div className="text-gray-500 text-sm">タスクなし</div>
            )}

            {tasks.map(task => {
              const type = maintenanceTypes.find(t => t.id === task.maintenance_type_id)
              const status = getStatus(task.due_at)

              return (
                <div
                  key={task.id}
                  className="flex justify-between items-center py-2 border-b"
                >
                  <div>
                    <div className="font-medium">{type?.name}</div>
                    <div className="text-sm text-gray-500">
                      {status.label}
                    </div>
                    <div className="text-xs text-gray-400">
                      期限：{new Date(task.due_at).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span>
                      {status.color === "red" && "🔴"}
                      {status.color === "yellow" && "🟡"}
                      {status.color === "green" && "🟢"}
                    </span>

                    <button
                      onClick={() => onCompleteTask(task.id)}
                      className="bg-blue-500 text-white px-2 py-1 rounded text-sm"
                    >
                      実施
                    </button>
                  </div>
                </div>
              )
            })}
          </div>


        {/* 🔽 ボタン */}
        <div className="flex justify-end gap-2 pt-4 border-t">
          <button onClick={onCancel}>キャンセル</button>

          <button
            onClick={() => {
              if (!device.id || !device.roomId) return

              onSubmit({
                id: device.id,
                managementNumber,
                serialNumber,
                note,
                patientName,
                roomId: device.roomId
              })
            }}
            className="bg-blue-500 text-white px-3 py-1 rounded"
          >
            保存
          </button>
        </div>

      </div>
    </div>,
    document.body
  )
}
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