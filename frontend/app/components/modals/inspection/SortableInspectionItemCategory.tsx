"use client"

import type { CSSProperties } from "react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

import {
    GripVertical,
    Pencil, 
    Trash2,
} from "lucide-react"

import type {
    InspectionItemCategoryEditType,
} from "../../../types/inspectionTypes/inspectionItemCategoryTypes"


type SortableInspectionItemCategoryProps = {
    category: InspectionItemCategoryEditType
    index: number
    onEdit: (category: InspectionItemCategoryEditType) => void
    onDelete: (category: InspectionItemCategoryEditType) => void
}
export default function SortableInspectionItemCategory({
    category,
    index,
    onEdit,
    onDelete
}: SortableInspectionItemCategoryProps) {

    // 新規追加カテゴリーは id が null のため、
    // UI上で一意になるSortable IDを作る
const sortableId =
    category.id !== null
        ? `category-${category.id}`
        : `new-category-${index}`
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: sortableId,
    })


    const style: CSSProperties = {
        transform: CSS.Transform.toString(
                                            transform? {
                                                        ...transform,
                                                        x: 0,
                                            }
                                            : null     
        ),
        transition,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 1 : undefined,
    }


    return (
        <div
            ref={setNodeRef}
            style={style}
            className="
                flex
                items-center
                gap-3
                rounded-lg
                border
                border-gray-200
                bg-white
                px-3
                py-3
            "
        >

            {/* 編集 */}
            <button
                type="button"
                onClick={() => onEdit(category)}
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
                    hover:border-blue-300
                    hover:bg-blue-50
                    hover:text-blue-500
                "
                title="編集"
            >
                <Pencil size={15} />
            </button>


            {/* 番号 */}
            <div
                className="
                    w-8
                    shrink-0
                    text-center
                    text-sm
                    text-gray-400
                "
            >
                {index + 1}
            </div>


            {/* 大項目名 */}
            <div
                className={`
                    min-w-0
                    flex-1
                    truncate
                    text-sm
                    ${
                        category.isActive
                            ? "text-gray-800"
                            : "text-gray-400 line-through"
                    }
                `}
            >
                {category.name}
            </div>


            {/* 削除 */}
            <button
                type="button"
                onClick={() => onDelete(category)}
                className="
                    flex
                    h-7
                    w-7
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-red-200
                    bg-white
                    text-red-400
                    transition
                    hover:border-red-300
                    hover:bg-red-50
                    hover:text-red-500
                "
                title="削除"
                aria-label={`${category.name}を削除`}
            >
                <Trash2 size={15} />
            </button>
            
            {/* Drag handle */}
            <button
                type="button"
                {...attributes}
                {...listeners}
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
                    active:cursor-grabbing
                "
                title="ドラッグして並び替え"
                aria-label={`${category.name}をドラッグして並び替え`}
            >
                <GripVertical size={18} />
            </button>

        </div>
    )
}