"use client"

import {useMemo, useState } from "react"
import { createPortal } from "react-dom"
import { ChevronDown, ChevronUp, X } from "lucide-react"
import { History } from "../../types/historyTypes"
import { HospitalSettingsType } from "../../types/hospitalSettingTypes"
import { exportHistoryPdfTransaction } from "../../api/transactions/exports/exportHistoryPdfTransaction"
import { exportHistoryCsvTransaction } from "../../api/transactions/exports/exportHistoryCsvTransaction"
import { LoadingOverlay } from "../common/LoadingOverlay"
import { executeWithErrorAndLoading } from "../../components/common/executeWithErrorAndLoading"

type Props = {
  isOpen: boolean
  onClose: () => void
  histories: History[]
  hospitalSettings: HospitalSettingsType | null
}

export default function HistoryModal({
  isOpen,
  onClose,
  histories,
  hospitalSettings
}: Props) {
  // ===== search =====
  const [loading, setLoading] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")

  const [selectedDeviceTypes, setSelectedDeviceTypes] = useState<string[]>([])
  const [selectedDeviceModels, setSelectedDeviceModels] = useState<string[]>([])
  const [selectedActionTypes, setSelectedActionTypes] = useState<string[]>([])
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([])

  const [deviceIdKeyword, setDeviceIdKeyword] = useState("")
  const [patientKeyword, setPatientKeyword] = useState("")


  // ===== action label =====
  const actionLabelMap: Record<string, string> = {
    create: "create",
    update: "update",
    move: "move",
    delete: "delete",
    fix_start: "fix_start",
    fix_end: "fix_end"
  }

  // ===== helper =====
  const toggleSelection = (
    value: string,
    list: string[],
    setList: (v: string[]) => void
  ) => {
    if (list.includes(value)) {
      setList(list.filter(v => v !== value))
      return
    }

    setList([...list, value])
  }

  const clearSearchConditions = () => {
    setStartDate("")
    setEndDate("")
    setSelectedDeviceTypes([])
    setSelectedDeviceModels([])
    setSelectedActionTypes([])
    setSelectedStatuses([])
    setDeviceIdKeyword("")
    setPatientKeyword("")
  }

  // ===== master =====
  const deviceTypes = useMemo(() => {
    return Array.from(
      new Set(
        histories
          .map(h => h.deviceTypeName)
          .filter(Boolean)
      )
    )
  }, [histories])

  const deviceModels = useMemo(() => {
    return Array.from(
      new Set(
        histories
          .filter(h => {
            if (selectedDeviceTypes.length === 0) {
              return true
            }

            return selectedDeviceTypes.includes(
              h.deviceTypeName ?? ""
            )
          })
          .map(h => h.deviceModelName)
          .filter(Boolean)
      )
    )
  }, [histories, selectedDeviceTypes])

  // ===== filter =====
  const filteredHistories = useMemo(() => {
    return histories.filter(history => {
      // ===== date =====
      const created = new Date(history.createdAt ?? "")

      if (startDate) {
        const start = new Date(startDate)

        if (created < start) {
          return false
        }
      }

      if (endDate) {
        const end = new Date(endDate)
        end.setHours(23, 59, 59, 999)

        if (created > end) {
          return false
        }
      }

      // ===== device type =====
      if (
        selectedDeviceTypes.length > 0 &&
        !selectedDeviceTypes.includes(
          history.deviceTypeName ?? ""
        )
      ) {
        return false
      }

      // ===== device model =====
      if (
        selectedDeviceModels.length > 0 &&
        !selectedDeviceModels.includes(
          history.deviceModelName ?? ""
        )
      ) {
        return false
      }

      // ===== action =====
      if (
        selectedActionTypes.length > 0 &&
        !selectedActionTypes.includes(
          history.actionType
        )
      ) {
        return false
      }

      // ===== device id =====
      if (
        deviceIdKeyword &&
        !String(history.deviceId).includes(
          deviceIdKeyword
        )
      ) {
        return false
      }

      // ===== patient =====
      if (
        hospitalSettings?.showPatientName &&
        patientKeyword &&
        !history.patientName
          ?.toLowerCase()
          .includes(patientKeyword.toLowerCase())
      ) {
        return false
      }

      return true
    })
  }, [
    histories,
    startDate,
    endDate,
    selectedDeviceTypes,
    selectedDeviceModels,
    selectedActionTypes,
    selectedStatuses,
    deviceIdKeyword,
    patientKeyword,
    hospitalSettings
  ])

  if (!isOpen) return null

  return createPortal(
    <>
      <div
        className="fixed inset-0 z-9999 flex items-center justify-center bg-slate-950/65 p-0 backdrop-blur-sm sm:p-4"
        onMouseDown={e => {
          if (e.target === e.currentTarget) {
            onClose()
          }
        }}
      >
        <div
          className="
            flex h-full w-full flex-col overflow-hidden
            bg-slate-50 text-slate-900
            sm:h-[92vh] sm:max-h-[94vh] sm:max-w-[1500px]
            sm:rounded-2xl sm:border sm:border-slate-300 sm:shadow-2xl
          "
          onMouseDown={e => e.stopPropagation()}
        >
          {/* ===== header ===== */}
          <div className="flex h-14 shrink-0 items-center justify-between border-b border-slate-700 bg-slate-900 px-4 text-white sm:px-5">
            <h2 className="text-base font-bold tracking-wide sm:text-lg">
              履歴一覧
            </h2>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  executeWithErrorAndLoading({
                    setLoading,
                    action: () =>
                      exportHistoryCsvTransaction(
                        filteredHistories,
                        hospitalSettings?.showPatientName ?? false
                      )
                  })
                }
                className="
                  h-8 rounded-lg border border-slate-600
                  bg-slate-800 px-3 text-xs font-bold text-slate-100
                  transition hover:bg-slate-700
                "
              >
                CSV出力
              </button>

              <button
                type="button"
                onClick={() =>
                  executeWithErrorAndLoading({
                    setLoading,
                    action: () =>
                      exportHistoryPdfTransaction(
                        filteredHistories,
                        hospitalSettings?.showPatientName ?? false
                      )
                  })
                }
                className="
                  h-8 rounded-lg bg-teal-700 px-3
                  text-xs font-bold text-white
                  transition hover:bg-teal-800
                "
              >
                PDF出力
              </button>

              <button
                type="button"
                onClick={onClose}
                className="
                  flex h-8 w-8 items-center justify-center
                  rounded-lg text-slate-300
                  transition hover:bg-slate-700 hover:text-white
                "
                aria-label="閉じる"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* ===== main ===== */}
          <div className="flex min-h-0 flex-1 flex-col gap-3 p-3 sm:gap-4 sm:p-4">
            {/* ===== search section ===== */}
            <section className="shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <button
                type="button"
                onClick={() => setSearchOpen(prev => !prev)}
                className="
                  flex w-full items-center justify-between
                  border-b border-slate-100 px-4 py-3
                  text-left transition hover:bg-slate-50
                  sm:px-5
                "
              >
                <div>
                  <div className="text-xs font-bold tracking-wide text-slate-700">
                    検索条件
                  </div>

                  {!searchOpen && (
                    <div className="mt-0.5 text-[11px] text-slate-400">
                      条件を指定して履歴を絞り込みます
                    </div>
                  )}
                </div>

                {searchOpen ? (
                  <ChevronUp className="h-4 w-4 text-slate-500" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-slate-500" />
                )}
              </button>

              {searchOpen && (
                <div className="max-h-[55vh] overflow-y-auto p-4 sm:max-h-none sm:overflow-visible sm:p-5">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                    {/* ===== date ===== */}
                    <div className="space-y-3">
                      <div>
                        <label className="mb-1.5 block text-xs font-medium text-slate-500">
                          検索開始日
                        </label>

                        <input
                          type="date"
                          value={startDate}
                          onChange={e =>
                            setStartDate(e.target.value)
                          }
                          className="
                            h-10 w-full rounded-lg
                            border border-slate-300 bg-white
                            px-3 text-sm text-slate-800
                            outline-none transition
                            focus:border-teal-600 focus:ring-2 focus:ring-teal-100
                          "
                        />
                      </div>

                      <div>
                        <label className="mb-1.5 block text-xs font-medium text-slate-500">
                          検索終了日
                        </label>

                        <input
                          type="date"
                          value={endDate}
                          onChange={e =>
                            setEndDate(e.target.value)
                          }
                          className="
                            h-10 w-full rounded-lg
                            border border-slate-300 bg-white
                            px-3 text-sm text-slate-800
                            outline-none transition
                            focus:border-teal-600 focus:ring-2 focus:ring-teal-100
                          "
                        />
                      </div>
                    </div>

                    {/* ===== keyword ===== */}
                    <div className="space-y-3">
                      <div>
                        <label className="mb-1.5 block text-xs font-medium text-slate-500">
                          機器ID
                        </label>

                        <input
                          type="text"
                          placeholder="機器IDを入力"
                          value={deviceIdKeyword}
                          onChange={e =>
                            setDeviceIdKeyword(
                              e.target.value
                            )
                          }
                          className="
                            h-10 w-full rounded-lg
                            border border-slate-300 bg-white
                            px-3 text-sm text-slate-800
                            outline-none transition
                            placeholder:text-slate-400
                            focus:border-teal-600 focus:ring-2 focus:ring-teal-100
                          "
                        />
                      </div>

                      {hospitalSettings?.showPatientName && (
                        <div>
                          <label className="mb-1.5 block text-xs font-medium text-slate-500">
                            患者名
                          </label>

                          <input
                            type="text"
                            placeholder="患者名を入力"
                            value={patientKeyword}
                            onChange={e =>
                              setPatientKeyword(
                                e.target.value
                              )
                            }
                            className="
                              h-10 w-full rounded-lg
                              border border-slate-300 bg-white
                              px-3 text-sm text-slate-800
                              outline-none transition
                              placeholder:text-slate-400
                              focus:border-teal-600 focus:ring-2 focus:ring-teal-100
                            "
                          />
                        </div>
                      )}
                    </div>

                    {/* ===== device type ===== */}
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-slate-500">
                        機種
                      </label>

                      <div className="max-h-36 overflow-y-auto rounded-lg border border-slate-200 bg-slate-50 p-2">
                        {deviceTypes.length === 0 ? (
                          <div className="px-2 py-2 text-xs text-slate-400">
                            選択肢がありません
                          </div>
                        ) : (
                          deviceTypes.map(type => (
                            <label
                              key={type}
                              className="
                                flex cursor-pointer items-center gap-2
                                rounded-md px-2 py-1.5
                                text-sm text-slate-700
                                hover:bg-white
                              "
                            >
                              <input
                                type="checkbox"
                                checked={selectedDeviceTypes.includes(
                                  type ?? ""
                                )}
                                onChange={() =>
                                  toggleSelection(
                                    type ?? "",
                                    selectedDeviceTypes,
                                    setSelectedDeviceTypes
                                  )
                                }
                                className="h-4 w-4 rounded border-slate-300 text-teal-700 focus:ring-teal-600"
                              />

                              <span>{type}</span>
                            </label>
                          ))
                        )}
                      </div>
                    </div>

                    {/* ===== device model ===== */}
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-slate-500">
                        型式
                      </label>

                      <div className="max-h-36 overflow-y-auto rounded-lg border border-slate-200 bg-slate-50 p-2">
                        {deviceModels.length === 0 ? (
                          <div className="px-2 py-2 text-xs text-slate-400">
                            選択肢がありません
                          </div>
                        ) : (
                          deviceModels.map(model => (
                            <label
                              key={model}
                              className="
                                flex cursor-pointer items-center gap-2
                                rounded-md px-2 py-1.5
                                text-sm text-slate-700
                                hover:bg-white
                              "
                            >
                              <input
                                type="checkbox"
                                checked={selectedDeviceModels.includes(
                                  model ?? ""
                                )}
                                onChange={() =>
                                  toggleSelection(
                                    model ?? "",
                                    selectedDeviceModels,
                                    setSelectedDeviceModels
                                  )
                                }
                                className="h-4 w-4 rounded border-slate-300 text-teal-700 focus:ring-teal-600"
                              />

                              <span>{model}</span>
                            </label>
                          ))
                        )}
                      </div>
                    </div>
                  </div>

                  {/* ===== action / status / clear ===== */}
                  <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                    {/* ===== action ===== */}
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-slate-500">
                        操作
                      </label>

                      <div className="rounded-lg border border-slate-200 bg-slate-50 p-2">
                        {[
                          ["create", "create"],
                          ["update", "update"],
                          ["move", "move"],
                          ["delete", "delete"]
                        ].map(([value, label]) => (
                          <label
                            key={value}
                            className="
                              flex cursor-pointer items-center gap-2
                              rounded-md px-2 py-1.5
                              text-sm text-slate-700
                              hover:bg-white
                            "
                          >
                            <input
                              type="checkbox"
                              checked={selectedActionTypes.includes(
                                value
                              )}
                              onChange={() =>
                                toggleSelection(
                                  value,
                                  selectedActionTypes,
                                  setSelectedActionTypes
                                )
                              }
                              className="h-4 w-4 rounded border-slate-300 text-teal-700 focus:ring-teal-600"
                            />

                            <span>{label}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* ===== status ===== */}
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-slate-500">
                        ステータス
                      </label>

                      <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                        <div className="text-xs text-slate-400">
                          現在選択項目はありません
                        </div>
                      </div>
                    </div>

                    {/* ===== clear ===== */}
                    <div className="flex items-end md:col-span-2">
                      <button
                        type="button"
                        onClick={clearSearchConditions}
                        className="
                          h-10 w-full rounded-lg
                          border border-slate-300
                          bg-slate-50 px-4
                          text-xs font-bold text-slate-700
                          transition hover:bg-slate-100
                          xl:w-auto xl:min-w-32
                        "
                      >
                        条件をクリア
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </section>

            {/* ===== history section ===== */}
            <section className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              {/* ===== section header ===== */}
              <div className="flex shrink-0 items-center justify-between border-b border-slate-100 px-4 py-3 sm:px-5">
                <div className="text-xs font-bold tracking-wide text-slate-700">
                  履歴一覧
                </div>

                <div className="text-xs font-medium text-slate-500">
                  検索結果：{filteredHistories.length}件
                </div>
              </div>

              {/* ===== table scroll area ===== */}
              <div className="min-h-0 flex-1 overflow-auto">
                <table className="min-w-[1150px] border-collapse text-xs">
                  <thead className="sticky top-0 z-10 bg-slate-100">
                    <tr>
                      <th className="whitespace-nowrap border-b border-r border-slate-200 px-2.5 py-2 text-left font-bold text-slate-600">
                        日時
                      </th>

                      <th className="whitespace-nowrap border-b border-r border-slate-200 px-2.5 py-2 text-center font-bold text-slate-600">
                        機器ID
                      </th>

                      <th className="whitespace-nowrap border-b border-r border-slate-200 px-2.5 py-2 text-left font-bold text-slate-600">
                        機種
                      </th>

                      <th className="whitespace-nowrap border-b border-r border-slate-200 px-2.5 py-2 text-left font-bold text-slate-600">
                        型式
                      </th>

                      <th className="whitespace-nowrap border-b border-r border-slate-200 px-2.5 py-2 text-center font-bold text-slate-600">
                        操作
                      </th>

                      <th className="whitespace-nowrap border-b border-r border-slate-200 px-2.5 py-2 text-left font-bold text-slate-600">
                        操作者
                      </th>

                      <th className="whitespace-nowrap border-b border-r border-slate-200 px-2.5 py-2 text-center font-bold text-slate-600">
                        保守開始日
                      </th>

                      <th className="whitespace-nowrap border-b border-r border-slate-200 px-2.5 py-2 text-center font-bold text-slate-600">
                        保守終了日
                      </th>

                      <th className="whitespace-nowrap border-b border-r border-slate-200 px-2.5 py-2 text-left font-bold text-slate-600">
                        配置
                      </th>

                      {hospitalSettings?.showPatientName && (
                        <th className="whitespace-nowrap border-b border-r border-slate-200 px-2.5 py-2 text-left font-bold text-slate-600">
                          患者
                        </th>
                      )}

                      <th className="whitespace-nowrap border-b border-slate-200 px-2.5 py-2 text-left font-bold text-slate-600">
                        内容
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredHistories.length === 0 && (
                      <tr>
                        <td
                          colSpan={
                            hospitalSettings?.showPatientName
                              ? 11
                              : 10
                          }
                          className="border-b border-slate-200 px-4 py-10 text-center text-sm text-slate-400"
                        >
                          履歴がありません
                        </td>
                      </tr>
                    )}

                    {filteredHistories.map(history => (
                      <tr
                        key={history.id}
                        className={`
                          transition hover:bg-slate-50
                          ${
                            history.actionType === "fix_start"
                              ? "bg-rose-50"
                              : history.actionType === "fix_end"
                                ? "bg-emerald-50"
                                : ""
                          }
                        `}
                      >
                        <td className="whitespace-nowrap border-b border-r border-slate-200 px-2.5 py-2 text-slate-700">
                          {history.createdAt
                            ? new Date(
                                history.createdAt
                              ).toLocaleString("ja-JP")
                            : "-"}
                        </td>

                        <td className="whitespace-nowrap border-b border-r border-slate-200 px-2.5 py-2 text-center font-medium text-slate-800">
                          {history.deviceId}
                        </td>

                        <td className="whitespace-nowrap border-b border-r border-slate-200 px-2.5 py-2 text-slate-700">
                          {history.deviceTypeName ?? "-"}
                        </td>

                        <td className="whitespace-nowrap border-b border-r border-slate-200 px-2.5 py-2 text-slate-700">
                          {history.deviceModelName ?? "-"}
                        </td>

                        <td className="whitespace-nowrap border-b border-r border-slate-200 px-2.5 py-2 text-center text-slate-700">
                          {actionLabelMap[history.actionType] ??
                            history.actionType}
                        </td>

                        <td className="whitespace-nowrap border-b border-r border-slate-200 px-2.5 py-2 text-slate-700">
                          {history.actionByName ?? "-"}
                        </td>

                        <td className="whitespace-nowrap border-b border-r border-slate-200 px-2.5 py-2 text-center text-slate-700">
                          {history.maintenanceStartedAt
                            ? new Date(
                                history.maintenanceStartedAt
                              ).toLocaleDateString("ja-JP")
                            : "-"}
                        </td>

                        <td className="whitespace-nowrap border-b border-r border-slate-200 px-2.5 py-2 text-center text-slate-700">
                          {history.maintenanceFinishedAt
                            ? new Date(
                                history.maintenanceFinishedAt
                              ).toLocaleDateString("ja-JP")
                            : "-"}
                        </td>

                        <td className="whitespace-nowrap border-b border-r border-slate-200 px-2.5 py-2 text-slate-700">
                          {history.roomName ??
                            history.stockAreaName ??
                            "-"}
                        </td>

                        {hospitalSettings?.showPatientName && (
                          <td className="whitespace-nowrap border-b border-r border-slate-200 px-2.5 py-2 text-slate-700">
                            {history.patientName ?? "-"}
                          </td>
                        )}

                        <td className="max-w-[420px] border-b border-slate-200 px-2.5 py-2 text-slate-700">
                          <div className="whitespace-pre-wrap break-words">
                            {history.message ?? "-"}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </div>
      </div>

      <LoadingOverlay loading={loading} />
    </>,
    document.body
  )
}