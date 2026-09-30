"use client"

import { useState, type CSSProperties } from "react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

// icon
import {
    GripVertical,
    Trash2,
    Edit2,
    ChevronDown,
    ChevronUp,
} from "lucide-react"

import type { InspectionItemType } from "../../types/inspectionTypes/inspectionItemTypeTypes"
import type { InspectionChecklistItemOption } from "../../types/inspectionTypes/inspectionChecklistItemOptionTypes"
import type { InspectionItemCategoryType } from "../../types/inspectionTypes/inspectionItemCategoryTypes"


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


type SortableInspectionChecklistItemProps = {
    item: InspectionChecklistItemEditor
    index: number
    inspectionItemTypes: InspectionItemType[]
    inspectionItemCategories: InspectionItemCategoryType[]
    onEdit: (item: InspectionChecklistItemEditor) => void
    onDelete: (itemId: number) => void
}


export default function SortableInspectionChecklistItem({
    item,
    index,
    inspectionItemTypes,
    inspectionItemCategories,
    onEdit,
    onDelete,
}: SortableInspectionChecklistItemProps)
{
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: item.id,
    })


    const style: CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 1 : undefined,
    }


    const itemType = inspectionItemTypes.find(
        (itemType) => itemType.id === item.itemTypeId
    )


    const itemTypeName = itemType?.name


    const category = inspectionItemCategories.find(
        (category) => category.id === item.categoryId
    )


    const categoryName = category?.name


    const isCustomOption = itemType?.isCustomOption === true


    const [isOptionsOpen, setIsOptionsOpen] = useState(false)


    const options = Array.isArray(item.options)
        ? item.options.filter(
            (option): option is {
                value: string
                displayOrder: number
            } =>
                typeof option === "object" &&
                option !== null &&
                "value" in option &&
                typeof option.value === "string"
        )
        : []


    const handleDelete = () =>
    {
        const confirmed = window.confirm(
            "この点検項目を削除しますか？"
        )

        if (confirmed)
        {
            onDelete(item.id)
        }
    }


return (
        <div
            ref={setNodeRef}
            style={style}
            className="overflow-x-auto rounded-xl border border-slate-200 bg-white p-3 shadow-sm"
        >

            {/* 項目本体 */}

            <div
                className="flex min-w-[760px] items-center gap-3"
            >

                {/* 編集 */}

                <button
                    type="button"
                    onClick={() => onEdit(item)}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                    title="編集"
                >
                    <Edit2 className="h-3.5 w-3.5" />
                </button>


                {/* 削除 */}

                <button
                    type="button"
                    onClick={handleDelete}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-700"
                    title="削除"
                >
                    <Trash2 size={15} />
                </button>


                {/* 項目番号 */}

                <div
                    className="
                        w-8 shrink-0 text-center text-xs font-mono font-bold text-slate-400
                    "
                >
                    {index + 1}
                </div>

                {/* 大項目 */}

                <div
                    className="w-24 shrink-0 text-center"
                    title={categoryName ?? "未選択"}
                >
                    <div className="truncate text-xs font-medium text-slate-500">
                        {categoryName ?? "未選択"}
                    </div>

                    {!item.required && (
                        <span className="mt-1 inline-flex rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-500">
                            入力任意
                        </span>
                    )}
                </div>




                {/* 項目名 */}

                <div className="min-w-0 flex-1 text-sm">
                    <span className="block min-w-0 truncate font-bold text-slate-900">
                        {item.name}
                    </span>
                </div>

                {/* 入力方式 */}

                {isCustomOption ? (

                    <button
                        type="button"
                        onClick={() =>
                            setIsOptionsOpen((prev) => !prev)
                        }
                        className="flex w-36 shrink-0 items-center justify-center gap-1 rounded-lg bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-100"
                        title="選択肢を表示"
                    >
                        <span>
                            任意の選択肢
                        </span>

                        {isOptionsOpen
                            ? <ChevronUp size={16} />
                            : <ChevronDown size={16} />
                        }
                    </button>

                ) : (

                    <div
                        className="w-32 shrink-0 text-center text-xs font-medium text-slate-500"
                    >
                        {itemTypeName}
                    </div>

                )}
                {/* 単位表示 */}
                <div className="w-20 shrink-0 text-center text-xs font-medium text-slate-500">
                    {item.unit ?? "-"}
                </div>

                {/* Drag handle */}

                <button
                    type="button"
                    {...attributes}
                    {...listeners}
                    className="flex h-8 w-8 shrink-0 touch-none cursor-grab items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 active:cursor-grabbing"
                    title="ドラッグして並び替え"
                    aria-label={`${item.name}をドラッグして並び替え`}
                >
                    <GripVertical size={18} />
                </button>

            </div>


            {/* 任意の選択肢 */}

            {isCustomOption && isOptionsOpen && (

                <div
                    className="mt-2 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 sm:ml-auto sm:w-36"
                >

                    {options.length === 0 ? (

                        <p className="text-[11px] text-slate-400">
                            選択肢がありません
                        </p>

                    ) : (

                        <div className="space-y-1">

                            {options.map((option, optionIndex) => (

                                <div
                                    key={`${option.value}-${optionIndex}`}
                                    className="rounded-md px-2 py-1 text-xs text-slate-700"
                                >
                                    {option.value}
                                </div>

                            ))}

                        </div>

                    )}

                </div>

            )}

        </div>
    )
}
