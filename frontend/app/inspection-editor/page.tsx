"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
//処理中表示
import { LoadingOverlay } from "../components/common/LoadingOverlay"
import { executeWithErrorAndLoading } from "../components/common/executeWithErrorAndLoading"

//dnd
import {DndContext,closestCenter,type DragEndEvent,} from "@dnd-kit/core"
import {SortableContext,verticalListSortingStrategy,arrayMove,} from "@dnd-kit/sortable"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import SortableInspectionChecklistItem from "./components/SortableInspectionChecklistItem"
//fetch
import { fetchCurrentUser } from "../api/auth/fetchCurrentUser"
import { getInspectionTypes } from "../api/inspection/inspectionTypes/fetchInspectionTypes"
import { getInspectionItemTypesFromApi } from "../api/inspection/inspectionItemTypes/fetchInspectionItemTypes"
import {getInspectionChecklistsFromApi} from "../api/inspection/inspectionChecklists/fetchInspectionChecklists"
import { getDeviceTypesFromApi } from "../api/deviceTypes/fetchDeviceTypes"
import { getDeviceModelsFromApi } from "../api/deviceModels/fetchDeviceModels"
import { getInspectionItemCategoriesFromApi } from "../api/inspection/inspectionItemCategoies/fetchInspectionItemCategories"
//types
import type {InspectionType,} from "../types/inspectionTypes/inspectionTypeTypes"
import type {InspectionItemType,} from "../types/inspectionTypes/inspectionItemTypeTypes"
import type { InspectionChecklist } from "../types/inspectionTypes/inspectionChecklistTypes"
import type {DeviceTypeType} from "../types/deviceTypeTypes"
import type {DeviceModelType,} from "../types/deviceModelTypes"
import { CreateInspectionChecklistTransactionFrontType } from "../types/inspectionTypes/inspectionTransactionTypes/inspectionChecklistTransactionTypes"
import {InspectionChecklistItemOption,} from "../types/inspectionTypes/inspectionChecklistItemOptionTypes"
import { InspectionItemCategoryType } from "../types/inspectionTypes/inspectionItemCategoryTypes"


//normalizer
import {normalizeDeviceType} from "../utils/deviceTypeMapper"
import {normalizeDeviceModel} from "../utils/deviceModelMapper"
import {normalizeInspectionType} from "../utils/inspectionMapper/inspectionTypeMapper"
import {normalizeInspectionItemType} from "../utils/inspectionMapper/inspectionItemTypeMapper"
import {normalizeInspectionChecklist} from "../utils/inspectionMapper/inspectionChecklistMapper"
import { normalizeInspectionItemCategory } from "../utils/inspectionMapper/inspectionItemCategoryMapper"
//CRUD

//transaction
import { createInspectionChecklistTransaction } from "../api/transactions/inspection/inspectionChecklists/createInspectionChecklistsTransaction"

//modal
import AddInspectionChecklistItemModal from "./components/AddInspectionChecklistItemModal"
import EditInspectionChecklistItemModal from "./components/EditInspectionChecklistItemModal"

export default function InspectionEditorPage()
{
    const router = useRouter()

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
                                        categoryId: number
                                        itemTypeId: number
                                        displayOrder: number
                                        required: boolean
                                        defaultValue: string | null
                                        options:InspectionChecklistItemOption[]
                                        unit: string | null
    }
    const [inspectionChecklistItems, setInspectionChecklistItems] =useState<InspectionChecklistItemEditor[]>([])
    const [deviceTypes, setDeviceTypes] = useState<DeviceTypeType[]>([])
    const [deviceModels, setDeviceModels] = useState<DeviceModelType[]>([])
    const [deviceTypeId, setDeviceTypeId] = useState<number | null>(null)
    const [deviceModelId, setDeviceModelId] = useState<number | null>(null)
    //項目追加編集用modal
    const [isAddItemModalOpen, setIsAddItemModalOpen] =useState(false)
    const [isEditItemModalOpen, setIsEditItemModalOpen] = useState(false)
    const [editingChecklistItem, setEditingChecklistItem] =useState<InspectionChecklistItemEditor | null>(null)
    const [inspectionItemCategories, setInspectionItemCategories] =useState<InspectionItemCategoryType[]>([])
    //処理中表示用
    const [loading, setLoading] = useState(false)
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
                inspectionItemCategoriesData,
            ] = await Promise.all([
                getInspectionTypes(),
                getInspectionItemTypesFromApi(),
                getInspectionChecklistsFromApi(),
                getDeviceTypesFromApi(),
                getDeviceModelsFromApi(),
                getInspectionItemCategoriesFromApi(),
            ])
            setInspectionTypes(inspectionTypesData.map(normalizeInspectionType))
            setInspectionItemTypes(inspectionItemTypesData.map(normalizeInspectionItemType))
            setInspectionChecklists(inspectionChecklistsDate.map(normalizeInspectionChecklist))
            setDeviceTypes(deviceTypesData.map(normalizeDeviceType))
            setDeviceModels(deviceModelsData.map(normalizeDeviceModel))
            setInspectionItemCategories(inspectionItemCategoriesData.map(normalizeInspectionItemCategory))
        }

        fetchInitialData()
    }, [])

    const filteredDeviceModels = deviceModels.filter(
                (deviceModel) =>deviceModel.deviceTypeId === deviceTypeId
    )
    const handleChecklistItemDragEnd = (event: DragEndEvent) => {
        const { active, over } = event

        if (!over) return

        if (active.id === over.id) return

        setInspectionChecklistItems((items) => {
            const oldIndex = items.findIndex(
                (item) => item.id === active.id
            )

            const newIndex = items.findIndex(
                (item) => item.id === over.id
            )

            if (oldIndex === -1 || newIndex === -1) {
                return items
            }

            return arrayMove(
                items,
                oldIndex,
                newIndex
            )
        })
    }

    const handleSave = async () => 
    {
    try {
        const trimmedName = inspectionName.trim()
        if (!trimmedName) {alert("点検表名を入力してください")
            return
        }
        // ==============================
        // 最新の点検表を再取得
        // ==============================
        const latestInspectionChecklistsData =await getInspectionChecklistsFromApi()
        const latestInspectionChecklists: InspectionChecklist[]  =latestInspectionChecklistsData.map(normalizeInspectionChecklist)

        const hasSameCondition = latestInspectionChecklists.some(
            (checklist) =>
                checklist.inspectionTypeId === inspectionTypeId &&
                checklist.deviceTypeId === deviceTypeId &&
                checklist.deviceModelId === deviceModelId
        )
        if (hasSameCondition) 
        {
            const confirmed = window.confirm("同じ点検表種類・機種・型式で点検表がすでに存在します。追加しますか？")
            if (!confirmed) {return}
        }

        const hasSameName = latestInspectionChecklists.some(
            (checklist) =>
                checklist.name.trim() === trimmedName &&
                checklist.inspectionTypeId === inspectionTypeId &&
                checklist.deviceTypeId === deviceTypeId &&
                checklist.deviceModelId === deviceModelId
        )        
        if (hasSameName) 
        {
            alert("同じ点検表種類・機種・型式で同名の点検表が存在します")
            return
        }


        // 必須チェック
        if (inspectionTypeId === null) {alert("点検表種類を選択してください")
            return
        }
        if (deviceTypeId === null) {alert("機種を選択してください")
            return
        }
        if (inspectionChecklistItems.some((item) => item.categoryId === null))
        {
            alert("カテゴリが設定されていない項目があります")
            return
        }
        // 点検表作成
       const request: CreateInspectionChecklistTransactionFrontType = 
       {
            inspectionTypeId,
            deviceTypeId,
            deviceModelId,
            name: inspectionName,
            version: 1,

            items: inspectionChecklistItems.map((item, index) => ({
                displayOrder: index + 1,
                itemName: item.name,
                categoryId: item.categoryId,
                itemTypeId: item.itemTypeId,
                required: false,
                defaultValue: null,

                options: Array.isArray(item.options)
                            ? item.options
                            : null,
                unit: null,
            })),
        }    
        await executeWithErrorAndLoading({
                setLoading,
                action: async () => {
                            const result = await createInspectionChecklistTransaction({
                                request,
                            })
                            //console.log("create inspection checklist result:",result)
                }
            })
        alert("点検表を保存しました")
    } catch (error) {
        console.error("Failed to save inspection checklist:",error)
        alert("点検表の保存に失敗しました")
    }
    }

return (
    <>
        <div className="min-h-screen bg-gray-200 p-12">

            <div className="mx-auto max-w-6xl">

                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-semibold text-gray-800">
                        点検表作成
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        点検表の情報と点検項目を設定してください
                    </p>
                </div>


                {/* Main */}
                <div className="flex flex-col gap-6 lg:flex-row">

                    {/* ===================================== */}
                    {/* 点検表情報：左 1/3 */}
                    {/* ===================================== */}
                    <section className="
                        w-full
                        rounded-xl
                        bg-white
                        p-6
                        shadow-sm
                        lg:w-1/3
                    ">

                        <div className="mb-3  pb-4">

                            <h2 className="text-lg font-semibold text-gray-800">
                                点検表情報
                            </h2>

                            <p className="mt-1 text-sm text-gray-500">
                                点検表の名前と種類を設定します
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
                                    border border-gray-500
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
                                    border border-gray-500
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
                                    border border-gray-500
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
                                    border border-gray-500
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


                    {/* ===================================== */}
                    {/* 点検項目：右 2/3 */}
                    {/* ===================================== */}
                    <section className="
                        w-full
                        rounded-xl
                        bg-white
                        p-6
                        shadow-sm
                        lg:w-2/3
                    ">

                        <div className="
                            mb-3
                            flex
                            items-center
                            justify-between
                            
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


                        {/* 点検項目リスト */}
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
                                        「項目を追加」から
                                        点検項目を追加してください
                                    </p>

                                </div>

                            </div>

                        ) : (

                            <div className="
                                h-[600px]
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

                                                    <SortableInspectionChecklistItem
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

                    </section>

                </div>


                {/* Footer */}
                <div className="
                    mt-6
                    flex
                    justify-between
                    gap-3
                ">

                    <button
                        type="button"
                        onClick={() => router.push("/dashboard")}
                        className="
                            rounded-lg
                            border border-gray-500
                            bg-white
                            px-5 py-2.5
                            text-sm
                            font-medium
                            text-gray-700
                            hover:bg-gray-50
                        "
                    >
                        ダッシュボードに戻る
                    </button>


                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={loading}
                        className="
                            rounded-lg
                            bg-blue-600
                            px-6 py-2.5
                            text-sm
                            font-medium
                            text-white
                            shadow-sm
                            hover:bg-blue-700
                            disabled:cursor-not-allowed
                            disabled:opacity-50
                        "
                    >
                        保存
                    </button>

                </div>

            </div>


            {/* 項目追加Modal */}
<AddInspectionChecklistItemModal
    open={isAddItemModalOpen}
    inspectionItemTypes={inspectionItemTypes}
    inspectionItemCategories={inspectionItemCategories}
    onClose={() =>setIsAddItemModalOpen(false)}
    onAdd={(name, categoryId, itemTypeId, options) =>
    {
        setInspectionChecklistItems((prev) =>
            [
                ...prev,
                {
                    id: Date.now(),
                    name: name,
                    categoryId,
                    itemTypeId,
                    displayOrder: prev.length + 1,
                    required: false,
                    defaultValue: null,
                    options,
                    unit: null,
                },
            ]
        )

        setIsAddItemModalOpen(false)
    }}
/>

            {/* 項目編集Modal */}
            <EditInspectionChecklistItemModal
                open={isEditItemModalOpen}
                item={editingChecklistItem}
                inspectionItemTypes={inspectionItemTypes}
                inspectionItemCategories={inspectionItemCategories}
                onClose={() => {
                    setIsEditItemModalOpen(false)
                    setEditingChecklistItem(null)
                }}
                onSave={(itemId, name, categoryId, itemTypeId, options) => {
                    setInspectionChecklistItems((prev) =>
                        prev.map((item) =>
                            item.id === itemId
                                ? {
                                    ...item,
                                    name,
                                    categoryId,
                                    itemTypeId,
                                    options,
                                }
                                : item
                        )
                    )
                    setIsEditItemModalOpen(false)
                    setEditingChecklistItem(null)
                }}
            />

            </div>


        {/* 処理中表示 */}
        <LoadingOverlay loading={loading} />

    </>
)
}