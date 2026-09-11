"use client"

import { useState } from "react"
import { Device } from "../../types/deviceTypes"
import { StockAreaType } from "../../types/stockTypes"
import { DeviceTypeType } from "../../types/deviceTypeTypes"
import { DeviceModelType } from "../../types/deviceModelTypes"
import { WardType } from "../../types/wardTypes"
import {CurrentUser  } from "../../types/userTypes"
import { RoomType } from "../../types/roomTypes"
import {MaintenanceType } from "../../types/maintenanceTypeTypes"

import {createMaintenanceTypeTransaction} from "../../../app/api/transactions/maintenanceTypes/createMaintenanceTypeTransaction"
import {deleteMaintenanceTypesTransaction} from "../../../app/api/transactions/maintenanceTypes/deleteMaintenanceTypesTransaction"
import {updateMaintenanceTypeTransaction} from "../../../app/api/transactions/maintenanceTypes/updateMaintenanceTypeTransaction"
import { executeWithLoading } from "../common/executeWithLoading"
import { executeWithErrorAndLoading } from "../../components/common/executeWithErrorAndLoading"

import {LoadingOverlay} from "../common/LoadingOverlay"
import CommonModal from "../common/CommonModal"

type Props = {
  maintenanceTypes: MaintenanceType[]
  setMaintenanceTypes: React.Dispatch<React.SetStateAction<any[]>>
  deviceTypes: DeviceTypeType[]
  deviceModels: DeviceModelType[]
}
export default function MaintenanceTypeSettingsModal({
  maintenanceTypes,
  setMaintenanceTypes,
  deviceTypes,
  deviceModels,
}: Props) {

  const [selectedTypeId, setSelectedTypeId] = useState<number | "">("")
  const [selectedModelId, setSelectedModelId] = useState<number | "">("")

  const [name, setName] = useState("")
  const [intervalDays, setIntervalDays] = useState(30)
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [loading, setLoading] = useState(false)
  // 🔽 型式候補
  const filteredModels = deviceModels.filter(
    m => m.deviceTypeId === selectedTypeId
  )

  // 🔽 追加
  const handleAdd = async () => {

    if (selectedTypeId === "") {
      alert("機種を選択してください")
      return
    }

    if (!name.trim()) {
      alert("メンテ名を入力してください")
      return
    }
    await executeWithErrorAndLoading({
        setLoading,
        action: async () => {
          await createMaintenanceTypeTransaction({
                                                    maintenanceType: {
                                                      name,
                                                      deviceTypeId: selectedTypeId,
                                                      deviceModelId:
                                                        selectedModelId === ""
                                                          ? null
                                                          : selectedModelId,
                                                      intervalDays
                                                    },
                                                    setMaintenanceTypes
                                                  })
              }
    })


    setName("")
    setIntervalDays(30)
    setSelectedModelId("")
  }
  // 🔽 チェック切替
  const toggleCheck = (id: number) => {
    setSelectedIds(prev =>
      prev.includes(id)
        ? prev.filter(v => v !== id)
        : [...prev, id]
    )
  }

  // 🔽 削除
  const handleDelete = async () => {
    if (selectedIds.length === 0) {
      return
    }
    const ok = window.confirm(
      "選択したメンテ種別を削除しますか？"
    )
    if (!ok) return

    await executeWithErrorAndLoading({
        setLoading,
        action: async () => {
    
          await deleteMaintenanceTypesTransaction({
                                                    ids: selectedIds,
                                                    setMaintenanceTypes
                                                  })
        }
    })
    
  setSelectedIds([])    
  }


  
return (
  <>
    <div className="w-full">

      {/* =========================================================
          Maintenance Settings Container
      ========================================================= */}
      <div className="rounded-2xl bg-gray-200 p-5">

        {/* =======================================================
            左右コンテナ
        ======================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

          {/* =====================================================
              左：メンテナンス追加
          ===================================================== */}
          <div className="rounded-xl bg-white p-6 shadow-sm">

            {/* タイトル */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800">
                メンテナンス追加
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                新しいメンテナンス種別を登録します
              </p>
            </div>

            <div className="space-y-5">

              {/* =================================================
                  機種
              ================================================= */}
              <div>
                <label className="mb-2 block text-xs font-medium text-gray-600">
                  機種
                </label>

                <select
                  value={selectedTypeId}
                  onChange={e => {
                    const value = e.target.value

                    setSelectedTypeId(
                      value === ""
                        ? ""
                        : Number(value)
                    )

                    setSelectedModelId("")
                  }}
                  className="
                    w-full
                    rounded-lg
                    border
                    border-gray-300
                    bg-white
                    px-3
                    py-2.5
                    text-sm
                    text-gray-700
                    outline-none
                    transition
                    focus:border-blue-500
                    focus:ring-2
                    focus:ring-blue-100
                  "
                >
                  <option value="">
                    選択してください
                  </option>

                  {deviceTypes.map(type => (
                    <option
                      key={type.id}
                      value={type.id}
                    >
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>


              {/* =================================================
                  型式
              ================================================= */}
              <div>
                <label className="mb-2 block text-xs font-medium text-gray-600">
                  型式
                </label>

                <select
                  value={selectedModelId}
                  onChange={e => {
                    const value = e.target.value

                    setSelectedModelId(
                      value === ""
                        ? ""
                        : Number(value)
                    )
                  }}
                  className="
                    w-full
                    rounded-lg
                    border
                    border-gray-300
                    bg-white
                    px-3
                    py-2.5
                    text-sm
                    text-gray-700
                    outline-none
                    transition
                    focus:border-blue-500
                    focus:ring-2
                    focus:ring-blue-100
                  "
                >
                  <option value="">
                    共通
                  </option>

                  {filteredModels.map(model => (
                    <option
                      key={model.id}
                      value={model.id}
                    >
                      {model.name}
                    </option>
                  ))}
                </select>
              </div>


              {/* =================================================
                  メンテ名
              ================================================= */}
              <div>
                <label className="mb-2 block text-xs font-medium text-gray-600">
                  メンテナンス名
                </label>

                <input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="
                    w-full
                    rounded-lg
                    border
                    border-gray-300
                    bg-white
                    px-3
                    py-2.5
                    text-sm
                    text-gray-700
                    outline-none
                    transition
                    placeholder:text-gray-400
                    focus:border-blue-500
                    focus:ring-2
                    focus:ring-blue-100
                  "
                  placeholder="使用前点検"
                />
              </div>


              {/* =================================================
                  間隔日数
              ================================================= */}
              <div>
                <label className="mb-2 block text-xs font-medium text-gray-600">
                  間隔日数
                </label>

                <div className="relative">
                  <input
                    type="number"
                    value={intervalDays}
                    onChange={e =>
                      setIntervalDays(
                        Number(e.target.value)
                      )
                    }
                    className="
                      w-full
                      rounded-lg
                      border
                      border-gray-300
                      bg-white
                      px-3
                      py-2.5
                      pr-12
                      text-sm
                      text-gray-700
                      outline-none
                      transition
                      focus:border-blue-500
                      focus:ring-2
                      focus:ring-blue-100
                    "
                  />

                  <span
                    className="
                      pointer-events-none
                      absolute
                      right-3
                      top-1/2
                      -translate-y-1/2
                      text-sm
                      text-gray-400
                    "
                  >
                    日
                  </span>
                </div>
              </div>


              {/* =================================================
                  追加ボタン
              ================================================= */}
              <div className="pt-2">

                <button
                  onClick={handleAdd}
                  className="
                    w-full
                    rounded-lg
                    bg-blue-500
                    px-4
                    py-2.5
                    text-sm
                    font-medium
                    text-white
                    shadow-sm
                    transition
                    hover:bg-blue-600
                    hover:shadow
                    active:scale-[0.99]
                  "
                >
                  メンテナンスを追加
                </button>

              </div>

            </div>
          </div>


          {/* =====================================================
              右：メンテナンス一覧
          ===================================================== */}
          <div className="rounded-xl bg-white p-6 shadow-sm">

            {/* =================================================
                ヘッダー
            ================================================= */}
            <div className="mb-5 flex items-center justify-between">

              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  メンテナンス一覧
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  登録されているメンテナンス種別
                </p>
              </div>

              <button
                onClick={handleDelete}
                disabled={selectedIds.length === 0}
                className={`
                  rounded-lg
                  px-4
                  py-2
                  text-sm
                  font-medium
                  transition
                  ${
                    selectedIds.length === 0
                      ? `
                        cursor-not-allowed
                        bg-gray-100
                        text-gray-400
                      `
                      : `
                        bg-red-50
                        text-red-600
                        hover:bg-red-100
                      `
                  }
                `}
              >
                削除
              </button>

            </div>


            {/* =================================================
                件数
            ================================================= */}
            <div className="mb-4">

              <div
                className="
                  inline-flex
                  items-center
                  rounded-full
                  bg-gray-100
                  px-3
                  py-1
                  text-xs
                  font-medium
                  text-gray-600
                "
              >
                {maintenanceTypes.length} 件
              </div>

            </div>


            {/* =================================================
                一覧
            ================================================= */}
            <div
              className="
                max-h-[420px]
                space-y-2
                overflow-y-auto
                pr-1
              "
            >

              {[...maintenanceTypes]
                .sort((a, b) => {

                  const aType =
                    deviceTypes.find(
                      t => t.id === a.deviceTypeId
                    )?.name ?? ""

                  const bType =
                    deviceTypes.find(
                      t => t.id === b.deviceTypeId
                    )?.name ?? ""

                  // ① 機種名
                  const typeCompare =
                    aType.localeCompare(
                      bType,
                      "ja"
                    )

                  if (typeCompare !== 0) {
                    return typeCompare
                  }

                  const aModel =
                    a.deviceModelId
                      ? deviceModels.find(
                          m =>
                            m.id ===
                            a.deviceModelId
                        )?.name ?? ""
                      : "共通"

                  const bModel =
                    b.deviceModelId
                      ? deviceModels.find(
                          m =>
                            m.id ===
                            b.deviceModelId
                        )?.name ?? ""
                      : "共通"

                  // ② 型式名
                  const modelCompare =
                    aModel.localeCompare(
                      bModel,
                      "ja"
                    )

                  if (modelCompare !== 0) {
                    return modelCompare
                  }

                  // ③ メンテ名
                  return a.name.localeCompare(
                    b.name,
                    "ja"
                  )
                })
                .map(mt => {

                  const typeName =
                    deviceTypes.find(
                      t =>
                        t.id ===
                        mt.deviceTypeId
                    )?.name ?? "不明"

                  const modelName =
                    mt.deviceModelId
                      ? deviceModels.find(
                          m =>
                            m.id ===
                            mt.deviceModelId
                        )?.name ?? "不明"
                      : "共通"

                  return (
                    <div
                      key={mt.id}
                      className="
                        group
                        rounded-xl
                        border
                        border-gray-200
                        bg-white
                        p-4
                        transition
                        hover:border-gray-300
                        hover:bg-gray-50
                        hover:shadow-sm
                      "
                    >

                      <div className="flex items-center justify-between gap-4">

                        {/* =====================================
                            左：情報
                        ===================================== */}
                        <div className="flex min-w-0 items-start gap-3">

                          {/* チェックボックス */}
                          <div className="pt-1">

                            <input
                              type="checkbox"
                              checked={selectedIds.includes(
                                mt.id
                              )}
                              onChange={() =>
                                toggleCheck(mt.id)
                              }
                              className="
                                h-4
                                w-4
                                rounded
                                border-gray-300
                                text-blue-500
                                focus:ring-blue-400
                              "
                            />

                          </div>


                          {/* 情報 */}
                          <div className="min-w-0">

                            <div
                              className="
                                truncate
                                text-sm
                                font-semibold
                                text-gray-800
                              "
                            >
                              {mt.name}
                            </div>

                            <div
                              className="
                                mt-1
                                truncate
                                text-xs
                                text-gray-500
                              "
                            >
                              {typeName}
                              {" / "}
                              {modelName}
                            </div>

                            <div
                              className="
                                mt-2
                                inline-flex
                                items-center
                                rounded-full
                                bg-gray-100
                                px-2.5
                                py-1
                                text-xs
                                font-medium
                                text-gray-600
                              "
                            >
                              間隔 {mt.intervalDays}日
                            </div>

                          </div>

                        </div>


                        {/* =====================================
                            右：編集
                        ===================================== */}
                        <button
                          onClick={async () => {

                            const newName =
                              prompt(
                                "メンテ名",
                                mt.name
                              )

                            if (
                              newName === null
                            ) {
                              return
                            }

                            const newInterval =
                              prompt(
                                "間隔日数",
                                `${mt.intervalDays}`
                              )

                            if (
                              newInterval === null
                            ) {
                              return
                            }

                            // promptはstring定義のためnumberに変換
                            const intervalDays =
                              Number(
                                newInterval
                              )

                            if (
                              Number.isNaN(
                                intervalDays
                              )
                            ) {
                              alert(
                                "数値を入力してください"
                              )
                              return
                            }

                            await executeWithErrorAndLoading({
                              setLoading,
                              action: async () => {

                                await updateMaintenanceTypeTransaction({
                                  maintenanceType: {
                                    ...mt,
                                    name:
                                      newName,
                                    intervalDays
                                  },
                                  setMaintenanceTypes
                                })

                              }
                            })

                          }}
                          className="
                            shrink-0
                            rounded-lg
                            bg-gray-100
                            px-3
                            py-2
                            text-sm
                            font-medium
                            text-gray-600
                            transition
                            hover:bg-gray-200
                            hover:text-gray-800
                          "
                        >
                          ✏
                        </button>

                      </div>

                    </div>
                  )
                })}


              {/* =================================================
                  データなし
              ================================================= */}
              {maintenanceTypes.length === 0 && (

                <div
                  className="
                    flex
                    min-h-[180px]
                    items-center
                    justify-center
                    rounded-xl
                    border
                    border-dashed
                    border-gray-300
                    bg-gray-50
                  "
                >
                  <div className="text-center">

                    <div className="text-sm font-medium text-gray-500">
                      メンテナンス種別なし
                    </div>

                    <div className="mt-1 text-xs text-gray-400">
                      左側からメンテナンスを追加してください
                    </div>

                  </div>
                </div>

              )}

            </div>

          </div>

        </div>
      </div>
    </div>

    <LoadingOverlay loading={loading} />
  </>
)  
}