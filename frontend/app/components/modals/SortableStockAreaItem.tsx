"use client"

import { GripVertical } from "lucide-react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { StockAreaType } from "../../types/stockTypes"

type Props = {
  stockArea: StockAreaType
}

export default function SortableStockAreaItem({ stockArea }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: stockArea.id,
  })

  const style = {
    transform: CSS.Translate.toString(transform ? { ...transform, x: 0 } : null),
    transition: isDragging ? "none" : transition,
    zIndex: isDragging ? 1000 : undefined,
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
      {/* 左端：専用グリップ帯 (幅32px / 背景薄グレー / touch-none) */}
      <div
        {...attributes}
        {...listeners}
        className="flex w-[32px] shrink-0 cursor-grab items-center justify-center border-r border-slate-200 bg-slate-100 text-slate-400 touch-none active:cursor-grabbing hover:bg-slate-200/70"
        title="ドラッグして並び替え"
      >
        <GripVertical size={16} />
      </div>

      {/* 右側：ストックエリア名表示領域 */}
      <div className="flex min-w-0 flex-1 items-center px-3 py-2.5">
        <span className="truncate text-sm font-bold text-slate-900">{stockArea.name}</span>
      </div>
    </div>
  )
}