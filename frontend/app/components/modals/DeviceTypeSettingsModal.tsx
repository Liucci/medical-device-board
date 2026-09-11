"use client"
import { useState } from "react"
import {createDeviceTypeTransaction} from  "../../../app/api/transactions/deviceTypes/createDeviceTypeTransaction"
import {deleteDeviceTypeTransaction} from  "../../../app/api/transactions/deviceTypes/deleteDeviceTypeTransaction"
import {updateDeviceTypeTransaction} from  "../../../app/api/transactions/deviceTypes/updateDeviceTypeTransaction"
import { createDeviceModelTransaction } from "../../../app/api/transactions/deviceModels/createDeviceModelTransaction"
import { deleteDeviceModelsTransaction } from "../../../app/api/transactions/deviceModels/deleteDeviceModelsTransaction"
import {updateDeviceModelTransaction} from  "../../../app/api/transactions/deviceModels/updateDeviceModelTransaction"
import { Device } from "../../types/deviceTypes"
import { StockAreaType } from "../../types/stockTypes"
import { DeviceTypeType } from "../../types/deviceTypeTypes"
import { DeviceModelType } from "../../types/deviceModelTypes"
import { WardType } from "../../types/wardTypes"
import {CurrentUser  } from "../../types/userTypes"
import { RoomType } from "../../types/roomTypes"
import { executeWithLoading } from "../common/executeWithLoading"
import {LoadingOverlay} from "../common/LoadingOverlay"
import { executeWithErrorAndLoading } from "../../components/common/executeWithErrorAndLoading"
import DeviceModelEditModal from "./DeviceModelEditModal"

type Props = {
  deviceTypes: DeviceTypeType[]
  setDeviceTypes:React.Dispatch<React.SetStateAction<any[]>>
  deviceModels: DeviceModelType[]
  setDeviceModels:React.Dispatch<React.SetStateAction<any[]>>
}

export default function DeviceTypeSettingsModal({
  deviceTypes,
  setDeviceTypes,
  deviceModels,
  setDeviceModels,
}: Props) {

  const [selectedTypeId, setSelectedTypeId] = useState<number | null>(null)
  const [newTypeName, setNewTypeName] = useState("")
  const [newModelName, setNewModelName] = useState("")
  const [checkedModelIds, setCheckedModelIds] = useState<number[]>([])
  const [newIconColor, setNewIconColor] = useState("#BFDBFE")
  const [editIconColor, setEditIconColor] = useState("#BFDBFE")
  const [loading, setLoading] = useState(false)
  const [editDeviceModel, setEditDeviceModel] = useState<DeviceModelType | null>(null)
  // ===== deviceType =====
  const handleAddType = async() => {
      const trimmed = newTypeName.trim()
      if (!trimmed) {return}

      const exists = deviceTypes.some(
                                        t =>
                                        t.name.toLowerCase() ===
                                        trimmed.toLowerCase()
                                    )

      if (exists) {
          alert("同じ機種が既に存在します")
          return
      }
    await executeWithErrorAndLoading({
      setLoading,
      action: async () => {
        await createDeviceTypeTransaction({
                                            deviceType: {
                                                          name: trimmed,
                                                          iconColor: newIconColor
                                                        },
                                            setDeviceTypes
                                          })
                          }
    })                                       
      setNewTypeName("")  
    }

  const handleRenameType = async() => {
    if (!selectedTypeId) return

    const type = deviceTypes.find(t => t.id === selectedTypeId)

    if (!type) return

    const name = prompt(
      "新しい機種名",
      type.name
    )

    if (!name) return

    await executeWithErrorAndLoading({
    setLoading,
    action: async () => {
      await updateDeviceTypeTransaction({
                                          deviceType: {
                                                        id: selectedTypeId,
                                                        name,
                                                        iconColor: type.iconColor
                                                        
                                                      },
                                          setDeviceTypes
                                        })
    }
    })
  }
  
  //色変更用確定実施hundle
  const handleChangeColor = async () => {
    if (!selectedTypeId) return

    const type =deviceTypes.find(t => t.id === selectedTypeId)

    if (!type) return
  await executeWithErrorAndLoading({
    setLoading,
    action: async () => {
        await updateDeviceTypeTransaction({
                                            deviceType: {
                                              id: selectedTypeId,
                                              name: type.name,
                                              iconColor: editIconColor
                                            },
                                            setDeviceTypes
                                          })
   }
  })

  }

  const handleDeleteType = async() => {
      if (!selectedTypeId) {return}
    const confirmed = window.confirm(
      "この機種を削除しますか？\n関連付けられた型式、点検表、点検項目、選択肢も削除されます。\nこの操作は元に戻せません。"
    )

    if (!confirmed) return

  await executeWithErrorAndLoading({
    setLoading,
    action: async () => {

      await deleteDeviceTypeTransaction({
                                          deviceType: {
                                                        id: selectedTypeId
                                                      },
                                          setDeviceTypes
                                        })
     }
  })

  setSelectedTypeId(null)
  }



  // ===== deviceModel =====
  const filteredModels = deviceModels
                                    .filter(m => m.deviceTypeId === selectedTypeId)
                                    .sort((a, b) => a.name.localeCompare(b.name, "ja"))
  const toggleModel = (id: number) => {
                                        setCheckedModelIds(prev =>
                                                                  prev.includes(id)
                                                                    ? prev.filter(i => i !== id)
                                                                    : [...prev, id]
                                                          )
  }

  const handleAddModel = async() => {
    if (!selectedTypeId) {alert("機種を選択してください")
      return
    }

    if (!newModelName.trim()) return
    await executeWithErrorAndLoading({
      setLoading,
      action: async () => {

      await createDeviceModelTransaction({
                                          deviceModel: {
                                                          deviceTypeId: selectedTypeId,
                                                          name: newModelName.trim(),
                                                          displayRemainingCount: false,
                                                          remainingAlertCount: 0
                                                        },
                                          setDeviceModels
                                        })
      }
    })

    setNewModelName("")
  }

  const handleDeleteModels = async () => {
    if (checkedModelIds.length === 0) {return}
    const confirmed = window.confirm(
      "この型式を削除しますか？\n関連付けられた点検表、点検項目、選択肢も削除されます。\nこの操作は元に戻せません。"
    )
     if (!confirmed) return

    await executeWithErrorAndLoading({
        setLoading,
        action: async () => {
          await deleteDeviceModelsTransaction({
                                                deviceModels: {
                                                                ids: checkedModelIds
                                                              },
                                                setDeviceModels
                                              })
          }
    })
    setCheckedModelIds([])

    }

  const handleRenameModel = (
                                model: DeviceModelType
                            ) => {
      setEditDeviceModel(model)
  }

  const handleSaveModel = async (
                                  deviceModel: DeviceModelType
                              ) => {

    await executeWithErrorAndLoading({
        setLoading,
        action: async () => {
            await updateDeviceModelTransaction({
                                                  deviceModel,
                                                  setDeviceModels
                                              })
        }
    })

    setEditDeviceModel(null)
  }

  return (
    <>
<div className="w-full rounded-2xl bg-gray-200 p-5">

  <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* ===================================================== */}
          {/* 左：機種 */}
          {/* ===================================================== */}
          <div className="rounded-xl bg-white p-6 shadow-sm">

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800">
                機種
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                機種を選択して、名前や色の変更、削除を行います
              </p>
            </div>


            {/* ================================================= */}
            {/* 機種選択 */}
            {/* ================================================= */}
            <div className="space-y-2">

              <label className="block text-xs font-medium text-gray-600">
                機種を選択
              </label>

              <div className="flex items-center gap-2">

                <select
                  value={selectedTypeId ?? ""}
                  onChange={(e) => {
                    const val = Number(e.target.value)

                    setSelectedTypeId(val || null)
                    setCheckedModelIds([])

                    const selectedType =
                      deviceTypes.find((t) => t.id === val)

                    if (selectedType) {
                      setEditIconColor(selectedType.iconColor)
                    }
                  }}
                  className="
                    min-w-0
                    flex-1
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

                  {deviceTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>


                {/* 名前変更 */}
                <button
                  onClick={handleRenameType}
                  disabled={!selectedTypeId}
                  className="
                    shrink-0
                    rounded-lg
                    bg-gray-100
                    px-3
                    py-2.5
                    text-sm
                    font-medium
                    text-gray-600
                    transition
                    hover:bg-gray-200
                    hover:text-gray-800
                    disabled:cursor-not-allowed
                    disabled:opacity-40
                  "
                >
                  ✏
                </button>

              </div>

            </div>


            {/* ================================================= */}
            {/* 色変更 */}
            {/* ================================================= */}
            {selectedTypeId && (
              <div className="mt-6">

                <label className="mb-2 block text-xs font-medium text-gray-600">
                  アイコン色
                </label>

                <div className="flex items-center gap-3">

                  <input
                    type="color"
                    value={editIconColor}
                    onChange={(e) =>
                      setEditIconColor(e.target.value)
                    }
                    className="
                      h-10
                      w-14
                      cursor-pointer
                      rounded-lg
                      border
                      border-gray-300
                      bg-white
                      p-1
                    "
                  />

                  <button
                    onClick={handleChangeColor}
                    className="
                      rounded-lg
                      bg-gray-100
                      px-4
                      py-2.5
                      text-sm
                      font-medium
                      text-gray-700
                      transition
                      hover:bg-gray-200
                    "
                  >
                    色を変更
                  </button>

                </div>

              </div>
            )}


            {/* ================================================= */}
            {/* 機種削除 */}
            {/* ================================================= */}
            {selectedTypeId && (
              <div className="mt-6">

                <button
                  onClick={handleDeleteType}
                  className="
                    rounded-lg
                    bg-red-50
                    px-4
                    py-2.5
                    text-sm
                    font-medium
                    text-red-600
                    transition
                    hover:bg-red-100
                  "
                >
                  機種を削除
                </button>

              </div>
            )}


            {/* ================================================= */}
            {/* 新しい機種を追加 */}
            {/* ================================================= */}
            {!selectedTypeId && (
              <div className="mt-8">

                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-800">
                    新しい機種を追加
                  </h4>

                  <p className="mt-1 text-xs text-gray-500">
                    機種名とアイコン色を設定してください
                  </p>
                </div>

                <div className="flex items-end gap-3">

                  <div className="min-w-0 flex-1">

                    <label className="mb-2 block text-xs font-medium text-gray-600">
                      機種名
                    </label>

                    <input
                      value={newTypeName}
                      onChange={(e) =>
                        setNewTypeName(e.target.value)
                      }
                      placeholder="例：人工呼吸器"
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
                    />

                  </div>


                  <div>

                    <label className="mb-2 block text-xs font-medium text-gray-600">
                      色
                    </label>

                    <input
                      type="color"
                      value={newIconColor}
                      onChange={(e) =>
                        setNewIconColor(e.target.value)
                      }
                      className="
                        h-10
                        w-14
                        cursor-pointer
                        rounded-lg
                        border
                        border-gray-300
                        bg-white
                        p-1
                      "
                    />

                  </div>


                  <button
                    onClick={handleAddType}
                    className="
                      shrink-0
                      rounded-lg
                      bg-blue-500
                      px-4
                      py-2.5
                      text-sm
                      font-medium
                      text-white
                      transition
                      hover:bg-blue-600
                    "
                  >
                    追加
                  </button>

                </div>

              </div>
            )}

          </div>


          {/* ===================================================== */}
          {/* 右：型式 */}
          {/* ===================================================== */}
          <div className="rounded-xl bg-white p-6 shadow-sm">

            <div className="mb-6">

              <h3 className="text-lg font-semibold text-gray-800">
                型式
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                選択した機種の型式を管理します
              </p>

            </div>


            {/* ================================================= */}
            {/* 選択中の機種 */}
            {/* ================================================= */}
            <div className="mb-5">

              <div className="text-xs font-medium text-gray-600">
                選択中の機種
              </div>

              <div className="mt-1 text-base font-semibold text-gray-800">

                {selectedTypeId
                  ? deviceTypes.find(
                      (type) => type.id === selectedTypeId
                    )?.name
                  : "機種を選択してください"}

              </div>

            </div>


            {/* ================================================= */}
            {/* 型式一覧ヘッダー */}
            {/* ================================================= */}
            <div className="mb-3 flex items-center justify-between">

              <div>

                <div className="text-sm font-semibold text-gray-800">
                  登録されている型式
                </div>

                {selectedTypeId && (
                  <div className="mt-1 text-xs text-gray-500">
                    {filteredModels.length} 件
                  </div>
                )}

              </div>


              {checkedModelIds.length > 0 && (
                <button
                  onClick={handleDeleteModels}
                  className="
                    rounded-lg
                    bg-red-50
                    px-3
                    py-2
                    text-sm
                    font-medium
                    text-red-600
                    transition
                    hover:bg-red-100
                  "
                >
                  選択削除
                </button>
              )}

            </div>


            {/* ================================================= */}
            {/* 型式一覧 */}
            {/* ================================================= */}
            <div className="max-h-[420px] overflow-y-auto">

              {!selectedTypeId ? (

                <div className="py-12 text-center text-sm text-gray-400">
                  機種を選択してください
                </div>

              ) : filteredModels.length === 0 ? (

                <div className="py-12 text-center text-sm text-gray-400">
                  登録されている型式はありません
                </div>

              ) : (

                <div>

                  {filteredModels.map((model) => (

                    <div
                      key={model.id}
                      className="
                        flex
                        items-center
                        gap-3
                        border-b
                        border-gray-100
                        py-3
                        last:border-b-0
                        hover:bg-gray-50
                      "
                    >

                      {/* チェックボックス */}
                      <input
                        type="checkbox"
                        checked={checkedModelIds.includes(model.id)}
                        onChange={() => toggleModel(model.id)}
                        className="
                          h-4
                          w-4
                          cursor-pointer
                          rounded
                          border-gray-300
                          text-blue-500
                          focus:ring-blue-400
                        "
                      />


                      {/* 型式名 */}
                      <span className="min-w-0 flex-1 truncate text-sm text-gray-800">
                        {model.name}
                      </span>


                      {/* 編集 */}
                      <button
                        onClick={() => handleRenameModel(model)}
                        className="
                          shrink-0
                          rounded-lg
                          bg-gray-100
                          px-3
                          py-1.5
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

                  ))}

                </div>

              )}

            </div>


            {/* ================================================= */}
            {/* 型式追加 */}
            {/* ================================================= */}
            <div className="mt-8">

              <div className="mb-4">

                <h4 className="text-sm font-semibold text-gray-800">
                  新しい型式を追加
                </h4>

                <p className="mt-1 text-xs text-gray-500">
                  選択中の機種に型式を追加します
                </p>

              </div>


              <div className="flex gap-3">

                <input
                  value={newModelName}
                  onChange={(e) =>
                    setNewModelName(e.target.value)
                  }
                  placeholder={
                    selectedTypeId
                      ? "例：Servo-i"
                      : "先に機種を選択してください"
                  }
                  disabled={!selectedTypeId}
                  className="
                    min-w-0
                    flex-1
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
                    disabled:cursor-not-allowed
                    disabled:bg-gray-100
                    disabled:text-gray-400
                    focus:border-blue-500
                    focus:ring-2
                    focus:ring-blue-100
                  "
                />

                <button
                  onClick={handleAddModel}
                  disabled={!selectedTypeId}
                  className="
                    shrink-0
                    rounded-lg
                    bg-blue-500
                    px-4
                    py-2.5
                    text-sm
                    font-medium
                    text-white
                    transition
                    hover:bg-blue-600
                    disabled:cursor-not-allowed
                    disabled:bg-gray-300
                  "
                >
                  追加
                </button>

              </div>

            </div>

          </div>

        </div>
      </div>


      {/* ===================================================== */}
      {/* 型式編集Modal */}
      {/* ===================================================== */}
      <DeviceModelEditModal
        isOpen={editDeviceModel !== null}
        deviceModel={editDeviceModel}
        onClose={() => setEditDeviceModel(null)}
        onSave={handleSaveModel}
      />


      {/* ===================================================== */}
      {/* Loading */}
      {/* ===================================================== */}
      <LoadingOverlay loading={loading} />

    </>
  )  
}