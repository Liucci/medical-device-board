"use client"

import { useState } from "react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical, Edit2, Trash2, ChevronDown, ChevronUp } from "lucide-react"
import type { InspectionItemType } from "../../../types/inspectionTypes/inspectionItemTypeTypes"
import type { InspectionItemCategoryType } from "../../../types/inspectionTypes/inspectionItemCategoryTypes"
import type { InspectionChecklistItem } from "../../../types/inspectionTypes/inspectionChecklistItemTypes"

type SortableInspectionChecklistItemEditProps = {
    item: InspectionChecklistItem
    index: number
    inspectionItemTypes: InspectionItemType[]
    inspectionItemCategories: InspectionItemCategoryType[]
    onEdit: (item: InspectionChecklistItem) => void
    onDelete: (itemId: number) => void
}

export default function SortableInspectionChecklistItemEdit({
    item,
    index,
    inspectionItemTypes,
    inspectionItemCategories,
    onEdit,
    onDelete,
}: SortableInspectionChecklistItemEditProps) {
    console.log("SortableInspectionChecklistItemEdit")
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id })

    const style = {
        transform: CSS.Translate.toString(transform ? { ...transform, x: 0 } : null),
        transition: isDragging ? "none" : transition,
        zIndex: isDragging ? 50 : undefined,
    }

    const itemType = inspectionItemTypes.find((it) => it.id === item.itemTypeId)
    const itemTypeName = itemType?.name
    const category = inspectionItemCategories.find((cat) => cat.id === item.categoryId)
    const isCategoryInactive = category?.isActive === false
    const categoryName = category?.name
    const isCustomOption = itemType?.isCustomOption === true
    const [isOptionsOpen, setIsOptionsOpen] = useState(false)
    const options = Array.isArray(item.options) ? item.options.filter((opt): opt is { value: string; displayOrder: number } => typeof opt === "object" && opt !== null && "value" in opt && typeof opt.value === "string") : []

    const handleDelete = () => {
        if (window.confirm("この点検項目を削除しますか？")) onDelete(item.id)
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`flex items-stretch overflow-hidden rounded-lg border bg-white select-none ${
                isDragging
                    ? "opacity-95 shadow-xl border-teal-500 ring-2 ring-teal-500/20"
                    : "border-slate-200 hover:border-slate-300 shadow-2xs"
            }`}
        >
            <div
                {...attributes}
                {...listeners}
                className="flex w-[32px] shrink-0 cursor-grab items-center justify-center border-r border-slate-200 bg-slate-100 text-slate-400 touch-none active:cursor-grabbing hover:bg-slate-200/70"
                title="ドラッグして並び替え"
            >
                <GripVertical className="h-4 w-4" />
            </div>

            <div className="flex min-w-0 flex-1 flex-col justify-center px-2 py-1.5">
                <div className="flex min-w-0 items-center gap-1">
                    <button
                        type="button"
                        onClick={() => onEdit(item)}
                        className="flex h-6 w-6 shrink-0 items-center justify-center rounded text-slate-400 transition-colors hover:bg-slate-100 hover:text-teal-700"
                        aria-label="点検項目を編集"
                    >
                        <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                        type="button"
                        onClick={handleDelete}
                        className="flex h-6 w-6 shrink-0 items-center justify-center rounded text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600"
                        aria-label="点検項目を削除"
                    >
                        <Trash2 className="h-3.5 w-3.5" />
                    </button>
                    <span className="min-w-0 flex-1 truncate pl-1 text-sm font-bold text-slate-800">
                        {item.itemName}
                    </span>
                    {item.required ? (
                        <span className="shrink-0 rounded bg-rose-50 border border-rose-200 px-1.5 py-0.2 text-[10px] font-bold text-rose-700">
                            必須
                        </span>
                    ) : (
                        <span className="shrink-0 rounded bg-slate-100 px-1.5 py-0.2 text-[10px] font-medium text-slate-500">
                            任意
                        </span>
                    )}
                </div>

                <div className="mt-1 flex flex-wrap items-center gap-1.5 pl-[58px]">
                    <span
                        className={`inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-medium ${
                            isCategoryInactive ? "bg-rose-50 text-rose-600 border border-rose-200" : "bg-slate-100 text-slate-600"
                        }`}
                        title={isCategoryInactive ? "無効な大項目を使用しています" : undefined}
                    >
                        {categoryName ?? "未選択"}
                        {isCategoryInactive && " (無効)"}
                    </span>
                    {isCustomOption ? (
                        <button
                            type="button"
                            onClick={() => setIsOptionsOpen((prev) => !prev)}
                            className="inline-flex items-center gap-1 rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[10px] font-medium text-slate-600 transition-colors hover:bg-slate-100"
                        >
                            <span>任意の選択肢{options.length > 0 ? ` (${options.length})` : ""}</span>
                            {isOptionsOpen ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                        </button>
                    ) : (
                        <span className="inline-flex items-center rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[10px] font-medium text-slate-600">
                            {itemTypeName ?? "未設定"}
                        </span>
                    )}
                    {item.unit && (
                        <span className="inline-flex items-center text-[10px] text-slate-500">
                            単位: <span className="ml-0.5 font-mono font-bold text-slate-700">{item.unit}</span>
                        </span>
                    )}
                </div>

                {isCustomOption && isOptionsOpen && (
                    <div className="mt-1.5 ml-[58px] w-fit min-w-[180px] max-w-xs rounded border border-slate-200 bg-slate-50 p-2 text-xs sm:max-w-sm">
                        {options.length === 0 ? (
                            <p className="text-[11px] text-slate-400">選択肢がありません</p>
                        ) : (
                            <div className="space-y-1">
                                {options.map((option, optIdx) => (
                                    <div key={`${option.value}-${optIdx}`} className="rounded border border-slate-200 bg-white px-2 py-0.5 text-[11px] text-slate-700 shadow-2xs">
                                        {option.value}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}