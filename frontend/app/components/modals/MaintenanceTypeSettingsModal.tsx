"use client"

import { useState } from "react"
import { DeviceTypeType } from "../../types/deviceTypeTypes"
import { DeviceModelType } from "../../types/deviceModelTypes"
import { MaintenanceType } from "../../types/maintenanceTypeTypes"
import { createMaintenanceTypeTransaction } from "../../../app/api/transactions/maintenanceTypes/createMaintenanceTypeTransaction"
import { deleteMaintenanceTypesTransaction } from "../../../app/api/transactions/maintenanceTypes/deleteMaintenanceTypesTransaction"
import { updateMaintenanceTypeTransaction } from "../../../app/api/transactions/maintenanceTypes/updateMaintenanceTypeTransaction"
import { executeWithErrorAndLoading } from "../../components/common/executeWithErrorAndLoading"
import { LoadingOverlay } from "../common/LoadingOverlay"
import useInputModal from "../../components/common/useInputModal"
import { Edit2, Plus, Trash2 } from "lucide-react"

type Props = {
  maintenanceTypes: MaintenanceType[]
  setMaintenanceTypes: React.Dispatch<React.SetStateAction<any[]>>
  deviceTypes: DeviceTypeType[]
  deviceModels: DeviceModelType[]
}

export default function MaintenanceTypeSettingsModal({ maintenanceTypes, setMaintenanceTypes, deviceTypes, deviceModels }: Props) {
  const [selectedTypeId, setSelectedTypeId] = useState<number | "">("")
  const [selectedModelId, setSelectedModelId] = useState<number | "">("")
  const [name, setName] = useState("")
  const [intervalDays, setIntervalDays] = useState(30)
  const [dependDeviceStatus, setDependDeviceStatus] = useState("both")
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [loading, setLoading] = useState(false)
  const inputModal = useInputModal()

  const filteredModels = deviceModels.filter(m => m.deviceTypeId === selectedTypeId)

  const handleAdd = async () => {
    if (selectedTypeId === "") {
      inputModal.openInputModal({
        title: "確認",
        message: "機種を選択してください",
        type: "confirm",
        buttonPattern: "ok_only",
        icon: "warning"
      })
      return
    }
    if (!name.trim()) {
      inputModal.openInputModal({
        title: "確認",
        message: "メンテ名を入力してください",
        type: "confirm",
        buttonPattern: "ok_only",
        icon: "warning"
      })
      return
    }
    await executeWithErrorAndLoading({
      setLoading,
      action: async () => {
        await createMaintenanceTypeTransaction({
          maintenanceType: {
            name,
            deviceTypeId: selectedTypeId,
            deviceModelId: selectedModelId === "" ? null : selectedModelId,
            intervalDays,
            dependDeviceStatus
          },
          setMaintenanceTypes
        })
      }
    })
    setName("")
    setIntervalDays(30)
    setSelectedModelId("")
  }

  const toggleCheck = (id: number) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(v => v !== id) : [...prev, id])
  }

  const handleDelete = async () => {
    if (selectedIds.length === 0) return
    const ok = await inputModal.confirm({
      title: "削除の確認",
      message: "選択したメンテ種別を削除しますか？",
      buttonPattern: "yes_no",
      confirmVariant: "danger",
      icon: "warning"
    })
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

  const handleEdit = (mt: MaintenanceType) => {
    inputModal.openInputModal({
      title: "メンテナンス名の変更",
      label: "メンテ名",
      value: mt.name,
      type: "text",
      buttonPattern: "save_cancel",
      onConfirm: (newName: string) => {
        if (!newName.trim()) return
        inputModal.openInputModal({
          title: "間隔日数の変更",
          label: "間隔日数 (日)",
          value: String(mt.intervalDays),
          type: "number",
          min: 1,
          buttonPattern: "save_cancel",
          onConfirm: async (newInterval: string) => {
            const nextIntervalDays = Number(newInterval)
            if (Number.isNaN(nextIntervalDays) || nextIntervalDays <= 0) return
            await executeWithErrorAndLoading({
              setLoading,
              action: async () => {
                await updateMaintenanceTypeTransaction({
                  maintenanceType: {
                    ...mt,
                    name: newName,
                    intervalDays: nextIntervalDays,
                    dependDeviceStatus
                  },
                  setMaintenanceTypes
                })
              }
            })
          }
        })
      }
    })
  }

  return (
    <>
      <div className="w-full rounded-2xl bg-slate-50 p-4 sm:p-5">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* 左：メンテナンス追加 */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-4 py-3 sm:px-5">
              <h3 className="text-xs font-bold tracking-wide text-slate-700">メンテナンス追加</h3>
              <p className="mt-1 text-[11px] text-slate-500">新しいメンテナンス種別を登録します</p>
            </div>

            <div className="p-4 sm:p-5">
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-xs font-medium text-slate-500">機種</label>
                  <select
                    value={selectedTypeId}
                    onChange={e => {
                      const value = e.target.value
                      setSelectedTypeId(value === "" ? "" : Number(value))
                      setSelectedModelId("")
                    }}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-700 outline-none transition-colors focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                  >
                    <option value="">選択してください</option>
                    {deviceTypes.map(type => (
                      <option key={type.id} value={type.id}>{type.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-medium text-slate-500">型式</label>
                  <select
                    value={selectedModelId}
                    onChange={e => {
                      const value = e.target.value
                      setSelectedModelId(value === "" ? "" : Number(value))
                    }}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-700 outline-none transition-colors focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                  >
                    <option value="">共通</option>
                    {filteredModels.map(model => (
                      <option key={model.id} value={model.id}>{model.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-medium text-slate-500">メンテナンス名</label>
                  <input
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="使用前点検"
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 outline-none transition-colors placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-medium text-slate-500">メンテナンス種類</label>
                  <select
                    value={dependDeviceStatus}
                    onChange={e => setDependDeviceStatus(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-700 outline-none transition-colors focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                  >
                    <option value="room">使用中メンテナンス</option>
                    <option value="stock">保管中メンテナンス</option>
                    <option value="both">定期メンテナンス</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-medium text-slate-500">間隔日数</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={intervalDays}
                      onChange={e => setIntervalDays(Number(e.target.value))}
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 pr-12 text-sm text-slate-700 outline-none transition-colors focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                    />
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400">日</span>
                  </div>
                </div>

                <div className="pt-1">
                  <button
                    type="button"
                    onClick={handleAdd}
                    className="inline-flex h-10 w-full items-center justify-center gap-1.5 rounded-lg bg-teal-700 px-4 text-xs font-bold text-white transition-colors hover:bg-teal-800"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    メンテナンスを追加
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 右：メンテナンス一覧 */}
          <div className="flex min-h-0 flex-col rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-4 py-3 sm:px-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-xs font-bold tracking-wide text-slate-700">メンテナンス一覧</h3>
                  <p className="mt-1 text-[11px] text-slate-500">登録されているメンテナンス種別</p>
                </div>

                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={selectedIds.length === 0}
                  className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-lg border px-3 text-[11px] font-bold transition-colors disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400 enabled:border-rose-200 enabled:bg-rose-50 enabled:text-rose-600 enabled:hover:bg-rose-100"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  削除
                </button>
              </div>
            </div>

            <div className="flex min-h-0 flex-1 flex-col p-4 sm:p-5">
              <div className="mb-3 shrink-0">
                <span className="inline-flex items-center rounded-md bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-600">
                  {maintenanceTypes.length} 件
                </span>
              </div>

              <div className="min-h-0 max-h-[420px] space-y-2 overflow-y-auto pr-1">
                {[...maintenanceTypes]
                  .sort((a, b) => {
                    const aType = deviceTypes.find(t => t.id === a.deviceTypeId)?.name ?? ""
                    const bType = deviceTypes.find(t => t.id === b.deviceTypeId)?.name ?? ""
                    const typeCompare = aType.localeCompare(bType, "ja")
                    if (typeCompare !== 0) return typeCompare

                    const aModel = a.deviceModelId ? deviceModels.find(m => m.id === a.deviceModelId)?.name ?? "" : "共通"
                    const bModel = b.deviceModelId ? deviceModels.find(m => m.id === b.deviceModelId)?.name ?? "" : "共通"
                    const modelCompare = aModel.localeCompare(bModel, "ja")
                    if (modelCompare !== 0) return modelCompare

                    return a.name.localeCompare(b.name, "ja")
                  })
                  .map(mt => {
                    const typeName = deviceTypes.find(t => t.id === mt.deviceTypeId)?.name ?? "不明"
                    const modelName = mt.deviceModelId ? deviceModels.find(m => m.id === mt.deviceModelId)?.name ?? "不明" : "共通"

                    return (
                      <div
                        key={mt.id}
                        className="rounded-xl border border-slate-200 bg-white p-3 transition-colors hover:border-slate-300 hover:bg-slate-50"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex min-w-0 items-start gap-3">
                            <div className="pt-1">
                              <input
                                type="checkbox"
                                checked={selectedIds.includes(mt.id)}
                                onChange={() => toggleCheck(mt.id)}
                                className="h-4 w-4 cursor-pointer rounded border-slate-300 text-teal-700 focus:ring-teal-500"
                              />
                            </div>

                            <div className="min-w-0">
                              <div className="truncate text-sm font-bold text-slate-900">{mt.name}</div>
                              <div className="mt-1 truncate text-[11px] font-medium text-slate-500">{typeName} / {modelName}</div>
                              <div className="mt-1 text-[11px] text-slate-500">
                                メンテナンス種類：
                                {mt.dependDeviceStatus === "room"
                                  ? "使用中メンテナンス"
                                  : mt.dependDeviceStatus === "stock"
                                    ? "保管中メンテナンス"
                                    : "定期メンテナンス"}
                              </div>
                              <div className="mt-2 inline-flex items-center rounded-md bg-slate-100 px-2 py-1 text-[11px] font-bold text-slate-600">
                                間隔 {mt.intervalDays}日
                              </div>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleEdit(mt)}
                            aria-label="メンテナンスを編集"
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    )
                  })}

                {maintenanceTypes.length === 0 && (
                  <div className="flex min-h-[180px] items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50">
                    <div className="text-center">
                      <div className="text-xs font-bold text-slate-500">メンテナンス種別なし</div>
                      <div className="mt-1 text-[11px] text-slate-400">左側からメンテナンスを追加してください</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <LoadingOverlay loading={loading} />
      {inputModal.ModalElement}
    </>
  )
}