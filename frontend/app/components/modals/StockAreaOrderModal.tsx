"use client"

import { useEffect, useState } from "react"

import { StockAreaType } from "../../types/stockTypes"
import { updateStockAreaDisplayOrderTransaction } from "../../api/transactions/stockAreas/updateStockAreaDisplayOrderTransaction"
import {GripVertical} from "lucide-react"
import {executeWithLoading} from "../common/executeWithLoading"
import { executeWithErrorAndLoading } from "../../components/common/executeWithErrorAndLoading"

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
  await executeWithErrorAndLoading({
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
    <div className="w-full rounded-xl bg-gray-200 p-5">
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800">
            ストックエリア並び替え
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            ドラッグ＆ドロップでストックエリアの表示順を変更します
          </p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
          <DndContext
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToVerticalAxis]}
          >
            <SortableContext
              items={editingStockAreas.map((s) => s.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="max-h-[420px] space-y-2 overflow-y-auto overflow-x-hidden">
                {editingStockAreas.map((stockArea) => (
                  <SortableStockAreaItem
                    key={stockArea.id}
                    stockArea={stockArea}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3 border-t border-gray-200 pt-5">
          <button
            onClick={onClose}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50 hover:text-gray-800"
          >
            キャンセル
          </button>

          <button
            onClick={handleSave}
            className="rounded-lg bg-blue-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-600"
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
