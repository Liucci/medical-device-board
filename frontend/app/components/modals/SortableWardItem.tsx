"use client"

import { GripVertical } from "lucide-react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

import { WardType } from "../../types/wardTypes"

type Props = {
  ward: WardType
}

export default function SortableWardItem({
  ward,
}: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: ward.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? "none" : transition,
    zIndex: isDragging ? 1000 : undefined
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        flex w-full items-center justify-between
        rounded-lg border border-slate-200
        bg-white px-3 py-2.5
        text-sm text-slate-900
        shadow-sm transition-colors
        ${isDragging
          ? "opacity-50 shadow-md"
          : "hover:border-slate-300 hover:bg-slate-50"}
      `}
    >
      <span className="min-w-0 flex-1 truncate font-bold">
        {ward.name}
      </span>

      <div
        {...attributes}
        {...listeners}
        className="ml-3 flex shrink-0 cursor-grab items-center justify-center rounded-md p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 active:cursor-grabbing"
        title="ドラッグして並び替え"
      >
        <GripVertical size={18} />
      </div>
    </div>
  )
}