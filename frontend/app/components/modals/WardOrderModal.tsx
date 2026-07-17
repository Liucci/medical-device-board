"use client"

import { useEffect, useState } from "react"

import { WardType } from "../../types/wardTypes"
import { updateWardDisplayOrderTransaction } from "../../api/transactions/wards/updateWardDisplayOrderTransaction"
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
import SortableWardItem from "./SortableWardItem"

type WardOrderModalProps = {
  isOpen: boolean
  onClose: () => void
  wards: WardType[]
  setWards: any
}

export default function WardOrderModal({
                                        isOpen,
                                        onClose,
                                        wards,
                                        setWards,
                                        }: WardOrderModalProps)
{
  const [editingWards, setEditingWards] = useState<WardType[]>([])
  const [loading, setLoading] = useState(false)
  useEffect(() => {
                    if (isOpen) {
                    setEditingWards([...wards])
                    }
                }, [isOpen, wards])

 function handleDragEnd(event: DragEndEvent) 
{
  const { active, over } = event

  if (!over) return

  if (active.id === over.id) return

  setEditingWards((items) => {
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
  //loading表示
  await executeWithErrorAndLoading({
      setLoading,
      action: async () => {
                await updateWardDisplayOrderTransaction({
                                wards: {
                                    wards: editingWards.map((ward, index) => ({
                                                                    id: ward.id,
                                                                    displayOrder: index + 1,
                                                                })
                                                            )
                                },
                                setWards,
                                })
                onClose()
        }
        })
                
  }

  return (
//loading表示用の<></>
    <>
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <div className="w-[400px] h-[500px] rounded-lg bg-white p-6 shadow-lg flex flex-col">
        <h2 className="mb-4 text-xl font-bold">
          病棟並び替え
        </h2>

<DndContext
  collisionDetection={closestCenter}
  onDragEnd={handleDragEnd}
   modifiers={[restrictToVerticalAxis]}
>
  <SortableContext
    items={editingWards.map((w) => w.id)}
    strategy={verticalListSortingStrategy}
  >
    <div className="flex-1 overflow-y-auto overflow-x-hidden space-y-1 border rounded p-2">
      {editingWards.map((ward) => (
        <SortableWardItem
          key={ward.id}
          ward={ward}
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