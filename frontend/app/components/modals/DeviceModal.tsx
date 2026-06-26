"use client"

import { useState } from "react"
import { Device,  AssetTypes } from "../../types/deviceTypes"
import { createPortal } from "react-dom"
import {createDeviceTransaction} from "../../api/transactions/devices/createDeviceTransaction"


type Props = {
  deviceList: any[]
  setDeviceList: React.Dispatch<React.SetStateAction<any[]>>
  onClose: () => void
  deviceTypes: { id: number; name: string }[]
  deviceModels: { id: number; deviceTypeId: number; name: string }[]
  stockAreas: { id: number; name: string }[]
  hospitalId:string
}

export default function DeviceModal({
                                      onClose,
                                   
                                      deviceTypes,
                                      deviceModels,
                                      hospitalId,
                                      deviceList,
                                      stockAreas,
                                      setDeviceList
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

  const [selectedStockAreaID, setSelectedStockAreaID]= useState<number | "">("")
  const [quantity, setQuantity] = useState(1)  
  //登録や読込中ですを表示するためのstate
  const [Loading, setLoading] = useState(false)
  const modelsForType = selectedTypeID === ""
    ? []
    : deviceModels.filter(m => m.deviceTypeId === selectedTypeID)



  const handleSubmit = async () => {


    if (selectedTypeID === "") {
      alert("機種を選択してください")
      return
    }

    if (selectedModelID=== "") {
      alert("型式を選択してください")
      return
    }
    if (selectedStockAreaID=== "") {
      alert("保管場所を選択してください")
      return
    }




      await createDeviceTransaction(
                                      {
                                        params: {
                                                  type: selectedTypeID,
                                                  model: selectedModelID,
                                                  assetType: selectedAssetType,
                                                  stockAreaId: selectedStockAreaID,
                                                  quantity: quantity,
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
                                                },
                                        setDeviceList:setDeviceList,
                                        onClose:onClose,
                                        setLoading:setLoading
                                      }
                                    )
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

        {/* stock areaを選択し初期位置を指定する */}
        <select
          className="border border-gray-300 rounded px-3 py-2 w-full"
          value={selectedStockAreaID}
          onChange={(e) =>
            setSelectedStockAreaID(Number(e.target.value))
          }
        >
          <option value="">
            保管場所選択
          </option>

          {stockAreas.map(area => (
            <option
              key={area.id}
              value={area.id}
            >
              {area.name}
            </option>
          ))}
        </select>
        {/* 登録台数を指定する */}
        <select
          className="border border-gray-300 rounded px-3 py-2 w-full"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
        >
          {[1,2,3,4,5,6,7,8,9,10].map((n) => (
            <option
              key={n}
              value={n}
            >
              {n}台
            </option>
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
          disabled={Loading}
          className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-400"        >
         {Loading ? "登録中..." : "登録"}
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