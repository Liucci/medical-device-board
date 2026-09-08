"use client"

import { createPortal } from "react-dom"
import { useEffect, useState } from "react"

import type { InspectionListType } from "../../../types/inspectionTypes/inspectionTransactionTypes/inspectionTransactionTypes"
import type { InspectionResultDetailType } from "../../../types/inspectionTypes/inspectionTransactionTypes/inspectionTransactionTypes"

import { fetchInspectionResulttransaction,} from "../../../api/transactions/inspection/inspections/fetchInspectionResultTransaction"

import {
    normalizeInspectionResultDetails,
} from "../../../mapper/inspectionMapper/inspectionTransactionMapper/inspectionTransactionMapper"


type Props = {
    isOpen: boolean
    onClose: () => void
    inspection: InspectionListType | null
}


export default function InspectionResultDetailModal({
    isOpen,
    onClose,
    inspection,
}: Props) {

    // =========================================================
    // State
    // =========================================================

    const [
        results,
        setResults
    ] = useState<InspectionResultDetailType[]>([])

    const [
        loading,
        setLoading
    ] = useState(false)


    // =========================================================
    // 点検結果取得
    // Modalを開いたときに取得
    // =========================================================

    useEffect(() => {

        if (!isOpen || !inspection) {
            return
        }

        const fetchData = async () => {

            setLoading(true)

            try {

                const data =
                    await fetchInspectionResulttransaction(
                        inspection.id,
                        inspection.checklistId
                    )

                const normalizedData =
                    normalizeInspectionResultDetails(
                        data
                    )

                setResults(
                    normalizedData
                )

            } catch (error) {

                console.error(
                    "点検結果詳細取得エラー:",
                    error
                )

                setResults([])

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


    // =========================================================
    // 大項目ごとにグループ化
    // =========================================================

    const categories = Array.from(
        new Map(
            results.map(result => [
                result.categoryName,
                {
                    name: result.categoryName,
                    displayOrder:
                        result.categoryDisplayOrder,
                },
            ])
        ).values()
    ).sort(
        (a, b) =>
            a.displayOrder -
            b.displayOrder
    )


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

                            {/* 点検日時 */}

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


                            {/* 点検種別 */}

                            <div>

                                <div className="text-sm text-gray-500">
                                    点検種別
                                </div>

                                <div>
                                    {
                                        inspection.inspectionTypeName ??
                                        "-"
                                    }
                                </div>

                            </div>


                            {/* 機種 */}

                            <div>

                                <div className="text-sm text-gray-500">
                                    機種
                                </div>

                                <div>
                                    {
                                        inspection.deviceTypeName ??
                                        "-"
                                    }
                                </div>

                            </div>


                            {/* 型式 */}

                            <div>

                                <div className="text-sm text-gray-500">
                                    型式
                                </div>

                                <div>
                                    {
                                        inspection.deviceModelName ??
                                        "-"
                                    }
                                </div>

                            </div>


                            {/* 管理番号 */}

                            <div>

                                <div className="text-sm text-gray-500">
                                    管理番号
                                </div>

                                <div>
                                    {
                                        inspection.managementNumber ??
                                        "-"
                                    }
                                </div>

                            </div>


                            {/* 病棟 */}

                            <div>

                                <div className="text-sm text-gray-500">
                                    病棟
                                </div>

                                <div>
                                    {
                                        inspection.wardName ??
                                        "-"
                                    }
                                </div>

                            </div>


                            {/* 部屋 */}

                            <div>

                                <div className="text-sm text-gray-500">
                                    部屋
                                </div>

                                <div>
                                    {
                                        inspection.roomName ??
                                        "-"
                                    }
                                </div>

                            </div>


                            {/* 実施者 */}

                            <div>

                                <div className="text-sm text-gray-500">
                                    実施者
                                </div>

                                <div>
                                    {
                                        inspection.performedByName ??
                                        "-"
                                    }
                                </div>

                            </div>


                            {/* 総合結果 */}

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


                            {/* コメント */}

                            <div className="col-span-2">

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

                            <div className="space-y-6">

                                {categories.map(
                                    category => {

                                        const categoryResults =
                                            results
                                                .filter(
                                                    result =>
                                                        result.categoryName ===
                                                        category.name
                                                )
                                                .sort(
                                                    (a, b) =>
                                                        a.itemDisplayOrder -
                                                        b.itemDisplayOrder
                                                )

                                        return (

                                            <div
                                                key={category.name}
                                            >

                                                {/* 大項目 */}

                                                <div
                                                    className="
                                                        font-bold
                                                        bg-gray-100
                                                        border
                                                        px-3
                                                        py-2
                                                    "
                                                >
                                                    {category.name}
                                                </div>


                                                {/* 点検項目 */}

                                                <div
                                                    className="
                                                        border-x
                                                        border-b
                                                    "
                                                >

                                                    {categoryResults.map(
                                                        result => (

                                                            <div
                                                                key={`${result.categoryName}-${result.itemDisplayOrder}`}
                                                                className="
                                                                    grid
                                                                    grid-cols-[1fr_160px_100px]
                                                                    border-b
                                                                    last:border-b-0
                                                                "
                                                            >

                                                                {/* 点検項目 */}

                                                                <div
                                                                    className="
                                                                        px-3
                                                                        py-2
                                                                    "
                                                                >
                                                                    {
                                                                        result.itemName
                                                                    }
                                                                </div>


                                                                {/* 点検結果 */}

                                                                <div
                                                                    className="
                                                                        px-3
                                                                        py-2
                                                                        text-center
                                                                        border-l
                                                                    "
                                                                >
                                                                    {
                                                                        result.value ??
                                                                        "-"
                                                                    }
                                                                </div>


                                                                {/* unit */}

                                                                <div
                                                                    className="
                                                                        px-3
                                                                        py-2
                                                                        border-l
                                                                    "
                                                                >
                                                                    {
                                                                        result.unit ??
                                                                        ""
                                                                    }
                                                                </div>

                                                            </div>

                                                        )
                                                    )}

                                                </div>

                                            </div>

                                        )

                                    }
                                )}

                            </div>

                        )}

                    </div>

                </div>

            </div>

        </div>,

        document.body
    )
}