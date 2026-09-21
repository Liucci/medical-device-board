"use client"

import React, { useEffect, useState } from "react"
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
    const [inspectionData, setInspectionData] =
        useState<InspectionsByLimitFrontType | null>(null)

    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (!isOpen) return
        if (!deviceId) return
        if (!checklistId) return

        const fetchData = async () => {
            await executeWithErrorAndLoading({
                setLoading,
                action: async () => {
                    const data = await fetchInspectionsByLimit(
                        deviceId,
                        checklistId
                    )

                    const normalizedData = normalizeInspectionsByLimit(data)
                    setInspectionData(normalizedData)
                },
            })
        }

        fetchData()
    }, [isOpen, deviceId, checklistId])

    if (!isOpen) return null

    const inspections = inspectionData?.inspections ?? []
    const results = inspectionData?.results ?? []

    const sortedInspections = [...inspections].sort(
        (a, b) =>
            new Date(a.createdAt).getTime() -
            new Date(b.createdAt).getTime()
    )

    const categories = Array.from(
        new Set(
            results.map(result => result.categoryName)
        )
    )

    const checklistName =
        sortedInspections[0]?.checklistName ?? "－"

    const deviceTypeName =
        sortedInspections[0]?.deviceTypeName ?? "－"

    const deviceModelName =
        sortedInspections[0]?.deviceModelName ?? "－"

    const managementNumber =
        sortedInspections[0]?.managementNumber ?? "－"

    const serialNumber =
        sortedInspections[0]?.serialNumber ?? "－"

    return (
        <>
            <div
                className="
                    fixed
                    inset-0
                    z-50
                    flex
                    items-center
                    justify-center
                    bg-black/40
                    p-2
                    sm:p-4
                "
            >
                <div
                    className="
                        flex
                        h-[95vh]
                        w-full
                        max-w-[1600px]
                        flex-col
                        overflow-hidden
                        rounded-2xl
                        bg-white
                        shadow-2xl
                        sm:h-[92vh]
                    "
                >
                    {/* ヘッダー */}
                    <div
                        className="
                            shrink-0
                            border-b
                            border-gray-200
                            bg-white
                            px-4
                            py-3
                            sm:px-6
                            sm:py-4
                        "
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div className="min-w-0">
                                <p className="text-xs font-medium text-blue-600">
                                    過去の点検結果
                                </p>

                                <h2
                                    className="
                                        mt-1
                                        truncate
                                        text-base
                                        font-semibold
                                        text-gray-900
                                        sm:text-lg
                                    "
                                >
                                    {checklistName}
                                </h2>
                            </div>

                            <button
                                type="button"
                                onClick={onClose}
                                className="
                                    flex
                                    h-9
                                    w-9
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-lg
                                    text-gray-400
                                    transition
                                    hover:bg-gray-100
                                    hover:text-gray-700
                                "
                            >
                                ✕
                            </button>
                        </div>

                        {/* 機器情報 */}
                        <div
                            className="
                                mt-3
                                grid
                                grid-cols-2
                                gap-x-4
                                gap-y-2
                                rounded-xl
                                bg-gray-50
                                px-3
                                py-3
                                text-xs
                                sm:grid-cols-4
                                sm:gap-x-6
                                sm:px-4
                            "
                        >
                            <div className="min-w-0">
                                <p className="text-[10px] font-medium text-gray-400">
                                    機種
                                </p>
                                <p className="truncate font-medium text-gray-700">
                                    {deviceTypeName}
                                </p>
                            </div>

                            <div className="min-w-0">
                                <p className="text-[10px] font-medium text-gray-400">
                                    型式
                                </p>
                                <p className="truncate font-medium text-gray-700">
                                    {deviceModelName}
                                </p>
                            </div>

                            <div className="min-w-0">
                                <p className="text-[10px] font-medium text-gray-400">
                                    管理番号
                                </p>
                                <p className="truncate font-medium text-gray-700">
                                    {managementNumber}
                                </p>
                            </div>

                            <div className="min-w-0">
                                <p className="text-[10px] font-medium text-gray-400">
                                    シリアル
                                </p>
                                <p className="truncate font-medium text-gray-700">
                                    {serialNumber}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* 表 */}
                    <div
                        className="
                            min-h-0
                            flex-1
                            overflow-auto
                            bg-gray-50
                            p-2
                            sm:p-4
                        "
                    >
                        {loading ? (
                            <div className="flex h-full items-center justify-center text-sm text-gray-500">
                                点検結果を取得しています...
                            </div>
                        ) : sortedInspections.length === 0 ? (
                            <div className="flex h-full items-center justify-center text-sm text-gray-500">
                                過去の点検結果はありません
                            </div>
                        ) : (
                            <div className="overflow-auto rounded-xl border border-gray-200 bg-white shadow-sm">
                                <table
                                    className="
                                        min-w-max
                                        border-collapse
                                        text-[11px]
                                        leading-tight
                                    "
                                >
                                    <thead>
                                        {/* 日付 */}
                                        <tr>
                                            <th
                                                rowSpan={3}
                                                className="
                                                    sticky
                                                    left-0
                                                    top-0
                                                    z-40
                                                    w-[180px]
                                                    min-w-[180px]
                                                    border
                                                    border-gray-300
                                                    bg-gray-100
                                                    px-2
                                                    py-2
                                                    text-left
                                                    font-semibold
                                                    text-gray-700
                                                    sm:w-[220px]
                                                    sm:min-w-[220px]
                                                "
                                            >
                                                点検項目
                                            </th>

                                            {sortedInspections.map(inspection => {
                                                const date = new Date(
                                                    inspection.createdAt
                                                )

                                                const dateText =
                                                    date.toLocaleDateString(
                                                        "ja-JP",
                                                        {
                                                            year: "numeric",
                                                            month: "2-digit",
                                                            day: "2-digit",
                                                        }
                                                    )

                                                return (
                                                    <th
                                                        key={inspection.id}
                                                        className="
                                                            sticky
                                                            top-0
                                                            z-30
                                                            w-[90px]
                                                            min-w-[90px]
                                                            border
                                                            border-gray-300
                                                            bg-gray-100
                                                            px-1
                                                            py-2
                                                            text-center
                                                            font-semibold
                                                            text-gray-700
                                                            whitespace-nowrap
                                                            sm:w-[100px]
                                                            sm:min-w-[100px]
                                                        "
                                                    >
                                                        {dateText}
                                                    </th>
                                                )
                                            })}
                                        </tr>

                                        {/* 時刻 */}
                                        <tr>
                                            {sortedInspections.map(inspection => {
                                                const date = new Date(
                                                    inspection.createdAt
                                                )

                                                const timeText =
                                                    date.toLocaleTimeString(
                                                        "ja-JP",
                                                        {
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                        }
                                                    )

                                                return (
                                                    <th
                                                        key={inspection.id}
                                                        className="
                                                            sticky
                                                            top-[31px]
                                                            z-30
                                                            border
                                                            border-gray-300
                                                            bg-gray-100
                                                            px-1
                                                            py-1
                                                            text-center
                                                            font-normal
                                                            text-gray-500
                                                        "
                                                    >
                                                        {timeText}
                                                    </th>
                                                )
                                            })}
                                        </tr>

                                        {/* 実施者 */}
                                        <tr>
                                            {sortedInspections.map(inspection => (
                                                <th
                                                    key={inspection.id}
                                                    className="
                                                        sticky
                                                        top-[56px]
                                                        z-30
                                                        border
                                                        border-gray-300
                                                        bg-gray-100
                                                        px-1
                                                        py-1
                                                        text-center
                                                        font-normal
                                                        text-gray-600
                                                    "
                                                >
                                                    {inspection.performedByName || "－"}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {categories.map(category => {
                                            const categoryResults = Array.from(
                                                new Map(
                                                    results
                                                        .filter(
                                                            result =>
                                                                result.categoryName ===
                                                                category
                                                        )
                                                        .map(result => [
                                                            result.itemDisplayOrder,
                                                            result,
                                                        ])
                                                ).values()
                                            ).sort(
                                                (a, b) =>
                                                    a.itemDisplayOrder -
                                                    b.itemDisplayOrder
                                            )

                                            return (
                                                <React.Fragment
                                                    key={`category-${category}`}
                                                >
                                                    {/* カテゴリ */}
                                                    <tr>
                                                        <td
                                                            colSpan={
                                                                sortedInspections.length + 1
                                                            }
                                                            className="
                                                                border
                                                                border-gray-300
                                                                bg-gray-100
                                                                px-2
                                                                py-1.5
                                                                font-semibold
                                                                text-gray-700
                                                            "
                                                        >
                                                            ■ {category}
                                                        </td>
                                                    </tr>

                                                    {/* 点検項目 */}
                                                    {categoryResults.map(result => (
                                                        <tr
                                                            key={`${category}-${result.itemDisplayOrder}`}
                                                        >
                                                            <td
                                                                className="
                                                                    sticky
                                                                    left-0
                                                                    z-20
                                                                    border
                                                                    border-gray-300
                                                                    bg-white
                                                                    px-2
                                                                    py-2
                                                                    text-left
                                                                    text-gray-700
                                                                    whitespace-nowrap
                                                                "
                                                            >
                                                                {result.itemName}

                                                                {result.unit && (
                                                                    <span className="ml-1 text-gray-400">
                                                                        ({result.unit})
                                                                    </span>
                                                                )}
                                                            </td>

                                                            {sortedInspections.map(
                                                                inspection => {
                                                                    const inspectionResult =
                                                                        results.find(
                                                                            item =>
                                                                                item.inspectionId ===
                                                                                    inspection.id &&
                                                                                item.categoryName ===
                                                                                    category &&
                                                                                item.itemDisplayOrder ===
                                                                                    result.itemDisplayOrder
                                                                        )

                                                                    const value =
                                                                        inspectionResult?.value

                                                                    return (
                                                                        <td
                                                                            key={
                                                                                inspection.id
                                                                            }
                                                                            className={`
                                                                                w-[90px]
                                                                                min-w-[90px]
                                                                                border
                                                                                border-gray-300
                                                                                bg-white
                                                                                px-1
                                                                                py-2
                                                                                text-center
                                                                                font-medium
                                                                                sm:w-[100px]
                                                                                sm:min-w-[100px]
                                                                                ${
                                                                                    value ===
                                                                                    "×"
                                                                                        ? "text-red-600"
                                                                                        : value ===
                                                                                          "-"
                                                                                        ? "text-gray-400"
                                                                                        : "text-gray-700"
                                                                                }
                                                                            `}
                                                                        >
                                                                            {value ??
                                                                                "－"}
                                                                        </td>
                                                                    )
                                                                }
                                                            )}
                                                        </tr>
                                                    ))}
                                                </React.Fragment>
                                            )
                                        })}

                                        {/* 総合判定 */}
                                        <tr>
                                            <td
                                                className="
                                                    sticky
                                                    left-0
                                                    z-20
                                                    border
                                                    border-gray-300
                                                    bg-gray-100
                                                    px-2
                                                    py-2
                                                    font-semibold
                                                    text-gray-700
                                                "
                                            >
                                                総合判定
                                            </td>

                                            {sortedInspections.map(inspection => (
                                                <td
                                                    key={inspection.id}
                                                    className="
                                                        border
                                                        border-gray-300
                                                        bg-gray-100
                                                        px-1
                                                        py-2
                                                        text-center
                                                        font-semibold
                                                        text-gray-700
                                                    "
                                                >
                                                    {inspection.overallResult || "－"}
                                                </td>
                                            ))}
                                        </tr>

                                        {/* 備考 */}
                                        <tr>
                                            <td
                                                className="
                                                    sticky
                                                    bottom-0
                                                    left-0
                                                    z-20
                                                    border
                                                    border-gray-300
                                                    bg-gray-100
                                                    px-2
                                                    py-2
                                                    font-semibold
                                                    text-gray-700
                                                "
                                            >
                                                備考
                                            </td>

                                            {sortedInspections.map(inspection => (
                                                <td
                                                    key={inspection.id}
                                                    className="
                                                        border
                                                        border-gray-300
                                                        bg-white
                                                        px-1
                                                        py-2
                                                        text-left
                                                        text-gray-600
                                                        whitespace-normal
                                                    "
                                                >
                                                    {inspection.comment || "－"}
                                                </td>
                                            ))}
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {/* フッター */}
                    <div
                        className="
                            flex
                            shrink-0
                            justify-end
                            border-t
                            border-gray-200
                            bg-white
                            px-4
                            py-3
                            sm:px-6
                        "
                    >
                        <button
                            type="button"
                            onClick={onClose}
                            className="
                                rounded-lg
                                bg-gray-800
                                px-5
                                py-2.5
                                text-sm
                                font-medium
                                text-white
                                transition
                                hover:bg-gray-700
                            "
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