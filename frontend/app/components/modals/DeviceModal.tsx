"use client"

import { useState } from "react"
import {AssetTypes } from "../../types/deviceTypes"
import { Device,  StockLastUpdatedResponse,WardLastUpdatedResponse,} from "../../types/deviceTypes"
import { StockAreaType } from "../../types/stockTypes"
import { DeviceTypeType } from "../../types/deviceTypeTypes"
import { DeviceModelType } from "../../types/deviceModelTypes"
import { WardType } from "../../types/wardTypes"
import {CurrentUser  } from "../../types/userTypes"
import { RoomType } from "../../types/roomTypes"
import {MaintenanceType } from "../../types/maintenanceTypeTypes"
import CommonModal from "../common/CommonModal"
import { createPortal } from "react-dom"
import {createDeviceTransaction} from "../../api/transactions/devices/createDeviceTransaction"
import { executeWithLoading } from "../common/executeWithLoading"
import {LoadingOverlay} from "../common/LoadingOverlay"
import {fetchStockLastUpdated} from "../../api/devices/fetchStockLastUpdated"
import {fetchWardLastUpdated} from "../../api/devices/fetchWardLastUpdated"
import { executeWithErrorAndLoading } from "../../components/common/executeWithErrorAndLoading"

type Props = {
  deviceList: Device[]
  setDeviceList: React.Dispatch<React.SetStateAction<any[]>>
  setStockLastUpdated: React.Dispatch<React.SetStateAction<StockLastUpdatedResponse>>
  setWardLastUpdated: React.Dispatch<React.SetStateAction<WardLastUpdatedResponse>>
  onClose: () => void
  deviceTypes: DeviceTypeType[]
  deviceModels: DeviceModelType[]
  stockAreas: StockAreaType[]
  hospitalId:string
}

export default function DeviceModal({
                                      onClose,
                                   
                                      deviceTypes,
                                      deviceModels,
                                      hospitalId,
                                      deviceList,
                                      stockAreas,
                                      setDeviceList,
                                      setStockLastUpdated,
                                      setWardLastUpdated
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
  const [loading, setLoading] = useState(false)
  const modelsForType = selectedTypeID === ""
    ? []
    : deviceModels.filter(m => m.deviceTypeId === selectedTypeID)



  const handleSubmit = async () => {


    if (selectedTypeID === "") {alert("機種を選択してください")
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

    await executeWithErrorAndLoading({
                                    setLoading,
        action: async () => {
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
    })
    //初期位置はstock area限定なので、wardは更新日更新しない
      setStockLastUpdated(await fetchStockLastUpdated())
      //setWardLastUpdated(await fetchWardLastUpdated())
  }

  return (
    <>
      <CommonModal
        open={true}
        onClose={onClose}
        title="機器登録"
        maxWidth="max-w-[600px]"
      >
        <div className="w-full bg-slate-50 p-4 sm:p-5">
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="p-4 sm:p-5">
              <div className="space-y-4">

                {/* ===================================================== */}
                {/* 機器情報 */}
                {/* ===================================================== */}
                <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
                  <div className="border-b border-slate-100 px-4 py-3 sm:px-5">
                    <div className="text-xs font-bold tracking-wide text-slate-700">
                      機器情報
                    </div>
                  </div>

                  <div className="space-y-4 p-4 sm:p-5">

                    {/* 機種 */}
                    <div>
                      <label className="text-xs font-medium text-slate-500">
                        機種
                      </label>

                      <select
                        className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-900 outline-none transition-colors focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                        value={selectedTypeID}
                        onChange={(e) =>
                          setSelectedTypeID(Number(e.target.value))
                        }
                      >
                        <option value="">
                          機種を選択
                        </option>

                        {deviceTypes.map(t => (
                          <option
                            key={t.id}
                            value={t.id}
                          >
                            {t.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* 型式 */}
                    <div>
                      <label className="text-xs font-medium text-slate-500">
                        型式
                      </label>

                      <select
                        className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-900 outline-none transition-colors focus:border-teal-500 focus:ring-2 focus:ring-teal-100 disabled:bg-white disabled:text-slate-400"
                        value={selectedModelID}
                        onChange={(e) =>
                          setSelectedModelID(Number(e.target.value))
                        }
                        disabled={modelsForType.length === 0}
                      >
                        <option value="">
                          型式を選択
                        </option>

                        {modelsForType.map(m => (
                          <option
                            key={m.id}
                            value={m.id}
                          >
                            {m.name}
                          </option>
                        ))}
                      </select>

                      {modelsForType.length === 0 && (
                        <p className="mt-1.5 text-[11px] text-slate-400">
                          先に機種を選択してください。
                        </p>
                      )}
                    </div>

                    {/* 保管場所 */}
                    <div>
                      <label className="text-xs font-medium text-slate-500">
                        保管場所
                      </label>

                      <select
                        className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-900 outline-none transition-colors focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                        value={selectedStockAreaID}
                        onChange={(e) =>
                          setSelectedStockAreaID(Number(e.target.value))
                        }
                      >
                        <option value="">
                          保管場所を選択
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
                    </div>

                    {/* 登録台数 */}
                    <div>
                      <label className="text-xs font-medium text-slate-500">
                        登録台数
                      </label>

                      <select
                        className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-900 outline-none transition-colors focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                        value={quantity}
                        onChange={(e) =>
                          setQuantity(Number(e.target.value))
                        }
                      >
                        {[1,2,3,4,5,6,7,8,9,10].map(n => (
                          <option
                            key={n}
                            value={n}
                          >
                            {n}台
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* 資産区分 */}
                    <div>
                      <label className="text-xs font-medium text-slate-500">
                        資産区分
                      </label>

                      <select
                        className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-900 outline-none transition-colors focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                        value={selectedAssetType}
                        onChange={(e) =>
                          setSelectedAssetType(
                            e.target.value as typeof AssetTypes[number]
                          )
                        }
                      >
                        {AssetTypes.map(a => (
                          <option
                            key={a}
                            value={a}
                          >
                            {a}
                          </option>
                        ))}
                      </select>
                    </div>

                  </div>
                </section>

                {/* ===================================================== */}
                {/* レンタル・代替機 */}
                {/* ===================================================== */}
                {(selectedAssetType === "レンタル" ||
                  selectedAssetType === "代替機") && (
                  <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
                    <div className="border-b border-slate-100 px-4 py-3 sm:px-5">
                      <div className="text-xs font-bold tracking-wide text-slate-700">
                        貸与期間
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 sm:p-5">

                      {/* 開始日 */}
                      <div>
                        <label className="text-xs font-medium text-slate-500">
                          貸与開始日
                        </label>

                        <input
                          type="date"
                          value={rentalStartDate}
                          onChange={(e) =>
                            setRentalStartDate(e.target.value)
                          }
                          className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-900 outline-none transition-colors focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                        />
                      </div>

                      {/* 終了日 */}
                      <div>
                        <label className="text-xs font-medium text-slate-500">
                          返却日
                        </label>

                        <input
                          type="date"
                          value={rentalEndDate}
                          onChange={(e) =>
                            setRentalEndDate(e.target.value)
                          }
                          className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-900 outline-none transition-colors focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                        />
                      </div>

                    </div>
                  </section>
                )}

                {/* ===================================================== */}
                {/* ボタン */}
                {/* ===================================================== */}
                <div className="flex flex-col-reverse gap-2 border-t border-slate-200 pt-4 sm:flex-row sm:justify-end">

                  <button
                    onClick={onClose}
                    className="h-9 rounded-lg border border-slate-200 bg-slate-50 px-4 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-100"
                  >
                    キャンセル
                  </button>

                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="h-9 rounded-lg bg-teal-700 px-5 text-xs font-bold text-white transition-colors hover:bg-teal-800 disabled:cursor-not-allowed disabled:bg-slate-300"
                  >
                    {loading ? "登録中..." : "登録"}
                  </button>

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