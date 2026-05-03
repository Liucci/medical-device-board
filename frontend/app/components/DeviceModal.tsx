"use client"

import { useState } from "react"
import { Device,  AssetTypes } from "../types/deviceTypes"
import { createPortal } from "react-dom"

 type Props = {
  onClose: () => void
  onCreate: (device: Device) => void
  deviceTypes: { id: number; name: string }[]
  deviceModels: { id: number; device_type_id: number; name: string }[]

}

export default function DeviceModal({
                                      onClose,
                                      onCreate,
                                      deviceTypes,
                                      deviceModels
                                    }: Props) 
  {
  const [selectedTypeID, setSelectedTypeID] = useState<number | "">("")
  const [selectedModelID, setSelectedModelID] = useState<number | "">("")
  const [selectedAssetType, setSelectedAssetType] = useState<typeof AssetTypes[number]>("資産")
  //本日の日付を取得
  const today = new Date().toISOString().split("T")[0]
    //レンタル開始日と終了日を管理するstateを追加
  const [rentalStartDate, setRentalStartDate] = useState(today)
  const [rentalEndDate, setRentalEndDate] = useState("")


  const modelsForType = selectedTypeID === ""
    ? []
    : deviceModels.filter(m => m.device_type_id === selectedTypeID)


  const handleSubmit = () => {
    if (selectedTypeID === "" || selectedModelID === "") return

  const newDevice: Device = {
    type: selectedTypeID,
    model: selectedModelID,
    assetType: selectedAssetType,

    rentalStartDate:
      selectedAssetType === "レンタル" ||
      selectedAssetType === "代替機"
        ? rentalStartDate
        : undefined,

    rentalEndDate:
      selectedAssetType === "レンタル" ||
      selectedAssetType === "代替機"
        ? rentalEndDate
        : undefined,

    status: "stock",
    stockAreaID: 1,
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
            <option key={t.id} value={t.id}>{t.name}</option>
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
            <option key={m.id} value={m.id}>{m.name}</option>
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
          {(selectedAssetType === "レンタル" ||
            selectedAssetType === "代替機") && (

            <div className="space-y-3 border-t pt-4 mt-4">

              <div>
                <div className="text-sm mb-1">開始日</div>

                <input
                  type="date"
                  value={rentalStartDate}
                  onChange={(e) => setRentalStartDate(e.target.value)}
                  className="border border-gray-300 rounded px-3 py-2 w-full"
                />
              </div>

              <div>
                <div className="text-sm text-gray-500 mb-1">
                  返却日（未設定可）
                </div>
                <input
                  type="date"
                  value={rentalEndDate}
                  onChange={(e) => setRentalEndDate(e.target.value)}
                  className="border border-gray-300 rounded px-3 py-2 w-full"
                />
    </div>

  </div>
)}




    </div>

  </div>,
  document.body
)}