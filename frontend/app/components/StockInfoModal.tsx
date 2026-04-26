"use client"

import { Device } from "../types/deviceTypes"
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
  

  useEffect(() => {
    if (!isOpen || !device) return

    setManagementNumber(device.managementNumber ?? "")
    setSerialNumber(device.serialNumber ?? "")
    setNote(device.note ?? "")
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
            {typeName}　{modelName}
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
                note
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