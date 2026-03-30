"use client"

import { useState } from "react"
import { Device, deviceTypes, deviceModels, AssetTypes } from "../types/deviceTypes"

type Props = {
  onClose: () => void
  onCreate: (device: Device) => void
}

export default function DeviceModal({ onClose, onCreate }: Props) {

  const [selectedTypeID, setSelectedTypeID] = useState<number | "">("")
  const [selectedModelID, setSelectedModelID] = useState<number | "">("")
  const [selectedAssetType, setSelectedAssetType] = useState<typeof AssetTypes[number]>("資産")

  // 選択した機種に紐づくモデルを取得
  const modelsForType = selectedTypeID === ""
    ? []
    : deviceModels.filter(m => m.typeID === selectedTypeID)

  const handleSubmit = () => {
    if (selectedTypeID === "" || selectedModelID === "") return

    const newDevice: Device = {
      id: Date.now(),
      type: selectedTypeID,
      model: selectedModelID,
      assetType: selectedAssetType,
      status: "stock",
      x: undefined,
      y: undefined
    }

    onCreate(newDevice)
    onClose()
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40">
      <div className="bg-white p-6 rounded w-80">
        <h2 className="font-bold mb-4">機器登録</h2>

        <div className="space-y-3">

          {/* 機種選択 */}
          <select
            className="border p-2 w-full"
            value={selectedTypeID}
            onChange={(e) => setSelectedTypeID(Number(e.target.value))}
          >
            <option value="">機種選択</option>
            {deviceTypes.map(t => (
              <option key={t.typeID} value={t.typeID}>{t.name}</option>
            ))}
          </select>

          {/* 型式選択 */}
          <select
            className="border p-2 w-full"
            value={selectedModelID}
            onChange={(e) => setSelectedModelID(Number(e.target.value))}
            disabled={modelsForType.length === 0}
          >
            <option value="">型式選択</option>
            {modelsForType.map(m => (
              <option key={m.modelID} value={m.modelID}>{m.name}</option>
            ))}
          </select>

          {/* 資産形態 */}
          <select
            className="border p-2 w-full"
            value={selectedAssetType}
            onChange={(e) => setSelectedAssetType(e.target.value as typeof AssetTypes[number])}
          >
            {AssetTypes.map(a => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>

        </div>

        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} className="px-3 py-1 bg-gray-300 rounded">キャンセル</button>
          <button onClick={handleSubmit} className="px-3 py-1 bg-blue-500 text-white rounded">登録</button>
        </div>
      </div>
    </div>
  )
}