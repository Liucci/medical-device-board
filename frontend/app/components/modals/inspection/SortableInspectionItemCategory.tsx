"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical, Edit2, Trash2 } from "lucide-react"
import type { InspectionItemCategoryEditType } from "../../../types/inspectionTypes/inspectionItemCategoryTypes"

type Props = {
    category: InspectionItemCategoryEditType
    index: number
    onEdit: (category: InspectionItemCategoryEditType) => void
    onDelete: (category: InspectionItemCategoryEditType) => void
    onToggleExcludeWhenStandby: (category: InspectionItemCategoryEditType) => void
}

export default function SortableInspectionItemCategory({
    category,
    index,
    onEdit,
    onDelete,
    onToggleExcludeWhenStandby,
}: Props) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: category.id !== null ? `category-${category.id}` : `new-category-${index}`,
    })

       // X軸の移動量を 0 に強制固定し、縦方向のみにドラッグを拘束
    const style = {
        transform: CSS.Translate.toString(transform ? { ...transform, x: 0 } : null),
        transition: isDragging ? "none" : transition,
        zIndex: isDragging ? 50 : undefined,
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
            {/* 左端：専用グリップ帯 (幅32px / 背景薄グレー / touch-none / 即座にマウス追従) */}
            <div
                {...attributes}
                {...listeners}
                className="flex w-[32px] shrink-0 cursor-grab items-center justify-center border-r border-slate-200 bg-slate-100 text-slate-400 touch-none active:cursor-grabbing hover:bg-slate-200/70"
                title="ドラッグして並び替え"
            >
                <GripVertical className="h-4 w-4" />
            </div>

            {/* コンテンツエリア (縦幅コンパクト2行構成) */}
            <div className="flex min-w-0 flex-1 flex-col justify-center px-2 py-1.5">
                {/* 1行目：[✎] [🗑] 大項目名 */}
                <div className="flex min-w-0 items-center gap-1">
                    <button
                        type="button"
                        onClick={() => onEdit(category)}
                        className="flex h-6 w-6 shrink-0 items-center justify-center rounded text-slate-400 transition-colors hover:bg-slate-100 hover:text-teal-700"
                        aria-label="大項目名を編集"
                    >
                        <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                        type="button"
                        onClick={() => onDelete(category)}
                        className="flex h-6 w-6 shrink-0 items-center justify-center rounded text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600"
                        aria-label="大項目を削除"
                    >
                        <Trash2 className="h-3.5 w-3.5" />
                    </button>
                    <span className="min-w-0 flex-1 truncate pl-1 text-sm font-bold text-slate-800">
                        {category.name}
                    </span>
                </div>

                {/* 2行目：大項目名の下に揃えた待機時除外チェックボックス */}
                <div className="pl-[58px]">
                    <label className="inline-flex cursor-pointer items-center gap-1.5 text-[11px] text-slate-500 select-none">
                        <input
                            type="checkbox"
                            checked={category.excludeWhenStandby}
                            onChange={() => onToggleExcludeWhenStandby(category)}
                            className="h-3.5 w-3.5 rounded border-slate-300 text-teal-700 focus:ring-teal-200"
                        />
                        待機時は点検から除外
                    </label>
                </div>
            </div>
        </div>
    )
}