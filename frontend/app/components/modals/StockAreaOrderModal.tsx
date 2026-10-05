"use client"

import { useEffect, useState } from "react"
import { StockAreaType } from "../../types/stockTypes"
import { updateStockAreaDisplayOrderTransaction } from "../../api/transactions/stockAreas/updateStockAreaDisplayOrderTransaction"
import { executeWithErrorAndLoading } from "../../components/common/executeWithErrorAndLoading"
import { LoadingOverlay } from "../common/LoadingOverlay"
import { DndContext, closestCenter, useSensor, useSensors, MouseSensor, TouchSensor, KeyboardSensor, DragEndEvent } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import SortableStockAreaItem from "./SortableStockAreaItem"

type StockAreaOrderModalProps = {
  isOpen: boolean
  onClose: () => void
  stockAreas: StockAreaType[]
  setStockAreas: any
}

export default function StockAreaOrderModal({ isOpen, onClose, stockAreas, setStockAreas }: StockAreaOrderModalProps) {
  const [editingStockAreas, setEditingStockAreas] = useState<StockAreaType[]>([])
  const [loading, setLoading] = useState(false)

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor)
  )

  useEffect(() => {
    if (isOpen) setEditingStockAreas([...stockAreas])
  }, [isOpen, stockAreas])

  if (!isOpen) return null

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    setEditingStockAreas((items) => {
      const oldIndex = items.findIndex((item) => item.id === active.id)
      const newIndex = items.findIndex((item) => item.id === over.id)
      if (oldIndex === -1 || newIndex === -1) return items
      return arrayMove(items, oldIndex, newIndex)
    })
  }

  async function handleSave() {
    await executeWithErrorAndLoading({
      setLoading,
      action: async () => {
        await updateStockAreaDisplayOrderTransaction({
          stockAreas: {
            stockAreas: editingStockAreas.map((stockArea, index) => ({
              id: stockArea.id,
              displayOrder: index + 1,
            })),
          },
          setStockAreas,
        })
        onClose()
      },
    })
  }

  return (
    <>
      <div className="w-full rounded-xl bg-slate-50 p-4 sm:p-5">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="mb-4">
            <h3 className="text-sm font-bold tracking-wide text-slate-700">ストックエリア並び替え</h3>
            <p className="mt-1 text-xs text-slate-500">ドラッグ＆ドロップでストックエリアの表示順を変更します</p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
              modifiers={[restrictToVerticalAxis]}
            >
              <SortableContext items={editingStockAreas.map((s) => s.id)} strategy={verticalListSortingStrategy}>
                {/* 右端スクロールバーとの干渉を防ぐ pr-1.5 マージン */}
                <div className="max-h-[420px] space-y-2 overflow-y-auto overflow-x-hidden pr-1.5">
                  {editingStockAreas.map((stockArea) => (
                    <SortableStockAreaItem key={stockArea.id} stockArea={stockArea} />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </div>

          <div className="mt-4 flex items-center justify-end gap-2 border-t border-slate-200 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="h-10 rounded-lg border border-slate-200 bg-slate-50 px-4 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-100"
            >
              キャンセル
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="h-10 rounded-lg bg-teal-700 px-5 text-xs font-bold text-white transition-colors hover:bg-teal-800"
            >
              保存
            </button>
          </div>
        </div>
      </div>
      <LoadingOverlay loading={loading} />
    </>
  )
}