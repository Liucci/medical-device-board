"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { FaTrashAlt } from "react-icons/fa"
import { StockAreaType } from "../../types/stockTypes"
import { DeviceTypeType } from "../../types/deviceTypeTypes"
import { DeviceModelType } from "../../types/deviceModelTypes"
import { MaintenanceType } from "../../types/maintenanceTypeTypes"
import { TodayInspectionFrontType } from "../../types/inspectionTypes/inspectionTypes"
import { Device } from "../../types/deviceTypes"
import { MaintenanceTask, UpdateMaintenanceTaskDueAt, CancelMaintenanceTask, CompleteMaintenanceTask } from "../../types/taskTypes"
import CommonModal from "../common/CommonModal"
import { executeWithErrorAndLoading } from "../../components/common/executeWithErrorAndLoading"
import { LoadingOverlay } from "../common/LoadingOverlay"
import AddMaintenanceTaskModal from "../../components/modals/AddMaintenanceTaskModal"
import { createBothMaintenanceTask } from "../../api/tasks/createBothMaintenanceTask"
import { normalizeMaintenanceTask } from "../../mapper/taskMapper"

type Props = {
  isOpen: boolean
  selectedDevice: Device | null
  stockAreas: StockAreaType[]
  deviceTypes: DeviceTypeType[]
  deviceModels: DeviceModelType[]
  onCancel: () => void
  renameManagementNumber: (id: number, value: string) => Promise<boolean>
  renameSerialNumber: (id: number, value: string) => Promise<boolean>
  renameNote: (id: number, value: string) => Promise<boolean>
  renameRentalDates: (deviceId: number, rentalStartDate: string, rentalEndDate: string) => Promise<boolean>
  renameMaintenanceDates: (deviceId: number, maintenanceStartedAt?: string) => Promise<boolean>
  toggleDeviceMaintenance: (deviceId: number, nextMaintenance: boolean) => Promise<boolean>
  tasks: MaintenanceTask[]
  maintenanceTypes: MaintenanceType[]
  onCompleteTask: (task: CompleteMaintenanceTask) => Promise<boolean>
  renameMaintenanceTaskDueAt: (task: UpdateMaintenanceTaskDueAt) => Promise<boolean>
  cancelTask: (task: CancelMaintenanceTask) => Promise<boolean>
  onDelete: (deviceId: number) => Promise<void>
  todayInspections?: TodayInspectionFrontType[]
}

export default function StockInfoModal({
      isOpen,
      selectedDevice,
      stockAreas,
      deviceTypes,
      deviceModels,
      onCancel,
      renameManagementNumber,
      renameSerialNumber,
      renameNote,
      renameRentalDates,
      renameMaintenanceDates,
      toggleDeviceMaintenance,
      tasks,
      maintenanceTypes,
      onCompleteTask,
      renameMaintenanceTaskDueAt,
      cancelTask,
      onDelete,
      todayInspections,
}: Props) 
{
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const [isAddMaintenanceTaskModalOpen, setIsAddMaintenanceTaskModalOpen] = useState(false)


  if (!isOpen || !selectedDevice) return null

  const managementNumber = selectedDevice.managementNumber ?? ""
  const serialNumber = selectedDevice.serialNumber ?? ""
  const note = selectedDevice.note ?? ""
  const rentalStartDate = selectedDevice.rentalStartDate ?? ""
  const rentalEndDate = selectedDevice.rentalEndDate ?? ""
  const typeName = deviceTypes.find(type => Number(type.id) === Number(selectedDevice.type))?.name ?? "不明"
  const modelName = deviceModels.find(model => Number(model.id) === Number(selectedDevice.model))?.name ?? "不明"
  const stockAreaName = stockAreas.find(stockArea => Number(stockArea.id) === Number(selectedDevice.stockAreaId))?.name ?? "不明"
  const deviceTasks = tasks.filter(task => Number(task.deviceId) === Number(selectedDevice.id))
  const deviceTodayInspections = todayInspections?.filter(inspection => Number(inspection.deviceId) === Number(selectedDevice.id)) ?? []

  const getStatus = (dueAt: string) => {
    const now = new Date()
    const diff = new Date(dueAt).getTime() - now.getTime()
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24))
    if (days < 0) return { label: `期限切れ（${Math.abs(days)}日）`, color: "red" }
    if (days <= 2) return { label: `残り${days}日`, color: "yellow" }
    return { label: `残り${days}日`, color: "green" }
  }

  const getRentalStatus = () => {
    if (!rentalEndDate) return null
    if (selectedDevice.assetType !== "レンタル" && selectedDevice.assetType !== "代替機") return null
    const today = new Date()
    const end = new Date(rentalEndDate)
    today.setHours(0, 0, 0, 0)
    end.setHours(0, 0, 0, 0)
    const diff = end.getTime() - today.getTime()
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24))
    if (days < 0) return "返却日超過"
    if (days === 0) return "本日返却"
    if (days <= 2) return `返却まで${days}日`
    return null
  }

  const rentalStatus = getRentalStatus()

  const handleInspection = () => {
    const deviceId = selectedDevice.id
    if (!deviceId) return
    const management = selectedDevice.managementNumber?.trim() ?? ""
    const serial = selectedDevice.serialNumber?.trim() ?? ""
    if (!management && !serial) {
      alert("管理番号またはシリアル番号を入力してください。")
      return
    }
    router.push(`/inspection-excution?deviceId=${deviceId}`)
  }

  const handleMaintenance = async () => {
    const deviceId = selectedDevice.id
    if (!deviceId) return
    const nextMaintenance = !selectedDevice.isUnderMaintenance
    await executeWithErrorAndLoading({
      setLoading,
      action: async () => {
        const success = await toggleDeviceMaintenance(deviceId, nextMaintenance)
        if (!success) return
        if (nextMaintenance) {
          await renameMaintenanceDates(deviceId, new Date().toISOString())
        } else {
          await renameMaintenanceDates(deviceId, undefined)
        }
      },
    })
  }

  const handleDelete = async () => {
    const deviceId = selectedDevice.id
    if (!deviceId) return
    if (!confirm("この機器を削除しますか？")) return
    await executeWithErrorAndLoading({
      setLoading,
      action: async () => {
        await onDelete(deviceId)
        onCancel()
      },
    })
  }

  const handleManagementNumber = async () => {
    const deviceId = selectedDevice.id
    if (!deviceId) return
    const value = prompt("管理番号を入力", managementNumber)
    if (value === null) return
    await executeWithErrorAndLoading({
      setLoading,
      action: async () => {
        const success = await renameManagementNumber(deviceId, value)
        if (!success) return
      },
    })
  }

  const handleSerialNumber = async () => {
    const deviceId = selectedDevice.id
    if (!deviceId) return
    const value = prompt("シリアル番号を入力", serialNumber)
    if (value === null) return
    await executeWithErrorAndLoading({
      setLoading,
      action: async () => {
        const success = await renameSerialNumber(deviceId, value)
        if (!success) return
      },
    })
  }

  const handleNote = async () => {
    const deviceId = selectedDevice.id
    if (!deviceId) return
    const value = prompt("備考を入力", note)
    if (value === null) return
    await executeWithErrorAndLoading({
      setLoading,
      action: async () => {
        const success = await renameNote(deviceId, value)
        if (!success) return
      },
    })
  }

  const handleRentalStartDate = async () => {
    const deviceId = selectedDevice.id
    if (!deviceId) return
    const value = prompt("貸与開始日を入力 (YYYY-MM-DD)", rentalStartDate)
    if (value === null) return
    await executeWithErrorAndLoading({
      setLoading,
      action: async () => {
        const success = await renameRentalDates(deviceId, value, rentalEndDate)
        if (!success) return
      },
    })
  }

  const handleRentalEndDate = async () => {
    const deviceId = selectedDevice.id
    if (!deviceId) return
    const value = prompt("返却日を入力 (YYYY-MM-DD)", rentalEndDate)
    if (value === null) return
    await executeWithErrorAndLoading({
      setLoading,
      action: async () => {
        const success = await renameRentalDates(deviceId, rentalStartDate, value)
        if (!success) return
      },
    })
  }

    const handleAddMaintenanceTask = async (maintenanceTypeId: number) => {
    if (!selectedDevice?.id) return

    await executeWithErrorAndLoading({
      setLoading,
      action: async () => {
        const taskDB = await createBothMaintenanceTask({
          deviceId: selectedDevice.id,
          maintenanceTypeId
        })

        const task = normalizeMaintenanceTask(taskDB)
      }
    })
  }

  return (
    <>
      <CommonModal
        open={isOpen}
        onClose={onCancel}
        title="在庫機器情報"
        maxWidth="max-w-[1200px]"
        height="h-[70vh]"
        rightContent={
          <button
            type="button"
            onClick={handleDelete}
            className="rounded-lg bg-red-50 px-3 py-2 text-red-600 hover:bg-red-100"
          >
            <FaTrashAlt size={18} />
          </button>
        }
      >
        <div className="h-full w-full rounded-xl bg-gray-200 p-5">
          <div className="grid h-full min-h-0 grid-cols-1 gap-5 lg:grid-cols-2">
            <div className="min-h-0 overflow-y-auto rounded-xl bg-white p-6 shadow-sm">
              <div className="space-y-5">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {typeName}　{modelName}　{selectedDevice.assetType}
                    {rentalStatus && <span className="ml-3 text-sm font-bold text-red-600">{rentalStatus}</span>}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">在庫場所：{stockAreaName}</p>
                </div>

                <button
                  type="button"
                  onClick={handleInspection}
                  className="w-full rounded-lg bg-blue-500 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-600 hover:shadow active:scale-[0.99]"
                >
                  点検実施
                </button>

                <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
                  <div className="text-sm font-semibold text-gray-800">本日の点検</div>
                  {deviceTodayInspections.length === 0 ? (
                    <div className="mt-2 text-sm text-gray-400">未実施</div>
                  ) : (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {deviceTodayInspections.map((inspection, index) => (
                        <span
                          key={index}
                          className="rounded-full bg-white px-3 py-1 text-xs font-medium text-gray-600 shadow-sm"
                        >
                          {new Date(inspection.createdAt).toLocaleTimeString("ja-JP", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-center justify-between border-b border-gray-100 py-2">
                    <div>
                      <span className="text-sm text-gray-500">管理番号：</span>
                      <span className="ml-2 font-medium">{managementNumber || "情報なし"}</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleManagementNumber}
                      className="rounded bg-gray-200 px-2 py-1 hover:bg-gray-300"
                    >
                      ✏
                    </button>
                  </div>

                  <div className="flex items-center justify-between border-b border-gray-100 py-2">
                    <div>
                      <span className="text-sm text-gray-500">シリアル：</span>
                      <span className="ml-2 font-medium">{serialNumber || "情報なし"}</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleSerialNumber}
                      className="rounded bg-gray-200 px-2 py-1 hover:bg-gray-300"
                    >
                      ✏
                    </button>
                  </div>

                  {(selectedDevice.assetType === "レンタル" || selectedDevice.assetType === "代替機") && (
                    <>
                      <div className="flex items-center justify-between border-b border-gray-100 py-2">
                        <div>
                          <span className="text-sm text-gray-500">貸与開始日：</span>
                          <span className="ml-2 font-medium">{rentalStartDate || "情報なし"}</span>
                        </div>
                        <button
                          type="button"
                          onClick={handleRentalStartDate}
                          className="rounded bg-gray-200 px-2 py-1 hover:bg-gray-300"
                        >
                          ✏
                        </button>
                      </div>

                      <div className="flex items-center justify-between border-b border-gray-100 py-2">
                        <div>
                          <span className="text-sm text-gray-500">返却日：</span>
                          <span className="ml-2 font-medium">{rentalEndDate || "情報なし"}</span>
                        </div>
                        <button
                          type="button"
                          onClick={handleRentalEndDate}
                          className="rounded bg-gray-200 px-2 py-1 hover:bg-gray-300"
                        >
                          ✏
                        </button>
                      </div>
                    </>
                  )}

                  <div className="flex items-center justify-between border-b border-gray-100 py-2">
                    <div>
                      <span className="text-sm text-gray-500">備考：</span>
                      <span className="ml-2 font-medium">{note || "情報なし"}</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleNote}
                      className="rounded bg-gray-200 px-2 py-1 hover:bg-gray-300"
                    >
                      ✏
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="min-h-0 overflow-y-auto rounded-xl bg-white p-6 shadow-sm">
              <div className="space-y-5">
                <div className="rounded-xl border border-gray-200 bg-white p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <div className="text-lg font-semibold text-gray-800">保守</div>
                    <button
                      type="button"
                      onClick={handleMaintenance}
                      className="rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-200"
                    >
                      {selectedDevice.isUnderMaintenance ? "保守終了" : "保守開始"}
                    </button>
                  </div>

                  {selectedDevice.isUnderMaintenance ? (
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-orange-600">保守中</div>
                      <div className="text-sm text-gray-500">
                        保守開始日：
                        {selectedDevice.maintenanceStartedAt
                          ? new Date(selectedDevice.maintenanceStartedAt).toLocaleDateString("ja-JP")
                          : "未設定"}
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500">保守中ではありません</div>
                  )}
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-4">
                  <div className="mb-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-800">メンテナンス</h3>
                      <button
                        type="button"
                        onClick={() => setIsAddMaintenanceTaskModalOpen(true)}
                        className="rounded-md bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700"
                      >
                        ＋ タスク追加
                      </button>                    
                    </div>
                    
                    <p className="mt-1 text-sm text-gray-500">登録されているメンテナンスタスク</p>
                  </div>

                  <div className="space-y-2">
                    {deviceTasks.length === 0 && (
                      <div className="flex min-h-[180px] items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50">
                        <div className="text-center">
                          <div className="text-sm font-medium text-gray-500">タスクなし</div>
                        </div>
                      </div>
                    )}

                    {deviceTasks.map(task => {
                      const type = maintenanceTypes.find(maintenanceType => Number(maintenanceType.id) === Number(task.maintenanceTypeId))
                      const status = getStatus(task.dueAt)
                      const isCompleted = task.completedAt !== null && task.completedAt !== undefined
                      const isCancelled = !task.isActive
                      const isPending = task.isActive && !isCompleted

                      return (
                        <div
                          key={task.id}
                          className="rounded-xl border border-gray-200 bg-white p-4 transition hover:border-gray-300 hover:bg-gray-50 hover:shadow-sm"
                        >
                          <div className="flex items-center justify-between gap-4">
                            <div className="min-w-0">
                              <div className="truncate text-sm font-semibold text-gray-800">{type?.name ?? "不明"}</div>
                                                          
                                <div className="text-xs text-gray-500">
                                  メンテナンス種類：
                                  {type?.dependDeviceStatus === "room"
                                    ? "使用中メンテナンス"
                                    : type?.dependDeviceStatus === "stock"
                                      ? "保管中メンテナンス"
                                      : "定期メンテナンス"}
                                </div>

                              <div className="mt-1 text-xs text-gray-500">{status.label}</div>
                              <div className="mt-1 text-xs text-gray-400">
                                期限：{new Date(task.dueAt).toLocaleDateString("ja-JP")}
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
                                    type="button"
                                    className="rounded-lg bg-blue-500 px-3 py-2 text-xs font-medium text-white hover:bg-blue-600"
                                    onClick={async () => {
                                      await executeWithErrorAndLoading({
                                        setLoading,
                                        action: async () => {
                                          const success = await onCompleteTask({ id: task.id })
                                          if (!success) return
                                        },
                                      })
                                    }}
                                  >
                                    実施
                                  </button>

                                  <button
                                    type="button"
                                    className="rounded-lg bg-gray-100 px-3 py-2 text-xs font-medium text-gray-600 hover:bg-gray-200"
                                    onClick={async () => {
                                      const value = prompt("メンテ期限を入力 (YYYY-MM-DD)", task.dueAt.slice(0, 10))
                                      if (value === null) return
                                      if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
                                        alert("YYYY-MM-DD形式で入力してください")
                                        return
                                      }
                                      await executeWithErrorAndLoading({
                                        setLoading,
                                        action: async () => {
                                          const success = await renameMaintenanceTaskDueAt({
                                            id: task.id,
                                            dueAt: `${value}T00:00:00`,
                                          })
                                          if (!success) return
                                        },
                                      })
                                    }}
                                  >
                                    修正
                                  </button>

                                  <button
                                    type="button"
                                    className="rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-100"
                                    onClick={async () => {
                                      if (!confirm("このメンテナンスタスクを中止しますか？")) return
                                      await executeWithErrorAndLoading({
                                        setLoading,
                                        action: async () => {
                                          const success = await cancelTask({ id: task.id, isActive: false })
                                          if (!success) return
                                        },
                                      })
                                    }}
                                  >
                                    中止
                                  </button>
                                </>
                              )}

                              {isCompleted && <div className="text-sm font-medium text-green-600">実施済み</div>}

                              {isCancelled && (
                                <button
                                  type="button"
                                  className="rounded-lg bg-gray-100 px-3 py-2 text-xs font-medium text-gray-600 hover:bg-gray-200"
                                  onClick={async () => {
                                    if (!confirm("中止を解除しますか？")) return
                                    await executeWithErrorAndLoading({
                                      setLoading,
                                      action: async () => {
                                        const success = await cancelTask({ id: task.id, isActive: true })
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
        
        <AddMaintenanceTaskModal
          isOpen={isAddMaintenanceTaskModalOpen}
          deviceId={selectedDevice.id}
          deviceTypeId={selectedDevice.type}
          deviceModelId={selectedDevice.model}
          maintenanceTypes={maintenanceTypes}
          onClose={() => setIsAddMaintenanceTaskModalOpen(false)}
          onAdd={handleAddMaintenanceTask}
        />
        

      </CommonModal>

      <LoadingOverlay loading={loading} />
    </>
  )
}