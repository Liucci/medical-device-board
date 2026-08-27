"use client"
import { useEffect, useState } from "react"
//fetch
import { getInspectionTypesFromApi } from "../api/inspection/inspectionTypes/fetchInspectionTypes"
import { getInspectionItemTypesFromApi } from "../api/inspection/inspectionItemTypes/fetchInspectionItemTypes"
import {getInspectionChecklistsFromApi} from "../api/inspection/inspectionChecklists/fetchInspectionChecklists"
import { getDeviceTypesFromApi } from "../api/deviceTypes/fetchDeviceTypes"
import { getDeviceModelsFromApi } from "../api/deviceModels/fetchDeviceModels"
//types
import type {InspectionType,} from "../types/inspectionTypes/inspectionTypeTypes"
import type {InspectionItemType,} from "../types/inspectionTypes/inspectionItemTypeTypes"
import type { InspectionChecklist } from "../types/inspectionTypes/inspectionChecklistTypes"
import type {DeviceTypeType} from "../types/deviceTypeTypes"
import type {DeviceModelType,} from "../types/deviceModelTypes"
//normalizer
import {normalizeDeviceType} from "../utils/deviceTypeMapper"
import {normalizeDeviceModel} from "../utils/deviceModelMapper"
import {normalizeInspectionType} from "../utils/inspectionMapper/inspectionTypeMapper"
import {normalizeInspectionItemType} from "../utils/inspectionMapper/inspectionItemTypeMapper"
import {normalizeInspectionChecklist} from "../utils/inspectionMapper/inspectionChecklistMapper"

import {
    toCreateInspectionChecklistTransactionRequest
} from "../utils/inspectionMapper/inspectionTransactionMapper/inspectionChecklistTransactionMapper"
//CRUD

//transaction
import { createInspectionChecklistTransaction } from "../api/transactions/inspection/inspectionChecklists/createInspectionChecklistsTransaction"

//modal
import AddInspectionChecklistItemModal from "./components/AddInspectionChecklistItemModal"

export default function InspectionEditorPage()
{
    //既存編集時のfrag
    const [isEditMode, setIsEditMode] = useState(false)

    const [inspectionTypes, setInspectionTypes] = useState<InspectionType[]>([])
    const [inspectionItemTypes, setInspectionItemTypes] = useState<InspectionItemType[]>([])
    const [inspectionName, setInspectionName] = useState("")
    const [inspectionTypeId, setInspectionTypeId] = useState<number | null>(null)
    const [selectedInspectionTypeId, setSelectedInspectionTypeId] =useState<number | null>(null)
    const [inspectionChecklists, setInspectionChecklists] =  useState<InspectionChecklist[]>([])
    const [selectedChecklistId, setSelectedChecklistId] = useState<number | null>(null)

    type InspectionChecklistItemEditor = {
                                        id: number
                                        name: string
                                        itemTypeId: number
                                        displayOrder: number
                                        required: boolean
                                        defaultValue: string | null
                                        options: unknown
                                        unit: string | null
    }
    const [inspectionChecklistItems, setInspectionChecklistItems] =useState<InspectionChecklistItemEditor[]>([])
    const [deviceTypes, setDeviceTypes] = useState<DeviceTypeType[]>([])
    const [deviceModels, setDeviceModels] = useState<DeviceModelType[]>([])
    const [deviceTypeId, setDeviceTypeId] = useState<number | null>(null)
    const [deviceModelId, setDeviceModelId] = useState<number | null>(null)
    const [isAddItemModalOpen, setIsAddItemModalOpen] =useState(false)
    useEffect(() =>
    {
        const fetchInitialData = async () =>
        {
            const [
                inspectionTypesData,
                inspectionItemTypesData,
                inspectionChecklistsDate,
                deviceTypesData,
                deviceModelsData,
            ] = await Promise.all([
                getInspectionTypesFromApi(),
                getInspectionItemTypesFromApi(),
                getInspectionChecklistsFromApi(),
                getDeviceTypesFromApi(),
                getDeviceModelsFromApi(),
            ])
            setInspectionTypes(inspectionTypesData.map(normalizeInspectionType))
            setInspectionItemTypes(inspectionItemTypesData.map(normalizeInspectionItemType))
            setInspectionChecklists(inspectionChecklistsDate.map(normalizeInspectionChecklist))
            setDeviceTypes(deviceTypesData.map(normalizeDeviceType))
            setDeviceModels(deviceModelsData.map(normalizeDeviceModel))
        }

        fetchInitialData()
    }, [])

    const filteredDeviceModels = deviceModels.filter(
                (deviceModel) =>deviceModel.deviceTypeId === deviceTypeId
    )

    const handleSave = async () => 
    {
    try {
        // 必須チェック
        if (inspectionTypeId === null) {
            alert("点検表種類を選択してください")
            return
        }
        if (deviceTypeId === null) {
            alert("機種を選択してください")
            return
        }
        if (!inspectionName.trim()) {
            alert("点検表名を入力してください")
            return
        }
        // 点検表作成
        const requests =
            toCreateInspectionChecklistTransactionRequest(
                {
                    inspectionTypeId,
                    deviceTypeId,
                    deviceModelId,
                    name: inspectionName,
                    version: 1,
                },
                inspectionChecklistItems.map(
                    (item, index) => ({
                        displayOrder: index + 1,
                        itemName: item.name,
                        itemTypeId: item.itemTypeId,
                        required: false,
                        defaultValue: null,
                        options: null,
                        unit: null,
                    })
                )
            )

        const result = await createInspectionChecklistTransaction({
            requests,
        })
        console.log("create inspection checklist result:",result)
        alert("点検表を保存しました")
    } catch (error) {
        console.error("Failed to save inspection checklist:",error)
        alert("点検表の保存に失敗しました")
    }
    }

return (
    <div className="min-h-screen bg-gray-50 p-8">

        <div className="mx-auto max-w-4xl">

            {/* Header */}
            {/* 編集対象 */}
            <section className="mb-6 rounded-xl bg-white p-6 shadow-sm">

                <div className="mb-5 flex items-center justify-between">
                    <div>
                        <label className="text-sm font-medium text-gray-700">
                            既存点検表を編集
                        </label>

                        <p className="mt-1 text-xs text-gray-400">
                            OFF：新規作成 / ON：既存点検表を編集
                        </p>
                    </div>

                    <button
                        type="button"
                        role="switch"
                        aria-checked={isEditMode}
                        onClick={() => {
                            setIsEditMode((prev) => !prev)
                        }}
                        className={`
                            relative
                            h-6
                            w-11
                            rounded-full
                            transition
                            ${isEditMode
                                ? "bg-blue-600"
                                : "bg-gray-300"
                            }
                        `}
                    >
                        <span
                            className={`
                                absolute
                                top-1
                                h-4
                                w-4
                                rounded-full
                                bg-white
                                shadow
                                transition
                                ${isEditMode
                                    ? "left-6"
                                    : "left-1"
                                }
                            `}
                        />
                    </button>
                </div>


                <div className="mb-6 border-b pb-4">
                    <h2 className="text-lg font-semibold text-gray-800">
                        編集対象
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        編集する点検表を選択してください
                    </p>
                </div>

            {/* isEditMode=tureで表示 */}
            {isEditMode && (
                <>
                {/* 点検表種類 */}
                <div className="mb-5">

                    <label className="mb-2 block text-sm font-medium text-gray-700">
                        点検表種類
                    </label>

                    <select
                        value={selectedInspectionTypeId ?? ""}
                        onChange={(event) =>
                        {
                            const id =
                                event.target.value === ""
                                    ? null
                                    : Number(event.target.value)

                            setSelectedInspectionTypeId(id)

                            // 点検表種類が変わったら点検表選択をリセット
                            setSelectedChecklistId(null)
                        }}
                        className="
                            w-full
                            rounded-lg
                            border border-gray-300
                            bg-white
                            px-4 py-2.5
                            text-sm
                            outline-none
                            transition
                            focus:border-blue-500
                            focus:ring-2
                            focus:ring-blue-100
                        "
                    >
                        <option value="">
                            選択してください
                        </option>

                        {inspectionTypes.map((inspectionType) => (
                            <option
                                key={inspectionType.id}
                                value={inspectionType.id}
                            >
                                {inspectionType.name}
                            </option>
                        ))}
                    </select>

                </div>


                {/* 点検表 */}
                <div>

                    <label className="mb-2 block text-sm font-medium text-gray-700">
                        点検表
                    </label>

                    <select
                        value={selectedChecklistId ?? ""}
                        disabled={selectedInspectionTypeId === null}
                        onChange={(event) =>
                        {
                            const id =
                                event.target.value === ""
                                    ? null
                                    : Number(event.target.value)

                            setSelectedChecklistId(id)
                        }}
                        className="
                            w-full
                            rounded-lg
                            border border-gray-300
                            bg-white
                            px-4 py-2.5
                            text-sm
                            outline-none
                            transition
                            focus:border-blue-500
                            focus:ring-2
                            focus:ring-blue-100
                            disabled:bg-gray-100
                            disabled:text-gray-400
                        "
                    >
                        <option value="">
                            {selectedInspectionTypeId === null
                                ? "先に点検表種類を選択してください"
                                : "選択してください"}
                        </option>

                        {inspectionChecklists
                            .filter(
                                (checklist) =>
                                    checklist.inspectionTypeId ===
                                    selectedInspectionTypeId
                            )
                            .map((checklist) => (
                                <option
                                    key={checklist.id}
                                    value={checklist.id}
                                >
                                    {checklist.name}
                                </option>
                            ))}
                    </select>

                </div>
                </>
            )}

            </section>

            {/* 点検表情報 */}
            <section className="rounded-xl bg-white p-6 shadow-sm">



                <div className="mb-6 border-b pb-4">
                    <h2 className="text-lg font-semibold text-gray-800">
                        点検表情報
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        点検表の名前と種類を設定します
                    </p>
                </div>

                {/* 点検表選択 */}
                <div className="mb-5">

                    {/* 点検表種類 */}
                    <div>

                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            点検表種類
                        </label>

                        <select
                            value={inspectionTypeId ?? ""}
                            onChange={(event) =>
                                setInspectionTypeId(
                                    event.target.value === ""
                                        ? null
                                        : Number(event.target.value)
                                )
                            }
                            className="
                                w-full
                                rounded-lg
                                border border-gray-300
                                bg-white
                                px-4 py-2.5
                                text-sm
                                outline-none
                                transition
                                focus:border-blue-500
                                focus:ring-2
                                focus:ring-blue-100
                            "
                        >

                            <option value="">
                                選択してください
                            </option>

                            {inspectionTypes.map((inspectionType) => (
                                <option
                                    key={inspectionType.id}
                                    value={inspectionType.id}
                                >
                                    {inspectionType.name}
                                </option>
                            ))}

                        </select>

                    </div>

                </div>



                {/* 機種 */}
                <div className="mb-5">

                    <label className="mb-2 block text-sm font-medium text-gray-700">
                        機種
                    </label>

                    <select
                        value={deviceTypeId ?? ""}
                        onChange={(event) =>
                        {
                            const id =
                                event.target.value === ""
                                    ? null
                                    : Number(event.target.value)

                            setDeviceTypeId(id)

                            // 機種が変わったら型式をリセット
                            setDeviceModelId(null)
                        }}
                        className="
                            w-full
                            rounded-lg
                            border border-gray-300
                            bg-white
                            px-4 py-2.5
                            text-sm
                            outline-none
                            transition
                            focus:border-blue-500
                            focus:ring-2
                            focus:ring-blue-100
                        "
                    >
                        <option value="">
                            選択してください
                        </option>

                        {deviceTypes.map((deviceType) => (
                            <option
                                key={deviceType.id}
                                value={deviceType.id}
                            >
                                {deviceType.name}
                            </option>
                        ))}
                    </select>

                </div>


                {/* 型式 */}
                <div>

                    <label className="mb-2 block text-sm font-medium text-gray-700">
                        型式
                    </label>

                    <select
                        value={deviceModelId ?? ""}
                        disabled={deviceTypeId === null}
                        onChange={(event) =>
                        {
                            setDeviceModelId(
                                event.target.value === ""
                                    ? null
                                    : Number(event.target.value)
                            )
                        }}
                        className="
                            w-full
                            rounded-lg
                            border border-gray-300
                            bg-white
                            px-4 py-2.5
                            text-sm
                            outline-none
                            transition
                            focus:border-blue-500
                            focus:ring-2
                            focus:ring-blue-100
                            disabled:bg-gray-100
                            disabled:text-gray-400
                        "
                    >
                        <option value="">
                            {deviceTypeId === null
                                ? "先に機種を選択してください"
                                : "選択してください"}
                        </option>

                        {filteredDeviceModels.map((deviceModel) => (
                            <option
                                key={deviceModel.id}
                                value={deviceModel.id}
                            >
                                {deviceModel.name}
                            </option>
                        ))}
                    </select>

                </div>

                {/* 点検表名 */}
                <div className="mb-5">

                    <label className="mb-2 block text-sm font-medium text-gray-700">
                        点検表名
                    </label>

                    <input
                        type="text"
                        value={inspectionName}
                        onChange={(event) =>
                            setInspectionName(event.target.value)
                        }
                        placeholder="例：人工呼吸器 定期点検表"
                        className="
                            w-full
                            rounded-lg
                            border border-gray-300
                            px-4 py-2.5
                            text-sm
                            outline-none
                            transition
                            focus:border-blue-500
                            focus:ring-2
                            focus:ring-blue-100
                        "
                    />

                </div>


            </section>


            {/* 点検項目 */}
            <section className="mt-6 rounded-xl bg-white p-6 shadow-sm">

                <div className="mb-5 flex items-center justify-between border-b pb-4">

                    <div>
                        <h2 className="text-lg font-semibold text-gray-800">
                            点検項目
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            点検項目を追加・編集・並び替えします
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => setIsAddItemModalOpen(true)}
                        className="
                            flex
                            items-center
                            gap-1.5
                            rounded-lg
                            bg-blue-600
                            px-4
                            py-2
                            text-sm
                            font-medium
                            text-white
                            shadow-sm
                            hover:bg-blue-700
                        "
                    >
                        <span className="text-lg leading-none">
                            ＋
                        </span>

                        項目を追加
                    </button>
                </div>


                {inspectionChecklistItems.length === 0 ? (

                    <div className="
                        rounded-lg
                        border
                        border-dashed
                        border-gray-300
                        py-10
                        text-center
                    ">
                        <p className="text-sm text-gray-400">
                            まだ点検項目がありません
                        </p>

                        <p className="mt-1 text-xs text-gray-400">
                            「項目を追加」から点検項目を追加してください
                        </p>
                    </div>

                ) : (

                    <div className="space-y-2">

                        {inspectionChecklistItems.map((item, index) => (

                            <div
                                key={item.id}
                                className="
                                    flex
                                    items-center
                                    gap-3
                                    rounded-lg
                                    border
                                    border-gray-200
                                    bg-gray-50
                                    px-3
                                    py-3
                                "
                            >

                                {/* 削除 */}
                                <button
                                    type="button"
                                    className="
                                        flex
                                        h-7
                                        w-7
                                        shrink-0
                                        items-center
                                        justify-center
                                        rounded-full
                                        border
                                        border-gray-300
                                        bg-white
                                        text-gray-500
                                        hover:border-red-300
                                        hover:bg-red-50
                                        hover:text-red-500
                                    "
                                >
                                    −
                                </button>


                                {/* 項目番号 */}
                                <div className="
                                    w-8
                                    shrink-0
                                    text-center
                                    text-sm
                                    text-gray-400
                                ">
                                    {index + 1}
                                </div>


                                {/* 項目名 */}
                                <div className="
                                    min-w-0
                                    flex-1
                                    text-sm
                                    text-gray-800
                                ">
                                    {item.name}
                                </div>


                                {/* 入力方式 */}
                                <div className="
                                    w-32
                                    shrink-0
                                    text-center
                                    text-xs
                                    text-gray-500
                                ">
                                    {
                                        inspectionItemTypes.find(
                                            (itemType) =>
                                                itemType.id === item.itemTypeId
                                        )?.name
                                    }
                                </div>


                                {/* Drag handle */}
                                <div
                                    className="
                                        flex
                                        h-8
                                        w-8
                                        shrink-0
                                        cursor-grab
                                        items-center
                                        justify-center
                                        rounded
                                        text-gray-400
                                        hover:bg-gray-200
                                    "
                                    title="ドラッグして並び替え"
                                >
                                    ⋮⋮
                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </section>

            {/* Footer */}
            <div className="mt-6 flex justify-end gap-3">

                <button
                    type="button"
                    className="
                        rounded-lg
                        border border-gray-300
                        bg-white
                        px-5 py-2.5
                        text-sm font-medium
                        text-gray-700
                        hover:bg-gray-50
                    "
                >
                    キャンセル
                </button>

                <button
                    type="button"
                    onClick={handleSave}
                    className="
                        rounded-lg
                        bg-blue-600
                        px-6 py-2.5
                        text-sm font-medium
                        text-white
                        shadow-sm
                        hover:bg-blue-700
                    "
                >
                    保存
                </button>

            </div>

        </div>

        <AddInspectionChecklistItemModal
            open={isAddItemModalOpen}
            inspectionItemTypes={inspectionItemTypes}
            onClose={() => setIsAddItemModalOpen(false)}
            onAdd={(name, itemTypeId) =>
            {
                setInspectionChecklistItems((prev) => 
                    [
                        ...prev,
                        {
                        id: Date.now(),
                        name,
                        itemTypeId,
                        displayOrder: prev.length + 1,
                        required: false,
                        defaultValue: null,
                        options: null,
                        unit: null,
                        },
                    ])
                setIsAddItemModalOpen(false)
            }}
        />

    </div>
)    
}