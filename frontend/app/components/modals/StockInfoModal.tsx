"use client"

import { Device } from "../../types/deviceTypes"
import { useState, useEffect } from "react"
import { createPortal } from "react-dom"

type Props = {
  isOpen: boolean
  device: Device | null
  deviceTypes: any[]
  deviceModels: any[]
  stockAreas: any[]
  onSubmit: (data: {
    id: number
    managementNumber: string
    serialNumber: string
    note: string
    rentalStartDate?: string
    rentalEndDate?: string
    isUnderMaintenance?: boolean
    maintenanceStartedAt?: string
    maintenanceFinishedAt?: string
  }) => void
  onCancel: () => void
}

export default function StockInfoModal({
  isOpen,
  device,
  deviceTypes,
  deviceModels,
  stockAreas,
  onSubmit,
  onCancel
}: Props) {
  const [managementNumber, setManagementNumber] = useState("")
  const [serialNumber, setSerialNumber] = useState("")
  const [note, setNote] = useState("")
  const [rentalStartDate, setRentalStartDate] = useState("")
  const [rentalEndDate, setRentalEndDate] = useState("")
  const [isUnderMaintenance,setIsUnderMaintenance] = useState(false)
  const [maintenanceStartedAt,setMaintenanceStartedAt ] = useState("")
  const [maintenanceFinishedAt,setMaintenanceFinishedAt] = useState("")
  
  useEffect(() => {
    if (!isOpen || !device) return

    setManagementNumber(device.managementNumber ?? "")
    setSerialNumber(device.serialNumber ?? "")
    setNote(device.note ?? "")
    setRentalStartDate(device.rentalStartDate || "")
    setRentalEndDate(device.rentalEndDate || "")
    setIsUnderMaintenance(device.isUnderMaintenance ?? false)
    setMaintenanceStartedAt(device.maintenanceStartedAt || "")
    setMaintenanceFinishedAt(device.maintenanceFinishedAt || "")
      }, [device, isOpen])

  if (!isOpen || !device) return null

  const typeName =
    deviceTypes.find(t => t.id === device.type)?.name ?? "不明"

  const modelName =
    deviceModels.find(m => m.id === device.model)?.name ?? "不明"

  const locationName =
    stockAreas.find(s => s.id === device.stockAreaID)?.name ?? "不明"

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

  return createPortal(
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 space-y-4">

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
          {isUnderMaintenance && (
            <>
              <InfoRow
                label="保守開始日"
                value={maintenanceStartedAt}
                onEdit={() => {
                  const val = prompt(
                    "保守開始日",
                    maintenanceStartedAt
                  )

                  if (val !== null) {
                    setMaintenanceStartedAt(val)
                  }
                }}
              />

              <InfoRow
                label="保守終了日"
                value={maintenanceFinishedAt}
                onEdit={() => {
                  const val = prompt(
                    "保守終了日",
                    maintenanceFinishedAt
                  )

                  if (val !== null) {
                    setMaintenanceFinishedAt(val)
                  }
                }}
              />
            </>
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

        {/* 🔽 ボタン */}
        <div className="flex justify-end gap-2 pt-4 border-t">
          <button onClick={onCancel}>キャンセル</button>

          <button
          
            onClick={() => {
              if (!device.id) return null
              onSubmit({
                id: device.id,
                managementNumber,
                serialNumber,
                note,
                rentalStartDate:rentalStartDate|| undefined,
                rentalEndDate:rentalEndDate|| undefined,
                isUnderMaintenance,
                maintenanceStartedAt:maintenanceStartedAt || undefined,
                maintenanceFinishedAt:maintenanceFinishedAt || undefined
              })
            }}
            className="bg-blue-500 text-white px-3 py-1 rounded"
          >
            保存
          </button>
          <button
            onClick={() => {

              const today =
                new Date()
                  .toISOString()
                  .split("T")[0]

              setIsUnderMaintenance(true)

              setMaintenanceStartedAt(today)

              setMaintenanceFinishedAt("")
            }}
            className="
              bg-red-500
              text-white
              px-3
              py-1
              rounded
            "
          >
            保守開始
          </button>

        </div>

      </div>
    </div>,
    document.body
  )
}