"use client"

import { useEffect, useState } from "react"
import { createPortal } from "react-dom"

import { InfectionTypeType } from "../../types/infectionTypeTypes"
import { RoomInfectionType } from "../../types/roomInfectionTypes"
import { executeWithLoading } from "../common/executeWithLoading"
import { executeWithErrorAndLoading } from "../../components/common/executeWithErrorAndLoading"

import { LoadingOverlay } from "../common/LoadingOverlay"
import { updateRoomInfectionsTransaction } from "../../api/transactions/roomInfections/updateRoomInfectionsTransaction"
import { FaVirus } from "react-icons/fa"

type Props = {
  isOpen: boolean
  onClose: () => void
  infectionTypes: InfectionTypeType[]
  roomInfections: RoomInfectionType[]
  roomId: number
  setRoomInfections: React.Dispatch<
    React.SetStateAction<RoomInfectionType[]>
  >
}

export default function InfectionSelectModal({
  isOpen,
  onClose,
  infectionTypes,
  roomInfections,
  roomId,
  setRoomInfections,
}: Props) {

  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    if (!isOpen) return

    setSelectedIds(
      roomInfections
        .filter(r => r.roomId === roomId)
        .map(r => r.infectionTypeId)
    )
  }, [isOpen, roomId, roomInfections])

  const toggle = (infectionTypeId: number) => {
    setSelectedIds(prev =>
      prev.includes(infectionTypeId)
        ? prev.filter(id => id !== infectionTypeId)
        : [...prev, infectionTypeId]
    )
  }

  if (!isOpen) return null

  return createPortal(
    <>
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30">

      <div className="w-[420px] rounded-xl bg-white p-6 shadow-xl">

        <h2 className="mb-4 text-lg font-bold">
          感染症設定
        </h2>

        <div className="max-h-80 overflow-y-auto border rounded p-3">

          {infectionTypes.map(type => (
            <label
              key={type.id}
              className="flex items-center gap-2 py-1 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedIds.includes(type.id)}
                onChange={() => toggle(type.id)}
              />

                <div className="flex items-center gap-2">

                <FaVirus
                    size={16}
                    color={type.color}
                />

                <span>{type.name}</span>

                </div>              
            </label>
          ))}

        </div>

        <div className="mt-5 flex justify-end gap-2">

          <button
            onClick={onClose}
            className="rounded bg-gray-200 px-4 py-2 hover:bg-gray-300"
          >
            キャンセル
          </button>

          <button
            onClick={async() => {
                await executeWithErrorAndLoading({
                    setLoading,
                    action: async () => {

                        await updateRoomInfectionsTransaction({
                                                                roomInfection: {
                                                                                roomId,
                                                                                infectionTypeIds: selectedIds
                                                                            },
                                                                setRoomInfections
                                                            })

                    onClose()         
                    }
                    })
            }}
            className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            保存
          </button>

        </div>

      </div>

    </div>
<LoadingOverlay loading={loading} />
  </>    
    ,
    document.body
  )
}