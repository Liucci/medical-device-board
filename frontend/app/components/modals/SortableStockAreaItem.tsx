"use client"

import { GripVertical } from "lucide-react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

import { StockAreaType } from "../../types/stockTypes"

type Props = {
  stockArea: StockAreaType
}

export default function SortableStockAreaItem({
  stockArea,
}: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: stockArea.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
     zIndex: isDragging ? 1000 : undefined
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
       w-full flex items-center justify-between
        rounded border
        px-2 py-1
        text-sm
        bg-white
        ${isDragging ? "opacity-50" : ""}
      `}
    >
      <span>{stockArea.name}</span>

      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing"
      >
        <GripVertical
          size={16}
          className="text-gray-500"
        />
      </div>
    </div>
  )
}