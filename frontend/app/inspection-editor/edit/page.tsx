"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Plus } from "lucide-react"
import { LoadingOverlay } from "../../components/common/LoadingOverlay"
import { executeWithErrorAndLoading } from "../../components/common/executeWithErrorAndLoading"
import { fetchCurrentUser } from "../../api/auth/fetchCurrentUser"
import { getInspectionTypes } from "../../api/inspection/inspectionTypes/fetchInspectionTypes"
import { getInspectionItemTypesFromApi } from "../../api/inspection/inspectionItemTypes/fetchInspectionItemTypes"
import { getInspectionChecklistsFromApi } from "../../api/inspection/inspectionChecklists/fetchInspectionChecklists"
import { getDeviceTypesFromApi } from "../../api/deviceTypes/fetchDeviceTypes"
import { getDeviceModelsFromApi } from "../../api/deviceModels/fetchDeviceModels"
import { getInspectionChecklistItemsWithOptionsFromApi } from "../../api/inspection/inspectionChecklistItems/fetchInspectionChecklistItemsWithOptions"
import { getInspectionItemCategoriesFromApi } from "../../api/inspection/inspectionItemCategoies/fetchInspectionItemCategories"
import { fetchInitInspectionEditor } from "../../api/inits/fetchInitInspectionEditor"
import type { InspectionType } from "../../types/inspectionTypes/inspectionTypeTypes"
import type { InspectionItemType } from "../../types/inspectionTypes/inspectionItemTypeTypes"
import type { InspectionChecklist } from "../../types/inspectionTypes/inspectionChecklistTypes"
import type { DeviceTypeType } from "../../types/deviceTypeTypes"
import type { DeviceModelType } from "../../types/deviceModelTypes"
import type { InspectionChecklistItem } from "../../types/inspectionTypes/inspectionChecklistItemTypes"
import type { InspectionItemCategoryType } from "../../types/inspectionTypes/inspectionItemCategoryTypes"
import type { CreateInspectionChecklistTransactionFrontType } from "../../types/inspectionTypes/inspectionTransactionTypes/inspectionChecklistTransactionTypes"
import { normalizeInspectionType } from "../../mapper/inspectionMapper/inspectionTypeMapper"
import { normalizeInspectionItemType } from "../../mapper/inspectionMapper/inspectionItemTypeMapper"
import { normalizeInspectionChecklist } from "../../mapper/inspectionMapper/inspectionChecklistMapper"
import { normalizeDeviceType } from "../../mapper/deviceTypeMapper"
import { normalizeDeviceModel } from "../../mapper/deviceModelMapper"
import { normalizeInspectionChecklistItem } from "../../mapper/inspectionMapper/inspectionChecklistItemMapper"
import { normalizeInspectionItemCategory } from "../../mapper/inspectionMapper/inspectionItemCategoryMapper"
import { DndContext, closestCenter, type DragEndEvent } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import SortableInspectionChecklistItemEdit from "./components/SortableInspectionChecklistItemEdit"
import AddInspectionChecklistItemEditModal from "./components/AddInspectionChecklistItemEditModal"
import EditInspectionChecklistItemEditModal from "./components/EditInspectionChecklistItemEditModal"
import ConfirmModal from "../../components/common/ConfirmModal"
import useConfirmModal from "../../components/common/useConfirmModal"
import { createInspectionChecklistTransaction } from "../../api/transactions/inspection/inspectionChecklists/createInspectionChecklistsTransaction"
import { deleteInspectionChecklistTransaction } from "../../api/transactions/inspection/inspectionChecklists/deleteInspectionChecklistTransaction"

export default function InspectionChecklistEditPage() {
    console.log("InspectionChecklistEditPage")
    const router = useRouter()
    const confirmModal = useConfirmModal()

    const [inspectionTypes, setInspectionTypes] = useState<InspectionType[]>([])
    const [inspectionItemTypes, setInspectionItemTypes] = useState<InspectionItemType[]>([])
    const [inspectionChecklists, setInspectionChecklists] = useState<InspectionChecklist[]>([])
    const [inspectionName, setInspectionName] = useState("")
    const [inspectionTypeId, setInspectionTypeId] = useState<number | null>(null)
    const [deviceTypes, setDeviceTypes] = useState<DeviceTypeType[]>([])
    const [deviceModels, setDeviceModels] = useState<DeviceModelType[]>([])
    const [deviceTypeId, setDeviceTypeId] = useState<number | null>(null)
    const [deviceModelId, setDeviceModelId] = useState<number | null>(null)
    const [selectedChecklistId, setSelectedChecklistId] = useState<number | null>(null)
    const [inspectionChecklistItems, setInspectionChecklistItems] = useState<InspectionChecklistItem[]>([])
    const [deleteItemIds, setDeleteItemIds] = useState<number[]>([])
    const [originalItemIds, setOriginalItemIds] = useState<number[]>([])
    const [inspectionItemCategories, setInspectionItemCategories] = useState<InspectionItemCategoryType[]>([])
    const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false)
    const [isEditItemModalOpen, setIsEditItemModalOpen] = useState(false)
    const [editingChecklistItem, setEditingChecklistItem] = useState<InspectionChecklistItem | null>(null)
    const [loading, setLoading] = useState(false)

    const fetchInitialData = async () => {
        try {
            await executeWithErrorAndLoading({
                setLoading,
                action: async () => {
                    const initData = await fetchInitInspectionEditor()
                    setInspectionTypes(initData.inspection_types.map(normalizeInspectionType))
                    setInspectionItemTypes(initData.inspection_item_types.map(normalizeInspectionItemType))
                    setInspectionChecklists(initData.inspection_checklists.map(normalizeInspectionChecklist))
                    setDeviceTypes(initData.device_types.map(normalizeDeviceType))
                    setDeviceModels(initData.device_models.map(normalizeDeviceModel))
                    setInspectionItemCategories(initData.inspection_item_categories.map(normalizeInspectionItemCategory))
                },
            })
        } catch (error) {
            await confirmModal.confirm({ title: "エラー", message: "初期化に失敗しました", buttonPattern: "ok_only", icon: "warning", confirmVariant: "danger" })
            router.push("/dashboard")
        }
    }

    const formatDateTime = (dateString: string | null | undefined) => {
        if (!dateString) return "-"
        const date = new Date(dateString)
        return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`
    }

    const inspectionTypeChecklists = inspectionChecklists.filter((cl) => cl.inspectionTypeId === inspectionTypeId)

    const filteredInspectionChecklists = Array.from(
        inspectionTypeChecklists.reduce((map, cl) => {
            const key = [cl.inspectionTypeId, cl.deviceTypeId, cl.deviceModelId ?? "null", cl.name].join("_")
            const current = map.get(key)
            if (!current || cl.version > current.version) map.set(key, cl)
            return map
        }, new Map<string, InspectionChecklist>()).values()
    )

    const selectedChecklist = inspectionChecklists.find((cl) => cl.id === selectedChecklistId)

    const sortChecklistItemsByCategory = (items: InspectionChecklistItem[]) => {
        return [...items].sort((a, b) => {
            const catA = inspectionItemCategories.find((cat) => cat.id === a.categoryId)
            const catB = inspectionItemCategories.find((cat) => cat.id === b.categoryId)
            return (catA?.displayOrder ?? Number.MAX_SAFE_INTEGER) - (catB?.displayOrder ?? Number.MAX_SAFE_INTEGER)
        })
    }

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
            return sortChecklistItemsByCategory([...prev, newItem])
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
                item.id === itemId ? { ...item, itemName: name, categoryId, itemTypeId, required, options, unit } : item
            )
            return sortChecklistItemsByCategory(updatedItems)
        })
        setIsEditItemModalOpen(false)
        setEditingChecklistItem(null)
    }

    const handleChecklistChange = async (checklistId: number | null) => {
        setSelectedChecklistId(checklistId)
        if (checklistId === null) {
            setInspectionName("")
            setDeviceTypeId(null)
            setDeviceModelId(null)
            setInspectionChecklistItems([])
            return
        }
        const checklist = inspectionChecklists.find((item) => item.id === checklistId)
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
        const items = await getInspectionChecklistItemsWithOptionsFromApi(checklistId)
        const itemsWithOptions: InspectionChecklistItem[] = items.map(normalizeInspectionChecklistItem)
        setInspectionChecklistItems(sortChecklistItemsByCategory(itemsWithOptions))
        setOriginalItemIds(itemsWithOptions.map((item) => item.id))
    }

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
            if (!selectedChecklistId) {
                await confirmModal.confirm({ title: "選択確認", message: "点検表を選択してください", buttonPattern: "ok_only", icon: "warning" })
                return
            }
            const checklist = inspectionChecklists.find((item) => item.id === selectedChecklistId)
            if (!checklist) {
                await confirmModal.confirm({ title: "確認", message: "点検表が見つかりません", buttonPattern: "ok_only", icon: "warning" })
                return
            }
            if (inspectionChecklistItems.some((item) => item.categoryId === null)) {
                await confirmModal.confirm({ title: "設定確認", message: "カテゴリが設定されていない項目があります", buttonPattern: "ok_only", icon: "warning" })
                return
            }
            const nextVersion = checklist.version + 1
            const request: CreateInspectionChecklistTransactionFrontType = {
                inspectionTypeId: checklist.inspectionTypeId,
                deviceTypeId: checklist.deviceTypeId,
                deviceModelId: checklist.deviceModelId,
                name: checklist.name,
                version: nextVersion,
                items: inspectionChecklistItems.map((item, index) => ({
                    displayOrder: index + 1,
                    itemName: item.itemName,
                    categoryId: item.categoryId,
                    itemTypeId: item.itemTypeId,
                    required: item.required,
                    defaultValue: item.defaultValue ?? null,
                    options: Array.isArray(item.options) ? item.options : null,
                    unit: item.unit ?? null,
                })),
            }
            await executeWithErrorAndLoading({
                setLoading,
                action: async () => {
                    const newChecklist = await createInspectionChecklistTransaction({ request })
                    setInspectionChecklists((prev) => [...prev, normalizeInspectionChecklist(newChecklist)])
                    setSelectedChecklistId(newChecklist.id)
                },
            })
            await confirmModal.confirm({ title: "保存完了", message: `点検表を保存しました（Ver.${nextVersion}）`, buttonPattern: "ok_only", icon: "success", confirmVariant: "teal" })
        } catch (error) {
            console.error("Failed to save inspection checklist:", error)
            await confirmModal.confirm({ title: "エラー", message: "点検表の保存に失敗しました", buttonPattern: "ok_only", icon: "warning", confirmVariant: "danger" })
        }
    }

    const handleDelete = async () => {
        if (!selectedChecklistId) {
            await confirmModal.confirm({ title: "選択確認", message: "点検表を選択してください", buttonPattern: "ok_only", icon: "warning" })
            return
        }
        const checklist = inspectionChecklists.find((item) => item.id === selectedChecklistId)
        if (!checklist) {
            await confirmModal.confirm({ title: "確認", message: "点検表が見つかりません", buttonPattern: "ok_only", icon: "warning" })
            return
        }
        const confirmed = await confirmModal.confirm({
            title: "点検表の削除",
            message: `「${checklist.name}」Ver.${checklist.version} を削除しますか？\n\nこの点検表の過去のバージョンを含む、すべてのバージョンが削除されます。\nまた、各バージョンに紐づく点検項目・選択肢もすべて削除されます。\n\nこの操作は取り消せません。`,
            buttonPattern: "yes_no",
            icon: "warning",
            confirmVariant: "danger",
            confirmText: "削除する",
        })
        if (!confirmed) return

        try {
            await executeWithErrorAndLoading({
                setLoading,
                action: async () => {
                    const updatedChecklists = await deleteInspectionChecklistTransaction({ checklistId: checklist.id })
                    setInspectionChecklists(updatedChecklists)
                    setSelectedChecklistId(null)
                    setInspectionName("")
                    setInspectionTypeId(null)
                    setDeviceTypeId(null)
                    setDeviceModelId(null)
                    setInspectionChecklistItems([])
                    setDeleteItemIds([])
                    setOriginalItemIds([])
                },
            })
            await confirmModal.confirm({ title: "削除完了", message: "点検表を削除しました", buttonPattern: "ok_only", icon: "success", confirmVariant: "teal" })
        } catch (error) {
            console.error("Failed to delete inspection checklist:", error)
            await confirmModal.confirm({ title: "エラー", message: "点検表の削除に失敗しました", buttonPattern: "ok_only", icon: "warning", confirmVariant: "danger" })
        }
    }

    useEffect(() => {
        fetchInitialData()
    }, [])

    return (
        <>
            <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
                <div className="mx-auto max-w-7xl">
                    <div className="mb-6">
                        <h1 className="text-base font-bold text-slate-900 sm:text-lg">
                            点検表編集
                        </h1>
                        <p className="mt-1 text-[11px] text-slate-500 sm:text-xs">
                            点検表の情報と点検項目を編集します
                        </p>
                    </div>

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
                                            const id = event.target.value === "" ? null : Number(event.target.value)
                                            setInspectionTypeId(id)
                                            setSelectedChecklistId(null)
                                            setInspectionName("")
                                            setDeviceTypeId(null)
                                            setDeviceModelId(null)
                                            setInspectionChecklistItems([])
                                        }}
                                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                                    >
                                        <option value="">選択してください</option>
                                        {inspectionTypes.map((it) => (
                                            <option key={it.id} value={it.id}>{it.name}</option>
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
                                            const id = event.target.value === "" ? null : Number(event.target.value)
                                            await handleChecklistChange(id)
                                        }}
                                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100 disabled:bg-slate-50 disabled:text-slate-400"
                                    >
                                        <option value="">
                                            {inspectionTypeId === null ? "先に点検表種類を選択してください" : "選択してください"}
                                        </option>
                                        {filteredInspectionChecklists.map((cl) => (
                                            <option key={cl.id} value={cl.id}>{cl.name}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* 機種 / 型式 横並びカード */}
                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                    <div>
                                        <label className="mb-1 block text-[11px] font-medium text-slate-400">機種</label>
                                        <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-bold text-slate-900">
                                            {deviceTypes.find((dt) => dt.id === deviceTypeId)?.name ?? "-"}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-[11px] font-medium text-slate-400">型式</label>
                                        <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-bold text-slate-900">
                                            {deviceModels.find((dm) => dm.id === deviceModelId)?.name ?? (deviceModelId === null && selectedChecklistId ? "共通" : "-")}
                                        </div>
                                    </div>
                                </div>

                                {/* Version / 作成・更新日 横並びカード */}
                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                    <div>
                                        <label className="mb-1 block text-[11px] font-medium text-slate-400">Version</label>
                                        <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 font-mono text-sm font-bold text-slate-900">
                                            {selectedChecklist ? `Ver.${selectedChecklist.version}` : "-"}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-[11px] font-medium text-slate-400">
                                            {selectedChecklist?.version === 1 ? "作成日" : "更新日"}
                                        </label>
                                        <div className="truncate rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700">
                                            {selectedChecklist ? (selectedChecklist.version === 1 ? formatDateTime(selectedChecklist.createdAt) : formatDateTime(selectedChecklist.updatedAt)) : "-"}
                                        </div>
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
                                    className="flex h-8 items-center gap-1.5 rounded-lg bg-teal-700 px-3 text-xs font-bold text-white transition-colors hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    <Plus className="h-3.5 w-3.5" />
                                    項目を追加
                                </button>
                            </div>

                            <div className="p-4 sm:p-5">
                                {inspectionChecklistItems.length === 0 ? (
                                    <div className="flex h-[calc(100vh-350px)] min-h-[300px] max-h-[600px] items-center justify-center rounded-lg border border-dashed border-slate-200">
                                        <div className="text-center">
                                            <p className="text-sm text-slate-400">
                                                {selectedChecklistId ? "まだ点検項目がありません" : "点検表を選択してください"}
                                            </p>
                                            {selectedChecklistId && (
                                                <p className="mt-1 text-xs text-slate-400">
                                                    「項目を追加」から点検項目を追加してください
                                                </p>
                                            )}
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
                                                                if (originalItemIds.includes(itemId)) {
                                                                    setDeleteItemIds((prev) => [...prev, itemId])
                                                                }
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
                            onClick={() => router.back()}
                            className="rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                        >
                            戻る
                        </button>

                        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center sm:gap-3">
                            <button
                                type="button"
                                onClick={handleDelete}
                                disabled={loading || !selectedChecklistId}
                                className="flex h-11 w-full items-center justify-center rounded-xl border border-rose-200 bg-white px-6 text-sm font-bold text-rose-600 transition-colors hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-40 sm:h-11 sm:w-auto"
                            >
                                削除
                            </button>

                            <button
                                type="button"
                                onClick={handleSave}
                                disabled={loading || !selectedChecklistId}
                                className="flex h-11 w-full items-center justify-center rounded-xl bg-teal-700 px-6 text-sm font-bold text-white transition-all hover:bg-teal-800 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 sm:h-11 sm:w-auto"
                            >
                                保存
                            </button>
                        </div>
                    </div>
                </div>

                <AddInspectionChecklistItemEditModal
                    open={isAddItemModalOpen}
                    inspectionItemTypes={inspectionItemTypes}
                    inspectionItemCategories={inspectionItemCategories}
                    onClose={() => setIsAddItemModalOpen(false)}
                    onAdd={addChecklistItem}
                />

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