"use client"
import { useState } from "react"

import { Device } from "../../types/deviceTypes"
import { StockAreaType } from "../../types/stockTypes"
import { DeviceTypeType } from "../../types/deviceTypeTypes"
import { DeviceModelType } from "../../types/deviceModelTypes"
import { WardType } from "../../types/wardTypes"
import {CurrentUser  } from "../../types/userTypes"
import { RoomType } from "../../types/roomTypes"
import {MaintenanceType } from "../../types/maintenanceTypeTypes"
import {MaintenanceTask } from "../../types/taskTypes"
import { createPortal } from "react-dom"
import {UpdateMaintenanceTaskDueAt,CancelMaintenanceTask,CompleteMaintenanceTask } from "../../types/taskTypes"
import { executeWithLoading } from "../common/executeWithLoading"
import {LoadingOverlay} from "../common/LoadingOverlay"


//page.tsxから
//stateレス化
type Props = {
  isOpen: boolean
  selectedRoomDevice: Device | null
  deviceTypes: DeviceTypeType[]
  deviceModels: DeviceModelType[]
  onCancel: () => void
  wards:WardType[]
  rooms: RoomType[]
  tasks: MaintenanceTask[]                 // ← 追加
  maintenanceTypes: MaintenanceType[]
  onCompleteTask: (task: CompleteMaintenanceTask) => Promise<boolean>
  renameManagementNumber:(id: number, value: string)=> Promise<boolean>
  renameSerialNumber:(id: number, value: string)=> Promise<boolean>
  renameNote:(id: number, value: string)=> Promise<boolean>
  renamePatientName:(roomId: number, value: string)=> Promise<boolean>
  toggleDeviceStandby:(
                        deviceId: number,
                        standby: boolean,
                      )=> Promise<boolean>
  renameRentalDates : (
                        deviceId: number,
                        rentalStartDate: string,
                        rentalEndDate: string
                      )=>Promise<boolean>
  renameMaintenanceTaskDueAt: (
                                task: UpdateMaintenanceTaskDueAt
                              ) => Promise<boolean>

cancelTask: (
              task: CancelMaintenanceTask
            ) => Promise<boolean>
}

export default function RoomDeviceInfoModal({
  isOpen,
  selectedRoomDevice,
  deviceTypes,
  deviceModels,
  onCancel,
  wards,
  rooms,
  tasks,
  maintenanceTypes,
  onCompleteTask,
  renameManagementNumber,
  renameSerialNumber,
  renameNote,
  renamePatientName,
  toggleDeviceStandby,
  renameRentalDates,
  renameMaintenanceTaskDueAt,
  cancelTask,
}: Props) {
const [loading, setLoading] = useState(false)


if (!isOpen || !selectedRoomDevice) return null

// ===== selectedRoomDeviceから直接取得 =====

const managementNumber =
  selectedRoomDevice.managementNumber ?? ""

const serialNumber =
  selectedRoomDevice.serialNumber ?? ""

const note =
  selectedRoomDevice.note ?? ""

const rentalStartDate =
  selectedRoomDevice.rentalStartDate || ""

const rentalEndDate =
  selectedRoomDevice.rentalEndDate || ""

const standby =
  selectedRoomDevice.standby ?? false

const standbyStartedAt =
  selectedRoomDevice.standbyStartedAt || ""

const standbyFinishedAt =
  selectedRoomDevice.standbyFinishedAt || ""

// ===== room =====

const room = rooms.find(
  r => r.id === selectedRoomDevice.roomId
)

const patientName =
  room?.patientName ?? ""

// ===== 名前 =====

const typeName =
  deviceTypes.find(
    t => t.id === selectedRoomDevice.type
  )?.name ?? "不明"

const modelName =
  deviceModels.find(
    m => m.id === selectedRoomDevice.model
  )?.name ?? "不明"

const roomName =
  room?.name ?? "不明"

const wardName =
  wards.find(
    w => w.id === room?.wardId
  )?.name ?? "不明" 
  
  
const deviceTasks =
  tasks.filter(
    task => task.deviceId === selectedRoomDevice.id
  )




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
  //スタンバイ開始解除の関数
  const handleToggleStandby = async () => {

    const deviceId = selectedRoomDevice.id
    if (!deviceId) return
    await executeWithLoading({
        setLoading,
        action: async () => {

    // ===== 解除 ====
    if (standby) {
      const success =
        await toggleDeviceStandby(
          deviceId,
          false
        )
      if (!success) return

      return
    }

    // ===== 開始 =====

    const success =
      await toggleDeviceStandby(
        deviceId,
        true
      )

    if (!success) return
    }
    })
  }  

return createPortal(
  <>
  <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">

    <div className="relative
                     bg-white 
                    rounded-xl 
                    shadow-xl 
                    w-full
                     max-w-5xl 
                     max-w-[850px] 
                     h-[70vh] 
                     flex 
                     flex-col p-6">

      <button
        onClick={onCancel}
        className="
          absolute
          top-4
          left-4
          text-gray-500
          hover:text-black
          text-xl
          font-bold
        "
      >
        ✕
      </button>

      <h2 className="text-xl font-bold text-center">
        病棟機器情報
      </h2>

      <div className="flex gap-4 mt-4 flex-1 overflow-hidden">

        {/* ===== 左 ===== */}
        <div className="w-[420px] overflow-y-auto">

          {/* 機種 + 型式 */}
          <div>
            <div className="text-lg font-bold">
              {typeName}　{modelName}　{selectedRoomDevice.assetType}

              {(selectedRoomDevice.assetType === "レンタル" ||
                selectedRoomDevice.assetType === "代替機") &&
                rentalEndDate && (() => {

                  const today = new Date()
                  const end = new Date(rentalEndDate)

                  today.setHours(0,0,0,0)
                  end.setHours(0,0,0,0)

                  const diff =
                    end.getTime() - today.getTime()

                  const days =
                    Math.ceil(diff / (1000 * 60 * 60 * 24))

                  if (days < 0) {
                    return (
                      <span className="ml-3 text-sm text-red-600 font-bold">
                        返却日超過
                      </span>
                    )
                  }

                  if (days === 0) {
                    return (
                      <span className="ml-3 text-sm text-red-600 font-bold">
                        本日返却
                      </span>
                    )
                  }

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

          {/* 詳細情報 */}
          <div className="border-t pt-2 mt-3 space-y-1">

            <InfoRow
              label="患者"
              value={patientName}
              onEdit={async () => {
                const roomId = selectedRoomDevice.roomId
                if (!roomId) return

                const val = prompt(
                  "患者名を入力",
                  patientName
                )

                if (val === null) return
                await executeWithLoading({
                    setLoading,
                    action: async () => {
      
                  const success =
                          await renamePatientName(
                            roomId,
                            val
                          )

                if (!success) return

                }
                })

                
              }}
            />

            <InfoRow
              label="管理番号"
              value={managementNumber}
              onEdit={async () => {
                const deviceId = selectedRoomDevice.id

                if (!deviceId) return

                const val = prompt(
                  "管理番号を入力",
                  managementNumber
                )

                if (val === null) return
                await executeWithLoading({
                    setLoading,
                    action: async () => {

                      const success =
                        await renameManagementNumber(
                          deviceId,
                          val
                        )
                    if (!success) return
                    }
                })

              }}
            />

            <InfoRow
              label="シリアル"
              value={serialNumber}
              onEdit={async () => {
                const deviceId = selectedRoomDevice.id
                if (!deviceId) return

                const val = prompt(
                  "シリアル番号を入力",
                  serialNumber
                )

                if (val === null) return
                await executeWithLoading({
                    setLoading,
                    action: async () => {

                    const success =
                      await renameSerialNumber(
                        deviceId,
                        val
                      )

                if (!success) return

                }
                })


              }}
            />

            {(selectedRoomDevice.assetType === "レンタル" ||
              selectedRoomDevice.assetType === "代替機") && (
              <>
                <InfoRow
                  label="貸与開始日"
                  value={rentalStartDate}
                  onEdit={async () => {

                    const deviceId=selectedRoomDevice.id
                    if (!deviceId) return

                    const val = prompt(
                      "貸与開始日を入力 (YYYY-MM-DD)",
                      rentalStartDate
                    )

                    if (val === null) return
                    await executeWithLoading({
                        setLoading,
                        action: async () => {

                        const success =
                              await renameRentalDates(
                                deviceId,
                                val,
                                rentalEndDate
                              )

                        if (!success) return
                        }
                    })

                  }}
                />

                <InfoRow
                  label="返却日"
                  value={rentalEndDate}
                  onEdit={async () => {

                    const deviceId=selectedRoomDevice.id
                    if (!deviceId) return

                    const val = prompt(
                      "返却日を入力 (YYYY-MM-DD)",
                      rentalEndDate
                    )

                    if (val === null) return
                    await executeWithLoading({
                        setLoading,
                        action: async () => {
          
                        const success =
                              await renameRentalDates(
                                deviceId,
                                rentalStartDate,
                                val
                              )

                        if (!success) return
                    }
                    })
                  }}
                />
              </>
            )}

            <InfoRow
              label="備考"
              value={note}
              onEdit={async () => {
                const deviceId=selectedRoomDevice.id
                if (!deviceId) return

                const val = prompt(
                  "備考を入力",
                  note
                )

                if (val === null) return
                await executeWithLoading({
                    setLoading,
                    action: async () => {

                    const success =
                            await renameNote(
                              deviceId,
                              val
                            )
                    if (!success) return
                  }
                })

              }}
            />

          </div>

        </div>

        {/* ===== 右 ===== */}
        <div className="w-[380px] flex flex-col overflow-hidden">

          {/* スタンバイ */}
          <div className="border rounded p-3">

              <div className="flex items-center justify-between mb-2">

                <div className="font-bold">
                  スタンバイ
                </div>

                <button
                  onClick={handleToggleStandby}
                  className={`
                    px-3
                    py-1
                    rounded
                    text-sm
                    font-bold
                    ${
                      standby
                        ? "bg-yellow-300 text-black hover:bg-yellow-400"
                        : "bg-gray-200 text-black hover:bg-gray-300"
                    }
                  `}
                >
                  {standby ? "解除" : "開始"}
                </button>

              </div>
            {standby ? (
              <div className="text-sm text-gray-600">
                待機開始日：
                {standbyStartedAt || "未設定"}
              </div>
            ) : (
              <div className="text-sm text-gray-500">
                スタンバイなし
              </div>
            )}

            {isStandbyOverOneMonth && (
              <div className="mt-2 rounded border border-red-300 bg-red-50 p-2 text-sm font-bold text-red-700">
                スタンバイ開始から1か月経過しています。
              </div>
            )}

          </div>

          {/* メンテナンス */}
          <div className="border rounded p-3 mt-4 flex-1 flex flex-col overflow-hidden">

            <div className="font-bold mb-2">
              メンテナンス
            </div>

            <div className="flex-1 overflow-y-auto pr-2">

              {deviceTasks.length === 0 && (
                <div className="text-gray-500 text-sm">
                  タスクなし
                </div>
              )}

              {deviceTasks.map(task => {

                const type =
                  maintenanceTypes.find(
                    t => t.id === task.maintenanceTypeId
                  )

                const status =
                  getStatus(task.dueAt)

                const isCompleted =
                  task.completedAt !== null &&
                  task.completedAt !== undefined

                const isCancelled =
                  !task.isActive

                const isPending =
                  task.isActive && !isCompleted



                return (
                  <div
                    key={task.id}
                    className="flex justify-between items-center py-2 border-b"
                  >

                    <div>
                      <div className="font-medium">
                        {type?.name}
                      </div>

                      <div className="text-sm text-gray-500">
                        {status.label}
                      </div>

                      <div className="text-xs text-gray-400">
                        期限：
                        {new Date(
                          task.dueAt
                        ).toLocaleDateString()}
                      </div>
                    </div>

                  <div className="flex items-center gap-2">

                    {isPending && (
                      <>
                        <span>
                          {status.color === "red" && "🔴"}
                          {status.color === "yellow" && "🟡"}
                          {status.color === "green" && "🟢"}
                        </span>

                        <button
                          className="bg-blue-500 text-white px-2 py-1 rounded text-sm"
                          onClick={async () => {
                            await executeWithLoading({
                                setLoading,
                                action: async () => {
                                  const success =
                                    await onCompleteTask({
                                      id: task.id
                                    })

                                  if (!success) return

                                }
                              })
                          }}
                        >
                          実施
                        </button>

                        <button
                          className="bg-yellow-500 text-white px-2 py-1 rounded text-sm"
                          onClick={async () => {

                            const val = prompt(
                              "メンテ期限を入力 (YYYY-MM-DD)",
                              task.dueAt.slice(0, 10)
                            )

                            if (val === null) return

                            if (!/^\d{4}-\d{2}-\d{2}$/.test(val)) {
                              alert("YYYY-MM-DD形式で入力してください")
                              return
                            }
                            await executeWithLoading({
                                setLoading,
                                action: async () => {
                                const success =
                                      await renameMaintenanceTaskDueAt({
                                        id: task.id,
                                        dueAt: `${val}T00:00:00`
                                      })
                                if (!success) return

                                }
                              })
                          }}
                        >
                          修正
                        </button>

                        <button
                          className="bg-red-500 text-white px-2 py-1 rounded text-sm"
                          onClick={async () => {

                            const ok = confirm(
                              "このメンテナンスタスクを中止しますか？"
                            )

                            if (!ok) return
                            await executeWithLoading({
                                setLoading,
                                action: async () => {
                                const success =
                                      await cancelTask({
                                        id: task.id,
                                        isActive: false
                                      })
                                if (!success) return
                                }
                              })
                          }}
                        >
                          中止
                        </button>
                      </>
                    )}

                    {isCompleted && (
                      <div className="text-green-600 font-bold text-sm">
                        実施済み
                      </div>
                    )}

                    {isCancelled && (
                      <button
                        className="bg-gray-500 text-white px-2 py-1 rounded text-sm"
                        onClick={async () => {

                          const ok = confirm(
                            "中止を解除しますか？"
                          )

                          if (!ok) return
                          await executeWithLoading({
                              setLoading,
                              action: async () => {
                              const success =
                                    await cancelTask({
                                      id: task.id,
                                      isActive: true
                                    })
                              if (!success) return
                              }
                        })
                        }}
                      >
                        中止解除
                      </button>
                    )}

                  </div>
                  </div>
                )
              })}

            </div>

          </div>

        </div>

      </div>


    </div>

  </div>
      <LoadingOverlay loading={loading} />
  </>

  
  ,
  document.body
)}
