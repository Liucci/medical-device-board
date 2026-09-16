"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"

//user、認証
import {CurrentUser  } from "../../types/userTypes"

//type
import { StockAreaType } from "../../types/stockTypes"
import { DeviceTypeType } from "../../types/deviceTypeTypes"
import { DeviceModelType } from "../../types/deviceModelTypes"
import { WardType } from "../../types/wardTypes"
import { RoomType } from "../../types/roomTypes"
import {MaintenanceType } from "../../types/maintenanceTypeTypes"
import { InfectionTypeType } from "../../types/infectionTypeTypes"
import { RoomInfectionType } from "../../types/roomInfectionTypes"
import { HospitalSettingsType } from "../../types/hospitalSettingTypes"
import { TodayInspectionFrontType } from "../../types/inspectionTypes/inspectionTypes"
//表示データ
import { Device } from "../../types/deviceTypes"
import {MaintenanceTask } from "../../types/taskTypes"
import { createPortal } from "react-dom"
import { FaTrashAlt } from "react-icons/fa"
import {UpdateMaintenanceTaskDueAt,CancelMaintenanceTask,CompleteMaintenanceTask } from "../../types/taskTypes"

//icon
import { FaVirus } from "react-icons/fa"
//modal
import CommonModal from "../common/CommonModal"
import { executeWithLoading } from "../common/executeWithLoading"
import { executeWithErrorAndLoading } from "../../components/common/executeWithErrorAndLoading"
import {LoadingOverlay} from "../common/LoadingOverlay"
import InfectionSelectModal from "./InfectionSelectModal"

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
infectionTypes:InfectionTypeType[]
roomInfections:RoomInfectionType[]
setRoomInfections:React.Dispatch<React.SetStateAction<any[]>>
onDelete: (deviceId: number) => Promise<void>
hospitalSettings: HospitalSettingsType | null
todayInspections?: TodayInspectionFrontType[]
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
  infectionTypes,
  roomInfections,
  setRoomInfections,
  onDelete,
  hospitalSettings,
  todayInspections,
}: Props) {
const [loading, setLoading] = useState(false)
const [isInfectionModalOpen, setIsInfectionModalOpen] = useState(false)
const router = useRouter()

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

const deviceTodayInspections =
  todayInspections?.filter(
    inspection =>
      inspection.deviceId === selectedRoomDevice.id
  ) ?? []


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
    await executeWithErrorAndLoading({
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
  const handleDelete = async () => {
    if (!selectedRoomDevice?.id) return

    if (!confirm("この機器を削除しますか？")) return

    await executeWithErrorAndLoading({
        setLoading,
        action: async () => {
          await onDelete(selectedRoomDevice.id!)

    onCancel()
       }
  })
  }

  const handleInspection = () => {
    if (!selectedRoomDevice?.id) return

    const managementNumber = selectedRoomDevice.managementNumber?.trim() ?? ""
    const serialNumber = selectedRoomDevice.serialNumber?.trim() ?? ""

    if (!managementNumber && !serialNumber) {
      alert("管理番号またはシリアル番号を入力してください。")
      return
    }

    router.push(
      `/inspection-excution?deviceId=${selectedRoomDevice.id}`
    )
  }
  
  if (!isOpen || !selectedRoomDevice) return null



return (
  <>
    <CommonModal
      open={isOpen}
      onClose={onCancel}
      title="病棟機器情報"
      maxWidth="max-w-[1200px]"
      height="h-[70vh]"
      rightContent={
        <button
          onClick={handleDelete}
          className="rounded-lg bg-red-50 px-3 py-2 text-red-600 hover:bg-red-100"
        >
          <FaTrashAlt size={18} />
        </button>
      }
    >
      <div className="rounded-xl h-full w-full bg-gray-200 p-5">
        <div className="grid h-full min-h-0 grid-cols-1 gap-5 lg:grid-cols-2">

          {/* ===================================================== */}
          {/* 左：機器情報 */}
          {/* ===================================================== */}
          <div className="min-h-0 overflow-y-auto rounded-xl bg-white p-6 shadow-sm">

            <div className="space-y-5">

              {/* 機種 + 型式 */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {typeName}　{modelName}　{selectedRoomDevice.assetType}
                  {(selectedRoomDevice.assetType === "レンタル" ||
                    selectedRoomDevice.assetType === "代替機") &&
                    rentalEndDate &&
                    (() => {
                      const today = new Date()
                      const end = new Date(rentalEndDate)
                      today.setHours(0, 0, 0, 0)
                      end.setHours(0, 0, 0, 0)
                      const diff =
                        end.getTime() - today.getTime()
                      const days = Math.ceil(
                        diff / (1000 * 60 * 60 * 24)
                      )

                      if (days < 0) {
                        return (
                          <span className="ml-3 text-sm font-bold text-red-600">
                            返却日超過
                          </span>
                        )
                      }

                      if (days === 0) {
                        return (
                          <span className="ml-3 text-sm font-bold text-red-600">
                            本日返却
                          </span>
                        )
                      }

                      if (days <= 2) {
                        return (
                          <span className="ml-3 text-sm font-bold text-red-600">
                            返却まで{days}日
                          </span>
                        )
                      }

                      return null
                    })()}
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  {wardName}　{roomName}
                </p>
              </div>

              {/* 点検実施 */}
              <button
                type="button"
                onClick={handleInspection}
                className="
                  w-full
                  rounded-lg
                  bg-blue-500
                  px-4
                  py-2.5
                  text-sm
                  font-medium
                  text-white
                  shadow-sm
                  transition
                  hover:bg-blue-600
                  hover:shadow
                  active:scale-[0.99]
                "
              >
                点検実施
              </button>

              {/* 本日の点検 */}
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
                <div className="text-sm font-semibold text-gray-800">
                  本日の点検
                </div>

                {deviceTodayInspections.length === 0 ? (
                  <div className="mt-2 text-sm text-gray-400">
                    未実施
                  </div>
                ) : (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {deviceTodayInspections.map((inspection, index) => (
                      <span
                        key={index}
                        className="
                          rounded-full
                          bg-white
                          px-3
                          py-1
                          text-xs
                          font-medium
                          text-gray-600
                          shadow-sm
                        "
                      >
                        {new Date(
                          inspection.createdAt
                        ).toLocaleTimeString("ja-JP", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* 詳細情報 */}
              <div className="border-t border-gray-200 pt-4">

                {/* 患者 */}
                {hospitalSettings?.showPatientName && (
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

                      await executeWithErrorAndLoading({
                        setLoading,
                        action: async () => {
                          const success =
                            await renamePatientName(roomId, val)
                          if (!success) return
                        },
                      })
                    }}
                  />
                )}

                {/* 感染症 */}
                <div className="flex items-start justify-between border-b border-gray-100 py-3">
                  <div className="flex min-w-0">
                    <span className="shrink-0 text-xs font-medium text-gray-600">
                      感染症：
                    </span>

                    <div className="ml-2 flex flex-col gap-1">
                      {room &&
                      roomInfections.filter(
                        ri => ri.roomId === room.id
                      ).length > 0 ? (
                        roomInfections
                          .filter(ri => ri.roomId === room.id)
                          .map(ri => {
                            const infection =
                              infectionTypes.find(
                                i =>
                                  i.id ===
                                  ri.infectionTypeId
                              )

                            return (
                              <div
                                key={ri.id}
                                className="flex items-center gap-1 text-sm text-gray-700"
                              >
                                <FaVirus
                                  size={12}
                                  color={infection?.color}
                                />
                                <span>
                                  {infection?.name}
                                </span>
                              </div>
                            )
                          })
                      ) : (
                        <span className="text-sm text-gray-400">
                          （なし）
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    className="
                      shrink-0
                      rounded-lg
                      bg-gray-100
                      px-3
                      py-2
                      text-xs
                      font-medium
                      text-gray-600
                      transition
                      hover:bg-gray-200
                      hover:text-gray-800
                    "
                    onClick={() =>
                      setIsInfectionModalOpen(true)
                    }
                  >
                    編集
                  </button>
                </div>

                {/* 管理番号 */}
                <InfoRow
                  label="管理番号"
                  value={managementNumber}
                  onEdit={async () => {
                    const deviceId =
                      selectedRoomDevice.id
                    if (!deviceId) return

                    const val = prompt(
                      "管理番号を入力",
                      managementNumber
                    )
                    if (val === null) return

                    await executeWithErrorAndLoading({
                      setLoading,
                      action: async () => {
                        const success =
                          await renameManagementNumber(
                            deviceId,
                            val
                          )
                        if (!success) return
                      },
                    })
                  }}
                />

                {/* シリアル */}
                <InfoRow
                  label="シリアル"
                  value={serialNumber}
                  onEdit={async () => {
                    const deviceId =
                      selectedRoomDevice.id
                    if (!deviceId) return

                    const val = prompt(
                      "シリアル番号を入力",
                      serialNumber
                    )
                    if (val === null) return

                    await executeWithErrorAndLoading({
                      setLoading,
                      action: async () => {
                        const success =
                          await renameSerialNumber(
                            deviceId,
                            val
                          )
                        if (!success) return
                      },
                    })
                  }}
                />

                {/* 貸与情報 */}
                {(selectedRoomDevice.assetType === "レンタル" ||
                  selectedRoomDevice.assetType === "代替機") && (
                  <>
                    <InfoRow
                      label="貸与開始日"
                      value={rentalStartDate}
                      onEdit={async () => {
                        const deviceId =
                          selectedRoomDevice.id
                        if (!deviceId) return

                        const val = prompt(
                          "貸与開始日を入力 (YYYY-MM-DD)",
                          rentalStartDate
                        )
                        if (val === null) return

                        await executeWithErrorAndLoading({
                          setLoading,
                          action: async () => {
                            const success =
                              await renameRentalDates(
                                deviceId,
                                val,
                                rentalEndDate
                              )
                            if (!success) return
                          },
                        })
                      }}
                    />

                    <InfoRow
                      label="返却日"
                      value={rentalEndDate}
                      onEdit={async () => {
                        const deviceId =
                          selectedRoomDevice.id
                        if (!deviceId) return

                        const val = prompt(
                          "返却日を入力 (YYYY-MM-DD)",
                          rentalEndDate
                        )
                        if (val === null) return

                        await executeWithErrorAndLoading({
                          setLoading,
                          action: async () => {
                            const success =
                              await renameRentalDates(
                                deviceId,
                                rentalStartDate,
                                val
                              )
                            if (!success) return
                          },
                        })
                      }}
                    />
                  </>
                )}

                {/* 備考 */}
                <InfoRow
                  label="備考"
                  value={note}
                  onEdit={async () => {
                    const deviceId =
                      selectedRoomDevice.id
                    if (!deviceId) return

                    const val = prompt(
                      "備考を入力",
                      note
                    )
                    if (val === null) return

                    await executeWithErrorAndLoading({
                      setLoading,
                      action: async () => {
                        const success =
                          await renameNote(deviceId, val)
                        if (!success) return
                      },
                    })
                  }}
                />
              </div>
            </div>
          </div>

          {/* ===================================================== */}
          {/* 右：スタンバイ・メンテナンス */}
          {/* ===================================================== */}
          <div className="min-h-0 overflow-y-auto rounded-xl bg-white p-6 shadow-sm">

            <div className="space-y-5">

              {/* スタンバイ */}
              <div className="rounded-xl border border-gray-200 bg-white p-4">

                <div className="mb-2 flex items-center justify-between">
                  <div className="text-lg font-semibold text-gray-800">
                    スタンバイ
                  </div>

                  <button
                    onClick={handleToggleStandby}
                    className={`
                      rounded-lg
                      px-3
                      py-2
                      text-sm
                      font-medium
                      transition
                      ${
                        standby
                          ? "bg-yellow-100 text-gray-700 hover:bg-yellow-200"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }
                    `}
                  >
                    {standby ? "解除" : "開始"}
                  </button>
                </div>

                {standby ? (
                  <div className="text-sm text-gray-500">
                    待機開始日：
                    {standbyStartedAt || "未設定"}
                  </div>
                ) : (
                  <div className="text-sm text-gray-500">
                    スタンバイなし
                  </div>
                )}

                {isStandbyOverOneMonth && (
                  <div className="mt-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-600">
                    スタンバイ開始から1か月経過しています。
                  </div>
                )}
              </div>

              {/* メンテナンス */}
              <div className="rounded-xl border border-gray-200 bg-white p-4">

                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    メンテナンス
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    登録されているメンテナンスタスク
                  </p>
                </div>

                <div className="space-y-2">

                  {deviceTasks.length === 0 && (
                    <div className="flex min-h-[180px] items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50">
                      <div className="text-center">
                        <div className="text-sm font-medium text-gray-500">
                          タスクなし
                        </div>
                      </div>
                    </div>
                  )}

                  {deviceTasks.map(task => {

                    const type =
                      maintenanceTypes.find(
                        t =>
                          t.id ===
                          task.maintenanceTypeId
                      )

                    const status =
                      getStatus(task.dueAt)

                    const isCompleted =
                      task.completedAt !== null &&
                      task.completedAt !== undefined

                    const isCancelled =
                      !task.isActive

                    const isPending =
                      task.isActive &&
                      !isCompleted

                    return (
                      <div
                        key={task.id}
                        className="
                          rounded-xl
                          border
                          border-gray-200
                          bg-white
                          p-4
                          transition
                          hover:border-gray-300
                          hover:bg-gray-50
                          hover:shadow-sm
                        "
                      >
                        <div className="flex items-center justify-between gap-4">

                          <div className="min-w-0">

                            <div className="truncate text-sm font-semibold text-gray-800">
                              {type?.name}
                            </div>

                            <div className="mt-1 text-xs text-gray-500">
                              {status.label}
                            </div>

                            <div className="mt-1 text-xs text-gray-400">
                              期限：
                              {new Date(
                                task.dueAt
                              ).toLocaleDateString()}
                            </div>

                          </div>

                          <div className="flex shrink-0 items-center gap-2">

                            {isPending && (
                              <>
                                <span>
                                  {status.color === "red" && "🔴"}
                                  {status.color === "yellow" && "🟡"}
                                  {status.color === "green" && "🟢"}
                                </span>

                                <button
                                  className="rounded-lg bg-blue-500 px-3 py-2 text-xs font-medium text-white hover:bg-blue-600"
                                  onClick={async () => {
                                    await executeWithErrorAndLoading({
                                      setLoading,
                                      action: async () => {
                                        const success =
                                          await onCompleteTask({
                                            id: task.id,
                                          })
                                        if (!success) return
                                      },
                                    })
                                  }}
                                >
                                  実施
                                </button>

                                <button
                                  className="rounded-lg bg-gray-100 px-3 py-2 text-xs font-medium text-gray-600 hover:bg-gray-200"
                                  onClick={async () => {
                                    const val = prompt(
                                      "メンテ期限を入力 (YYYY-MM-DD)",
                                      task.dueAt.slice(0, 10)
                                    )

                                    if (val === null) return

                                    if (
                                      !/^\d{4}-\d{2}-\d{2}$/.test(
                                        val
                                      )
                                    ) {
                                      alert(
                                        "YYYY-MM-DD形式で入力してください"
                                      )
                                      return
                                    }

                                    await executeWithErrorAndLoading({
                                      setLoading,
                                      action: async () => {
                                        const success =
                                          await renameMaintenanceTaskDueAt({
                                            id: task.id,
                                            dueAt: `${val}T00:00:00`,
                                          })
                                        if (!success) return
                                      },
                                    })
                                  }}
                                >
                                  修正
                                </button>

                                <button
                                  className="rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-100"
                                  onClick={async () => {
                                    const ok = confirm(
                                      "このメンテナンスタスクを中止しますか？"
                                    )

                                    if (!ok) return

                                    await executeWithErrorAndLoading({
                                      setLoading,
                                      action: async () => {
                                        const success =
                                          await cancelTask({
                                            id: task.id,
                                            isActive: false,
                                          })
                                        if (!success) return
                                      },
                                    })
                                  }}
                                >
                                  中止
                                </button>
                              </>
                            )}

                            {isCompleted && (
                              <div className="text-sm font-medium text-green-600">
                                実施済み
                              </div>
                            )}

                            {isCancelled && (
                              <button
                                className="rounded-lg bg-gray-100 px-3 py-2 text-xs font-medium text-gray-600 hover:bg-gray-200"
                                onClick={async () => {
                                  const ok = confirm(
                                    "中止を解除しますか？"
                                  )

                                  if (!ok) return

                                  await executeWithErrorAndLoading({
                                    setLoading,
                                    action: async () => {
                                      const success =
                                        await cancelTask({
                                          id: task.id,
                                          isActive: true,
                                        })
                                      if (!success) return
                                    },
                                  })
                                }}
                              >
                                中止解除
                              </button>
                            )}

                          </div>
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

      <InfectionSelectModal
        isOpen={isInfectionModalOpen}
        onClose={() => setIsInfectionModalOpen(false)}
        infectionTypes={infectionTypes}
        roomInfections={roomInfections}
        roomId={room?.id ?? 0}
        setRoomInfections={setRoomInfections}
      />
    </CommonModal>

    <LoadingOverlay loading={loading} />
  </>
)
}
