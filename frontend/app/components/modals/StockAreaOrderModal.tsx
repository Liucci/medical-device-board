"use client"

import { useEffect, useState } from "react"

import { StockAreaType } from "../../types/stockTypes"
import { updateStockAreaDisplayOrderTransaction } from "../../api/transactions/stockAreas/updateStockAreaDisplayOrderTransaction"
import {GripVertical} from "lucide-react"
import {executeWithLoading} from "../common/executeWithLoading"
import {LoadingOverlay} from "../common/LoadingOverlay"

//DnDライブラリー
import {
  DndContext,
  closestCenter,
  DragEndEvent,
} from "@dnd-kit/core"

import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import SortableStockAreaItem from "./SortableStockAreaItem"


type StockAreaOrderModalProps = {
  isOpen: boolean
  onClose: () => void
  stockAreas: StockAreaType[]
  setStockAreas: any
}

export default function StockAreaOrderModal({
                                        isOpen,
                                        onClose,
                                        stockAreas,
                                        setStockAreas,
                                        }: StockAreaOrderModalProps)
{
  const [editingStockAreas, setEditingStockAreas] = useState<StockAreaType[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
                    if (isOpen) {
                    setEditingStockAreas([...stockAreas])
                    }
                }, [isOpen, stockAreas])

 function handleDragEnd(event: DragEndEvent) 
{
  const { active, over } = event

  if (!over) return

  if (active.id === over.id) return

  setEditingStockAreas((items) => {
    const oldIndex = items.findIndex(
      (item) => item.id === active.id
    )

    const newIndex = items.findIndex(
      (item) => item.id === over.id
    )

    return arrayMove(
      items,
      oldIndex,
      newIndex
    )
  })
}

  if (!isOpen) return null

  async function handleSave() {
  await executeWithLoading({
      setLoading,
      action: async () => {

                await updateStockAreaDisplayOrderTransaction({
                                stockAreas: {
                                    stockAreas: editingStockAreas.map((stockArea, index) => ({
                                                                    id: stockArea.id,
                                                                    displayOrder: index + 1,
                                                                })
                                                            )
                                },
                                setStockAreas,
                                })
                onClose()
        }
        })
  }

  return (
     <>
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <div className="w-[400px] h-[500px] rounded-lg bg-white p-6 shadow-lg flex flex-col">
        <h2 className="mb-4 text-xl font-bold">
        ストックエリア並び替え
        </h2>

<DndContext
  collisionDetection={closestCenter}
  onDragEnd={handleDragEnd}
   modifiers={[restrictToVerticalAxis]}
>
  <SortableContext
    items={editingStockAreas.map((s) => s.id)}
    strategy={verticalListSortingStrategy}
  >
    <div className="flex-1 overflow-y-auto overflow-x-hidden space-y-1 border rounded p-2">
      {editingStockAreas.map((stockArea) => (
        <SortableStockAreaItem
          key={stockArea.id}
          stockArea={stockArea}
        />
      ))}
    </div>
  </SortableContext>
</DndContext>

        <div className="mt-6 flex justify-end gap-2">

          <button
            onClick={onClose}
            className="rounded border px-4 py-2"
          >
            キャンセル
          </button>

          <button
            onClick={handleSave}
            className="rounded bg-blue-600 px-4 py-2 text-white"
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
