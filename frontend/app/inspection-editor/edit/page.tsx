"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"

// 処理中表示
import { LoadingOverlay } from "../../components/common/LoadingOverlay"

// fetch
import { fetchCurrentUser } from "../../api/auth/fetchCurrentUser"
import { getInspectionTypesFromApi } from "../../api/inspection/inspectionTypes/fetchInspectionTypes"
import { getInspectionItemTypesFromApi } from "../../api/inspection/inspectionItemTypes/fetchInspectionItemTypes"
import { getInspectionChecklistsFromApi } from "../../api/inspection/inspectionChecklists/fetchInspectionChecklists"
import { getDeviceTypesFromApi } from "../../api/deviceTypes/fetchDeviceTypes"
import { getDeviceModelsFromApi } from "../../api/deviceModels/fetchDeviceModels"
import { getInspectionChecklistItemsFromApi } from "../../api/inspection/inspectionChecklistItems/fetchInspectionChecklistItems"

// types
import type { InspectionType } from "../../types/inspectionTypes/inspectionTypeTypes"
import type { InspectionItemType } from "../../types/inspectionTypes/inspectionItemTypeTypes"
import type { InspectionChecklist } from "../../types/inspectionTypes/inspectionChecklistTypes"
import type { DeviceTypeType } from "../../types/deviceTypeTypes"
import type { DeviceModelType } from "../../types/deviceModelTypes"
import type {InspectionChecklistItem} from "../../types/inspectionTypes/inspectionChecklistItemTypes"
// normalizer
import { normalizeInspectionType } from "../../utils/inspectionMapper/inspectionTypeMapper"
import { normalizeInspectionItemType } from "../../utils/inspectionMapper/inspectionItemTypeMapper"
import { normalizeInspectionChecklist } from "../../utils/inspectionMapper/inspectionChecklistMapper"
import { normalizeDeviceType } from "../../utils/deviceTypeMapper"
import { normalizeDeviceModel } from "../../utils/deviceModelMapper"
import {normalizeInspectionChecklistItem} from "../../utils/inspectionMapper/inspectionChecklistItemMapper"
// dnd
import {
    DndContext,
    closestCenter,
    type DragEndEvent,
} from "@dnd-kit/core"

import {
    SortableContext,
    verticalListSortingStrategy,
    arrayMove,
} from "@dnd-kit/sortable"

import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import SortableInspectionChecklistItemEdit
    from "./components/SortableInspectionChecklistItemEdit"

import AddInspectionChecklistItemEditModal
    from "./components/AddInspectionChecklistItemEditModal"

import EditInspectionChecklistItemEditModal
    from "./components/EditInspectionChecklistItemEditModal"

export default function InspectionChecklistEditPage() {

    const router = useRouter()
    const searchParams = useSearchParams()
    // 編集対象
    const checklistIdParam = searchParams.get("id")
    const checklistId =
        checklistIdParam
            ? Number(checklistIdParam)
            : null


    // ========================================
    // 点検表関連
    // ========================================

    const [inspectionTypes, setInspectionTypes] =useState<InspectionType[]>([])
    const [inspectionItemTypes, setInspectionItemTypes] =useState<InspectionItemType[]>([])
    const [inspectionChecklists, setInspectionChecklists] = useState<InspectionChecklist[]>([])
    // 点検表情報

    const [inspectionName, setInspectionName] =useState("")
    const [inspectionTypeId, setInspectionTypeId] =useState<number | null>(null)


    // ========================================
    // 機種関連
    // ========================================

    const [deviceTypes, setDeviceTypes] =useState<DeviceTypeType[]>([])
    const [deviceModels, setDeviceModels] =useState<DeviceModelType[]>([])
    const [deviceTypeId, setDeviceTypeId] =useState<number | null>(null)
    const [deviceModelId, setDeviceModelId] =useState<number | null>(null)
    const [selectedChecklistId, setSelectedChecklistId] =useState<number | null>(null)
    // ========================================
    // 点検項目
    // ========================================
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

    // ========================================
    // Modal
    // ========================================

    const [isAddItemModalOpen, setIsAddItemModalOpen] =useState(false)
    const [isEditItemModalOpen, setIsEditItemModalOpen] =useState(false)
    const [editingChecklistItem, setEditingChecklistItem] =useState<InspectionChecklistItemEditor | null>(null)

    // ========================================
    // Loading
    // ========================================

    const [loading, setLoading] = useState(false)


    // ========================================
    // 初期データ取得
    // ========================================

    useEffect(() =>
    {
        const fetchInitialData = async () =>
        {
        // current user取得
            const currentUser = await fetchCurrentUser()    
            // 権限チェック
            if (!currentUser) {return}
            if (currentUser?.role !== "admin")
            {
                alert("権限がありません")
                router.push("/dashboard")
                return
            }
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

    //点検表種類に紐づく点検表だけに絞る
    const filteredInspectionChecklists =
        inspectionChecklists.filter(
            (checklist) =>
                checklist.inspectionTypeId === inspectionTypeId
        )

    // 型式フィルタ
    const filteredDeviceModels =
        deviceModels.filter(
            (deviceModel) =>
                deviceModel.deviceTypeId === deviceTypeId
        )

    //点検表名選択時、点検項目表示させる
    const handleChecklistChange = async (checklistId: number | null) => 
    {
        setSelectedChecklistId(checklistId)
        if (checklistId === null) {
            setInspectionName("")
            setDeviceTypeId(null)
            setDeviceModelId(null)
            setInspectionChecklistItems([])
            return
        }

        const checklist =inspectionChecklists.find((item) => item.id === checklistId)
        if (!checklist) {
            setInspectionName("")
            setDeviceTypeId(null)
            setDeviceModelId(null)
            setInspectionChecklistItems([])
            return
        }
        setInspectionName(checklist.name)
        setDeviceTypeId(checklist.deviceTypeId)
        setDeviceModelId(checklist.deviceModelId)


        // 点検項目取得
        const items =await getInspectionChecklistItemsFromApi(checklistId)
        const normalizedItems =items.map(normalizeInspectionChecklistItem)
        setInspectionChecklistItems(normalizedItems)
    }


    // ========================================
    // 項目並び替え
    // ========================================

    const handleChecklistItemDragEnd = (
        event: DragEndEvent
    ) => {

        const { active, over } = event

        if (!over) return

        if (active.id === over.id) return

        setInspectionChecklistItems((items) => {

            const oldIndex =
                items.findIndex(
                    (item) => item.id === active.id
                )

            const newIndex =
                items.findIndex(
                    (item) => item.id === over.id
                )

            if (
                oldIndex === -1 ||
                newIndex === -1
            ) {
                return items
            }

            return arrayMove(
                items,
                oldIndex,
                newIndex
            )

        })
    }


    // ========================================
    // 保存
    // ========================================

    const handleSave = async () => {

        /*
         * 編集保存処理は後で実装
         */

    }


    return (
        <>

            <div className="min-h-screen bg-gray-200 p-12">

                <div className="mx-auto max-w-6xl">

                    {/* ================================= */}
                    {/* Header */}
                    {/* ================================= */}

                    <div className="mb-6">

                        <h1 className="
                            text-3xl
                            font-semibold
                            text-gray-800
                        ">
                            点検表編集
                        </h1>

                        <p className="
                            mt-1
                            text-sm
                            text-gray-500
                        ">
                            点検表の情報と点検項目を編集します
                        </p>

                    </div>


                    {/* ================================= */}
                    {/* Main */}
                    {/* ================================= */}

                    <div className="
                        flex
                        flex-col
                        gap-6
                        lg:flex-row
                    ">


                        {/* ============================= */}
                        {/* 点検表情報 */}
                        {/* ============================= */}

                        <section className="
                            w-full
                            rounded-xl
                            bg-white
                            p-6
                            shadow-sm
                            lg:w-1/3
                        ">

                            <div className="
                                mb-5
                                border-b
                                pb-4
                            ">

                                <h2 className="
                                    text-lg
                                    font-semibold
                                    text-gray-800
                                ">
                                    点検表情報
                                </h2>

                                <p className="
                                    mt-1
                                    text-sm
                                    text-gray-500
                                ">
                                    点検表の情報を編集します
                                </p>

                            </div>


                            {/* 点検表種類 */}

                            <div className="mb-5">

                                <label className="
                                    mb-2
                                    block
                                    text-sm
                                    font-medium
                                    text-gray-700
                                ">
                                    点検表種類
                                </label>

                                <select
                                    value={inspectionTypeId ?? ""}
                                    onChange={(event) => {
                                        const id =
                                            event.target.value === ""
                                                ? null
                                                : Number(event.target.value)
                                        setInspectionTypeId(id)
                                        // 点検表種類が変わったら
                                        // 選択中の点検表をリセット
                                        setSelectedChecklistId(null)
                                        setInspectionName("")
                                        setDeviceTypeId(null)
                                        setDeviceModelId(null)
                                    }}
                                    className="
                                        w-full
                                        rounded-lg
                                        border
                                        border-gray-500
                                        bg-white
                                        px-4
                                        py-2.5
                                        text-sm
                                    "
                                >
                                    <option value="">
                                        選択してください
                                    </option>

                                    {inspectionTypes.map(
                                        (inspectionType) => (
                                            <option
                                                key={inspectionType.id}
                                                value={inspectionType.id}
                                            >
                                                {inspectionType.name}
                                            </option>
                                        )
                                    )}

                                </select>

                            </div>
                            {/* 点検表名 */}

                            <div>

                                <label className="
                                    mb-2
                                    block
                                    text-sm
                                    font-medium
                                    text-gray-700
                                ">
                                    点検表名
                                </label>
                                <select
                                    value={selectedChecklistId ?? ""}
                                    disabled={inspectionTypeId === null}
                                    onChange={async (event) => {

                                        const id =
                                            event.target.value === ""
                                                ? null
                                                : Number(event.target.value)

                                        await handleChecklistChange(id)
                                    }}
                                    className="
                                        w-full
                                        rounded-lg
                                        border
                                        border-gray-500
                                        bg-white
                                        px-4
                                        py-2.5
                                        text-sm
                                    "
                                >
                                    <option value="">
                                        {inspectionTypeId === null
                                            ? "先に点検表種類を選択してください"
                                            : "選択してください"}
                                    </option>

                                    {filteredInspectionChecklists.map(
                                        (checklist) => (
                                            <option
                                                key={checklist.id}
                                                value={checklist.id}
                                            >
                                                {checklist.name}
                                            </option>
                                        )
                                    )}
                                </select>                                
                            </div>

                            {/* 機種 */}
                            <div className="mb-5">

                                <label className="
                                    mb-2
                                    block
                                    text-sm
                                    font-medium
                                    text-gray-700
                                ">
                                    機種
                                </label>

                                <div className="
                                    w-full
                                    rounded-lg
                                    border
                                    border-gray-500
                                    bg-gray-50
                                    px-4
                                    py-2.5
                                    text-sm
                                    text-gray-700
                                ">
                                    {deviceTypes.find(
                                        (deviceType) =>
                                            deviceType.id === deviceTypeId
                                    )?.name ?? "-"}
                                </div>

                            </div>
                            {/* 型式 */}
                            <div className="mb-5">

                                <label className="
                                    mb-2
                                    block
                                    text-sm
                                    font-medium
                                    text-gray-700
                                ">
                                    型式
                                </label>

                                <div className="
                                    w-full
                                    rounded-lg
                                    border
                                    border-gray-500
                                    bg-gray-50
                                    px-4
                                    py-2.5
                                    text-sm
                                    text-gray-700
                                ">
                                    {deviceModels.find(
                                        (deviceModel) =>
                                            deviceModel.id === deviceModelId
                                    )?.name ?? "-"}
                                </div>

                            </div>

                        </section>


                        {/* ============================= */}
                        {/* 点検項目 */}
                        {/* ============================= */}

                        <section className="
                            w-full
                            rounded-xl
                            bg-white
                            p-6
                            shadow-sm
                            lg:w-2/3
                        ">

                            <div className="
                                mb-5
                                flex
                                items-center
                                justify-between
                                border-b
                                pb-4
                            ">

                                <div>

                                    <h2 className="
                                        text-lg
                                        font-semibold
                                        text-gray-800
                                    ">
                                        点検項目
                                    </h2>

                                    <p className="
                                        mt-1
                                        text-sm
                                        text-gray-500
                                    ">
                                        点検項目を追加・編集・並び替えします
                                    </p>

                                </div>


                                <button
                                    type="button"
                                    onClick={() =>
                                        setIsAddItemModalOpen(true)
                                    }
                                    className="
                                        rounded-lg
                                        bg-blue-600
                                        px-4
                                        py-2
                                        text-sm
                                        font-medium
                                        text-white
                                        hover:bg-blue-700
                                    "
                                >
                                    ＋ 項目を追加
                                </button>

                            </div>


                            {/* 項目一覧 */}

                            {inspectionChecklistItems.length === 0 ? (

                                <div className="
                                    flex
                                    h-[600px]
                                    items-center
                                    justify-center
                                    rounded-lg
                                    border
                                    border-dashed
                                    border-gray-300
                                ">

                                    <div className="text-center">

                                        <p className="
                                            text-sm
                                            text-gray-400
                                        ">
                                            まだ点検項目がありません
                                        </p>

                                        <p className="
                                            mt-1
                                            text-xs
                                            text-gray-400
                                        ">
                                            「項目を追加」から追加してください
                                        </p>

                                    </div>

                                </div>

                            ) : (

                                <div className="
                                    h-[600px]
                                    overflow-y-auto
                                ">

                                    <DndContext
                                        collisionDetection={
                                            closestCenter
                                        }
                                        onDragEnd={
                                            handleChecklistItemDragEnd
                                        }
                                        modifiers={[
                                            restrictToVerticalAxis
                                        ]}
                                    >

                                        <SortableContext
                                            items={
                                                inspectionChecklistItems.map(
                                                    (item) => item.id
                                                )
                                            }
                                            strategy={
                                                verticalListSortingStrategy
                                            }
                                        >

                                            <div className="space-y-2">

                                                {inspectionChecklistItems.map(
                                                    (item, index) => (

                                                        <SortableInspectionChecklistItemEdit
                                                            key={item.id}
                                                            item={item}
                                                            index={index}
                                                            inspectionItemTypes={
                                                                inspectionItemTypes
                                                            }
                                                            onEdit={(item) => {
                                                                setEditingChecklistItem(item)
                                                                setIsEditItemModalOpen(true)
                                                            }}
                                                            onDelete={(itemId) => {
                                                                setInspectionChecklistItems(
                                                                    (prev) =>
                                                                        prev.filter(
                                                                            (item) => item.id !== itemId
                                                                        )
                                                                )
                                                            }}
                                                            />

                                                    )
                                                )}

                                            </div>

                                        </SortableContext>

                                    </DndContext>

                                </div>

                            )}

                        </section>

                    </div>


                    {/* ================================= */}
                    {/* Footer */}
                    {/* ================================= */}

                    <div className="
                        mt-6
                        flex
                        justify-between
                        gap-3
                    ">

                        <button
                            type="button"
                            onClick={() =>
                                router.back()
                            }
                            className="
                                rounded-lg
                                border
                                border-gray-500
                                bg-white
                                px-5
                                py-2.5
                                text-sm
                                font-medium
                                text-gray-700
                            "
                        >
                            キャンセル
                        </button>


                        <button
                            type="button"
                            onClick={handleSave}
                            disabled={loading}
                            className="
                                rounded-lg
                                bg-blue-600
                                px-6
                                py-2.5
                                text-sm
                                font-medium
                                text-white
                                disabled:opacity-50
                            "
                        >
                            保存
                        </button>

                    </div>

                </div>


                {/* ================================= */}
                {/* Modal */}
                {/* ================================= */}

                <AddInspectionChecklistItemEditModal
                    open={isAddItemModalOpen}
                    inspectionItemTypes={
                        inspectionItemTypes
                    }
                    onClose={() =>
                        setIsAddItemModalOpen(false)
                    }
                    onAdd={(name, itemTypeId) => {

                        setInspectionChecklistItems(
                            (prev) => [
                                ...prev,
                                {
                                    id: Date.now(),
                                    name,
                                    itemTypeId,
                                    displayOrder:
                                        prev.length + 1,
                                    required: false,
                                    defaultValue: null,
                                    options: null,
                                    unit: null,
                                },
                            ]
                        )

                        setIsAddItemModalOpen(false)

                    }}
                />


                <EditInspectionChecklistItemEditModal
                    open={isEditItemModalOpen}
                    item={editingChecklistItem}
                    inspectionItemTypes={
                        inspectionItemTypes
                    }
                    onClose={() => {

                        setIsEditItemModalOpen(false)
                        setEditingChecklistItem(null)

                    }}
                    onSave={() => {

                        setIsEditItemModalOpen(false)
                        setEditingChecklistItem(null)

                    }}
                />

            </div>


            <LoadingOverlay loading={loading} />

        </>
    )
}

