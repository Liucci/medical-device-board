"use client"

import { Device } from "../../types/deviceTypes"
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
    rentalStartDate?: string
    rentalEndDate?: string
    standby: boolean
    standbyStartedAt?: string
    standbyFinishedAt?: string

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
  const [rentalStartDate, setRentalStartDate] = useState("")
  const [rentalEndDate, setRentalEndDate] = useState("")
  const [standby, setStandby] = useState(false)
  const [standbyStartedAt, setStandbyStartedAt] = useState("")
  const [standbyFinishedAt, setStandbyFinishedAt] = useState("")

  useEffect(() => {
    if (!isOpen || !device) return

    setManagementNumber(device.managementNumber ?? "")
    setSerialNumber(device.serialNumber ?? "")
    setNote(device.note ?? "")
    setRentalStartDate(device.rentalStartDate || "")
    setRentalEndDate(device.rentalEndDate || "")
    setStandby(device.standby ?? false)
    setStandbyStartedAt(device.standbyStartedAt || "")
    setStandbyFinishedAt(device.standbyFinishedAt || "")


    const room = rooms.find(r => r.id === device.roomId)
    setPatientName(room?.patientName ?? "")
  }, [device, isOpen, rooms])

  if (!isOpen || !device) return null

  const typeName =
    deviceTypes.find(t => t.id === device.type)?.name ?? "不明"

  const modelName =
    deviceModels.find(m => m.id === device.model)?.name ?? "不明"

  const room = rooms.find(r => r.id === device.roomId)
  const roomName = room?.roomName ?? "不明"
  const wardName =
    wards.find(w => w.wardId === room?.wardId)?.wardName ?? "不明"
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
  const isStandbyOverOneMonth = (() => {
    if (!standby || !standbyStartedAt) return false

    const start = new Date(standbyStartedAt)
    const limit = new Date(start)
    limit.setMonth(limit.getMonth() + 1)

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    limit.setHours(0, 0, 0, 0)

    return today >= limit
  })()
  const handleToggleStandby = () => {
    const today = new Date().toISOString().split("T")[0]

    if (standby) {
      setStandby(false)
      setStandbyFinishedAt(today)
      return
    }

    setStandby(true)
    setStandbyStartedAt(standbyStartedAt || today)
    setStandbyFinishedAt("")
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
            {typeName}　{modelName}　{device.assetType}

            {(device.assetType === "レンタル" ||
              device.assetType === "代替機") &&
              rentalEndDate && (() => {

                const today = new Date()

                const end = new Date(rentalEndDate)

                // 時刻ズレ防止
                today.setHours(0,0,0,0)
                end.setHours(0,0,0,0)

                const diff =
                  end.getTime() - today.getTime()

                const days =
                  Math.ceil(diff / (1000 * 60 * 60 * 24))

                // 超過
                if (days < 0) {
                  return (
                    <span className="ml-3 text-sm text-red-600 font-bold">
                      返却日超過
                    </span>
                  )
                }

                // 当日
                if (days === 0) {
                  return (
                    <span className="ml-3 text-sm text-red-600 font-bold">
                      本日返却
                    </span>
                  )
                }

                // 2日前以内
                if (days <= 2) {
                  return (
                    <span className="ml-3 text-sm text-red-600 font-bold">
                      返却まで{days}日
                    </span>
                  )
                }

                return null

              })()}
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
          {/* 管理番号 */}
          <InfoRow
            label="管理番号"
            value={managementNumber}
            onEdit={() => {
              const val = prompt("管理番号を入力", managementNumber)
              if (val !== null) setManagementNumber(val)
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
            {(device.assetType === "レンタル" ||
              device.assetType === "代替機") && (
              <>
                {/* 貸与開始日 */}
                <InfoRow
                  label="貸与開始日"
                  value={rentalStartDate}
                  onEdit={() => {
                    const val = prompt(
                      "貸与開始日を入力 (YYYY-MM-DD)",
                      rentalStartDate
                    )

                    if (val !== null) {
                      setRentalStartDate(val)
                    }
                  }}
                />
                {/* 返却日 */}
                <InfoRow
                  label="返却日"
                  value={rentalEndDate}
                  onEdit={() => {
                    const val = prompt(
                      "返却日を入力 (YYYY-MM-DD)",
                      rentalEndDate
                    )

                    if (val !== null) {
                      setRentalEndDate(val)
                    }
                  }}
                />
              </>
              
            )}
          {false && standby && (
            <div>
              <label>待機開始日</label>
              <input
                type="date"
                value={standbyStartedAt}
                onChange={e => setStandbyStartedAt(e.target.value)}
              />
            </div>
          )}
          {false && isStandbyOverOneMonth && (
            <div className="rounded border border-red-300 bg-red-50 p-2 text-sm font-bold text-red-700">
              スタンバイ開始から1か月経過しています。返却を検討してください。
            </div>
          )}

          

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
          <div className="border-t pt-4 mt-2 space-y-3">

            {standby && (
              <>
                <div>
                  <div className="font-bold">スタンバイ</div>

                  <div className="text-xs text-gray-500">
                    使用待機中の機器として管理します
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    待機開始日
                  </label>

                  <input
                    type="date"
                    value={standbyStartedAt}
                    onChange={e => setStandbyStartedAt(e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2 w-full"
                  />
                </div>
              </>
            )}

            {isStandbyOverOneMonth && (
              <div className="rounded border border-red-300 bg-red-50 p-2 text-sm font-bold text-red-700">
                スタンバイ開始から1か月経過しています。返却を検討してください。
              </div>
            )}
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

          <button onClick={onCancel}>
            キャンセル
          </button>

          <button
            onClick={handleToggleStandby}
            className={`
              px-3 py-1 rounded text-sm font-bold
              ${
                standby
                  ? "bg-yellow-300 text-black hover:bg-yellow-400"
                  : "bg-gray-200 text-black hover:bg-gray-300"
              }
            `}
          >
            {standby ? "スタンバイ解除" : "スタンバイ"}
          </button>

          <button
            onClick={() => {
              if (!device.id || !device.roomId) return

              onSubmit({
                id: device.id,
                managementNumber,
                serialNumber,
                note,
                patientName,
                roomId: device.roomId,
                rentalStartDate:rentalStartDate|| undefined,
                rentalEndDate:rentalEndDate|| undefined,
                standby,
                standbyStartedAt: standbyStartedAt || undefined,
                standbyFinishedAt: standbyFinishedAt || undefined
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
