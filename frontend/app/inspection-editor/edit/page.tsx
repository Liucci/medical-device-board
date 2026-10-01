
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
import { getInspectionChecklistItemsWithOptionsFromApi }from "../../api/inspection/inspectionChecklistItems/fetchInspectionChecklistItemsWithOptions"
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
        try{
            await executeWithErrorAndLoading({
                setLoading,
                action: async () => {
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
        }catch(error){
                alert("初期化に失敗しました")
                router.push("/dashboard")
        }
    
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

    const handleChecklistChange = async (checklistId: number | null) =>
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

        const checklist =inspectionChecklists.find(
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

        const items =await getInspectionChecklistItemsWithOptionsFromApi(checklistId)
        const itemsWithOptions: InspectionChecklistItem[] =items.map(normalizeInspectionChecklistItem)

        setInspectionChecklistItems(
            sortChecklistItemsByCategory(itemsWithOptions)
        )
        setOriginalItemIds(
            itemsWithOptions.map((item) => item.id)
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
            `「${checklist.name}」Ver.${checklist.version} を削除しますか？\n\n` +
            `この点検表の過去のバージョンを含む、すべてのバージョンが削除されます。\n` +
            `また、各バージョンに紐づく点検項目・選択肢もすべて削除されます。\n\n` +
            `この操作は取り消せません。`
        )
        if (!confirmed) {
            return
        }

        await executeWithErrorAndLoading({
            setLoading,
            action: async () => {

                const updatedChecklists=await deleteInspectionChecklistTransaction({
                    checklistId: checklist.id
                })
                setInspectionChecklists(updatedChecklists)

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
            <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">

                <div className="mx-auto max-w-7xl">

                    {/* Header */}
                    <div className="mb-6">
                        <h1 className="text-base font-bold text-slate-900 sm:text-lg">
                            点検表編集
                        </h1>

                        <p className="mt-1 text-[11px] text-slate-500 sm:text-xs">
                            点検表の情報と点検項目を編集します
                        </p>
                    </div>


                    {/* Main */}
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:items-start">

                        {/* 点検表情報 */}
                        <section className="rounded-xl border border-slate-200 bg-white shadow-sm lg:col-span-4">

                            <div className="border-b border-slate-100 px-4 py-3 sm:px-5">

                                <h2 className="text-xs font-bold tracking-wide text-slate-700">
                                    点検表情報
                                </h2>

                                <p className="mt-1 text-[11px] text-slate-500">
                                    編集する点検表を選択します
                                </p>

                            </div>

                            <div className="space-y-4 p-4 sm:p-5">

                                {/* 点検表種類 */}
                                <div>

                                    <label className="mb-2 block text-xs font-medium text-slate-500">
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
                                            setSelectedChecklistId(null)
                                            setInspectionName("")
                                            setDeviceTypeId(null)
                                            setDeviceModelId(null)
                                            setInspectionChecklistItems([])

                                        }}
                                        className="
                                            w-full
                                            rounded-lg
                                            border border-slate-200
                                            bg-white
                                            px-3 py-2.5
                                            text-sm
                                            outline-none
                                            transition
                                            focus:border-teal-600
                                            focus:ring-2
                                            focus:ring-teal-100
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


                                {/* 点検表名 */}
                                <div>

                                    <label className="mb-2 block text-xs font-medium text-slate-500">
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
                                            border border-slate-200
                                            bg-white
                                            px-3 py-2.5
                                            text-sm
                                            outline-none
                                            transition
                                            focus:border-teal-600
                                            focus:ring-2
                                            focus:ring-teal-100
                                            disabled:bg-slate-50
                                            disabled:text-slate-400
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
                                <div>

                                    <label className="mb-2 block text-xs font-medium text-slate-500">
                                        機種
                                    </label>

                                    <div className="
                                        w-full
                                        rounded-lg
                                        border border-slate-200
                                        bg-slate-50
                                        px-3 py-2.5
                                        text-sm
                                        text-slate-700
                                    ">
                                        {
                                            deviceTypes.find(
                                                (deviceType) =>
                                                    deviceType.id === deviceTypeId
                                            )?.name ?? "-"
                                        }
                                    </div>

                                </div>


                                {/* 型式 */}
                                <div>

                                    <label className="mb-2 block text-xs font-medium text-slate-500">
                                        型式
                                    </label>

                                    <div className="
                                        w-full
                                        rounded-lg
                                        border border-slate-200
                                        bg-slate-50
                                        px-3 py-2.5
                                        text-sm
                                        text-slate-700
                                    ">
                                        {
                                            deviceModels.find(
                                                (deviceModel) =>
                                                    deviceModel.id === deviceModelId
                                            )?.name ?? "-"
                                        }
                                    </div>

                                </div>


                                {/* Version */}
                                <div>

                                    <label className="mb-2 block text-xs font-medium text-slate-500">
                                        Version
                                    </label>

                                    <div className="
                                        w-full
                                        rounded-lg
                                        border border-slate-200
                                        bg-slate-50
                                        px-3 py-2.5
                                        text-sm
                                        text-slate-700
                                    ">
                                        {selectedChecklist?.version ?? "-"}
                                    </div>

                                </div>


                                {/* 作成日 / 更新日 */}
                                <div>

                                    <label className="mb-2 block text-xs font-medium text-slate-500">
                                        {
                                            selectedChecklist?.version === 1
                                                ? "作成日"
                                                : "更新日"
                                        }
                                    </label>

                                    <div className="
                                        w-full
                                        rounded-lg
                                        border border-slate-200
                                        bg-slate-50
                                        px-3 py-2.5
                                        text-sm
                                        text-slate-700
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

                            </div>

                        </section>


                        {/* 点検項目 */}
                        <section className="min-w-0 rounded-xl border border-slate-200 bg-white shadow-sm lg:col-span-8">

                            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 sm:px-5">

                                <div>
                                    <h2 className="text-xs font-bold tracking-wide text-slate-700">
                                        点検項目
                                    </h2>

                                    <p className="mt-1 text-[11px] text-slate-500">
                                        点検項目を追加・編集・並び替えします
                                    </p>
                                </div>


                                <button
                                    type="button"
                                    onClick={() => setIsAddItemModalOpen(true)}
                                    disabled={!selectedChecklistId}
                                    className="
                                        flex
                                        h-8
                                        items-center
                                        gap-1.5
                                        rounded-lg
                                        bg-teal-700
                                        px-3
                                        text-xs
                                        font-bold
                                        text-white
                                        transition-colors
                                        hover:bg-teal-800
                                        disabled:cursor-not-allowed
                                        disabled:opacity-40
                                    "
                                >
                                    <span className="text-sm">＋</span>
                                    項目を追加
                                </button>

                            </div>


                            <div className="p-4 sm:p-5">

                                {inspectionChecklistItems.length === 0 ? (

                                    <div className="
                                        flex
                                        h-[calc(100vh-350px)]
                                        min-h-[300px]
                                        max-h-[600px]
                                        items-center
                                        justify-center
                                        rounded-lg
                                        border
                                        border-dashed
                                        border-slate-200
                                    ">

                                        <div className="text-center">

                                            <p className="text-sm text-slate-400">
                                                {
                                                    selectedChecklistId
                                                        ? "まだ点検項目がありません"
                                                        : "点検表を選択してください"
                                                }
                                            </p>

                                            {selectedChecklistId && (
                                                <p className="mt-1 text-xs text-slate-400">
                                                    「項目を追加」から点検項目を追加してください
                                                </p>
                                            )}

                                        </div>

                                    </div>

                                ) : (

                                    <div className="
                                        h-[calc(100vh-350px)]
                                        min-h-[300px]
                                        max-h-[600px]
                                        overflow-y-auto
                                        pr-2
                                    ">

                                        <DndContext
                                            collisionDetection={closestCenter}
                                            onDragEnd={handleChecklistItemDragEnd}
                                            modifiers={[restrictToVerticalAxis]}
                                        >

                                            <SortableContext
                                                items={inspectionChecklistItems.map(
                                                    (item) => item.id
                                                )}
                                                strategy={verticalListSortingStrategy}
                                            >

                                                <div className="space-y-2">

                                                    {inspectionChecklistItems.map(
                                                        (item, index) => (

                                                            <SortableInspectionChecklistItemEdit
                                                                key={item.id}
                                                                item={item}
                                                                index={index}
                                                                inspectionItemTypes={inspectionItemTypes}
                                                                inspectionItemCategories={inspectionItemCategories}
                                                                onEdit={(item) => {
                                                                    setEditingChecklistItem(item)
                                                                    setIsEditItemModalOpen(true)
                                                                }}
                                                                onDelete={(itemId) => {

                                                                    if (
                                                                        originalItemIds.includes(
                                                                            itemId
                                                                        )
                                                                    ) {
                                                                        setDeleteItemIds(
                                                                            (prev) => [
                                                                                ...prev,
                                                                                itemId,
                                                                            ]
                                                                        )
                                                                    }

                                                                    setInspectionChecklistItems(
                                                                        (prev) =>
                                                                            prev.filter(
                                                                                (item) =>
                                                                                    item.id !==
                                                                                    itemId
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

                            </div>

                        </section>

                    </div>


                    {/* Footer */}
                    <div className="
                        mt-4
                        flex
                        flex-col-reverse
                        gap-3
                        sm:mt-6
                        sm:flex-row
                        sm:items-center
                        sm:justify-between
                    ">

                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="
                                rounded-lg
                                border border-slate-200
                                bg-white
                                px-5 py-2.5
                                text-sm
                                font-medium
                                text-slate-700
                                hover:bg-slate-50
                            "
                        >
                            戻る
                        </button>


                        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">

                            <button
                                type="button"
                                onClick={handleDelete}
                                disabled={loading || !selectedChecklistId}
                                className="
                                    h-11
                                    w-full
                                    rounded-xl
                                    border
                                    border-rose-200
                                    bg-white
                                    px-6
                                    text-sm
                                    font-bold
                                    text-rose-600
                                    transition-colors
                                    hover:bg-rose-50
                                    disabled:cursor-not-allowed
                                    disabled:opacity-40
                                    sm:w-auto
                                "
                            >
                                削除
                            </button>


                            <button
                                type="button"
                                onClick={handleSave}
                                disabled={loading || !selectedChecklistId}
                                className="
                                    h-11
                                    w-full
                                    rounded-xl
                                    bg-teal-700
                                    px-6
                                    text-sm
                                    font-bold
                                    text-white
                                    transition-all
                                    hover:bg-teal-800
                                    active:scale-[0.99]
                                    disabled:cursor-not-allowed
                                    disabled:opacity-50
                                    sm:w-auto
                                "
                            >
                                保存
                            </button>

                        </div>

                    </div>

                </div>


                {/* 項目追加Modal */}
                <AddInspectionChecklistItemEditModal
                    open={isAddItemModalOpen}
                    inspectionItemTypes={inspectionItemTypes}
                    inspectionItemCategories={inspectionItemCategories}
                    onClose={() => setIsAddItemModalOpen(false)}
                    onAdd={addChecklistItem}
                />


                {/* 項目編集Modal */}
                <EditInspectionChecklistItemEditModal
                    open={isEditItemModalOpen}
                    item={editingChecklistItem}
                    inspectionItemTypes={inspectionItemTypes}
                    inspectionItemCategories={inspectionItemCategories}
                    onClose={() => {
                        setIsEditItemModalOpen(false)
                        setEditingChecklistItem(null)
                    }}
                    onSave={updateChecklistItem}
                />

            </div>


            <LoadingOverlay loading={loading} />

        </>
    )

}
