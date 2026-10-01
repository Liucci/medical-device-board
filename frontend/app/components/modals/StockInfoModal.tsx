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
import InputModal from "../common/InputModal"
import useInputModal from "../common/useInputModal"

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
  const [isInputModalOpen, setIsInputModalOpen] = useState(false)
  const [inputModalTaskId, setInputModalTaskId] = useState<number | null>(null)
  const [inputModalValue, setInputModalValue] = useState("")
  const inputModal = useInputModal()
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


  const handleMaintenanceTaskDueAt = (
      taskId: number,
      currentDueAt: string
  ) => {
      inputModal.openInputModal({
          title: "メンテ期限の修正",
          label: "メンテ期限",
          type: "date",
          value: currentDueAt.slice(0, 10),
          onConfirm: async (value) => {

              await executeWithErrorAndLoading({
                  setLoading,
                  action: async () => {
                      const success = await renameMaintenanceTaskDueAt({
                          id: taskId,
                          dueAt: `${value.replace(/\//g, "-")}T00:00:00`,
                      })

                      if (!success) return
                      inputModal.closeInputModal()
                  },
              })
          },
      })
  }

  const handleManagementNumber = async () =>
  {
    const deviceId = selectedDevice.id
    if (!deviceId) return
    inputModal.openInputModal({
        title: "管理番号の変更",
        label: "管理番号",
        type: "text",
        value: managementNumber,
        onConfirm: async (value) => 
        {
            await executeWithErrorAndLoading({
                setLoading,
                action: async () => {
                    await renameManagementNumber(
                        selectedDevice.id,
                        value
                    )
                },
            })
             inputModal.closeInputModal()
        },
    })    
  }

  const handleSerialNumber = async () => {
    const deviceId = selectedDevice.id
    if (!deviceId) return
    inputModal.openInputModal({
        title: "シリアルの変更",
        label: "シリアル番号",
        type: "text",
        value: serialNumber,
        onConfirm: async (value) => {
            await executeWithErrorAndLoading({
                setLoading,
                action: async () => {
                    await renameSerialNumber(
                        selectedDevice.id,
                        value
                    )
                },
            })
            inputModal.closeInputModal()
        },
    }) 
  }

  const handleNote = async () => {
    const deviceId = selectedDevice.id
    if (!deviceId) return
    inputModal.openInputModal({
        title: "備考欄の変更",
        label: "備考欄",
        type: "text",
        value: note,
        onConfirm: async (value) => {
            await executeWithErrorAndLoading({
                setLoading,
                action: async () => {
                    await renameNote(
                        selectedDevice.id,
                        value
                    )
                },
            })
        },
    }) 
  }

  const handleRentalStartDate = async () => {
    const deviceId = selectedDevice.id
    if (!deviceId) return
    inputModal.openInputModal({
        title: "貸与開始日の変更",
        label: "貸与開始日",
        type: "date",
        value: rentalStartDate,
        onConfirm: async (value) => {
            await executeWithErrorAndLoading({
                setLoading,
                action: async () => {
                    await renameRentalDates(
                        deviceId,
                        value,
                        rentalEndDate
                    )
                },
            })
            inputModal.closeInputModal()
        },
    }) 
  }

  const handleRentalEndDate = async () => {
    const deviceId = selectedDevice.id
    if (!deviceId) return
        inputModal.openInputModal({
        title: "返却日の変更",
        label: "返却日",
        type: "date",
        value: rentalEndDate,
        onConfirm: async (value) => {
            await executeWithErrorAndLoading({
                setLoading,
                action: async () => {
                    await renameRentalDates(
                        deviceId,
                        rentalStartDate,
                        value,
                    )
                },
            })
            inputModal.closeInputModal()
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
      maxWidth="max-w-6xl"
      height="h-[70vh]"
      rightContent={
        <button
          type="button"
          onClick={handleDelete}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-rose-800/70 bg-rose-950/70 text-rose-300 transition-colors hover:bg-rose-900"
          title="機器の削除"
        >
          <FaTrashAlt size={14} />
        </button>
      }
    >
      <div className="h-full w-full bg-slate-50 p-3 sm:p-4">
        <div className="grid h-full min-h-0 grid-cols-1 gap-4 lg:grid-cols-12">
          <div className="min-h-0 overflow-y-auto lg:col-span-7">
            <div className="space-y-4">
              <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-700 bg-slate-900 px-4 py-3 sm:px-5">
                  <div className="mb-1 flex items-center gap-2 text-[11px] font-semibold text-slate-400">
                    <span>{selectedDevice.assetType}</span>
                    <span className="text-slate-600">/</span>
                    <span className="font-mono text-slate-300">
                      {managementNumber
                        ? `管理番号 ${managementNumber}`
                        : "管理番号未設定"}
                    </span>
                  </div>

                  <h3 className="truncate text-base font-bold text-white sm:text-lg">
                    {typeName}
                    <span className="ml-2 font-normal text-slate-300">
                      {modelName}
                    </span>
                  </h3>
                </div>

                <div className="grid grid-cols-2 border-b border-slate-200 bg-slate-50 sm:grid-cols-2">
                  <div className="border-r border-slate-200 px-4 py-2.5 sm:px-5">
                    <div className="text-[10px] font-semibold tracking-wide text-slate-500">
                      現在の位置
                    </div>
                    <div className="mt-0.5 truncate text-sm font-bold text-slate-900">
                      {stockAreaName}
                    </div>
                  </div>


                  <div className="col-span-2 px-4 py-2.5 sm:col-span-1 sm:px-5">
                    <div className="text-[10px] font-semibold tracking-wide text-slate-500">
                      稼働状態
                    </div>
                    <div
                      className={`mt-0.5 text-sm font-bold ${
                        selectedDevice.isUnderMaintenance
                          ? "text-amber-700"
                          : "text-emerald-700"
                      }`}
                    >
                      {selectedDevice.isUnderMaintenance
                        ? "保守中"
                        : "通常状態"}
                    </div>
                  </div>
                </div>

                {rentalStatus && (
                  <div
                    className={`border-b px-4 py-3 sm:px-5 ${
                      rentalStatus === "返却日超過"
                        ? "border-rose-300 bg-rose-50"
                        : "border-amber-300 bg-amber-50"
                    }`}
                  >
                    <div className="text-xs font-bold">
                      <span
                        className={
                          rentalStatus === "返却日超過"
                            ? "text-rose-900"
                            : "text-amber-900"
                        }
                      >
                        {rentalStatus === "返却日超過"
                          ? "重要アラート"
                          : "返却予定"}
                      </span>
                    </div>

                    <div
                      className={`mt-0.5 text-xs ${
                        rentalStatus === "返却日超過"
                          ? "text-rose-800"
                          : "text-amber-800"
                      }`}
                    >
                      {rentalStatus}
                      {rentalStatus === "返却日超過"
                        ? "。契約更新または返却手続きを確認してください。"
                        : ""}
                    </div>
                  </div>
                )}

                <div className="p-4 sm:p-5">
                  <button
                    type="button"
                    onClick={handleInspection}
                    className="h-12 w-full rounded-xl bg-teal-700 px-4 text-sm font-bold text-white transition-colors hover:bg-teal-800 active:scale-[0.99]"
                  >
                    点検チェックシートを開く
                  </button>
                </div>
              </section>

              <section className="rounded-xl border border-teal-200 bg-white shadow-sm">
                <div className="border-b border-slate-100 px-4 py-3 sm:px-5">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-xs font-bold tracking-wide text-slate-700">
                        本日の点検
                      </div>
                      <div className="mt-0.5 text-[11px] text-slate-400">
                        実施状況
                      </div>
                    </div>

                    <div className="text-sm font-bold text-teal-700">
                      {deviceTodayInspections.length} 回
                    </div>
                  </div>
                </div>

                <div className="p-4 sm:p-5">
                  {deviceTodayInspections.length === 0 ? (
                    <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-400">
                      本日はまだ点検を実施していません
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {deviceTodayInspections.map((inspection, index) => (
                        <span
                          key={index}
                          className="rounded-md border border-teal-200 bg-teal-50 px-2.5 py-1 text-xs font-bold text-teal-800"
                        >
                          {new Date(inspection.createdAt).toLocaleTimeString(
                            "ja-JP",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </section>

              <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-100 px-4 py-3 sm:px-5">
                  <div className="text-xs font-bold tracking-wide text-slate-700">
                    機器情報
                  </div>
                </div>

                <div className="divide-y divide-slate-100 px-4 sm:px-5">
                  <div className="flex items-center justify-between gap-4 py-3">
                    <div className="min-w-0">
                      <div className="text-[11px] font-medium text-slate-400">
                        ME管理番号
                      </div>
                      <div className="mt-0.5 truncate font-mono text-sm font-bold text-slate-900">
                        {managementNumber || "情報なし"}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleManagementNumber}
                      className="h-8 shrink-0 rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-100"
                    >
                      変更
                    </button>
                  </div>

                  <div className="flex items-center justify-between gap-4 py-3">
                    <div className="min-w-0">
                      <div className="text-[11px] font-medium text-slate-400">
                        シリアル番号
                      </div>
                      <div className="mt-0.5 truncate font-mono text-sm font-bold text-slate-900">
                        {serialNumber || "情報なし"}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleSerialNumber}
                      className="h-8 shrink-0 rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-100"
                    >
                      変更
                    </button>
                  </div>

                  {(selectedDevice.assetType === "レンタル" ||
                    selectedDevice.assetType === "代替機") && (
                    <>
                      <div className="flex items-center justify-between gap-4 py-3">
                        <div className="min-w-0">
                          <div className="text-[11px] font-medium text-slate-400">
                            貸与開始日
                          </div>
                          <div className="mt-0.5 text-sm font-bold text-slate-900">
                            {rentalStartDate || "情報なし"}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={handleRentalStartDate}
                          className="h-8 shrink-0 rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-100"
                        >
                          変更
                        </button>
                      </div>

                      <div className="flex items-center justify-between gap-4 py-3">
                        <div className="min-w-0">
                          <div className="text-[11px] font-medium text-slate-400">
                            返却日
                          </div>
                          <div
                            className={`mt-0.5 text-sm font-bold ${
                              rentalStatus === "返却日超過"
                                ? "text-rose-700"
                                : rentalStatus
                                  ? "text-amber-700"
                                  : "text-slate-900"
                            }`}
                          >
                            {rentalEndDate || "情報なし"}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={handleRentalEndDate}
                          className="h-8 shrink-0 rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-100"
                        >
                          変更
                        </button>
                      </div>
                    </>
                  )}

                  <div className="flex items-center justify-between gap-4 py-3">
                    <div className="min-w-0">
                      <div className="text-[11px] font-medium text-slate-400">
                        備考
                      </div>
                      <div className="mt-0.5 break-words text-sm font-bold text-slate-900">
                        {note || "情報なし"}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleNote}
                      className="h-8 shrink-0 rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-100"
                    >
                      変更
                    </button>
                  </div>
                </div>
              </section>
            </div>
          </div>

          <div className="min-h-0 overflow-y-auto lg:col-span-5">
            <div className="space-y-4">
              <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-100 px-4 py-3 sm:px-5">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-xs font-bold tracking-wide text-slate-700">
                        保守
                      </div>
                      <div className="mt-0.5 text-[11px] text-slate-400">
                        現在の保守状態
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleMaintenance}
                      className="h-8 rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-100"
                    >
                      {selectedDevice.isUnderMaintenance
                        ? "保守終了"
                        : "保守開始"}
                    </button>
                  </div>
                </div>

                <div className="p-4 sm:p-5">
                  {selectedDevice.isUnderMaintenance ? (
                    <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
                      <div className="text-sm font-bold text-amber-700">
                        保守中
                      </div>

                      <div className="mt-1 text-xs text-amber-800">
                        保守開始日：
                        {selectedDevice.maintenanceStartedAt
                          ? new Date(
                              selectedDevice.maintenanceStartedAt
                            ).toLocaleDateString("ja-JP")
                          : "未設定"}
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-500">
                      保守中ではありません
                    </div>
                  )}
                </div>
              </section>

              <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-100 px-4 py-3 sm:px-5">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-xs font-bold tracking-wide text-slate-700">
                        メンテナンス
                      </div>
                      <div className="mt-0.5 text-[11px] text-slate-400">
                        登録されているメンテナンスタスク
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsAddMaintenanceTaskModalOpen(true)}
                      className="flex h-8 items-center rounded-lg bg-teal-700 px-3 text-xs font-bold text-white transition-colors hover:bg-teal-800"
                    >
                      ＋ タスク追加
                    </button>
                  </div>
                </div>

                <div className="space-y-2 p-4 sm:p-5">
                  {deviceTasks.length === 0 && (
                    <div className="flex min-h-[160px] items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50">
                      <div className="text-center">
                        <div className="text-sm font-bold text-slate-500">
                          タスクなし
                        </div>
                        <div className="mt-1 text-xs text-slate-400">
                          登録されているメンテナンスタスクはありません
                        </div>
                      </div>
                    </div>
                  )}

                  {deviceTasks.map(task => {
                    const type = maintenanceTypes.find(
                      maintenanceType =>
                        Number(maintenanceType.id) ===
                        Number(task.maintenanceTypeId)
                    )
                    const status = getStatus(task.dueAt)
                    const isCompleted =
                      task.completedAt !== null &&
                      task.completedAt !== undefined
                    const isCancelled = !task.isActive
                    const isPending = task.isActive && !isCompleted

                    const taskStateClass = isCompleted
                      ? "border-emerald-200 bg-emerald-50"
                      : isCancelled
                        ? "border-slate-200 bg-slate-50 opacity-60"
                        : status.color === "red"
                          ? "border-rose-200 bg-rose-50"
                          : status.color === "yellow"
                            ? "border-amber-200 bg-amber-50/60"
                            : "border-slate-200 bg-white"

                    return (
                      <div
                        key={task.id}
                        className={`rounded-lg border p-3 transition-colors ${taskStateClass}`}
                      >
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div className="min-w-0">
                            <div className="truncate text-sm font-bold text-slate-900">
                              {type?.name ?? "不明"}
                            </div>

                            <div className="mt-1 text-[11px] font-medium text-slate-500">
                              メンテナンス種類：
                              {type?.dependDeviceStatus === "room"
                                ? "使用中メンテナンス"
                                : type?.dependDeviceStatus === "stock"
                                  ? "保管中メンテナンス"
                                  : "定期メンテナンス"}
                            </div>

                            <div
                              className={`mt-2 text-xs font-bold ${
                                status.color === "red"
                                  ? "text-rose-700"
                                  : status.color === "yellow"
                                    ? "text-amber-700"
                                    : "text-emerald-700"
                              }`}
                            >
                              {status.label}
                            </div>

                            <div className="mt-1 text-[11px] text-slate-500">
                              期限：
                              {new Date(task.dueAt).toLocaleDateString(
                                "ja-JP"
                              )}
                            </div>
                          </div>

                          <div className="flex shrink-0 flex-wrap gap-2">
                            {isPending && (
                              <>
                                <button
                                  type="button"
                                  className="h-8 rounded-lg bg-teal-700 px-3 text-xs font-bold text-white transition-colors hover:bg-teal-800"
                                  onClick={async () => {
                                    await executeWithErrorAndLoading({
                                      setLoading,
                                      action: async () => {
                                        const success =
                                          await onCompleteTask({ id: task.id })
                                        if (!success) return
                                      },
                                    })
                                  }}
                                >
                                  実施
                                </button>

                                <button
                                  type="button"
                                  className="h-8 rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-100"
                                  onClick={() => {
                                    handleMaintenanceTaskDueAt(
                                      task.id,
                                      task.dueAt
                                    )
                                  }}
                                >
                                  修正
                                </button>

                                <button
                                  type="button"
                                  className="h-8 rounded-lg border border-rose-200 bg-rose-50 px-3 text-xs font-bold text-rose-700 transition-colors hover:bg-rose-100"
                                  onClick={async () => {
                                    if (
                                      !confirm(
                                        "このメンテナンスタスクを中止しますか？"
                                      )
                                    ) {
                                      return
                                    }

                                    await executeWithErrorAndLoading({
                                      setLoading,
                                      action: async () => {
                                        const success = await cancelTask({
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
                              <div className="text-xs font-bold text-emerald-700">
                                実施済
                              </div>
                            )}

                            {isCancelled && (
                              <button
                                type="button"
                                className="h-8 rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-bold text-slate-600 transition-colors hover:bg-slate-100"
                                onClick={async () => {
                                  if (!confirm("中止を解除しますか？")) return

                                  await executeWithErrorAndLoading({
                                    setLoading,
                                    action: async () => {
                                      const success = await cancelTask({
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
              </section>
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

      <InputModal
        open={inputModal.isOpen}
        onClose={inputModal.closeInputModal}
        onConfirm={inputModal.onConfirm}
        title={inputModal.title}
        label={inputModal.label}
        type={inputModal.type}
        defaultValue={inputModal.value}
        placeholder={inputModal.placeholder}
        required={inputModal.required}
        min={inputModal.min}
        max={inputModal.max}
        step={inputModal.step}
      />
    </CommonModal>

    <LoadingOverlay loading={loading} />
  </>
)
  
}