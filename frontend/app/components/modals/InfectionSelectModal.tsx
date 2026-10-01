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
import { Edit2, Plus, Trash2 } from "lucide-react"

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
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/65 p-4 backdrop-blur-sm">

        <div className="flex max-h-[90vh] w-full max-w-md flex-col overflow-hidden rounded-2xl border border-slate-300 bg-slate-50 text-slate-900 shadow-2xl">

          {/* ================================================= */}
          {/* ヘッダー */}
          {/* ================================================= */}
          <div className="shrink-0 border-b border-slate-200 bg-slate-900 px-5 py-4">
            <h2 className="text-sm font-bold text-white">
              感染症設定
            </h2>

            <p className="mt-1 text-[11px] text-slate-300">
              この部屋に該当する感染症を選択してください
            </p>
          </div>

          {/* ================================================= */}
          {/* 感染症一覧 */}
          {/* ================================================= */}
          <div className="min-h-0 flex-1 overflow-y-auto p-4">

            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
              {infectionTypes.length === 0 ? (

                <div className="px-4 py-10 text-center text-xs text-slate-400">
                  登録されている感染症はありません
                </div>

              ) : (

                <div>
                  {infectionTypes.map(type => (
                    <label
                      key={type.id}
                      className="
                        flex
                        cursor-pointer
                        items-center
                        gap-3
                        border-b
                        border-slate-100
                        px-4
                        py-3
                        last:border-b-0
                        hover:bg-slate-50
                      "
                    >
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(type.id)}
                        onChange={() => toggle(type.id)}
                        className="
                          h-4
                          w-4
                          cursor-pointer
                          rounded
                          border-slate-300
                          text-teal-700
                          focus:ring-teal-500
                        "
                      />

                      <div className="flex min-w-0 items-center gap-2.5">
                        <FaVirus
                          size={16}
                          color={type.color}
                        />

                        <span className="truncate text-sm font-bold text-slate-800">
                          {type.name}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>

              )}
            </div>

          </div>

          {/* ================================================= */}
          {/* フッター */}
          {/* ================================================= */}
          <div className="shrink-0 border-t border-slate-200 bg-white px-4 py-3">
            <div className="flex justify-end gap-2">

              <button
                type="button"
                onClick={onClose}
                className="
                  h-9
                  rounded-lg
                  border
                  border-slate-200
                  bg-slate-50
                  px-4
                  text-xs
                  font-bold
                  text-slate-700
                  transition-colors
                  hover:bg-slate-100
                "
              >
                キャンセル
              </button>

              <button
                type="button"
                onClick={async () => {
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
                className="
                  h-9
                  rounded-lg
                  bg-teal-700
                  px-5
                  text-xs
                  font-bold
                  text-white
                  transition-colors
                  hover:bg-teal-800
                "
              >
                保存
              </button>

            </div>
          </div>

        </div>
      </div>

      <LoadingOverlay loading={loading} />
    </>,
    document.body
  )  
}