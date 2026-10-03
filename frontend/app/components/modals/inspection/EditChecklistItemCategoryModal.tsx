"use client"

import { useEffect, useState } from "react"
import { DndContext, closestCenter, useSensor, useSensors, MouseSensor, TouchSensor, KeyboardSensor, type DragEndEvent } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable"
import { Plus, Save, X } from "lucide-react"
import type { InspectionItemCategoryType, InspectionItemCategoryEditType } from "../../../types/inspectionTypes/inspectionItemCategoryTypes"
import { toSaveInspectionItemCategoriesRequest, normalizeInspectionItemCategory } from "../../../mapper/inspectionMapper/inspectionItemCategoryMapper"
import { deleteInspectionItemCategoryTransaction } from "../../../api/transactions/inspection/inspectionItemCategories/deleteInspectionItemCategoryTransaction"
import { saveInspectionItemCategories } from "../../../api/transactions/inspection/inspectionItemCategories/saveInspectionItemCategories"
import { executeWithErrorAndLoading } from "../../common/executeWithErrorAndLoading"
import { LoadingOverlay } from "../../common/LoadingOverlay"
import useInputModal from "../../../components/common/useInputModal"
import SortableInspectionItemCategory from "./SortableInspectionItemCategory"

type Props = {
    inspectionItemCategories: InspectionItemCategoryType[]
    setInspectionItemCategories: React.Dispatch<React.SetStateAction<InspectionItemCategoryType[]>>
    onclose: () => void
}

export default function EditChecklistItemCategoryModal({ inspectionItemCategories, setInspectionItemCategories, onclose }: Props) {
    console.log("EditChecklistItemCategoryModal")
    const [editCategories, setEditCategories] = useState<InspectionItemCategoryEditType[]>([])
    const [newName, setNewName] = useState("")
    const [loading, setLoading] = useState(false)
    const inputModal = useInputModal()

    const sensors = useSensors(
        useSensor(MouseSensor),
        useSensor(TouchSensor, {
            activationConstraint: {
                delay: 200,
                tolerance: 5,
            },
        }),
        useSensor(KeyboardSensor)
    )

    useEffect(() => {
        setEditCategories(
            inspectionItemCategories.slice().sort((a, b) => a.displayOrder - b.displayOrder).map((category) => ({
                id: category.id,
                name: category.name,
                displayOrder: category.displayOrder,
                isActive: category.isActive,
                excludeWhenStandby: category.excludeWhenStandby,
            }))
        )
    }, [inspectionItemCategories])

    const getSortableId = (category: InspectionItemCategoryEditType, index: number) => {
        return category.id !== null ? `category-${category.id}` : `new-category-${index}`
    }

    const sortableIds = editCategories.map((category, index) => getSortableId(category, index))

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event
        if (!over || active.id === over.id) return
        setEditCategories((current) => {
            const oldIndex = current.findIndex((category, index) => getSortableId(category, index) === active.id)
            const newIndex = current.findIndex((category, index) => getSortableId(category, index) === over.id)
            if (oldIndex === -1 || newIndex === -1) return current
            const moved = arrayMove(current, oldIndex, newIndex)
            return moved.map((category, index) => ({
                ...category,
                displayOrder: index,
            }))
        })
    }

    const handleEdit = (category: InspectionItemCategoryEditType) => {
        inputModal.openInputModal({
            title: "大項目名の変更",
            label: "大項目名",
            value: category.name,
            type: "text",
            buttonPattern: "save_cancel",
            onConfirm: (val: string) => {
                const trimmed = val.trim()
                if (!trimmed || trimmed === category.name) return
                const exists = editCategories.some(
                    (item) => item.id !== category.id && item.name.trim().toLowerCase() === trimmed.toLowerCase()
                )
                if (exists) {
                    inputModal.openInputModal({
                        title: "確認",
                        message: "同名の大項目がすでに存在します",
                        type: "confirm",
                        buttonPattern: "ok_only",
                        icon: "warning",
                    })
                    return
                }
                setEditCategories((current) =>
                    current.map((item) => (item.id === category.id ? { ...item, name: trimmed } : item))
                )
            },
        })
    }

    const handleToggleExcludeWhenStandby = (category: InspectionItemCategoryEditType) => {
        setEditCategories((current) =>
            current.map((item) => (item.id === category.id ? { ...item, excludeWhenStandby: !item.excludeWhenStandby } : item))
        )
    }

    const handleDelete = async (category: InspectionItemCategoryEditType) => {
        if (category.id === null) {
            setEditCategories((current) => current.filter((item) => item !== category))
            return
        }
        const confirmed = await inputModal.confirm({
            title: "大項目の削除",
            message: `「${category.name}」を削除しますか？`,
            subMessage: "この大項目を使用している点検項目もすべて削除されます。",
            buttonPattern: "yes_no",
            confirmVariant: "danger",
            icon: "warning",
        })
        if (!confirmed) return
        await executeWithErrorAndLoading({
            setLoading,
            action: async () => {
                const deletedCategories = await deleteInspectionItemCategoryTransaction({
                    categoryId: category.id!,
                })
                setInspectionItemCategories(deletedCategories.map(normalizeInspectionItemCategory))
            },
        })
    }

    const handleAdd = () => {
        const trimmed = newName.trim()
        if (!trimmed) return
        const exists = editCategories.some(
            (category) => category.name.trim().toLowerCase() === trimmed.toLowerCase()
        )
        if (exists) {
            inputModal.openInputModal({
                title: "確認",
                message: "同名の大項目がすでに存在します",
                type: "confirm",
                buttonPattern: "ok_only",
                icon: "warning",
            })
            return
        }
        const nextDisplayOrder = editCategories.length
        const newCategory: InspectionItemCategoryEditType = {
            id: null,
            name: trimmed,
            displayOrder: nextDisplayOrder,
            isActive: true,
            excludeWhenStandby: false,
        }
        setEditCategories((current) => [...current, newCategory])
        setNewName("")
    }

    const handleSave = async () => {
        const categoriesToSave = editCategories.map((category, index) => ({
            ...category,
            displayOrder: index,
        }))
        const request = toSaveInspectionItemCategoriesRequest({
            categories: categoriesToSave,
        })
        await executeWithErrorAndLoading({
            setLoading,
            action: async () => {
                const savedCategories = await saveInspectionItemCategories(request)
                setInspectionItemCategories(savedCategories.map(normalizeInspectionItemCategory))
            },
        })
    }

    return (
        <>
            <div className="w-full rounded-2xl bg-slate-50 p-3 sm:p-4">
                <div className="flex max-h-[92vh] sm:h-[620px] min-h-0 w-full flex-col rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                    <div className="mb-3 shrink-0">
                        <h3 className="text-sm font-bold tracking-wide text-slate-700">点検項目の大項目</h3>
                        <p className="mt-0.5 text-xs text-slate-500">大項目の追加、名前の変更、削除、並び順の変更を行います</p>
                    </div>

                    <div className="mb-2.5 flex shrink-0 items-center justify-between">
                        <div className="text-xs font-bold tracking-wide text-slate-700">登録されている大項目</div>
                        <div className="text-[11px] font-bold text-slate-500">{editCategories.length} 件</div>
                    </div>

                    <div className="min-h-0 flex-1 overflow-y-auto rounded-xl border border-slate-200 bg-slate-50 p-2 sm:p-3">
                        {editCategories.length === 0 ? (
                            <div className="py-12 text-center text-xs text-slate-400">登録されている大項目はありません</div>
                        ) : (
                            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                                <SortableContext items={sortableIds} strategy={verticalListSortingStrategy}>
                                    <div className="space-y-1.5">
                                        {editCategories.map((category, index) => (
                                            <SortableInspectionItemCategory
                                                key={getSortableId(category, index)}
                                                category={category}
                                                index={index}
                                                onEdit={handleEdit}
                                                onDelete={handleDelete}
                                                onToggleExcludeWhenStandby={handleToggleExcludeWhenStandby}
                                            />
                                        ))}
                                    </div>
                                </SortableContext>
                            </DndContext>
                        )}
                    </div>

                    <div className="mt-3 shrink-0 border-t border-slate-200 pt-3">
                        <div className="mb-2">
                            <h4 className="text-xs font-bold tracking-wide text-slate-700">新しい大項目を追加</h4>
                            <p className="text-[11px] text-slate-500">追加した項目は保存するまでデータベースには登録されません</p>
                        </div>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") handleAdd()
                                }}
                                placeholder="例：外観・動作確認"
                                className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                            />
                            <button
                                type="button"
                                onClick={handleAdd}
                                className="flex h-9 shrink-0 items-center gap-1.5 rounded-lg bg-teal-700 px-4 text-xs font-bold text-white transition-colors hover:bg-teal-800"
                            >
                                <Plus size={15} />
                                追加
                            </button>
                        </div>
                    </div>

                    <div className="mt-3 flex shrink-0 justify-end gap-2 border-t border-slate-200 pt-3">
                        <button
                            type="button"
                            onClick={onclose}
                            className="flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-4 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-100"
                        >
                            <X size={15} />
                            キャンセル
                        </button>
                        <button
                            type="button"
                            onClick={handleSave}
                            disabled={loading}
                            className="flex h-9 items-center gap-1.5 rounded-lg bg-teal-700 px-5 text-xs font-bold text-white transition-colors hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <Save size={15} />
                            保存
                        </button>
                    </div>
                </div>
            </div>
            <LoadingOverlay loading={loading} />
            {inputModal.ModalElement}
        </>
    )
}