
"use client"

import { useEffect, useState } from "react"
import { DeviceTypeType } from "../../types/deviceTypeTypes"
import { updateDeviceTypeDisplayOrderTransaction } from "../../api/transactions/deviceTypes/updateDeviceTypeDisplayOrderTransaction"
import { executeWithErrorAndLoading } from "../common/executeWithErrorAndLoading"
import { LoadingOverlay } from "../common/LoadingOverlay"
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  MouseSensor,
  TouchSensor,
  KeyboardSensor,
  DragEndEvent,
} from "@dnd-kit/core"
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import SortableDeviceTypeItem from "./SortableDeviceTypeItem"

type DeviceTypeOrderModalProps = {
  isOpen: boolean
  onClose: () => void
  deviceTypes: DeviceTypeType[]
  setDeviceTypes: any
}


export default function DeviceTypeOrderModal({
  isOpen,
  onClose,
  deviceTypes,
  setDeviceTypes,
}: DeviceTypeOrderModalProps) {

  const [editingDeviceTypes, setEditingDeviceTypes] = useState<DeviceTypeType[]>([])
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
    if (isOpen) setEditingDeviceTypes([...deviceTypes])
  }, [isOpen, deviceTypes])

  if (!isOpen) return null


  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event

    if (!over || active.id === over.id) return

    setEditingDeviceTypes((items) => {
      const oldIndex = items.findIndex((item) => item.id === active.id)
      const newIndex = items.findIndex((item) => item.id === over.id)

      if (oldIndex === -1 || newIndex === -1) return items

      return arrayMove(items, oldIndex, newIndex)
    })
  }
  function handleColorChange(id: number, iconColor: string) {
    setEditingDeviceTypes((items) =>
      items.map((item) =>
        item.id === id
          ? { ...item, iconColor }
          : item
      )
    )
  }

  async function handleSave() {
    await executeWithErrorAndLoading({
      setLoading,
      action: async () => {
        await updateDeviceTypeDisplayOrderTransaction({
          deviceTypes: {
            deviceTypes: editingDeviceTypes.map((deviceType, index) => ({
              id: deviceType.id,
              displayOrder: index + 1,
              iconColor: deviceType.iconColor,
            })),
          },
          setDeviceTypes,
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
            <h3 className="text-sm font-bold tracking-wide text-slate-700">
              機器種別並び替え
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              ドラッグ＆ドロップで機器種別の表示順を変更します
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
              modifiers={[restrictToVerticalAxis]}
            >
              <SortableContext
                items={editingDeviceTypes.map((deviceType) => deviceType.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="max-h-[420px] space-y-2 overflow-y-auto overflow-x-hidden pr-1.5">
                  {editingDeviceTypes.map((deviceType) => (
                    <SortableDeviceTypeItem
                      key={deviceType.id}
                      deviceType={deviceType}
                      onColorChange={handleColorChange}
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
