"use client"
import { useEffect, useState } from "react"

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

  return createPortal(
    <>
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md p-6 space-y-4">
        <button
          onClick={onCancel}
          className="
            relative
            top-3
            left-3
            text-gray-500
            hover:text-black
            text-xl
            font-bold
          "
        >
          ✕
        </button>
      <button
      onClick={handleDelete}
      className="
        absolute
        top-4
        right-4
        text-gray-400
        hover:text-red-500
        text-xl
        transition-colors
      "
      title="機器を削除"
    >
      <FaTrashAlt size={18} />
    </button>



        {/* 🔽 タイトル */}
        <h2 className="text-xl font-bold text-center">
          機器情報（Stock）
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
                // 時刻ズレ対策
                today.setHours(0,0,0,0)
                end.setHours(0,0,0,0)

                const diff = end.getTime() - today.getTime()
                const days = Math.ceil(diff / (1000 * 60 * 60 * 24))

                // 返却日超過
                if (days < 0) {
                  return (
                    <span className="ml-3 text-sm text-red-600 font-bold">
                      返却日超過
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
              })
              ()}            
          </div>

          <div className="text-gray-600">
            {locationName}
          </div>
        </div>

        {/* 🔽 情報 */}
        <div className="border-t pt-2 space-y-1">

          {/* 管理番号 */}
          <InfoRow
            label="管理番号"
            value={managementNumber}
            onEdit={async () => {

              const deviceId=device.id
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

                }
                })


            }}
          />

          {/* シリアル */}
          <InfoRow
            label="シリアル"
            value={serialNumber}
            onEdit={async () => {
              const deviceId=device.id
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
                  }
              })
            }}
          />
          {(device.assetType === "レンタル" ||
            device.assetType === "代替機") && (
            <>
              {/* 貸与開始日 */}
              <InfoRow
                label="貸与開始日"
                value={rentalStartDate}
            onEdit={async () => {

              const deviceId=device.id
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
                  }
                })


            }}
              />
              {/* 返却日 */}
              <InfoRow
                label="返却日"
                value={rentalEndDate}
            onEdit={async () => {
              const deviceId=device.id
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
                }
              })

            }}
              />
            </>
          )}

          {isUnderMaintenance && (
          
           <InfoRow
              label="保守開始日"
              value={maintenanceStartedAt}
              onEdit={async () => {
                const deviceId=device.id
                if (!deviceId) return

                const val = prompt("保守開始日 (YYYY-MM-DD)",maintenanceStartedAt)

                if (val === null) return
                await executeWithErrorAndLoading({
                    setLoading,
                    action: async () => {
                      const success =await renameMaintenanceDates(deviceId,val)
                      if (!success) return
                    }
                })

              }}
            />
          
          )}
          
          {/* 備考 */}
          <InfoRow
            label="備考"
            value={note}
            onEdit={async () => {
              const deviceId=device.id
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
                }
                })

            }} 
          />
        </div>

        {/* 🔽 ボタン */}
        <div className="flex justify-end gap-2 pt-4 border-t">

          <button
            onClick={async () => {

              const deviceId=device.id
              if (!deviceId) return
              // ===== 保守終了 =====
              if (isUnderMaintenance) {
                const today =
                  new Date()
                    .toISOString()
                    .split("T")[0]

                await executeWithErrorAndLoading({
                    setLoading,
                    action: async () => {

                      const success =
                        await toggleDeviceMaintenance(
                          deviceId,
                          false
                        )
                      if (!success) return

                }
              })
              return
              }
              // ===== 保守開始 =====
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
                }
                })
            }}
            className="
              bg-red-500
              text-white
              px-3
              py-1
              rounded
            "
          >
            {isUnderMaintenance
              ? "保守終了"
              : "保守開始"}
          </button>
        </div>

      </div>
    </div>
    <LoadingOverlay loading={loading} /> 
</>
    ,
    document.body
  )
}