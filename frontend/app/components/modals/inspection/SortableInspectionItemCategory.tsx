"use client"

import type { CSSProperties } from "react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

import {
    GripVertical,
    Pencil,
} from "lucide-react"

import type {
    InspectionItemCategoryEditType,
} from "../../../types/inspectionTypes/inspectionItemCategoryTypes"


type SortableInspectionItemCategoryProps = {
    category: InspectionItemCategoryEditType
    index: number
    onEdit: (category: InspectionItemCategoryEditType) => void
    onToggleActive: (category: InspectionItemCategoryEditType) => void
}


export default function SortableInspectionItemCategory({
    category,
    index,
    onEdit,
    onToggleActive,
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
                className="
                    min-w-0
                    flex-1
                    truncate
                    text-sm
                    text-gray-800
                "
            >
                {category.name}
            </div>


            {/* 有効 / 無効 */}
            <button
                type="button"
                onClick={() => onToggleActive(category)}
                className={`
                    shrink-0
                    rounded-lg
                    px-3
                    py-1.5
                    text-sm
                    font-medium
                    transition
                    ${
                        category.isActive
                            ? `
                                bg-gray-100
                                text-gray-600
                                hover:bg-gray-200
                                hover:text-gray-800
                              `
                            : `
                                bg-blue-50
                                text-blue-600
                                hover:bg-blue-100
                              `
                    }
                `}
            >
                {category.isActive ? "無効" : "有効"}
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