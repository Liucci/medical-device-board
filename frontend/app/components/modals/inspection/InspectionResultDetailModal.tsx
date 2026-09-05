"use client"

import { createPortal } from "react-dom"
import { useEffect, useState } from "react"

import type { Inspection } from "../../../types/inspectionTypes/inspectionTypes"
import type { InspectionResult } from "../../../types/inspectionTypes/inspectionResultTypes"
import type { InspectionChecklistItem } from "../../../types/inspectionTypes/inspectionChecklistItemTypes"

import {
    getInspectionResultsFromApi,
} from "../../../api/inspection/inspectionResults/fetchInspectionResults"

import {
    getInspectionChecklistItemsFromApi,
} from "../../../api/inspection/inspectionChecklistItems/fetchInspectionChecklistItems"

import {
    normalizeInspectionResult,
} from "../../../utils/inspectionMapper/inspectionResultMapper"

import {
    normalizeInspectionChecklistItem,
} from "../../../utils/inspectionMapper/inspectionChecklistItemMapper"


type Props = {
    isOpen: boolean
    onClose: () => void
    inspection: Inspection | null
}


export default function InspectionResultDetailModal({
    isOpen,
    onClose,
    inspection,
}: Props) {

    // =========================================================
    // State
    // =========================================================

    const [results, setResults] =
        useState<InspectionResult[]>([])

    const [checklistItems, setChecklistItems] =
        useState<InspectionChecklistItem[]>([])

    const [loading, setLoading] =
        useState(false)


    // =========================================================
    // 点検結果・点検項目取得
    // =========================================================

    useEffect(() => {

        if (!isOpen || !inspection) {
            return
        }


        const fetchData = async () => {

            setLoading(true)

            try {

                // -------------------------------------------------
                // 点検結果取得
                // -------------------------------------------------

                const resultsData =
                    await getInspectionResultsFromApi(
                        inspection.id
                    )

                const normalizedResults =
                    resultsData.map(
                        normalizeInspectionResult
                    )


                // -------------------------------------------------
                // 点検項目取得
                //
                // inspection.checklistId に紐づく
                // inspection_checklist_items を取得
                // -------------------------------------------------

                const checklistItemsData =
                    await getInspectionChecklistItemsFromApi(
                        inspection.checklistId
                    )

                const normalizedChecklistItems =
                    checklistItemsData.map(
                        normalizeInspectionChecklistItem
                    )


                setResults(
                    normalizedResults
                )

                setChecklistItems(
                    normalizedChecklistItems
                )


            } catch (error) {

                console.error(
                    "点検結果詳細取得エラー:",
                    error
                )

                setResults([])
                setChecklistItems([])

            } finally {

                setLoading(false)

            }

        }


        fetchData()

    }, [
        isOpen,
        inspection,
    ])


    // =========================================================
    // Modal
    // =========================================================

    if (!isOpen || !inspection) {
        return null
    }


    return createPortal(

        <div
            className="
                fixed
                inset-0
                z-[1100]
                flex
                items-center
                justify-center
                bg-black/50
            "
        >

            <div
                className="
                    bg-white
                    rounded-xl
                    shadow-xl
                    w-[1000px]
                    max-w-[95vw]
                    h-[70vh]
                    flex
                    flex-col
                "
            >

                {/* =================================================
                    Header
                ================================================= */}

                <div
                    className="
                        flex
                        items-center
                        justify-between
                        border-b
                        px-6
                        py-4
                    "
                >

                    <h2
                        className="
                            text-xl
                            font-bold
                        "
                    >
                        点検結果詳細
                    </h2>


                    <button
                        type="button"
                        onClick={onClose}
                        className="
                            px-3
                            py-1
                            bg-gray-300
                            rounded
                            hover:bg-gray-400
                        "
                    >
                        閉じる
                    </button>

                </div>


                {/* =================================================
                    Content
                ================================================= */}

                <div
                    className="
                        flex-1
                        overflow-auto
                        p-6
                    "
                >

                    {/* =================================================
                        点検情報
                    ================================================= */}

                    <div className="mb-6">

                        <h3
                            className="
                                text-lg
                                font-bold
                                mb-3
                            "
                        >
                            点検情報
                        </h3>


                        <div
                            className="
                                grid
                                grid-cols-2
                                gap-4
                            "
                        >

                            <div>

                                <div className="text-sm text-gray-500">
                                    点検日時
                                </div>

                                <div>
                                    {
                                        inspection.createdAt
                                            ? new Date(
                                                inspection.createdAt
                                            ).toLocaleString(
                                                "ja-JP"
                                            )
                                            : "-"
                                    }
                                </div>

                            </div>


                            <div>

                                <div className="text-sm text-gray-500">
                                    実施者
                                </div>

                                <div>
                                    {
                                        inspection.performedBy ??
                                        "-"
                                    }
                                </div>

                            </div>


                            <div>

                                <div className="text-sm text-gray-500">
                                    総合結果
                                </div>

                                <div>
                                    {
                                        inspection.overallResult ??
                                        "-"
                                    }
                                </div>

                            </div>


                            <div>

                                <div className="text-sm text-gray-500">
                                    コメント
                                </div>

                                <div>
                                    {
                                        inspection.comment ??
                                        "-"
                                    }
                                </div>

                            </div>

                        </div>

                    </div>


                    {/* =================================================
                        点検項目結果
                    ================================================= */}

                    <div>

                        <h3
                            className="
                                text-lg
                                font-bold
                                mb-3
                            "
                        >
                            点検項目結果
                        </h3>


                        {loading ? (

                            <div
                                className="
                                    py-8
                                    text-center
                                    text-gray-500
                                "
                            >
                                点検結果を取得しています...
                            </div>

                        ) : results.length === 0 ? (

                            <div
                                className="
                                    py-8
                                    text-center
                                    text-gray-500
                                "
                            >
                                点検項目結果はありません
                            </div>

                        ) : (

                            <table
                                className="
                                    w-full
                                    border-collapse
                                    text-sm
                                "
                            >

                                <thead>

                                    <tr
                                        className="
                                            bg-gray-100
                                        "
                                    >

                                        <th className="border p-2 w-16">
                                            No.
                                        </th>

                                        <th className="border p-2">
                                            点検項目
                                        </th>

                                        <th className="border p-2 w-40">
                                            結果
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {results
                                        .map((result) => {

                                            const item =
                                                checklistItems.find(
                                                    (checklistItem) =>
                                                        Number(
                                                            checklistItem.id
                                                        ) ===
                                                        Number(
                                                            result.checklistItemId
                                                        )
                                                )

                                            return {
                                                result,
                                                item,
                                            }

                                        })
                                        .sort(
                                            (a, b) =>
                                                (
                                                    a.item?.displayOrder ??
                                                    999999
                                                ) -
                                                (
                                                    b.item?.displayOrder ??
                                                    999999
                                                )
                                        )
                                        .map(
                                            ({
                                                result,
                                                item,
                                            }) => (

                                                <tr
                                                    key={result.id}
                                                    className="
                                                        hover:bg-gray-50
                                                    "
                                                >

                                                    {/* No. */}

                                                    <td
                                                        className="
                                                            border
                                                            p-2
                                                            text-center
                                                        "
                                                    >
                                                        {
                                                            item?.displayOrder ??
                                                            "-"
                                                        }
                                                    </td>


                                                    {/* 項目名 */}

                                                    <td
                                                        className="
                                                            border
                                                            p-2
                                                        "
                                                    >
                                                        {
                                                            item?.itemName ??
                                                            "-"
                                                        }
                                                    </td>


                                                    {/* 結果 */}

                                                    <td
                                                        className="
                                                            border
                                                            p-2
                                                            text-center
                                                        "
                                                    >
                                                        {
                                                            result.value ??
                                                            "-"
                                                        }
                                                    </td>

                                                </tr>

                                            )
                                        )}

                                </tbody>

                            </table>

                        )}

                    </div>

                </div>

            </div>

        </div>,

        document.body
    )
}