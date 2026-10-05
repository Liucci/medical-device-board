"use client"

import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { X } from "lucide-react"
import { HospitalSettingsType } from "../../../types/hospitalSettingTypes"
import type { InspectionListType } from "../../../types/inspectionTypes/inspectionTransactionTypes/inspectionTransactionTypes"
import type { InspectionResult } from "../../../types/inspectionTypes/inspectionResultTypes"
import { getInspectionResultsFromApi } from "../../../api/inspection/inspectionResults/fetchInspectionResults"
import { normalizeInspectionResult } from "../../../mapper/inspectionMapper/inspectionResultMapper"

type Props = {
  isOpen: boolean
  onClose: () => void
  inspection: InspectionListType | null
  hospitalSettings: HospitalSettingsType | null
}

export default function InspectionResultDetailModal({
  isOpen,
  onClose,
  inspection,
  hospitalSettings,
}: Props) {
  const [results, setResults] = useState<InspectionResult[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!isOpen || !inspection) return
    const fetchData = async () => {
      setLoading(true)
      try {
        console.log("fetchInspectionResults")
        const data = await getInspectionResultsFromApi(inspection.id)
        setResults(data.map(normalizeInspectionResult))
      } catch (error) {
        console.error("点検結果詳細取得エラー:", error)
        setResults([])
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [isOpen, inspection])

  if (!isOpen || !inspection) return null

  const categories = Array.from(
    new Map(
      results.map(result => [
        result.categoryName,
        {
          name: result.categoryName,
          displayOrder: result.categoryDisplayOrder,
        },
      ])
    ).values()
  ).sort((a, b) => a.displayOrder - b.displayOrder)

  return createPortal(
    <div
      className="fixed inset-0 z-[1100] flex items-center justify-center bg-slate-950/65 p-0 backdrop-blur-sm sm:p-4"
      onMouseDown={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className="flex h-full w-full flex-col overflow-hidden bg-slate-50 text-slate-900 sm:h-[90vh] sm:max-h-[92vh] sm:max-w-[1100px] sm:rounded-2xl sm:border sm:border-slate-300 sm:shadow-2xl"
        onMouseDown={e => e.stopPropagation()}
      >
        {/* ===== header ===== */}
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-slate-700 bg-slate-900 px-4 text-white sm:px-5">
          <div>
            <h2 className="text-base font-bold tracking-wide sm:text-lg">点検結果詳細</h2>
            <div className="text-[11px] text-slate-400">点検結果の詳細情報</div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-300 transition hover:bg-slate-700 hover:text-white"
            aria-label="閉じる"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* ===== main content ===== */}
        <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-3 sm:gap-4 sm:p-4">
          {/* ===== section 1: inspection info ===== */}
          <section className="shrink-0 rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-4 py-3 sm:px-5">
              <div className="text-xs font-bold tracking-wide text-slate-700">点検基本情報</div>
              <div className="mt-0.5 text-[11px] text-slate-400">点検時の登録内容</div>
            </div>

            <div className="p-4 sm:p-5">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4">
                <div className="rounded-lg border border-slate-200 bg-white p-2.5">
                  <div className="text-[11px] font-medium text-slate-400">点検日時</div>
                  <div className="mt-0.5 text-xs font-bold text-slate-800">
                    {inspection.createdAt ? new Date(inspection.createdAt).toLocaleString("ja-JP") : "-"}
                  </div>
                </div>

                <div className="rounded-lg border border-slate-200 bg-white p-2.5">
                  <div className="text-[11px] font-medium text-slate-400">点検種別</div>
                  <div className="mt-0.5 text-xs font-bold text-slate-800">{inspection.inspectionTypeName ?? "-"}</div>
                </div>

                <div className="rounded-lg border border-slate-200 bg-white p-2.5">
                  <div className="text-[11px] font-medium text-slate-400">実施者</div>
                  <div className="mt-0.5 text-xs font-bold text-slate-800">{inspection.performedByName ?? "-"}</div>
                </div>

                <div className="rounded-lg border border-slate-200 bg-white p-2.5">
                  <div className="text-[11px] font-medium text-slate-400">管理番号</div>
                  <div className="mt-0.5 font-mono text-xs font-bold text-slate-800">{inspection.managementNumber ?? "-"}</div>
                </div>

                <div className="rounded-lg border border-slate-200 bg-white p-2.5">
                  <div className="text-[11px] font-medium text-slate-400">機種</div>
                  <div className="mt-0.5 text-xs font-bold text-slate-800">{inspection.deviceTypeName ?? "-"}</div>
                </div>

                <div className="rounded-lg border border-slate-200 bg-white p-2.5">
                  <div className="text-[11px] font-medium text-slate-400">型式</div>
                  <div className="mt-0.5 text-xs font-bold text-slate-800">{inspection.deviceModelName ?? "-"}</div>
                </div>

                <div className="rounded-lg border border-slate-200 bg-white p-2.5">
                  <div className="text-[11px] font-medium text-slate-400">病棟 / 部屋</div>
                  <div className="mt-0.5 text-xs font-bold text-slate-800">
                    {[inspection.wardName, inspection.roomName].filter(Boolean).join(" ") || "-"}
                  </div>
                </div>

                {hospitalSettings?.showPatientName && (
                  <div className="rounded-lg border border-slate-200 bg-white p-2.5">
                    <div className="text-[11px] font-medium text-slate-400">患者名</div>
                    <div className="mt-0.5 text-xs font-bold text-slate-800">{inspection.patientName ?? "-"}</div>
                  </div>
                )}
              </div>

              {/* 総合結果 & コメント */}
              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="rounded-lg border border-slate-200 bg-white p-2.5">
                  <div className="text-[11px] font-medium text-slate-400">総合結果</div>
                  <div className="mt-1">
                    <span className="inline-flex items-center rounded-md bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-800">
                      {inspection.overallResult ?? "-"}
                    </span>
                  </div>
                </div>

                <div className="rounded-lg border border-slate-200 bg-white p-2.5 sm:col-span-2">
                  <div className="text-[11px] font-medium text-slate-400">コメント</div>
                  <div className="mt-1 whitespace-pre-wrap break-words text-xs text-slate-800">
                    {inspection.comment ?? "-"}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ===== section 2: checklist items ===== */}
          <section className="flex-1 rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="flex shrink-0 items-center justify-between border-b border-slate-100 px-4 py-3 sm:px-5">
              <div className="text-xs font-bold tracking-wide text-slate-700">点検項目結果</div>
              <div className="text-xs font-medium text-slate-500">{inspection.checklistName}</div>
            </div>

            <div className="p-4 sm:p-5">
              {loading ? (
                <div className="py-12 text-center text-sm text-slate-400">点検結果を取得しています...</div>
              ) : results.length === 0 ? (
                <div className="py-12 text-center text-sm text-slate-400">点検項目結果はありません</div>
              ) : (
                <div className="space-y-4">
                  {categories.map(category => {
                    const categoryResults = results
                      .filter(r => r.categoryName === category.name)
                      .sort((a, b) => a.itemDisplayOrder - b.itemDisplayOrder)

                    return (
                      <div key={category.name} className="overflow-hidden rounded-lg border border-slate-200 bg-white">
                        <div className="border-b border-slate-100 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700">
                          {category.name}
                        </div>
                        <div className="divide-y divide-slate-100">
                          {categoryResults.map(result => (
                            <div
                              key={`${result.categoryName}-${result.itemDisplayOrder}`}
                              className="flex items-center justify-between gap-4 px-3 py-2 text-xs transition hover:bg-slate-50"
                            >
                              <div className="min-w-0 flex-1 font-medium text-slate-800">{result.itemName}</div>
                              <div className="flex shrink-0 items-center gap-1.5">
                                <span className="inline-flex min-w-16 justify-center rounded-md border border-slate-200 bg-slate-50 px-2 py-1 font-bold text-slate-800">
                                  {result.value ?? "-"}
                                </span>
                                {result.unit && <span className="text-[11px] text-slate-500">{result.unit}</span>}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>,
    document.body
  )
}