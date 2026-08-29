"use client"

import type { CSSProperties } from "react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
//icon
import { GripVertical,Trash2, Pencil,} from "lucide-react"

import type { InspectionItemType } from "../../../types/inspectionTypes/inspectionItemTypeTypes"
import type {InspectionChecklistItem} from "../../../types/inspectionTypes/inspectionChecklistItemTypes"



type SortableInspectionChecklistItemEditProps = {
                                                item: InspectionChecklistItem
                                                index: number
                                                inspectionItemTypes: InspectionItemType[]
                                                onEdit: (item: InspectionChecklistItem) => void
                                                onDelete: (itemId: number) => void
}

export default function SortableInspectionChecklistItemEdit({
                                                            item,
                                                            index,
                                                            inspectionItemTypes,
                                                            onEdit,
                                                            onDelete,
}: SortableInspectionChecklistItemEditProps) 
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

    const itemTypeName = inspectionItemTypes.find(
        (itemType) => itemType.id === item.itemTypeId
    )?.name

    const handleDelete = () => {
        const confirmed = window.confirm(
            "この点検項目を削除しますか？"
        )

        if (confirmed) {
            onDelete(item.id)
        }
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
                border-gray-500
                bg-gray-50
                px-3
                py-3
            "
        >

            {/* 編集 */}
            <button
                type="button"
                onClick={() => onEdit(item)}
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

            {/* 削除 */}
            <button
                type="button"
                onClick={handleDelete}
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
                    hover:border-red-300
                    hover:bg-red-50
                    hover:text-red-500
                "
                title="削除"
            >
                <Trash2 size={15} />
             </button>

            {/* 項目番号 */}
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

            {/* 項目名 */}
            <div
                className="
                    min-w-0
                    flex-1
                    text-s
                    text-gray-1000
                "
            >
                {item.itemName}
            </div>

            {/* 入力方式 */}
            <div
                className="
                    w-32
                    shrink-0
                    text-center
                    text-s
                    text-gray-500
                "
            >
                {itemTypeName}
            </div>

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
                aria-label={`${item.itemName}をドラッグして並び替え`}
            >
                <GripVertical size={18} />
            </button>

        </div>
    )
}