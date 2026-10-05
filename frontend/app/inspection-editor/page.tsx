"use client"
import { useEffect, useState } from "react"
import { Plus } from "lucide-react"
import { useRouter } from "next/navigation"
// 処理中表示
import { LoadingOverlay } from "../components/common/LoadingOverlay"
import { executeWithErrorAndLoading } from "../components/common/executeWithErrorAndLoading"

// dnd
import { DndContext, closestCenter, type DragEndEvent } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import SortableInspectionChecklistItem from "./components/SortableInspectionChecklistItem"

// fetch
import { fetchCurrentUser } from "../api/auth/fetchCurrentUser"
import { getInspectionTypes } from "../api/inspection/inspectionTypes/fetchInspectionTypes"
import { getInspectionItemTypesFromApi } from "../api/inspection/inspectionItemTypes/fetchInspectionItemTypes"
import { getInspectionChecklistsFromApi } from "../api/inspection/inspectionChecklists/fetchInspectionChecklists"
import { getDeviceTypesFromApi } from "../api/deviceTypes/fetchDeviceTypes"
import { getDeviceModelsFromApi } from "../api/deviceModels/fetchDeviceModels"
import { getInspectionItemCategoriesFromApi } from "../api/inspection/inspectionItemCategoies/fetchInspectionItemCategories"
import { fetchInitInspectionEditor } from "../api/inits/fetchInitInspectionEditor"

// types
import type { InspectionType } from "../types/inspectionTypes/inspectionTypeTypes"
import type { InspectionItemType } from "../types/inspectionTypes/inspectionItemTypeTypes"
import type { InspectionChecklist } from "../types/inspectionTypes/inspectionChecklistTypes"
import type { DeviceTypeType } from "../types/deviceTypeTypes"
import type { DeviceModelType } from "../types/deviceModelTypes"
import { CreateInspectionChecklistTransactionFrontType } from "../types/inspectionTypes/inspectionTransactionTypes/inspectionChecklistTransactionTypes"
import { InspectionChecklistItemOption } from "../types/inspectionTypes/inspectionChecklistItemOptionTypes"
import { InspectionItemCategoryType } from "../types/inspectionTypes/inspectionItemCategoryTypes"

// normalizer
import { normalizeDeviceType } from "../mapper/deviceTypeMapper"
import { normalizeDeviceModel } from "../mapper/deviceModelMapper"
import { normalizeInspectionType } from "../mapper/inspectionMapper/inspectionTypeMapper"
import { normalizeInspectionItemType } from "../mapper/inspectionMapper/inspectionItemTypeMapper"
import { normalizeInspectionChecklist } from "../mapper/inspectionMapper/inspectionChecklistMapper"
import { normalizeInspectionItemCategory } from "../mapper/inspectionMapper/inspectionItemCategoryMapper"

// transaction
import { createInspectionChecklistTransaction } from "../api/transactions/inspection/inspectionChecklists/createInspectionChecklistsTransaction"

// modal
import AddInspectionChecklistItemModal from "./components/AddInspectionChecklistItemModal"
import EditInspectionChecklistItemModal from "./components/EditInspectionChecklistItemModal"
import ConfirmModal from "../components/common/ConfirmModal"
import useConfirmModal from "../components/common/useConfirmModal"

export default function InspectionEditorPage() {
    const router = useRouter()
    const confirmModal = useConfirmModal()

    const [inspectionTypes, setInspectionTypes] = useState<InspectionType[]>([])
    const [inspectionItemTypes, setInspectionItemTypes] = useState<InspectionItemType[]>([])
    const [inspectionName, setInspectionName] = useState("")
    const [inspectionTypeId, setInspectionTypeId] = useState<number | null>(null)
    const [selectedInspectionTypeId, setSelectedInspectionTypeId] = useState<number | null>(null)
    const [inspectionChecklists, setInspectionChecklists] = useState<InspectionChecklist[]>([])
    const [selectedChecklistId, setSelectedChecklistId] = useState<number | null>(null)

    type InspectionChecklistItemEditor = {
        id: number
        name: string
        categoryId: number
        itemTypeId: number
        displayOrder: number
        required: boolean
        defaultValue: string | null
        options: InspectionChecklistItemOption[]
        unit: string | null
    }
    const [inspectionChecklistItems, setInspectionChecklistItems] = useState<InspectionChecklistItemEditor[]>([])
    const [deviceTypes, setDeviceTypes] = useState<DeviceTypeType[]>([])
    const [deviceModels, setDeviceModels] = useState<DeviceModelType[]>([])
    const [deviceTypeId, setDeviceTypeId] = useState<number | null>(null)
    const [deviceModelId, setDeviceModelId] = useState<number | null>(null)
    // 項目追加編集用modal
    const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false)
    const [isEditItemModalOpen, setIsEditItemModalOpen] = useState(false)
    const [editingChecklistItem, setEditingChecklistItem] = useState<InspectionChecklistItemEditor | null>(null)
    const [inspectionItemCategories, setInspectionItemCategories] = useState<InspectionItemCategoryType[]>([])
    // 処理中表示用
    const [loading, setLoading] = useState(false)

    // 初期化用
    const fetchInitialData = async () => {
        try {
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
                },
            })
        } catch (error) {
            await confirmModal.confirm({ title: "エラー", message: "初期化に失敗しました", buttonPattern: "ok_only", icon: "warning", confirmVariant: "danger" })
            router.push("/dashboard")
        }
    }

    const filteredDeviceModels = deviceModels.filter((deviceModel) => deviceModel.deviceTypeId === deviceTypeId)

    // 追加した小項目がどのcategoryに属するかによって、そのcategoryの大項目位置に強制的に入る
    const addChecklistItem = (
        name: string,
        categoryId: number,
        itemTypeId: number,
        required: boolean,
        options: InspectionChecklistItemOption[],
        unit: string | null
    ) => {
        setInspectionChecklistItems((prev) => {
            const newItem: InspectionChecklistItemEditor = {
                id: Date.now(),
                name,
                categoryId,
                itemTypeId,
                displayOrder: prev.length + 1,
                required,
                defaultValue: null,
                options,
                unit,
            }
            return sortChecklistItemsByCategory([...prev, newItem])
        })
        setIsAddItemModalOpen(false)
    }

    // UI上で追加したitemのcategoryを変更したとき「category順に並べる」処理
    const sortChecklistItemsByCategory = (items: InspectionChecklistItemEditor[]) => {
        return [...items].sort((a, b) => {
            const categoryA = inspectionItemCategories.find((category) => category.id === a.categoryId)
            const categoryB = inspectionItemCategories.find((category) => category.id === b.categoryId)
            return (categoryA?.displayOrder ?? Number.MAX_SAFE_INTEGER) - (categoryB?.displayOrder ?? Number.MAX_SAFE_INTEGER)
        })
    }

    // UI上のitem編集を実施確定したときの処理
    const updateChecklistItem = (
        itemId: number,
        name: string,
        categoryId: number,
        itemTypeId: number,
        required: boolean,
        options: InspectionChecklistItemOption[],
        unit: string | null
    ) => {
        setInspectionChecklistItems((prev) => {
            const updatedItems = prev.map((item) =>
                item.id === itemId ? { ...item, name, categoryId, itemTypeId, required, options, unit } : item
            )
            return sortChecklistItemsByCategory(updatedItems)
        })
        setIsEditItemModalOpen(false)
        setEditingChecklistItem(null)
    }

    // itemをdrop後の処理
    const handleChecklistItemDragEnd = (event: DragEndEvent) => {
        const { active, over } = event
        if (!over || active.id === over.id) return
        setInspectionChecklistItems((items) => {
            const oldIndex = items.findIndex((item) => item.id === active.id)
            const newIndex = items.findIndex((item) => item.id === over.id)
            if (oldIndex === -1 || newIndex === -1) return items
            const activeItem = items[oldIndex]
            const overItem = items[newIndex]
            if (activeItem.categoryId !== overItem.categoryId) return items
            return arrayMove(items, oldIndex, newIndex)
        })
    }

    const handleSave = async () => {
        try {
            const trimmedName = inspectionName.trim()
            if (!trimmedName) {
                await confirmModal.confirm({ title: "入力確認", message: "点検表名を入力してください", buttonPattern: "ok_only", icon: "warning" })
                return
            }

            // 最新の点検表を再取得
            const latestInspectionChecklistsData = await getInspectionChecklistsFromApi()
            const latestInspectionChecklists: InspectionChecklist[] = latestInspectionChecklistsData.map(normalizeInspectionChecklist)

            // 型式が「共通 (0)」または未指定の場合は null として判定
            const targetModelId = deviceModelId === 0 ? null : deviceModelId

            const hasSameCondition = latestInspectionChecklists.some(
                (checklist) =>
                    checklist.inspectionTypeId === inspectionTypeId &&
                    checklist.deviceTypeId === deviceTypeId &&
                    checklist.deviceModelId === targetModelId
            )
            if (hasSameCondition) {
                const confirmed = await confirmModal.confirm({
                    title: "重複確認",
                    message: "同じ点検表種類・機種・型式で点検表がすでに存在します。追加しますか？",
                    buttonPattern: "yes_no",
                    icon: "question",
                })
                if (!confirmed) return
            }

            const hasSameName = latestInspectionChecklists.some(
                (checklist) =>
                    checklist.name.trim() === trimmedName &&
                    checklist.inspectionTypeId === inspectionTypeId &&
                    checklist.deviceTypeId === deviceTypeId &&
                    checklist.deviceModelId === targetModelId
            )
            if (hasSameName) {
                await confirmModal.confirm({ title: "重複エラー", message: "同じ点検表種類・機種・型式で同名の点検表が存在します", buttonPattern: "ok_only", icon: "warning" })
                return
            }

            // 必須チェック（機種は必須）
            if (inspectionTypeId === null) {
                await confirmModal.confirm({ title: "選択確認", message: "点検表種類を選択してください", buttonPattern: "ok_only", icon: "warning" })
                return
            }
            if (deviceTypeId === null) {
                await confirmModal.confirm({ title: "選択確認", message: "機種を選択してください", buttonPattern: "ok_only", icon: "warning" })
                return
            }
            if (inspectionChecklistItems.some((item) => item.categoryId === null)) {
                await confirmModal.confirm({ title: "設定確認", message: "カテゴリが設定されていない項目があります", buttonPattern: "ok_only", icon: "warning" })
                return
            }

            // 点検表作成（型式「共通」時は deviceModelId = null で保存）
            const request: CreateInspectionChecklistTransactionFrontType = {
                inspectionTypeId,
                deviceTypeId,
                deviceModelId: targetModelId,
                name: inspectionName,
                version: 1,
                items: inspectionChecklistItems.map((item, index) => ({
                    displayOrder: index + 1,
                    itemName: item.name,
                    categoryId: item.categoryId,
                    itemTypeId: item.itemTypeId,
                    required: item.required,
                    defaultValue: null,
                    options: Array.isArray(item.options) ? item.options : null,
                    unit: item.unit,
                })),
            }

            await executeWithErrorAndLoading({
                setLoading,
                action: async () => {
                    await createInspectionChecklistTransaction({ request })
                },
            })
            await confirmModal.confirm({ title: "保存完了", message: "点検表を保存しました", buttonPattern: "ok_only", icon: "success", confirmVariant: "teal" })
        } catch (error) {
            console.error("Failed to save inspection checklist:", error)
            await confirmModal.confirm({ title: "エラー", message: "点検表の保存に失敗しました", buttonPattern: "ok_only", icon: "warning", confirmVariant: "danger" })
        }
    }

    // 初期処理
    useEffect(() => {
        fetchInitialData()
    }, [])

    return (
        <>
            <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
                <div className="mx-auto max-w-7xl">
                    {/* Header */}
                    <div className="mb-6">
                        <h1 className="text-base font-bold text-slate-900 sm:text-lg">
                            点検表作成
                        </h1>
                        <p className="mt-1 text-[11px] text-slate-500 sm:text-xs">
                            点検表の情報と点検項目を設定してください
                        </p>
                    </div>

                    {/* Main */}
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:items-start">
                        {/* 点検表情報：左 1/3 */}
                        <section className="rounded-xl border border-slate-200 bg-white shadow-sm lg:col-span-4">
                            <div className="border-b border-slate-100 px-4 py-3 sm:px-5">
                                <h2 className="text-xs font-bold tracking-wide text-slate-700">
                                    点検表情報
                                </h2>
                                <p className="mt-1 text-[11px] text-slate-500">
                                    点検表の名前と種類を設定します
                                </p>
                            </div>

                            <div className="space-y-4 p-4 sm:p-5">
                                {/* 点検表種類 */}
                                <div className="mb-5">
                                    <label className="mb-2 block text-xs font-medium text-slate-500">
                                        点検表種類
                                    </label>
                                    <select
                                        value={inspectionTypeId ?? ""}
                                        onChange={(event) =>
                                            setInspectionTypeId(
                                                event.target.value === "" ? null : Number(event.target.value)
                                            )
                                        }
                                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                                    >
                                        <option value="">選択してください</option>
                                        {inspectionTypes.map((inspectionType) => (
                                            <option key={inspectionType.id} value={inspectionType.id}>
                                                {inspectionType.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* 機種（共通は不要のため純粋な機種一覧） */}
                                <div className="mb-5">
                                    <label className="mb-2 block text-xs font-medium text-slate-500">
                                        機種
                                    </label>
                                    <select
                                        value={deviceTypeId ?? ""}
                                        onChange={(event) => {
                                            const id = event.target.value === "" ? null : Number(event.target.value)
                                            setDeviceTypeId(id)
                                            setDeviceModelId(null)
                                        }}
                                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                                    >
                                        <option value="">選択してください</option>
                                        {deviceTypes.map((deviceType) => (
                                            <option key={deviceType.id} value={deviceType.id}>
                                                {deviceType.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* 型式（機種選択後に「共通」を選択可能） */}
                                <div className="mb-5">
                                    <label className="mb-2 block text-xs font-medium text-slate-500">
                                        型式
                                    </label>
                                    <select
                                        value={deviceModelId ?? ""}
                                        disabled={deviceTypeId === null}
                                        onChange={(event) =>
                                            setDeviceModelId(
                                                event.target.value === "" ? null : Number(event.target.value)
                                            )
                                        }
                                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100 disabled:bg-slate-50 disabled:text-slate-400"
                                    >
                                        <option value="">
                                            {deviceTypeId === null ? "先に機種を選択してください" : "選択してください"}
                                        </option>
                                        {deviceTypeId !== null && <option value="0">共通</option>}
                                        {filteredDeviceModels.filter((model) => model.name !== "共通" && model.id !== 0).map((deviceModel) => (
                                            <option key={deviceModel.id} value={deviceModel.id}>
                                                {deviceModel.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* 点検表名 */}
                                <div>
                                    <label className="mb-2 block text-xs font-medium text-slate-500">
                                        点検表名
                                    </label>
                                    <input
                                        type="text"
                                        value={inspectionName}
                                        onChange={(event) => setInspectionName(event.target.value)}
                                        placeholder="例：人工呼吸器 定期点検表"
                                        className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                                    />
                                </div>
                            </div>
                        </section>

                        {/* 点検項目：右 2/3 */}
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
                                    className="flex h-8 items-center gap-1.5 rounded-lg bg-teal-700 px-3 text-xs font-bold text-white transition-colors hover:bg-teal-800"
                                >
                                    <Plus className="h-3.5 w-3.5" />
                                    項目を追加
                                </button>
                            </div>

                            <div className="p-4 sm:p-5">
                                {/* 点検項目リスト */}
                                {inspectionChecklistItems.length === 0 ? (
                                    <div className="flex h-[calc(100vh-350px)] min-h-[300px] max-h-[600px] items-center justify-center rounded-lg border border-dashed border-slate-200">
                                        <div className="text-center">
                                            <p className="text-sm text-slate-400">
                                                まだ点検項目がありません
                                            </p>
                                            <p className="mt-1 text-xs text-slate-400">
                                                「項目を追加」から点検項目を追加してください
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="h-[calc(100vh-350px)] min-h-[300px] max-h-[600px] overflow-y-auto pr-2">
                                        <DndContext
                                            collisionDetection={closestCenter}
                                            onDragEnd={handleChecklistItemDragEnd}
                                            modifiers={[restrictToVerticalAxis]}
                                        >
                                            <SortableContext
                                                items={inspectionChecklistItems.map((item) => item.id)}
                                                strategy={verticalListSortingStrategy}
                                            >
                                                <div className="space-y-2">
                                                    {inspectionChecklistItems.map((item, index) => (
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
                                                                setInspectionChecklistItems((prev) =>
                                                                    prev.filter((item) => item.id !== itemId)
                                                                )
                                                            }}
                                                        />
                                                    ))}
                                                </div>
                                            </SortableContext>
                                        </DndContext>
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>

                    {/* Footer */}
                    <div className="mt-4 flex flex-col-reverse gap-3 sm:mt-6 sm:flex-row sm:items-center sm:justify-between">
                        <button
                            type="button"
                            onClick={() => router.push("/dashboard")}
                            className="rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            ダッシュボードに戻る
                        </button>

                        <button
                            type="button"
                            onClick={handleSave}
                            disabled={loading}
                            className="h-11 w-full rounded-xl bg-teal-700 px-6 text-sm font-bold text-white transition-all hover:bg-teal-800 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
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
                    onClose={() => setIsAddItemModalOpen(false)}
                    onAdd={addChecklistItem}
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
                    onSave={updateChecklistItem}
                />
            </div>

            {/* 処理中表示 */}
            <LoadingOverlay loading={loading} />

            {/* 確認・アラートModal */}
            <ConfirmModal
                open={confirmModal.isOpen}
                onClose={confirmModal.closeConfirmModal}
                onConfirm={confirmModal.onConfirm}
                title={confirmModal.title}
                message={confirmModal.message}
                subMessage={confirmModal.subMessage}
                icon={confirmModal.icon}
                buttonPattern={confirmModal.buttonPattern}
                confirmText={confirmModal.confirmText}
                cancelText={confirmModal.cancelText}
                confirmVariant={confirmModal.confirmVariant}
            />
        </>
    )
}