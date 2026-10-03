"use client"

import { useMemo, useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { ChevronDown, ChevronUp, X } from "lucide-react"
import { executeWithErrorAndLoading } from "../../../components/common/executeWithErrorAndLoading"
import { LoadingOverlay } from "../../common/LoadingOverlay"
import type { InspectionListType } from "../../../types/inspectionTypes/inspectionTransactionTypes/inspectionTransactionTypes"
import type { InspectionResult } from "../../../types/inspectionTypes/inspectionResultTypes"
import { HospitalSettingsType } from "../../../types/hospitalSettingTypes"
import { getInspectionsFromApi } from "../../../api/inspection/inspections/fetchInspections"
import { normalizeInspectionList } from "../../../mapper/inspectionMapper/inspectionTransactionMapper/inspectionTransactionMapper"
import { getInspectionResultsFromApi } from "../../../api/inspection/inspectionResults/fetchInspectionResults"
import { normalizeInspectionResult } from "../../../mapper/inspectionMapper/inspectionResultMapper"
import InspectionResultDetailModal from "./InspectionResultDetailModal"
import { getInspectionIdsForPdf } from "../../../api/exports/getInspectionIdsForPdf"
import { createInspectionPdfTransaction } from "../../../api/transactions/exports/createInspectionPdfTransaction"
import { getInspectionIdsForCsv } from "../../../api/exports/getInspectionIdsForCsv"
import { createInspectionCsvTransaction } from "../../../api/transactions/exports/createInspectionCsvTransaction"

type Props = {
  isOpen: boolean
  onClose: () => void
  hospitalSettings: HospitalSettingsType | null
}

export default function InspectionResultModal({ isOpen, onClose, hospitalSettings }: Props) {
  console.log("InspectionResultModal")
  const [inspections, setInspections] = useState<InspectionListType[]>([])
  const [loading, setLoading] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [selectedDeviceTypes, setSelectedDeviceTypes] = useState<string[]>([])
  const [selectedDeviceModels, setSelectedDeviceModels] = useState<string[]>([])
  const [selectedWards, setSelectedWards] = useState<string[]>([])
  const [selectedManagementNumber, setSelectedManagementNumber] = useState("")
  const [selectedPerformer, setSelectedPerformer] = useState("")
  const [openDetailModal, setOpenDetailModal] = useState(false)
  const [selectedInspection, setSelectedInspection] = useState<InspectionListType | null>(null)

  useEffect(() => {
    if (!isOpen) return
    const fetchData = async () => {
      setLoading(true)
      try {
        const data = await getInspectionsFromApi()
        setInspections(data.map(normalizeInspectionList))
      } catch (error) {
        console.error("点検結果一覧取得エラー:", error)
        setInspections([])
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [isOpen])

  const toggleSelection = (value: string, list: string[], setList: (v: string[]) => void) => {
    if (list.includes(value)) {
      setList(list.filter(v => v !== value))
      return
    }
    setList([...list, value])
  }

  const resetSearch = () => {
    setStartDate("")
    setEndDate("")
    setSelectedDeviceTypes([])
    setSelectedDeviceModels([])
    setSelectedWards([])
    setSelectedManagementNumber("")
    setSelectedPerformer("")
  }

  const deviceTypeOptions = useMemo(() => {
    return Array.from(new Set(inspections.map(i => i.deviceTypeName).filter((v): v is string => Boolean(v && v !== "-")))).sort()
  }, [inspections])

  const deviceModelOptions = useMemo(() => {
    return Array.from(new Set(inspections.filter(i => selectedDeviceTypes.length === 0 || selectedDeviceTypes.includes(i.deviceTypeName ?? "")).map(i => i.deviceModelName).filter((v): v is string => Boolean(v && v !== "-")))).sort()
  }, [inspections, selectedDeviceTypes])

  const wardOptions = useMemo(() => {
    return Array.from(new Set(inspections.map(i => i.wardName).filter((v): v is string => Boolean(v && v !== "-")))).sort()
  }, [inspections])

  const managementNumberOptions = useMemo(() => {
    return Array.from(new Set(inspections.map(i => i.managementNumber).filter((v): v is string => Boolean(v && v !== "-")))).sort()
  }, [inspections])

  const performerOptions = useMemo(() => {
    return Array.from(new Set(inspections.map(i => i.performedByName).filter((v): v is string => Boolean(v && v !== "-")))).sort()
  }, [inspections])

  const filteredInspections = useMemo(() => {
    return inspections.filter(i => {
      const created = new Date(i.createdAt ?? "")
      if (startDate && created < new Date(`${startDate}T00:00:00`)) return false
      if (endDate && created > new Date(`${endDate}T23:59:59.999`)) return false
      if (selectedDeviceTypes.length > 0 && !selectedDeviceTypes.includes(i.deviceTypeName ?? "")) return false
      if (selectedDeviceModels.length > 0 && !selectedDeviceModels.includes(i.deviceModelName ?? "")) return false
      if (selectedWards.length > 0 && !selectedWards.includes(i.wardName ?? "")) return false
      if (selectedManagementNumber && i.managementNumber !== selectedManagementNumber) return false
      if (selectedPerformer && i.performedByName !== selectedPerformer) return false
      return true
    }).sort((a, b) => new Date(b.createdAt ?? "").getTime() - new Date(a.createdAt ?? "").getTime())
  }, [inspections, startDate, endDate, selectedDeviceTypes, selectedDeviceModels, selectedWards, selectedManagementNumber, selectedPerformer])

  const handleExportPdf = async () => {
    console.log("handleExportPdf")
    await executeWithErrorAndLoading({
      setLoading,
      action: async () => {
        const inspectionIds = getInspectionIdsForPdf(filteredInspections)
        const blob = await createInspectionPdfTransaction({
          inspectionIds,
          showPatientName: hospitalSettings?.showPatientName === true
        })
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = url
        link.download = "inspection.pdf"
        link.click()
        URL.revokeObjectURL(url)
      }
    })
  }

  const handleExportCsv = async () => {
    console.log("handleExportCsv")
    await executeWithErrorAndLoading({
      setLoading,
      action: async () => {
        const inspectionIds = getInspectionIdsForCsv(filteredInspections)
        const blob = await createInspectionCsvTransaction(inspectionIds)
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = url
        link.download = "inspection.csv"
        link.click()
        URL.revokeObjectURL(url)
      }
    })
  }

  if (!isOpen) return null

  return createPortal(
    <>
      <div
        className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-950/65 p-0 backdrop-blur-sm sm:p-4"
        onMouseDown={e => { if (e.target === e.currentTarget) onClose() }}
      >
        <div
          className="flex h-full w-full flex-col overflow-hidden bg-slate-50 text-slate-900 sm:h-[92vh] sm:max-h-[94vh] sm:max-w-[1500px] sm:rounded-2xl sm:border sm:border-slate-300 sm:shadow-2xl"
          onMouseDown={e => e.stopPropagation()}
        >
          {/* ===== header ===== */}
          <div className="flex h-14 shrink-0 items-center justify-between border-b border-slate-700 bg-slate-900 px-4 text-white sm:px-5">
            <h2 className="text-base font-bold tracking-wide sm:text-lg">点検結果一覧</h2>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleExportCsv}
                className="h-8 rounded-lg border border-slate-600 bg-slate-800 px-3 text-xs font-bold text-slate-100 transition hover:bg-slate-700"
              >
                CSV出力
              </button>
              <button
                type="button"
                onClick={handleExportPdf}
                className="h-8 rounded-lg bg-teal-700 px-3 text-xs font-bold text-white transition hover:bg-teal-800"
              >
                PDF出力
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-300 transition hover:bg-slate-700 hover:text-white"
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
                className="flex w-full items-center justify-between border-b border-slate-100 px-4 py-3 text-left transition hover:bg-slate-50 sm:px-5"
              >
                <div>
                  <div className="text-xs font-bold tracking-wide text-slate-700">検索条件</div>
                  {!searchOpen && <div className="mt-0.5 text-[11px] text-slate-400">条件を指定して点検結果を絞り込みます</div>}
                </div>
                {searchOpen ? <ChevronUp className="h-4 w-4 text-slate-500" /> : <ChevronDown className="h-4 w-4 text-slate-500" />}
              </button>

              {searchOpen && (
                <div className="max-h-[55vh] overflow-y-auto p-4 sm:max-h-none sm:overflow-visible sm:p-5">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                    {/* 日付 */}
                    <div className="space-y-3">
                      <div>
                        <label className="mb-1.5 block text-xs font-medium text-slate-500">検索開始日</label>
                        <input
                          type="date"
                          value={startDate}
                          onChange={e => setStartDate(e.target.value)}
                          className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-800 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-xs font-medium text-slate-500">検索終了日</label>
                        <input
                          type="date"
                          value={endDate}
                          onChange={e => setEndDate(e.target.value)}
                          className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-800 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                        />
                      </div>
                    </div>

                    {/* 機種 */}
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-slate-500">機種</label>
                      <div className="max-h-36 overflow-y-auto rounded-lg border border-slate-200 bg-slate-50 p-2">
                        {deviceTypeOptions.length === 0 ? (
                          <div className="px-2 py-2 text-xs text-slate-400">選択肢がありません</div>
                        ) : (
                          deviceTypeOptions.map(type => (
                            <label key={type} className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm text-slate-700 hover:bg-white">
                              <input
                                type="checkbox"
                                checked={selectedDeviceTypes.includes(type)}
                                onChange={() => toggleSelection(type, selectedDeviceTypes, setSelectedDeviceTypes)}
                                className="h-4 w-4 rounded border-slate-300 text-teal-700 focus:ring-teal-600"
                              />
                              <span>{type}</span>
                            </label>
                          ))
                        )}
                      </div>
                    </div>

                    {/* 型式 */}
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-slate-500">型式</label>
                      <div className="max-h-36 overflow-y-auto rounded-lg border border-slate-200 bg-slate-50 p-2">
                        {deviceModelOptions.length === 0 ? (
                          <div className="px-2 py-2 text-xs text-slate-400">選択肢がありません</div>
                        ) : (
                          deviceModelOptions.map(model => (
                            <label key={model} className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm text-slate-700 hover:bg-white">
                              <input
                                type="checkbox"
                                checked={selectedDeviceModels.includes(model)}
                                onChange={() => toggleSelection(model, selectedDeviceModels, setSelectedDeviceModels)}
                                className="h-4 w-4 rounded border-slate-300 text-teal-700 focus:ring-teal-600"
                              />
                              <span>{model}</span>
                            </label>
                          ))
                        )}
                      </div>
                    </div>

                    {/* 病棟 */}
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-slate-500">病棟</label>
                      <div className="max-h-36 overflow-y-auto rounded-lg border border-slate-200 bg-slate-50 p-2">
                        {wardOptions.length === 0 ? (
                          <div className="px-2 py-2 text-xs text-slate-400">選択肢がありません</div>
                        ) : (
                          wardOptions.map(ward => (
                            <label key={ward} className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm text-slate-700 hover:bg-white">
                              <input
                                type="checkbox"
                                checked={selectedWards.includes(ward)}
                                onChange={() => toggleSelection(ward, selectedWards, setSelectedWards)}
                                className="h-4 w-4 rounded border-slate-300 text-teal-700 focus:ring-teal-600"
                              />
                              <span>{ward}</span>
                            </label>
                          ))
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 管理番号 / 実施者 / クリア */}
                  <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-slate-500">管理番号</label>
                      <select
                        value={selectedManagementNumber}
                        onChange={e => setSelectedManagementNumber(e.target.value)}
                        className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-800 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                      >
                        <option value="">すべて</option>
                        {managementNumberOptions.map(num => <option key={num} value={num}>{num}</option>)}
                      </select>
                    </div>

                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-slate-500">実施者</label>
                      <select
                        value={selectedPerformer}
                        onChange={e => setSelectedPerformer(e.target.value)}
                        className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-800 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                      >
                        <option value="">すべて</option>
                        {performerOptions.map(performer => <option key={performer} value={performer}>{performer}</option>)}
                      </select>
                    </div>

                    <div className="flex items-end md:col-span-2">
                      <button
                        type="button"
                        onClick={resetSearch}
                        className="h-10 w-full rounded-lg border border-slate-300 bg-slate-50 px-4 text-xs font-bold text-slate-700 transition hover:bg-slate-100 xl:w-auto xl:min-w-32"
                      >
                        条件をクリア
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </section>

            {/* ===== inspection table section ===== */}
            <section className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="flex shrink-0 items-center justify-between border-b border-slate-100 px-4 py-3 sm:px-5">
                <div className="text-xs font-bold tracking-wide text-slate-700">点検結果一覧</div>
                <div className="text-xs font-medium text-slate-500">検索結果：{filteredInspections.length}件</div>
              </div>

              <div className="min-h-0 flex-1 overflow-auto">
                <table className="min-w-[1150px] border-collapse text-xs">
                  <thead className="sticky top-0 z-10 bg-slate-100">
                    <tr>
                      <th className="whitespace-nowrap border-b border-r border-slate-200 px-2.5 py-2 text-center font-bold text-slate-600">詳細</th>
                      <th className="whitespace-nowrap border-b border-r border-slate-200 px-2.5 py-2 text-left font-bold text-slate-600">点検日時</th>
                      <th className="whitespace-nowrap border-b border-r border-slate-200 px-2.5 py-2 text-left font-bold text-slate-600">点検種別</th>
                      <th className="whitespace-nowrap border-b border-r border-slate-200 px-2.5 py-2 text-left font-bold text-slate-600">機種</th>
                      <th className="whitespace-nowrap border-b border-r border-slate-200 px-2.5 py-2 text-left font-bold text-slate-600">型式</th>
                      <th className="whitespace-nowrap border-b border-r border-slate-200 px-2.5 py-2 text-left font-bold text-slate-600">管理番号</th>
                      {hospitalSettings?.showPatientName && (
                        <th className="whitespace-nowrap border-b border-r border-slate-200 px-2.5 py-2 text-left font-bold text-slate-600">患者名</th>
                      )}
                      <th className="whitespace-nowrap border-b border-r border-slate-200 px-2.5 py-2 text-left font-bold text-slate-600">病棟</th>
                      <th className="whitespace-nowrap border-b border-r border-slate-200 px-2.5 py-2 text-left font-bold text-slate-600">部屋</th>
                      <th className="whitespace-nowrap border-b border-slate-200 px-2.5 py-2 text-left font-bold text-slate-600">実施者</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredInspections.length === 0 && (
                      <tr>
                        <td
                          colSpan={hospitalSettings?.showPatientName ? 10 : 9}
                          className="border-b border-slate-200 px-4 py-10 text-center text-sm text-slate-400"
                        >
                          点検結果はありません
                        </td>
                      </tr>
                    )}
                    {filteredInspections.map(inspection => (
                      <tr key={inspection.id} className="transition hover:bg-slate-50">
                        <td className="whitespace-nowrap border-b border-r border-slate-200 px-2.5 py-2 text-center">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedInspection(inspection)
                              setOpenDetailModal(true)
                            }}
                            className="h-7 rounded-md border border-slate-200 bg-slate-50 px-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-100"
                          >
                            詳細
                          </button>
                        </td>
                        <td className="whitespace-nowrap border-b border-r border-slate-200 px-2.5 py-2 text-slate-700">
                          {inspection.createdAt ? new Date(inspection.createdAt).toLocaleString("ja-JP") : "-"}
                        </td>
                        <td className="whitespace-nowrap border-b border-r border-slate-200 px-2.5 py-2 text-slate-700">
                          {inspection.inspectionTypeName ?? "-"}
                        </td>
                        <td className="whitespace-nowrap border-b border-r border-slate-200 px-2.5 py-2 text-slate-700">
                          {inspection.deviceTypeName ?? "-"}
                        </td>
                        <td className="whitespace-nowrap border-b border-r border-slate-200 px-2.5 py-2 text-slate-700">
                          {inspection.deviceModelName ?? "-"}
                        </td>
                        <td className="whitespace-nowrap border-b border-r border-slate-200 px-2.5 py-2 font-mono text-slate-700">
                          {inspection.managementNumber ?? "-"}
                        </td>
                        {hospitalSettings?.showPatientName && (
                          <td className="whitespace-nowrap border-b border-r border-slate-200 px-2.5 py-2 text-slate-700">
                            {inspection.patientName ?? "-"}
                          </td>
                        )}
                        <td className="whitespace-nowrap border-b border-r border-slate-200 px-2.5 py-2 text-slate-700">
                          {inspection.wardName ?? "-"}
                        </td>
                        <td className="whitespace-nowrap border-b border-r border-slate-200 px-2.5 py-2 text-slate-700">
                          {inspection.roomName ?? "-"}
                        </td>
                        <td className="whitespace-nowrap border-b border-slate-200 px-2.5 py-2 text-slate-700">
                          {inspection.performedByName ?? "-"}
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

      <InspectionResultDetailModal
        isOpen={openDetailModal}
        onClose={() => {
          setOpenDetailModal(false)
          setSelectedInspection(null)
        }}
        inspection={selectedInspection}
        hospitalSettings={hospitalSettings}
      />
      <LoadingOverlay loading={loading} />
    </>,
    document.body
  )
}