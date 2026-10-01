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
    <>
      <div className="w-full rounded-xl bg-slate-50 p-4 sm:p-5">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="mb-4">
            <h3 className="text-sm font-bold tracking-wide text-slate-700">
              病棟並び替え
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              ドラッグ＆ドロップで病棟の表示順を変更します
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <DndContext
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
              modifiers={[restrictToVerticalAxis]}
            >
              <SortableContext
                items={editingWards.map((w) => w.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="max-h-[420px] space-y-2 overflow-y-auto overflow-x-hidden">
                  {editingWards.map((ward) => (
                    <SortableWardItem
                      key={ward.id}
                      ward={ward}
                    />
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