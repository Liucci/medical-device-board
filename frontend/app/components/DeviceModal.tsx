"use client"

import { useState } from "react"
import { Device, deviceTypes, deviceModels, AssetTypes } from "../types/deviceTypes"
import { createPortal } from "react-dom"

 type Props = {
  onClose: () => void
  onCreate: (device: Device) => void
}

export default function DeviceModal({ onClose, onCreate }: Props) {
  const [selectedTypeID, setSelectedTypeID] = useState<number | "">("")
  const [selectedModelID, setSelectedModelID] = useState<number | "">("")
  const [selectedAssetType, setSelectedAssetType] = useState<typeof AssetTypes[number]>("資産")

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
    stockAreaID: 1, //初期値はCE室
    row: 0,
    col: 0
  }

  onCreate(newDevice)
  onClose()
}


return createPortal(
  <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
    
    <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-8">
      <h2 className="text-2xl font-bold mb-6 text-center">機器登録</h2>

      <div className="space-y-4">
        <select
          className="border border-gray-300 rounded px-3 py-2 w-full"
          value={selectedTypeID}
          onChange={(e) => setSelectedTypeID(Number(e.target.value))}
        >
          <option value="">機種選択</option>
          {deviceTypes.map(t => (
            <option key={t.typeID} value={t.typeID}>{t.name}</option>
          ))}
        </select>

        <select
          className="border border-gray-300 rounded px-3 py-2 w-full"
          value={selectedModelID}
          onChange={(e) => setSelectedModelID(Number(e.target.value))}
          disabled={modelsForType.length === 0}
        >
          <option value="">型式選択</option>
          {modelsForType.map(m => (
            <option key={m.modelID} value={m.modelID}>{m.name}</option>
          ))}
        </select>

        <select
          className="border border-gray-300 rounded px-3 py-2 w-full"
          value={selectedAssetType}
          onChange={(e) =>
            setSelectedAssetType(e.target.value as typeof AssetTypes[number])
          }
        >
          {AssetTypes.map(a => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>
      </div>

      <div className="flex justify-end gap-4 mt-6">
        <button
          onClick={onClose}
          className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400"
        >
          キャンセル
        </button>

        <button
          onClick={handleSubmit}
          className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
        >
          登録
        </button>
      </div>

    </div>

  </div>,
  document.body
)}