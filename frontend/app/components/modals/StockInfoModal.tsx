"use client"
import { useEffect, useState } from "react"
import CommonModal from "../common/CommonModal"

import { Device } from "../../types/deviceTypes"
import { StockAreaType } from "../../types/stockTypes"
import { DeviceTypeType } from "../../types/deviceTypeTypes"
import { DeviceModelType } from "../../types/deviceModelTypes"
import { WardType } from "../../types/wardTypes"
import {CurrentUser  } from "../../types/userTypes"
import { RoomType } from "../../types/roomTypes"

import { createPortal } from "react-dom"
import { FaTrashAlt } from "react-icons/fa"

import {executeWithLoading} from "../common/executeWithLoading"
import { executeWithErrorAndLoading } from "../../components/common/executeWithErrorAndLoading"
import {LoadingOverlay} from "../common/LoadingOverlay"

//page.tsxからpropsを受け取る
//stateレス化
type Props = {
  isOpen: boolean
  device: Device | null
  deviceTypes: DeviceTypeType[]
  deviceModels: DeviceModelType[]
  stockAreas: StockAreaType[]
  onCancel: () => void
  renameManagementNumber:(id: number, value: string)=> Promise<boolean>
  renameSerialNumber:(id: number, value: string)=> Promise<boolean>
  renameNote:(id: number, value: string)=> Promise<boolean>
  renameRentalDates:(id: number, startDate?: string, endDate?: string)=> Promise<boolean>
  renameMaintenanceDates:(id: number, maintenanceStartedAt?: string)=>Promise<boolean>
  toggleDeviceMaintenance: (deviceId: number, nextMaintenance: boolean) => Promise<boolean>
  onDelete: (deviceId: number) => Promise<void>

}

export default function StockInfoModal({
  isOpen,
  device,
  deviceTypes,
  deviceModels,
  stockAreas,
  onCancel,
  renameManagementNumber,
  renameSerialNumber,
  renameNote,
  renameRentalDates,
  renameMaintenanceDates,
  toggleDeviceMaintenance,
  onDelete

}: Props) {
  const [loading, setLoading] = useState(false)
  

  if (!isOpen || !device) return null

  const typeName =
    deviceTypes.find(t => t.id === device.type)?.name ?? "不明"

  const modelName =
    deviceModels.find(m => m.id === device.model)?.name ?? "不明"

  const locationName =
    stockAreas.find(s => s.id === device.stockAreaId)?.name ?? "不明"
  // ===== deviceから直接取得 =====

  const managementNumber =
    device.managementNumber ?? ""

  const serialNumber =
    device.serialNumber ?? ""

  const note =
    device.note ?? ""

  const rentalStartDate =
    device.rentalStartDate || ""

  const rentalEndDate =
    device.rentalEndDate || ""
  
  const isUnderMaintenance =
    device.isUnderMaintenance ?? false

  const maintenanceStartedAt =
    device.maintenanceStartedAt || ""

  const maintenanceFinishedAt =
    device.maintenanceFinishedAt || ""

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
    const handleDelete = async () => {
      if (!device?.id) return

      if (!confirm("この機器を削除しますか？")) return

      await executeWithErrorAndLoading({
          setLoading,
          action: async () => {
            await onDelete(device.id!)

      onCancel()
        }
    })
    }

return (
  <>
    <CommonModal
      open={isOpen}
      onClose={onCancel}
      title="機器情報（Stock）"
      maxWidth="max-w-[700px]"
      height="h-[70vh]"
      rightContent={
        <button
          onClick={handleDelete}
          className="rounded-lg bg-red-50 px-3 py-2 text-red-600 transition hover:bg-red-100"
        >
          <FaTrashAlt size={18} />
        </button>
      }
    >
      <div className="h-full rounded-xl w-full bg-gray-200 p-5">
        <div className="h-full min-h-0 overflow-y-auto rounded-xl bg-white p-6 shadow-sm">

          <div className="space-y-5">

            {/* ===================================================== */}
            {/* 機器情報 */}
            {/* ===================================================== */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                機器情報
              </h3>

              <div className="mt-3 rounded-xl border border-gray-200 bg-white p-4">
                <div className="text-lg font-bold text-gray-800">
                  {typeName}　{modelName}　{device.assetType}

                  {(device.assetType === "レンタル" ||
                    device.assetType === "代替機") &&
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

                      if (days <= 2) {
                        return (
                          <span className="ml-3 text-sm font-bold text-red-600">
                            返却まで{days}日
                          </span>
                        )
                      }

                      return null
                    })()}
                </div>

                <div className="mt-2 text-sm text-gray-500">
                  保管場所：{locationName}
                </div>
              </div>
            </div>

            {/* ===================================================== */}
            {/* 詳細情報 */}
            {/* ===================================================== */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                詳細情報
              </h3>

              <div className="mt-3 rounded-xl border border-gray-200 bg-white p-4">

                <div className="space-y-1">

                  {/* 管理番号 */}
                  <InfoRow
                    label="管理番号"
                    value={managementNumber}
                    onEdit={async () => {
                      const deviceId = device.id
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
                      const deviceId = device.id
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
                  {(device.assetType === "レンタル" ||
                    device.assetType === "代替機") && (
                    <>
                      <InfoRow
                        label="貸与開始日"
                        value={rentalStartDate}
                        onEdit={async () => {
                          const deviceId = device.id
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
                          const deviceId = device.id
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

                  {/* 保守開始日 */}
                  {isUnderMaintenance && (
                    <InfoRow
                      label="保守開始日"
                      value={maintenanceStartedAt}
                      onEdit={async () => {
                        const deviceId = device.id
                        if (!deviceId) return

                        const val = prompt(
                          "保守開始日 (YYYY-MM-DD)",
                          maintenanceStartedAt
                        )

                        if (val === null) return

                        await executeWithErrorAndLoading({
                          setLoading,
                          action: async () => {
                            const success =
                              await renameMaintenanceDates(
                                deviceId,
                                val
                              )

                            if (!success) return
                          },
                        })
                      }}
                    />
                  )}

                  {/* 備考 */}
                  <InfoRow
                    label="備考"
                    value={note}
                    onEdit={async () => {
                      const deviceId = device.id
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
                            await renameNote(
                              deviceId,
                              val
                            )

                          if (!success) return
                        },
                      })
                    }}
                  />

                </div>
              </div>
            </div>

            {/* ===================================================== */}
            {/* 保守状態 */}
            {/* ===================================================== */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                保守状態
              </h3>

              <div className="mt-3 rounded-xl border border-gray-200 bg-white p-4">

                <div className="flex items-center justify-between gap-4">

                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      {isUnderMaintenance
                        ? "保守中"
                        : "通常"}
                    </p>

                    {isUnderMaintenance ? (
                      <p className="mt-1 text-xs text-gray-500">
                        保守開始日：
                        {maintenanceStartedAt || "未設定"}
                      </p>
                    ) : (
                      <p className="mt-1 text-xs text-gray-500">
                        保守なし
                      </p>
                    )}
                  </div>

                  <button
                    onClick={async () => {
                      const deviceId = device.id
                      if (!deviceId) return

                      /* ===== 保守終了 ===== */
                      if (isUnderMaintenance) {
                        await executeWithErrorAndLoading({
                          setLoading,
                          action: async () => {
                            const success =
                              await toggleDeviceMaintenance(
                                deviceId,
                                false
                              )

                            if (!success) return
                          },
                        })

                        return
                      }

                      /* ===== 保守開始 ===== */
                      const val = prompt(
                        "保守開始日を入力 (YYYY-MM-DD)",
                        new Date()
                          .toISOString()
                          .split("T")[0]
                      )

                      if (val === null) return

                      await executeWithErrorAndLoading({
                        setLoading,
                        action: async () => {
                          const success =
                            await toggleDeviceMaintenance(
                              deviceId,
                              true
                            )

                          if (!success) return
                        },
                      })
                    }}
                    className={
                      isUnderMaintenance
                        ? "rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-200"
                        : "rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-600"
                    }
                  >
                    {isUnderMaintenance
                      ? "保守終了"
                      : "保守開始"}
                  </button>

                </div>

              </div>
            </div>

          </div>
        </div>
      </div>
    </CommonModal>

    <LoadingOverlay loading={loading} />
  </>
)  
}