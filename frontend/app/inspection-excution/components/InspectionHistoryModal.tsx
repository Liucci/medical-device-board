"use client"

import React, { useEffect, useState } from "react"
import { X } from "lucide-react"
import { fetchInspectionsByLimit } from "../../api/transactions/inspection/inspections/fetchInspectionsByLimit"
import { InspectionsByLimitFrontType } from "../../types/inspectionTypes/inspectionTransactionTypes/inspectionTransactionTypes"
import { normalizeInspectionsByLimit } from "../../mapper/inspectionMapper/inspectionTransactionMapper/inspectionTransactionMapper"
import { executeWithErrorAndLoading } from "../../components/common/executeWithErrorAndLoading"
import { LoadingOverlay } from "../../components/common/LoadingOverlay"

type InspectionHistoryModalProps = {
    isOpen: boolean
    onClose: () => void
    deviceId: number
    checklistId: number
}

export default function InspectionHistoryModal({
    isOpen,
    onClose,
    deviceId,
    checklistId,
}: InspectionHistoryModalProps) {
    console.log("InspectionHistoryModal")
    const [inspectionData, setInspectionData] = useState<InspectionsByLimitFrontType | null>(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (!isOpen || !deviceId || !checklistId) return
        const fetchData = async () => {
            await executeWithErrorAndLoading({
                setLoading,
                action: async () => {
                    const data = await fetchInspectionsByLimit(deviceId, checklistId)
                    setInspectionData(normalizeInspectionsByLimit(data))
                },
            })
        }
        fetchData()
    }, [isOpen, deviceId, checklistId])

    useEffect(() => {
        if (!isOpen) return
        const originalOverflow = document.body.style.overflow
        document.body.style.overflow = "hidden"
        return () => { document.body.style.overflow = originalOverflow }
    }, [isOpen])

    if (!isOpen) return null

    const inspections = inspectionData?.inspections ?? []
    const results = inspectionData?.results ?? []
    const sortedInspections = [...inspections].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    const categories = Array.from(new Set(results.map((r) => r.categoryName)))
    const checklistName = sortedInspections[0]?.checklistName ?? "－"
    const deviceTypeName = sortedInspections[0]?.deviceTypeName ?? "－"
    const deviceModelName = sortedInspections[0]?.deviceModelName ?? "－"
    const managementNumber = sortedInspections[0]?.managementNumber ?? "－"
    const serialNumber = sortedInspections[0]?.serialNumber ?? "－"

    return (
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/65 p-0 backdrop-blur-sm sm:p-4">
                <div className="flex h-full w-full flex-col overflow-hidden bg-slate-50 shadow-2xl sm:h-[92vh] sm:max-w-6xl sm:rounded-2xl sm:border sm:border-slate-300">
                    <div className="shrink-0 bg-slate-900 px-4 py-3 text-white sm:px-6 sm:py-4">
                        <div className="flex items-start justify-between gap-4">
                            <div className="min-w-0">
                                <span className="text-[11px] font-bold text-teal-400">過去の点検結果</span>
                                <h2 className="mt-0.5 truncate text-base font-bold sm:text-lg">{checklistName}</h2>
                            </div>
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
                                title="閉じる"
                                aria-label="閉じる"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        <div className="mt-2.5 grid grid-cols-2 gap-2 rounded-xl bg-slate-800/80 p-2.5 text-xs sm:grid-cols-4 sm:gap-4 sm:px-4 sm:py-2">
                            <div>
                                <span className="text-[10px] text-slate-400 block">機種</span>
                                <span className="truncate font-bold text-slate-200 block">{deviceTypeName}</span>
                            </div>
                            <div>
                                <span className="text-[10px] text-slate-400 block">型式</span>
                                <span className="truncate font-bold text-slate-200 block">{deviceModelName}</span>
                            </div>
                            <div>
                                <span className="text-[10px] text-slate-400 block">管理番号</span>
                                <span className="truncate font-mono font-bold text-slate-200 block">{managementNumber}</span>
                            </div>
                            <div>
                                <span className="text-[10px] text-slate-400 block">シリアル</span>
                                <span className="truncate font-mono font-bold text-slate-200 block">{serialNumber}</span>
                            </div>
                        </div>
                    </div>

                    <div className="min-h-0 flex-1 overflow-auto bg-slate-50 p-2 sm:p-4">
                        {loading ? (
                            <div className="flex h-full items-center justify-center text-xs text-slate-500">点検結果を取得しています...</div>
                        ) : sortedInspections.length === 0 ? (
                            <div className="flex h-full items-center justify-center text-xs text-slate-500">過去の点検結果はありません</div>
                        ) : (
                            <div className="overflow-auto rounded-xl border border-slate-200 bg-white shadow-xs">
                                <table className="min-w-max border-collapse text-[11px] leading-tight">
                                    <thead>
                                        <tr>
                                            <th rowSpan={3} className="sticky left-0 top-0 z-40 w-[160px] min-w-[160px] border-b border-r border-slate-200 bg-slate-100 px-2.5 py-2 text-left font-bold text-slate-700 sm:w-[220px] sm:min-w-[220px]">
                                                点検項目
                                            </th>
                                            {sortedInspections.map((insp) => {
                                                const d = new Date(insp.createdAt)
                                                return (
                                                    <th key={insp.id} className="sticky top-0 z-30 w-[88px] min-w-[88px] border-b border-r border-slate-200 bg-slate-100 px-1 py-1.5 text-center font-bold text-slate-700 whitespace-nowrap">
                                                        {d.toLocaleDateString("ja-JP", { month: "2-digit", day: "2-digit" })}
                                                    </th>
                                                )
                                            })}
                                        </tr>
                                        <tr>
                                            {sortedInspections.map((insp) => (
                                                <th key={insp.id} className="sticky top-[27px] z-30 border-b border-r border-slate-200 bg-slate-100 px-1 py-0.5 text-center font-mono text-[10px] text-slate-500">
                                                    {new Date(insp.createdAt).toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" })}
                                                </th>
                                            ))}
                                        </tr>
                                        <tr>
                                            {sortedInspections.map((insp) => (
                                                <th key={insp.id} className="sticky top-[47px] z-30 border-b border-r border-slate-200 bg-slate-100 px-1 py-1 text-center font-normal text-slate-600 truncate max-w-[88px]">
                                                    {insp.performedByName || "－"}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {categories.map((category) => {
                                            const catResults = Array.from(
                                                new Map(results.filter((r) => r.categoryName === category).map((r) => [r.itemDisplayOrder, r])).values()
                                            ).sort((a, b) => a.itemDisplayOrder - b.itemDisplayOrder)

                                            return (
                                                <React.Fragment key={`cat-${category}`}>
                                                    <tr>
                                                        <td colSpan={sortedInspections.length + 1} className="border-b border-slate-200 bg-slate-100/70 px-2.5 py-1.5 font-bold text-slate-700">
                                                            ■ {category}
                                                        </td>
                                                    </tr>
                                                    {catResults.map((r) => (
                                                        <tr key={`${category}-${r.itemDisplayOrder}`} className="hover:bg-slate-50/60">
                                                            <td className="sticky left-0 z-20 border-b border-r border-slate-200 bg-white px-2.5 py-1.5 text-left font-medium text-slate-700 whitespace-nowrap">
                                                                {r.itemName}
                                                                {r.unit && <span className="ml-1 text-[10px] text-slate-400">({r.unit})</span>}
                                                            </td>
                                                            {sortedInspections.map((insp) => {
                                                                const ir = results.find((item) => item.inspectionId === insp.id && item.categoryName === category && item.itemDisplayOrder === r.itemDisplayOrder)
                                                                const val = ir?.value
                                                                return (
                                                                    <td key={insp.id} className={`w-[88px] min-w-[88px] border-b border-r border-slate-200 px-1 py-1.5 text-center font-bold ${
                                                                        val === "NG" || val === "異常" ? "text-rose-600 bg-rose-50/40" : val === "-" ? "text-slate-400" : "text-slate-700"
                                                                    }`}>
                                                                        {val ?? "－"}
                                                                    </td>
                                                                )
                                                            })}
                                                        </tr>
                                                    ))}
                                                </React.Fragment>
                                            )
                                        })}
                                        <tr className="bg-slate-50/80">
                                            <td className="sticky left-0 z-20 border-t-2 border-r border-slate-300 bg-slate-100 px-2.5 py-2 font-bold text-slate-800">総合判定</td>
                                            {sortedInspections.map((insp) => (
                                                <td key={insp.id} className={`border-t-2 border-r border-slate-300 px-1 py-2 text-center font-bold text-xs ${
                                                    insp.overallResult === "OK" ? "text-emerald-700" : insp.overallResult === "NG" ? "text-rose-700" : "text-slate-700"
                                                }`}>
                                                    {insp.overallResult || "－"}
                                                </td>
                                            ))}
                                        </tr>
                                        <tr>
                                            <td className="sticky left-0 z-20 border-t border-r border-slate-200 bg-slate-100 px-2.5 py-2 font-bold text-slate-700">備考</td>
                                            {sortedInspections.map((insp) => (
                                                <td key={insp.id} className="border-t border-r border-slate-200 bg-white p-1 text-left text-[10px] text-slate-600 whitespace-normal">
                                                    {insp.comment || "－"}
                                                </td>
                                            ))}
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    <div className="flex shrink-0 justify-end border-t border-slate-200 bg-white p-3 sm:px-6 sm:py-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex h-10 w-full items-center justify-center rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-700 hover:bg-slate-50 sm:h-9 sm:w-28 sm:text-sm"
                        >
                            閉じる
                        </button>
                    </div>
                </div>
            </div>
            <LoadingOverlay loading={loading} />
        </>
    )
}