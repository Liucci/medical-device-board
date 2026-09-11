"use client"

import { createPortal } from "react-dom"
import { useEffect, useState } from "react"
import { HospitalSettingsType } from "../../../types/hospitalSettingTypes"

import type { InspectionListType } from "../../../types/inspectionTypes/inspectionTransactionTypes/inspectionTransactionTypes"
import type { InspectionResult } from "../../../types/inspectionTypes/inspectionResultTypes"

import {
    getInspectionResultsFromApi,
} from "../../../api/inspection/inspectionResults/fetchInspectionResults"

import {
    normalizeInspectionResult,
} from "../../../mapper/inspectionMapper/inspectionResultMapper"


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

    // =========================================================
    // State
    // =========================================================

    const [
        results,
        setResults
    ] = useState<InspectionResult[]>([])

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

                console.log("fetchInspectionResults")

                const data =
                    await getInspectionResultsFromApi(
                        inspection.id
                    )

                const normalizedData =
                    data.map(
                        normalizeInspectionResult
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
            p-4
        "
    >

        <div
            className="
                bg-gray-200
                rounded-2xl
                shadow-2xl
                w-[1200px]
                max-w-[95vw]
                h-[80vh]
                max-h-[900px]
                flex
                flex-col
                overflow-hidden
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
                    px-6
                    py-4
                    bg-white
                    shrink-0
                "
            >

                <div>

                    <h2
                        className="
                            text-xl
                            font-bold
                            text-gray-800
                        "
                    >
                        点検結果詳細
                    </h2>

                    <div
                        className="
                            text-xs
                            text-gray-500
                            mt-1
                        "
                    >
                        点検結果の詳細情報
                    </div>

                </div>

                <button
                    type="button"
                    onClick={onClose}
                    className="
                        px-4
                        py-2
                        text-sm
                        font-medium
                        text-gray-700
                        bg-gray-100
                        rounded-lg
                        hover:bg-gray-200
                        transition
                    "
                >
                    閉じる
                </button>

            </div>


            {/* =================================================
                Main
            ================================================= */}

            <div
                className="
                    flex
                    flex-1
                    min-h-0
                "
            >

                {/* =================================================
                    Left
                    点検情報
                ================================================= */}

                <div
                    className="
                        w-1/3
                        min-w-[320px]
                        px-6
                        py-5
                        overflow-y-auto
                    "
                >

                    <div
                        className="
                            mb-5
                        "
                    >

                        <h3
                            className="
                                text-lg
                                font-semibold
                                text-gray-800
                            "
                        >
                            点検情報
                        </h3>

                        <p
                            className="
                                mt-1
                                text-sm
                                text-gray-500
                            "
                        >
                            点検時の登録情報
                        </p>

                    </div>


                    <div
                        className="
                            bg-white
                            rounded-xl
                            p-6
                            shadow-sm
                        "
                    >

                        <div className="space-y-5">

                            <div>
                                <div className="mb-1 text-xs text-gray-500">
                                    点検日時
                                </div>
                                <div className="text-sm font-medium text-gray-800">
                                    {
                                        inspection.createdAt
                                            ? new Date(
                                                inspection.createdAt
                                            ).toLocaleString("ja-JP")
                                            : "-"
                                    }
                                </div>
                            </div>

                            <div>
                                <div className="mb-1 text-xs text-gray-500">
                                    点検種別
                                </div>
                                <div className="text-sm font-medium text-gray-800">
                                    {inspection.inspectionTypeName ?? "-"}
                                </div>
                            </div>

                            <div>
                                <div className="mb-1 text-xs text-gray-500">
                                    機種
                                </div>
                                <div className="text-sm font-medium text-gray-800">
                                    {inspection.deviceTypeName ?? "-"}
                                </div>
                            </div>

                            <div>
                                <div className="mb-1 text-xs text-gray-500">
                                    型式
                                </div>
                                <div className="text-sm font-medium text-gray-800">
                                    {inspection.deviceModelName ?? "-"}
                                </div>
                            </div>

                            <div>
                                <div className="mb-1 text-xs text-gray-500">
                                    管理番号
                                </div>
                                <div className="text-sm font-medium text-gray-800">
                                    {inspection.managementNumber ?? "-"}
                                </div>
                            </div>

                            {hospitalSettings?.showPatientName === true && (
                            <div>
                                <div className="mb-1 text-xs text-gray-500">
                                    患者名
                                </div>
                                <div className="text-sm font-medium text-gray-800">
                                    {inspection.patientName ?? "-"}
                                </div>
                            </div>
                            )}

                            <div>
                                <div className="mb-1 text-xs text-gray-500">
                                    病棟
                                </div>
                                <div className="text-sm font-medium text-gray-800">
                                    {inspection.wardName ?? "-"}
                                </div>
                            </div>

                            <div>
                                <div className="mb-1 text-xs text-gray-500">
                                    部屋
                                </div>
                                <div className="text-sm font-medium text-gray-800">
                                    {inspection.roomName ?? "-"}
                                </div>
                            </div>

                            <div>
                                <div className="mb-1 text-xs text-gray-500">
                                    実施者
                                </div>
                                <div className="text-sm font-medium text-gray-800">
                                    {inspection.performedByName ?? "-"}
                                </div>
                            </div>

                            <div>
                                <div className="mb-1 text-xs text-gray-500">
                                    総合結果
                                </div>
                                <div
                                    className="
                                        inline-flex
                                        items-center
                                        rounded-lg
                                        bg-gray-100
                                        px-3
                                        py-1.5
                                        text-sm
                                        font-semibold
                                        text-gray-800
                                    "
                                >
                                    {inspection.overallResult ?? "-"}
                                </div>
                            </div>

                            <div>
                                <div className="mb-1 text-xs text-gray-500">
                                    コメント
                                </div>
                                <div
                                    className="
                                        text-sm
                                        text-gray-800
                                        whitespace-pre-wrap
                                        break-words
                                    "
                                >
                                    {inspection.comment ?? "-"}
                                </div>
                            </div>

                        </div>

                    </div>

                </div>


                {/* =================================================
                    Right
                    点検項目結果
                ================================================= */}

                <div
                    className="
                        flex-1
                        min-w-0
                        flex
                        flex-col
                        px-6
                        py-5
                    "
                >

                    <div
                        className="
                            flex
                            items-center
                            justify-between
                            mb-4
                            shrink-0
                        "
                    >

                        <div>

                            <h3
                                className="
                                    text-lg
                                    font-semibold
                                    text-gray-800
                                "
                            >
                                点検項目結果
                            </h3>

                            <p
                                className="
                                    mt-1
                                    text-sm
                                    text-gray-500
                                "
                            >
                                {inspection.checklistName}
                            </p>

                        </div>


                    </div>


                    {/* =================================================
                        Result Container
                    ================================================= */}

                    <div
                        className="
                            flex-1
                            min-h-0
                            overflow-y-auto
                            pr-2
                        "
                    >

                        {loading ? (

                            <div
                                className="
                                    h-full
                                    flex
                                    items-center
                                    justify-center
                                    rounded-xl
                                    bg-white
                                    shadow-sm
                                "
                            >

                                <div className="text-sm text-gray-500">
                                    点検結果を取得しています...
                                </div>

                            </div>

                        ) : results.length === 0 ? (

                            <div
                                className="
                                    h-full
                                    flex
                                    items-center
                                    justify-center
                                    rounded-xl
                                    bg-white
                                    shadow-sm
                                "
                            >

                                <div className="text-sm text-gray-500">
                                    点検項目結果はありません
                                </div>

                            </div>

                        ) : (

                            <div
                                className="
                                    space-y-5
                                    pb-2
                                "
                            >

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
                                                className="
                                                    rounded-xl
                                                    bg-white
                                                    p-6
                                                    shadow-sm
                                                "
                                            >

                                                {/* カテゴリ */}

                                                <div
                                                    className="
                                                        mb-4
                                                        pb-3
                                                    "
                                                >

                                                    <h3
                                                        className="
                                                            text-lg
                                                            font-semibold
                                                            text-gray-800
                                                        "
                                                    >
                                                        {category.name}
                                                    </h3>



                                                </div>


                                                {/* 項目 */}

                                                <div className="space-y-3">

                                                    {categoryResults.map(
                                                        result => (

                                                            <div
                                                                key={`${result.categoryName}-${result.itemDisplayOrder}`}
                                                                className="
                                                                    flex
                                                                    items-center
                                                                    justify-between
                                                                    gap-6
                                                                    rounded-lg
                                                                    bg-gray-50
                                                                    px-4
                                                                    py-3
                                                                    transition
                                                                    hover:bg-gray-100
                                                                "
                                                            >

                                                                {/* 点検項目 */}

                                                                <div
                                                                    className="
                                                                        min-w-0
                                                                        flex-1
                                                                        text-sm
                                                                        font-medium
                                                                        text-gray-800
                                                                    "
                                                                >
                                                                    {result.itemName}
                                                                </div>


                                                                {/* 結果 + 単位 */}

                                                                <div
                                                                    className="
                                                                        flex
                                                                        shrink-0
                                                                        items-center
                                                                        gap-2
                                                                    "
                                                                >

                                                                    <span
                                                                        className="
                                                                            inline-flex
                                                                            min-w-[72px]
                                                                            justify-center
                                                                            rounded-lg
                                                                            bg-white
                                                                            px-3
                                                                            py-1.5
                                                                            text-sm
                                                                            font-semibold
                                                                            text-gray-800
                                                                            shadow-sm
                                                                        "
                                                                    >
                                                                        {result.value ?? "-"}
                                                                    </span>

                                                                    {result.unit && (
                                                                        <span
                                                                            className="
                                                                                text-sm
                                                                                text-gray-500
                                                                            "
                                                                        >
                                                                            {result.unit}
                                                                        </span>
                                                                    )}

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

        </div>

    </div>,

    document.body

)
}