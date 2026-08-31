"use client"

import { useState, type CSSProperties } from "react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

// icon
import {
    GripVertical,
    Trash2,
    Pencil,
    ChevronDown,
    ChevronUp,
} from "lucide-react"

import type { InspectionItemType } from "../../types/inspectionTypes/inspectionItemTypeTypes"


type InspectionChecklistItem = {
    id: number
    name: string
    itemTypeId: number
    displayOrder: number
    required: boolean
    defaultValue: string | null
    options: unknown
    unit: string | null
}


type SortableInspectionChecklistItemProps = {
    item: InspectionChecklistItem
    index: number
    inspectionItemTypes: InspectionItemType[]
    onEdit: (item: InspectionChecklistItem) => void
    onDelete: (itemId: number) => void
}


export default function SortableInspectionChecklistItem({
    item,
    index,
    inspectionItemTypes,
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


    const isCustomOption = itemType?.isCustomOption === true


    const [isOptionsOpen, setIsOptionsOpen] = useState(false)


    const options: string[] = Array.isArray(item.options)
        ? item.options.filter(
            (option): option is string =>
                typeof option === "string"
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
            className="
                rounded-lg
                border
                border-gray-500
                bg-gray-50
                px-3
                py-3
            "
        >

            {/* 項目本体 */}
            <div
                className="
                    flex
                    items-center
                    gap-3
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
                        text-sm
                        text-gray-800
                    "
                >
                    {item.name}
                </div>


                {/* 入力方式 */}
                {isCustomOption ? (

                    <button
                        type="button"
                        onClick={() =>
                            setIsOptionsOpen((prev) => !prev)
                        }
                        className="
                            flex
                            w-36
                            shrink-0
                            items-center
                            justify-center
                            gap-1
                            rounded-md
                            px-2
                            py-1.5
                            text-sm
                            text-gray-600
                            hover:bg-gray-200
                        "
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
                        className="
                            w-32
                            shrink-0
                            text-center
                            text-sm
                            text-gray-500
                        "
                    >
                        {itemTypeName}
                    </div>

                )}


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
                    aria-label={`${item.name}をドラッグして並び替え`}
                >
                    <GripVertical size={18} />
                </button>

            </div>


            {/* 任意の選択肢 */}
            {isCustomOption && isOptionsOpen && (

                <div
                    className="
                        mt-2
                        ml-auto
                        w-36
                        rounded-md
                        border
                        border-gray-300
                        bg-white
                        px-3
                        py-2
                    "
                >

                    {options.length === 0 ? (

                        <p className="text-xs text-gray-400">
                            選択肢がありません
                        </p>

                    ) : (

                        <div className="space-y-1">

                            {options.map((option, optionIndex) => (

                                <div
                                    key={`${option}-${optionIndex}`}
                                    className="
                                        rounded
                                        px-2
                                        py-1
                                        text-sm
                                        text-gray-700
                                    "
                                >
                                    {option}
                                </div>

                            ))}

                        </div>

                    )}

                </div>

            )}

        </div>
    )
}

