"use client"

import { createPortal } from "react-dom"
import { useMemo, useState } from "react"
import type { Inspection } from "../../../types/inspectionTypes/inspectionTypes"
import InspectionResultDetailModal from "./InspectionResultDetailModal"
type Props = {
    isOpen: boolean
    onClose: () => void

    loading: boolean

    inspections: Inspection[]

    devices: any[]
    rooms: any[]
    wards: any[]

    deviceTypes: any[]
    deviceModels: any[]

    inspectionTypes: any[]
}

export default function InspectionResultModal({
    isOpen,
    onClose,
    loading,
    inspections,
    devices,
    rooms,
    wards,
    deviceTypes,
    deviceModels,
    inspectionTypes,
}: Props) {

    // =========================================================
    // 検索条件
    // =========================================================

    const [startDate, setStartDate] = useState("")
    const [endDate, setEndDate] = useState("")

    // 機種
    const [
        selectedDeviceTypes,
        setSelectedDeviceTypes
    ] = useState<string[]>([])

    // 型式
    const [
        selectedDeviceModels,
        setSelectedDeviceModels
    ] = useState<string[]>([])

    // 病棟
    const [
        selectedWards,
        setSelectedWards
    ] = useState<string[]>([])

    // 管理番号
    const [
        selectedManagementNumber,
        setSelectedManagementNumber
    ] = useState("")

    // 実施者
    const [
        selectedPerformer,
        setSelectedPerformer
    ] = useState("")

const [openDetailModal, setOpenDetailModal] = useState(false)
const [selectedInspection, setSelectedInspection] =
    useState<Inspection | null>(null)


    // =========================================================
    // チェックボックス選択切り替え
    // =========================================================

    const toggleSelection = (
        value: string,
        list: string[],
        setList: (value: string[]) => void
    ) => {

        if (list.includes(value)) {

            setList(
                list.filter(v => v !== value)
            )

        } else {

            setList([
                ...list,
                value,
            ])

        }
    }


    // =========================================================
    // 点検結果一覧用データ作成
    // =========================================================

    const inspectionRows = useMemo(() => {

        return inspections
            .map((inspection) => {

                // -------------------------------------------------
                // 機器
                // -------------------------------------------------

                const device =
                    devices.find(
                        (item) =>
                            Number(item.id) ===
                            Number(inspection.deviceId)
                    )


                // -------------------------------------------------
                // 部屋
                // -------------------------------------------------

                const room =
                    rooms.find(
                        (item) =>
                            Number(item.id) ===
                            Number(inspection.roomId)
                    )


                // -------------------------------------------------
                // 病棟
                // -------------------------------------------------

                const ward =
                    wards.find(
                        (item) =>
                            Number(item.id) ===
                            Number(room?.wardId)
                    )


                // -------------------------------------------------
                // 機種
                // -------------------------------------------------

                const deviceType =
                    deviceTypes.find(
                        (item) =>
                            Number(item.id) ===
                            Number(device?.type)
                    )


                // -------------------------------------------------
                // 型式
                // -------------------------------------------------

                const deviceModel =
                    deviceModels.find(
                        (item) =>
                            Number(item.id) ===
                            Number(device?.model)
                    )


                // -------------------------------------------------
                // 点検種別
                // -------------------------------------------------

                const inspectionType =
                    inspectionTypes.find(
                        (item) =>
                            Number(item.id) ===
                            Number(
                                inspection.inspectionTypeId
                            )
                    )


                return {

                    inspection,

                    deviceTypeName:
                        deviceType?.name ?? "-",

                    deviceModelName:
                        deviceModel?.name ?? "-",

                    managementNumber:
                        device?.managementNumber ?? "-",

                    wardName:
                        ward?.name ?? "-",

                    roomName:
                        room?.name ?? "-",

                    inspectionTypeName:
                        inspectionType?.name ?? "-",

                }

            })

    }, [
        inspections,
        devices,
        rooms,
        wards,
        deviceTypes,
        deviceModels,
        inspectionTypes,
    ])


    // =========================================================
    // 検索候補
    // =========================================================

    // ---------------------------------------------------------
    // 機種
    // ---------------------------------------------------------

    const deviceTypeOptions = useMemo(() => {

        return Array.from(
            new Set(
                inspectionRows
                    .map(row => row.deviceTypeName)
                    .filter(
                        value =>
                            value &&
                            value !== "-"
                    )
            )
        ).sort()

    }, [inspectionRows])


    // ---------------------------------------------------------
    // 型式
    //
    // 機種を選択した場合は、その機種に属する型式だけ表示
    // ---------------------------------------------------------

    const deviceModelOptions = useMemo(() => {

        return Array.from(
            new Set(
                inspectionRows
                    .filter(row => {

                        if (
                            selectedDeviceTypes.length === 0
                        ) {
                            return true
                        }

                        return selectedDeviceTypes.includes(
                            row.deviceTypeName
                        )

                    })
                    .map(row => row.deviceModelName)
                    .filter(
                        value =>
                            value &&
                            value !== "-"
                    )
            )
        ).sort()

    }, [
        inspectionRows,
        selectedDeviceTypes,
    ])


    // ---------------------------------------------------------
    // 病棟
    // ---------------------------------------------------------

    const wardOptions = useMemo(() => {

        return Array.from(
            new Set(
                inspectionRows
                    .map(row => row.wardName)
                    .filter(
                        value =>
                            value &&
                            value !== "-"
                    )
            )
        ).sort()

    }, [inspectionRows])


    // ---------------------------------------------------------
    // 管理番号
    // ---------------------------------------------------------

    const managementNumberOptions = useMemo(() => {

        return Array.from(
            new Set(
                inspectionRows
                    .map(row => row.managementNumber)
                    .filter(
                        value =>
                            value &&
                            value !== "-"
                    )
            )
        ).sort()

    }, [inspectionRows])


    // ---------------------------------------------------------
    // 実施者
    // ---------------------------------------------------------

    const performerOptions = useMemo(() => {

        return Array.from(
            new Set(
                inspectionRows
                    .map(
                        row =>
                            row.inspection.performedBy
                    )
                    .filter(
                        value =>
                            value
                    )
            )
        ).sort()

    }, [inspectionRows])


    // =========================================================
    // 検索・ソート済み一覧
    // =========================================================

    const filteredInspectionRows = useMemo(() => {

        return inspectionRows
            .filter((row) => {

                // -------------------------------------------------
                // 点検日：開始日
                // -------------------------------------------------

                const inspectionDate =
                    row.inspection.createdAt ?? ""

                const date =
                    inspectionDate
                        ? new Date(inspectionDate)
                        : null


                if (
                    startDate &&
                    date
                ) {

                    const start =
                        new Date(
                            `${startDate}T00:00:00`
                        )

                    if (
                        date < start
                    ) {
                        return false
                    }

                }


                // -------------------------------------------------
                // 点検日：終了日
                // -------------------------------------------------

                if (
                    endDate &&
                    date
                ) {

                    const end =
                        new Date(
                            `${endDate}T23:59:59.999`
                        )

                    if (
                        date > end
                    ) {
                        return false
                    }

                }


                // -------------------------------------------------
                // 機種
                // -------------------------------------------------

                if (
                    selectedDeviceTypes.length > 0 &&
                    !selectedDeviceTypes.includes(
                        row.deviceTypeName
                    )
                ) {

                    return false

                }


                // -------------------------------------------------
                // 型式
                // -------------------------------------------------

                if (
                    selectedDeviceModels.length > 0 &&
                    !selectedDeviceModels.includes(
                        row.deviceModelName
                    )
                ) {

                    return false

                }


                // -------------------------------------------------
                // 病棟
                // -------------------------------------------------

                if (
                    selectedWards.length > 0 &&
                    !selectedWards.includes(
                        row.wardName
                    )
                ) {

                    return false

                }


                // -------------------------------------------------
                // 管理番号
                // -------------------------------------------------

                if (
                    selectedManagementNumber &&
                    row.managementNumber !==
                        selectedManagementNumber
                ) {

                    return false

                }


                // -------------------------------------------------
                // 実施者
                // -------------------------------------------------

                if (
                    selectedPerformer &&
                    String(
                        row.inspection.performedBy ?? ""
                    ) !== selectedPerformer
                ) {

                    return false

                }


                return true

            })

            // -----------------------------------------------------
            // 点検実施順
            // 新しいものを上
            // -----------------------------------------------------

            .sort((a, b) => {

                const dateA =
                    new Date(
                        a.inspection.createdAt ?? ""
                    ).getTime()

                const dateB =
                    new Date(
                        b.inspection.createdAt ?? ""
                    ).getTime()

                return dateB - dateA

            })

    }, [
        inspectionRows,

        startDate,
        endDate,

        selectedDeviceTypes,
        selectedDeviceModels,
        selectedWards,

        selectedManagementNumber,
        selectedPerformer,
    ])


    // =========================================================
    // 検索条件リセット
    // =========================================================

    const resetSearch = () => {

        setStartDate("")
        setEndDate("")

        setSelectedDeviceTypes([])
        setSelectedDeviceModels([])
        setSelectedWards([])

        setSelectedManagementNumber("")
        setSelectedPerformer("")

    }


    // =========================================================
    // Modal
    // =========================================================

    if (!isOpen) {
        return null
    }


    return createPortal(

        <div
            className="
                fixed
                inset-0
                z-[1000]
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
                    w-[1400px]
                    max-w-[95vw]
                    h-[85vh]
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
                        点検結果
                    </h2>


                    <div
                        className="
                            flex
                            items-center
                            gap-2
                        "
                    >

                        <button
                            type="button"
                            className="
                                px-3
                                py-1
                                bg-gray-200
                                rounded
                                hover:bg-gray-300
                            "
                        >
                            CSV
                        </button>


                        <button
                            type="button"
                            className="
                                px-3
                                py-1
                                bg-gray-200
                                rounded
                                hover:bg-gray-300
                            "
                        >
                            PDF
                        </button>


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

                </div>


                {/* =================================================
                    Search
                ================================================= */}

                <div
                    className="
                        px-6
                        pt-4
                    "
                >

                    <div
                        className="
                            grid
                            grid-cols-6
                            gap-4
                            text-sm
                        "
                    >

                        {/* =========================================
                            検索期間
                        ========================================= */}

                        <div
                            className="
                                flex
                                flex-col
                                gap-2
                            "
                        >

                            <div
                                className="
                                    flex
                                    flex-col
                                "
                            >

                                <label
                                    className="
                                        text-xs
                                        text-gray-600
                                        mb-1
                                    "
                                >
                                    検索開始日
                                </label>

                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) =>
                                        setStartDate(
                                            e.target.value
                                        )
                                    }
                                    className="
                                        border
                                        p-2
                                        rounded
                                        w-full
                                    "
                                />

                            </div>


                            <div
                                className="
                                    flex
                                    flex-col
                                "
                            >

                                <label
                                    className="
                                        text-xs
                                        text-gray-600
                                        mb-1
                                    "
                                >
                                    検索終了日
                                </label>

                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) =>
                                        setEndDate(
                                            e.target.value
                                        )
                                    }
                                    className="
                                        border
                                        p-2
                                        rounded
                                        w-full
                                    "
                                />

                            </div>

                        </div>


                        {/* =========================================
                            機種
                        ========================================= */}

                        <div>

                            <label
                                className="
                                    text-xs
                                    text-gray-600
                                    mb-1
                                    block
                                "
                            >
                                機種
                            </label>


                            <div
                                className="
                                    border
                                    rounded
                                    p-2
                                    max-h-32
                                    overflow-auto
                                "
                            >

                                {deviceTypeOptions.length === 0 ? (

                                    <div
                                        className="
                                            text-gray-400
                                        "
                                    >
                                        選択肢なし
                                    </div>

                                ) : (

                                    deviceTypeOptions.map(
                                        (type) => (

                                            <label
                                                key={type}
                                                className="
                                                    block
                                                    cursor-pointer
                                                "
                                            >

                                                <input
                                                    type="checkbox"
                                                    checked={
                                                        selectedDeviceTypes.includes(
                                                            type
                                                        )
                                                    }
                                                    onChange={() =>
                                                        toggleSelection(
                                                            type,
                                                            selectedDeviceTypes,
                                                            setSelectedDeviceTypes
                                                        )
                                                    }
                                                />

                                                <span
                                                    className="
                                                        ml-1
                                                    "
                                                >
                                                    {type}
                                                </span>

                                            </label>

                                        )
                                    )

                                )}

                            </div>

                        </div>


                        {/* =========================================
                            型式
                        ========================================= */}

                        <div>

                            <label
                                className="
                                    text-xs
                                    text-gray-600
                                    mb-1
                                    block
                                "
                            >
                                型式
                            </label>


                            <div
                                className="
                                    border
                                    rounded
                                    p-2
                                    max-h-32
                                    overflow-auto
                                "
                            >

                                {deviceModelOptions.length === 0 ? (

                                    <div
                                        className="
                                            text-gray-400
                                        "
                                    >
                                        選択肢なし
                                    </div>

                                ) : (

                                    deviceModelOptions.map(
                                        (model) => (

                                            <label
                                                key={model}
                                                className="
                                                    block
                                                    cursor-pointer
                                                "
                                            >

                                                <input
                                                    type="checkbox"
                                                    checked={
                                                        selectedDeviceModels.includes(
                                                            model
                                                        )
                                                    }
                                                    onChange={() =>
                                                        toggleSelection(
                                                            model,
                                                            selectedDeviceModels,
                                                            setSelectedDeviceModels
                                                        )
                                                    }
                                                />

                                                <span
                                                    className="
                                                        ml-1
                                                    "
                                                >
                                                    {model}
                                                </span>

                                            </label>

                                        )
                                    )

                                )}

                            </div>

                        </div>


                        {/* =========================================
                            病棟
                        ========================================= */}

                        <div>

                            <label
                                className="
                                    text-xs
                                    text-gray-600
                                    mb-1
                                    block
                                "
                            >
                                病棟
                            </label>


                            <div
                                className="
                                    border
                                    rounded
                                    p-2
                                    max-h-32
                                    overflow-auto
                                "
                            >

                                {wardOptions.length === 0 ? (

                                    <div
                                        className="
                                            text-gray-400
                                        "
                                    >
                                        選択肢なし
                                    </div>

                                ) : (

                                    wardOptions.map(
                                        (ward) => (

                                            <label
                                                key={ward}
                                                className="
                                                    block
                                                    cursor-pointer
                                                "
                                            >

                                                <input
                                                    type="checkbox"
                                                    checked={
                                                        selectedWards.includes(
                                                            ward
                                                        )
                                                    }
                                                    onChange={() =>
                                                        toggleSelection(
                                                            ward,
                                                            selectedWards,
                                                            setSelectedWards
                                                        )
                                                    }
                                                />

                                                <span
                                                    className="
                                                        ml-1
                                                    "
                                                >
                                                    {ward}
                                                </span>

                                            </label>

                                        )
                                    )

                                )}

                            </div>

                        </div>


                        {/* =========================================
                            管理番号
                        ========================================= */}

                        <div>

                            <label
                                className="
                                    text-xs
                                    text-gray-600
                                    mb-1
                                    block
                                "
                            >
                                管理番号
                            </label>


                            <select
                                value={
                                    selectedManagementNumber
                                }
                                onChange={(e) =>
                                    setSelectedManagementNumber(
                                        e.target.value
                                    )
                                }
                                className="
                                    border
                                    p-2
                                    rounded
                                    w-full
                                "
                            >

                                <option value="">
                                    すべて
                                </option>


                                {managementNumberOptions.map(
                                    (number) => (

                                        <option
                                            key={number}
                                            value={number}
                                        >
                                            {number}
                                        </option>

                                    )
                                )}

                            </select>

                        </div>


                        {/* =========================================
                            実施者
                        ========================================= */}

                        <div>

                            <label
                                className="
                                    text-xs
                                    text-gray-600
                                    mb-1
                                    block
                                "
                            >
                                実施者
                            </label>


                            <select
                                value={
                                    selectedPerformer
                                }
                                onChange={(e) =>
                                    setSelectedPerformer(
                                        e.target.value
                                    )
                                }
                                className="
                                    border
                                    p-2
                                    rounded
                                    w-full
                                "
                            >

                                <option value="">
                                    すべて
                                </option>


                                {performerOptions.map(
                                    (performer) => (

                                        <option
                                            key={performer}
                                            value={performer}
                                        >
                                            {performer}
                                        </option>

                                    )
                                )}

                            </select>

                        </div>

                    </div>


                    {/* =================================================
                        検索条件リセット
                    ================================================= */}

                    <div
                        className="
                            flex
                            justify-end
                            mt-3
                        "
                    >

                        <button
                            type="button"
                            onClick={resetSearch}
                            className="
                                px-3
                                py-1
                                text-sm
                                border
                                rounded
                                bg-white
                                hover:bg-gray-100
                            "
                        >
                            検索条件をクリア
                        </button>

                    </div>

                </div>


                {/* =================================================
                    Result
                ================================================= */}

                {loading ? (

                    <div
                        className="
                            flex
                            flex-1
                            items-center
                            justify-center
                        "
                    >

                        <div
                            className="
                                text-gray-500
                            "
                        >
                            点検結果を取得しています...
                        </div>

                    </div>

                ) : (

                    <div
                        className="
                            flex-1
                            overflow-auto
                            p-4
                        "
                    >

                        {/* =========================================
                            件数
                        ========================================= */}

                        <div
                            className="
                                mb-2
                                text-sm
                                text-gray-600
                            "
                        >
                            検索結果：
                            {filteredInspectionRows.length}
                            件
                        </div>


                        {/* =========================================
                            Table
                        ========================================= */}

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

                                    <th
                                        className="
                                            border
                                            p-2
                                            sticky
                                            top-0
                                            bg-gray-100
                                        "
                                    >
                                        詳細
                                    </th>


                                    <th
                                        className="
                                            border
                                            p-2
                                            whitespace-nowrap
                                            sticky
                                            top-0
                                            bg-gray-100
                                        "
                                    >
                                        点検日時
                                    </th>


                                    <th
                                        className="
                                            border
                                            p-2
                                            sticky
                                            top-0
                                            bg-gray-100
                                        "
                                    >
                                        点検種別
                                    </th>


                                    <th
                                        className="
                                            border
                                            p-2
                                            sticky
                                            top-0
                                            bg-gray-100
                                        "
                                    >
                                        機種
                                    </th>


                                    <th
                                        className="
                                            border
                                            p-2
                                            sticky
                                            top-0
                                            bg-gray-100
                                        "
                                    >
                                        型式
                                    </th>


                                    <th
                                        className="
                                            border
                                            p-2
                                            sticky
                                            top-0
                                            bg-gray-100
                                        "
                                    >
                                        管理番号
                                    </th>


                                    <th
                                        className="
                                            border
                                            p-2
                                            sticky
                                            top-0
                                            bg-gray-100
                                        "
                                    >
                                        病棟
                                    </th>


                                    <th
                                        className="
                                            border
                                            p-2
                                            sticky
                                            top-0
                                            bg-gray-100
                                        "
                                    >
                                        部屋
                                    </th>


                                    <th
                                        className="
                                            border
                                            p-2
                                            sticky
                                            top-0
                                            bg-gray-100
                                        "
                                    >
                                        実施者
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {filteredInspectionRows.map(
                                    (row) => {

                                        const inspection =
                                            row.inspection


                                        return (

                                            <tr
                                                key={
                                                    inspection.id
                                                }
                                                className="
                                                    hover:bg-gray-50
                                                "
                                            >

                                                {/* 詳細 */}

                                                <td
                                                    className="
                                                        border
                                                        p-2
                                                        text-center
                                                    "
                                                >

                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setSelectedInspection(inspection)
                                                            setOpenDetailModal(true)
                                                        }}
                                                            className="
                                                            px-3
                                                            py-1
                                                            rounded
                                                            bg-gray-200
                                                            hover:bg-gray-300
                                                        "
                                                    >
                                                        詳細
                                                    </button>

                                                </td>


                                                {/* 点検日時 */}

                                                <td
                                                    className="
                                                        border
                                                        p-2
                                                        whitespace-nowrap
                                                    "
                                                >
                                                    {
                                                        inspection.createdAt
                                                            ? new Date(
                                                                inspection.createdAt
                                                            ).toLocaleString(
                                                                "ja-JP"
                                                            )
                                                            : "-"
                                                    }
                                                </td>


                                                {/* 点検種別 */}

                                                <td
                                                    className="
                                                        border
                                                        p-2
                                                    "
                                                >
                                                    {
                                                        row.inspectionTypeName
                                                    }
                                                </td>


                                                {/* 機種 */}

                                                <td
                                                    className="
                                                        border
                                                        p-2
                                                    "
                                                >
                                                    {
                                                        row.deviceTypeName
                                                    }
                                                </td>


                                                {/* 型式 */}

                                                <td
                                                    className="
                                                        border
                                                        p-2
                                                    "
                                                >
                                                    {
                                                        row.deviceModelName
                                                    }
                                                </td>


                                                {/* 管理番号 */}

                                                <td
                                                    className="
                                                        border
                                                        p-2
                                                    "
                                                >
                                                    {
                                                        row.managementNumber
                                                    }
                                                </td>


                                                {/* 病棟 */}

                                                <td
                                                    className="
                                                        border
                                                        p-2
                                                    "
                                                >
                                                    {
                                                        row.wardName
                                                    }
                                                </td>


                                                {/* 部屋 */}

                                                <td
                                                    className="
                                                        border
                                                        p-2
                                                    "
                                                >
                                                    {
                                                        row.roomName
                                                    }
                                                </td>


                                                {/* 実施者 */}

                                                <td
                                                    className="
                                                        border
                                                        p-2
                                                    "
                                                >
                                                    {
                                                        inspection.performedBy ??
                                                        "-"
                                                    }
                                                </td>

                                            </tr>

                                        )

                                    }
                                )}


                                {/* =====================================
                                    検索結果なし
                                ===================================== */}

                                {filteredInspectionRows.length === 0 && (

                                    <tr>

                                        <td
                                            colSpan={9}
                                            className="
                                                border
                                                p-8
                                                text-center
                                                text-gray-500
                                            "
                                        >
                                            点検結果はありません
                                        </td>

                                    </tr>

                                )}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>
            <InspectionResultDetailModal
                isOpen={openDetailModal}
                onClose={() => {
                    setOpenDetailModal(false)
                    setSelectedInspection(null)
                }}
                inspection={selectedInspection}
            />
        </div>,

        document.body
    )
}