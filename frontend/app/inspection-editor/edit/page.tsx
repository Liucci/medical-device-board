
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

// 処理中表示
import { LoadingOverlay } from "../../components/common/LoadingOverlay"
import { executeWithErrorAndLoading } from "../../components/common/executeWithErrorAndLoading"

// fetch
import { fetchCurrentUser } from "../../api/auth/fetchCurrentUser"
import { getInspectionTypes } from "../../api/inspection/inspectionTypes/fetchInspectionTypes"
import { getInspectionItemTypesFromApi } from "../../api/inspection/inspectionItemTypes/fetchInspectionItemTypes"
import { getInspectionChecklistsFromApi } from "../../api/inspection/inspectionChecklists/fetchInspectionChecklists"
import { getDeviceTypesFromApi } from "../../api/deviceTypes/fetchDeviceTypes"
import { getDeviceModelsFromApi } from "../../api/deviceModels/fetchDeviceModels"
import { getInspectionChecklistItemsFromApi } from "../../api/inspection/inspectionChecklistItems/fetchInspectionChecklistItems"
import { getInspectionChecklistItemOptionsFromApi } from "../../api/inspection/inspectionChecklistItemOptions/fetchInspectionChecklistItemOptions"
import { getInspectionItemCategoriesFromApi } from "../../api/inspection/inspectionItemCategoies/fetchInspectionItemCategories"
import { fetchInitInspectionEditor } from "../../api/inits/fetchInitInspectionEditor"

// types
import type { InspectionType } from "../../types/inspectionTypes/inspectionTypeTypes"
import type { InspectionItemType } from "../../types/inspectionTypes/inspectionItemTypeTypes"
import type { InspectionChecklist } from "../../types/inspectionTypes/inspectionChecklistTypes"
import type { DeviceTypeType } from "../../types/deviceTypeTypes"
import type { DeviceModelType } from "../../types/deviceModelTypes"
import type { InspectionChecklistItem } from "../../types/inspectionTypes/inspectionChecklistItemTypes"
import { InspectionItemCategoryType } from "../../types/inspectionTypes/inspectionItemCategoryTypes"
import { CreateInspectionChecklistTransactionFrontType } from "../../types/inspectionTypes/inspectionTransactionTypes/inspectionChecklistTransactionTypes"

// normalizer
import { normalizeInspectionType } from "../../mapper/inspectionMapper/inspectionTypeMapper"
import { normalizeInspectionItemType } from "../../mapper/inspectionMapper/inspectionItemTypeMapper"
import { normalizeInspectionChecklist } from "../../mapper/inspectionMapper/inspectionChecklistMapper"
import { normalizeDeviceType } from "../../mapper/deviceTypeMapper"
import { normalizeDeviceModel } from "../../mapper/deviceModelMapper"
import { normalizeInspectionChecklistItem } from "../../mapper/inspectionMapper/inspectionChecklistItemMapper"
import {normalizeInspectionChecklistItemOption} from "../../mapper/inspectionMapper/inspectionChecklistItemOptionMapper"
import { normalizeInspectionItemCategory } from "../../mapper/inspectionMapper/inspectionItemCategoryMapper"

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

// modal
import SortableInspectionChecklistItemEdit from "./components/SortableInspectionChecklistItemEdit"
import AddInspectionChecklistItemEditModal from "./components/AddInspectionChecklistItemEditModal"
import EditInspectionChecklistItemEditModal from "./components/EditInspectionChecklistItemEditModal"

// transaction
import { createInspectionChecklistTransaction } from "../../api/transactions/inspection/inspectionChecklists/createInspectionChecklistsTransaction"
import { deleteInspectionChecklistTransaction } from "../../api/transactions/inspection/inspectionChecklists/deleteInspectionChecklistTransaction"

export default function InspectionChecklistEditPage()
{
    const router = useRouter()

    // 点検表関連
    const [inspectionTypes, setInspectionTypes] =useState<InspectionType[]>([])
    const [inspectionItemTypes, setInspectionItemTypes] =useState<InspectionItemType[]>([])
    const [inspectionChecklists, setInspectionChecklists] =useState<InspectionChecklist[]>([])

    // 点検表情報
    const [inspectionName, setInspectionName] =useState("")
    const [inspectionTypeId, setInspectionTypeId] =useState<number | null>(null)
    // 機種関連
    const [deviceTypes, setDeviceTypes] =useState<DeviceTypeType[]>([])
    const [deviceModels, setDeviceModels] =useState<DeviceModelType[]>([])
    const [deviceTypeId, setDeviceTypeId] =useState<number | null>(null)
    const [deviceModelId, setDeviceModelId] =useState<number | null>(null)
    const [selectedChecklistId, setSelectedChecklistId] =useState<number | null>(null)
    // 点検項目
    const [inspectionChecklistItems, setInspectionChecklistItems] =useState<InspectionChecklistItem[]>([])
    const [deleteItemIds, setDeleteItemIds] =useState<number[]>([])
    const [originalItemIds, setOriginalItemIds] =useState<number[]>([])
    const [inspectionItemCategories, setInspectionItemCategories] =useState<InspectionItemCategoryType[]>([])

    // Modal
    const [isAddItemModalOpen, setIsAddItemModalOpen] =useState(false)
    const [isEditItemModalOpen, setIsEditItemModalOpen] =useState(false)
    const [editingChecklistItem, setEditingChecklistItem] =useState<InspectionChecklistItem | null>(null)
    // Loading
    const [loading, setLoading] =useState(false)


    // =========================================
    // 初期データ取得
    // =========================================

    const fetchInitialData = async () =>
    {
    await executeWithErrorAndLoading({
            setLoading,
            action: async () => {
                    // current user取得
                    const currentUser = await fetchCurrentUser()
                    // 権限チェック
                    if (!currentUser) {
                        return
                    }
                    if (currentUser?.role !== "admin")
                    {
                        alert("権限がありません")
                        router.push("/dashboard")
                        return
                    }
                        const initData = await fetchInitInspectionEditor()
                        const inspectionTypesData = initData.inspection_types
                        const inspectionItemTypesData = initData.inspection_item_types
                        const inspectionChecklistsData = initData.inspection_checklists
                        const deviceTypesData = initData.device_types
                        const deviceModelsData = initData.device_models
                        const inspectionItemCategoriesData = initData.inspection_item_categories
                        setInspectionTypes(inspectionTypesData.map(normalizeInspectionType))
                        setInspectionItemTypes(inspectionItemTypesData.map(normalizeInspectionItemType))
                        setInspectionChecklists(inspectionChecklistsData.map(normalizeInspectionChecklist))
                        setDeviceTypes(deviceTypesData.map(normalizeDeviceType))
                        setDeviceModels(deviceModelsData.map(normalizeDeviceModel))
                        setInspectionItemCategories(inspectionItemCategoriesData.map(normalizeInspectionItemCategory))
            }
        })
    
    
        }


    // =========================================
    // 時刻format
    // =========================================

    const formatDateTime = (
        dateString: string | null | undefined
    ) => {
        if (!dateString) return "-"

        const date = new Date(dateString)

        return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} ${
            String(date.getHours()).padStart(2, "0")
        }:${String(date.getMinutes()).padStart(2, "0")}`
    }


    // =========================================
    // 点検表種類に紐づく点検表だけに絞る
    // =========================================

    const inspectionTypeChecklists =
        inspectionChecklists.filter(
            (checklist) =>
                checklist.inspectionTypeId === inspectionTypeId
        )


    // =========================================
    // 同じ点検表系列の中から最新Versionだけを残す
    // =========================================

    const filteredInspectionChecklists = Array.from(
        inspectionTypeChecklists.reduce((map, checklist) => {

            const key = [
                checklist.inspectionTypeId,
                checklist.deviceTypeId,
                checklist.deviceModelId ?? "null",
                checklist.name,
            ].join("_")

            const current = map.get(key)

            if (!current || checklist.version > current.version) {
                map.set(key, checklist)
            }

            return map

        }, new Map<string, InspectionChecklist>())
            .values()
    )


    const selectedChecklist = inspectionChecklists.find(
        (checklist) =>
            checklist.id === selectedChecklistId
    )

    const addChecklistItem = (
        name: string,
        categoryId: number,
        itemTypeId: number,
        required: boolean,
        options: InspectionChecklistItem["options"],
        unit: string | null
    ) => {
        setInspectionChecklistItems((prev) => {
            const newItem: InspectionChecklistItem = {
                id: Date.now(),
                categoryId,
                checklistId: selectedChecklistId!,
                displayOrder: prev.length + 1,
                itemName: name,
                itemTypeId,
                required,
                defaultValue: null,
                options,
                unit,
            }

            return sortChecklistItemsByCategory([
                ...prev,
                newItem,
            ])
        })

        setIsAddItemModalOpen(false)
    }

    const updateChecklistItem = (
        itemId: number,
        name: string,
        categoryId: number,
        itemTypeId: number,
        required: boolean,
        options: InspectionChecklistItem["options"],
        unit: string | null
    ) => {
        setInspectionChecklistItems((prev) => {
            const updatedItems = prev.map((item) =>
                item.id === itemId
                    ? {
                        ...item,
                        itemName: name,
                        categoryId,
                        itemTypeId,
                        required,
                        options,
                        unit,
                    }
                    : item
            )

            return sortChecklistItemsByCategory(updatedItems)
        })

        setIsEditItemModalOpen(false)
        setEditingChecklistItem(null)
    }

    //UI上で追加したitemのcategoryを変更したとき「category順に並べる」処理  
    const sortChecklistItemsByCategory = (
        items: InspectionChecklistItem[]
    ) => {
        return [...items].sort((a, b) => {
            const categoryA = inspectionItemCategories.find(
                (category) => category.id === a.categoryId
            )

            const categoryB = inspectionItemCategories.find(
                (category) => category.id === b.categoryId
            )

            return (
                (categoryA?.displayOrder ?? Number.MAX_SAFE_INTEGER) -
                (categoryB?.displayOrder ?? Number.MAX_SAFE_INTEGER)
            )
        })
    }
    // =========================================
    // 点検表選択時
    // =========================================

    const handleChecklistChange = async (
        checklistId: number | null
    ) =>
    {
        setSelectedChecklistId(checklistId)

        if (checklistId === null)
        {
            setInspectionName("")
            setDeviceTypeId(null)
            setDeviceModelId(null)
            setInspectionChecklistItems([])
            return
        }

        const checklist =
            inspectionChecklists.find(
                (item) => item.id === checklistId
            )

        if (!checklist)
        {
            setInspectionName("")
            setDeviceTypeId(null)
            setDeviceModelId(null)
            setInspectionChecklistItems([])
            return
        }

        setInspectionName(checklist.name)
        setDeviceTypeId(checklist.deviceTypeId)
        setDeviceModelId(checklist.deviceModelId)


        // =========================================
        // 点検項目取得
        // =========================================

        const items =
            await getInspectionChecklistItemsFromApi(
                checklistId
            )

        const normalizedItems: InspectionChecklistItem[] =
            items.map(normalizeInspectionChecklistItem)


        // =========================================
        // 各項目の選択肢取得
        // =========================================

        const itemsWithOptions =
            await Promise.all(
                normalizedItems.map(
                    async (item) =>
                    {
                        const options =
                            await getInspectionChecklistItemOptionsFromApi(
                                item.id
                            )

                        //console.log("options:", options)

                        return {
                            ...item,
                            options:
                                options.map(
                                    normalizeInspectionChecklistItemOption
                                ),
                        }
                    }
                )
            )

        setInspectionChecklistItems(
            sortChecklistItemsByCategory(itemsWithOptions)
        )

        setOriginalItemIds(
            itemsWithOptions.map(
                (item) => item.id
            )
        )
    }


    // =========================================
    // 項目並び替え
    // =========================================

    const handleChecklistItemDragEnd = (event: DragEndEvent) => {
        const { active, over } = event
        if (!over) return
        if (active.id === over.id) return

        setInspectionChecklistItems((items) => {
            const oldIndex = items.findIndex((item) => item.id === active.id)
            const newIndex = items.findIndex((item) => item.id === over.id)
            if (oldIndex === -1 || newIndex === -1) return items

            const activeItem = items[oldIndex]
            const overItem = items[newIndex]
            if (activeItem.categoryId !== overItem.categoryId) return items

            const movedItems = arrayMove(items, oldIndex, newIndex)
            return sortChecklistItemsByCategory(movedItems)
        })
    }
    // =========================================
    // 保存
    // =========================================

    const handleSave = async () =>
    {
    try{
        if (!selectedChecklistId)
        {alert("点検表を選択してください")
            return}
        const checklist =inspectionChecklists.find((item) =>item.id === selectedChecklistId)
        if (!checklist)
        {alert("点検表が見つかりません")
        return}
        setLoading(true)

        const nextVersion =checklist.version + 1
        const request: CreateInspectionChecklistTransactionFrontType = 
                    {inspectionTypeId:checklist.inspectionTypeId,
                    deviceTypeId:checklist.deviceTypeId,
                    deviceModelId:checklist.deviceModelId,
                    name:checklist.name,
                    version:nextVersion,
                    items:inspectionChecklistItems.map(
                            (item,index) => ({
                                displayOrder: index + 1,
                                itemName:item.itemName,
                                categoryId: item.categoryId,
                                itemTypeId:item.itemTypeId,
                                required:item.required,
                                defaultValue:item.defaultValue ?? null,
                                options:item.options ?? null,
                                unit:item.unit ?? null,
                            })
                        ),
                }
        await executeWithErrorAndLoading({
                setLoading,
                action: async () => {      
                                const newChecklist =await createInspectionChecklistTransaction({request})
                // 更新したchecklistをstateに保存
                setInspectionChecklists(
                    (prev) => [
                        ...prev,
                        normalizeInspectionChecklist(
                            newChecklist
                        ),
                    ]
                )
                setSelectedChecklistId(newChecklist.id)
                }
            })
             alert("点検表を保存しました")

        }
        catch (error)
        {
            console.error(error)
            alert("点検表の保存に失敗しました")
        }
        finally
        {
        setLoading(false)
        }
    }

    const handleDelete = async () => {

        if (!selectedChecklistId) {
            alert("点検表を選択してください")
            return
        }

        const checklist = inspectionChecklists.find(
            (item) => item.id === selectedChecklistId
        )

        if (!checklist) {
            alert("点検表が見つかりません")
            return
        }

        const confirmed = window.confirm(
            `「${checklist.name}」Ver.${checklist.version} を削除しますか？\n\nこの操作は取り消せません。`
        )

        if (!confirmed) {
            return
        }

        await executeWithErrorAndLoading({
            setLoading,
            action: async () => {

                await deleteInspectionChecklistTransaction({
                    checklistId: checklist.id
                })

                // UIから削除した点検表を除外
                setInspectionChecklists((prev) =>
                    prev.filter(
                        (item) => item.id !== checklist.id
                    )
                )

                // 選択状態を解除
                setSelectedChecklistId(null)

                // 編集画面の状態も初期化
                setInspectionName("")
                setInspectionTypeId(null)
                setDeviceTypeId(null)
                setDeviceModelId(null)
                setInspectionChecklistItems([])
                setDeleteItemIds([])
                setOriginalItemIds([])
            }
        })

        alert("点検表を削除しました")
    }    

    // =========================================
    // 初期処理
    // =========================================

    useEffect(() =>
    {
        fetchInitialData()
    }, [])


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
                                    value={
                                        inspectionTypeId ?? ""
                                    }
                                    onChange={(event) => {

                                        const id =
                                            event.target.value === ""
                                                ? null
                                                : Number(
                                                    event.target.value
                                                )

                                        setInspectionTypeId(id)

                                        setSelectedChecklistId(
                                            null
                                        )

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
                                                key={
                                                    inspectionType.id
                                                }
                                                value={
                                                    inspectionType.id
                                                }
                                            >
                                                {
                                                    inspectionType.name
                                                }
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
                                    value={
                                        selectedChecklistId ?? ""
                                    }
                                    disabled={
                                        inspectionTypeId === null
                                    }
                                    onChange={
                                        async (event) => {

                                            const id =
                                                event.target.value === ""
                                                    ? null
                                                    : Number(
                                                        event.target.value
                                                    )

                                            await handleChecklistChange(
                                                id
                                            )
                                        }
                                    }
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
                                        {
                                            inspectionTypeId === null
                                                ? "先に点検表種類を選択してください"
                                                : "選択してください"
                                        }
                                    </option>

                                    {filteredInspectionChecklists.map(
                                        (checklist) => (

                                            <option
                                                key={
                                                    checklist.id
                                                }
                                                value={
                                                    checklist.id
                                                }
                                            >
                                                {
                                                    checklist.name
                                                }
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
                                    {
                                        deviceTypes.find(
                                            (deviceType) =>
                                                deviceType.id ===
                                                deviceTypeId
                                        )?.name ?? "-"
                                    }
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
                                    {
                                        deviceModels.find(
                                            (deviceModel) =>
                                                deviceModel.id ===
                                                deviceModelId
                                        )?.name ?? "-"
                                    }
                                </div>

                            </div>


                            {/* Version */}

                            <div className="mb-5">

                                <label className="
                                    mb-2
                                    block
                                    text-sm
                                    font-medium
                                    text-gray-700
                                ">
                                    Version
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
                                    {
                                        selectedChecklist?.version ??
                                        "-"
                                    }
                                </div>

                            </div>


                            {/* 作成日 / 更新日 */}

                            <div className="mb-5">

                                <label className="
                                    mb-2
                                    block
                                    text-sm
                                    font-medium
                                    text-gray-700
                                ">
                                    {
                                        selectedChecklist?.version === 1
                                            ? "作成日"
                                            : "更新日"
                                    }
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
                                    {
                                        selectedChecklist
                                            ? (
                                                selectedChecklist.version === 1
                                                    ? formatDateTime(
                                                        selectedChecklist.createdAt
                                                    )
                                                    : formatDateTime(
                                                        selectedChecklist.updatedAt
                                                    )
                                            )
                                            : "-"
                                    }
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
                                        collisionDetection={closestCenter}
                                        onDragEnd={handleChecklistItemDragEnd}
                                        modifiers={[restrictToVerticalAxis,]}
                                    >
                                        <SortableContext
                                            items={inspectionChecklistItems.map(
                                                    (item) => item.id
                                                )}
                                            strategy={verticalListSortingStrategy}
                                        >
                                            <div className="space-y-2">
                                                {
                                                    inspectionChecklistItems.map(
                                                        (item,index) =>
                                                        (
                                                            <SortableInspectionChecklistItemEdit
                                                                key={item.id}
                                                                item={item}
                                                                index={index}
                                                                inspectionItemTypes={inspectionItemTypes}
                                                                inspectionItemCategories={inspectionItemCategories}
                                                                onEdit={(item) => {
                                                                        setEditingChecklistItem(item)
                                                                        setIsEditItemModalOpen(true)
                                                                    }
                                                                }
                                                                onDelete={(itemId) => {
                                                                        if (originalItemIds.includes(itemId))
                                                                        {
                                                                            setDeleteItemIds(
                                                                                (prev) => [
                                                                                    ...prev,
                                                                                    itemId,
                                                                                ]
                                                                            )
                                                                        }
                                                                        setInspectionChecklistItems((prev) =>
                                                                                prev.filter(
                                                                                    (item) =>
                                                                                        item.id !==
                                                                                        itemId
                                                                                )
                                                                        )
                                                                    }
                                                                }
                                                            />

                                                        )
                                                    )
                                                }

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
                            ダッシュボードに戻る
                        </button>

                        <div className="flex gap-3">

                            <button
                                type="button"
                                onClick={handleDelete}
                                disabled={loading || !selectedChecklistId}
                                className="
                                    rounded-lg
                                    border
                                    border-red-500
                                    bg-white
                                    px-6
                                    py-2.5
                                    text-sm
                                    font-medium
                                    text-red-600
                                    hover:bg-red-50
                                    disabled:opacity-50
                                "
                            >
                                削除
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
                </div>


                {/* ================================= */}
                {/* 項目追加Modal */}
                {/* ================================= */}

                <AddInspectionChecklistItemEditModal
                    open={isAddItemModalOpen}
                    inspectionItemTypes={inspectionItemTypes}
                    inspectionItemCategories={inspectionItemCategories}
                    onClose={() =>setIsAddItemModalOpen(false)}

                    // ★ 新規登録用と同じくoptionsを受け取る
                    onAdd={addChecklistItem}
                />


                {/* ================================= */}
                {/* 項目編集Modal */}
                {/* ================================= */}

                <EditInspectionChecklistItemEditModal
                    open={isEditItemModalOpen}
                    item={editingChecklistItem}
                    inspectionItemTypes={
                        inspectionItemTypes
                    }
                    inspectionItemCategories={inspectionItemCategories}
                    onClose={() => {
                        setIsEditItemModalOpen(false)
                        setEditingChecklistItem(null)
                    }}
                    onSave={updateChecklistItem}

                />

            </div>


            <LoadingOverlay
                loading={loading}
            />

        </>
    )
}
