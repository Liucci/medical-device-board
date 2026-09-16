"use client"

import { createPortal } from "react-dom"
import { FaVirus } from "react-icons/fa"

import { InfectionTypeType } from "../../types/infectionTypeTypes"

type Props = {
  isOpen: boolean
  onClose: () => void

  infectionTypes: InfectionTypeType[]

  selectedInfectionIds: number[]
  setSelectedInfectionIds: React.Dispatch<
    React.SetStateAction<number[]>
  >
}

export default function WardInfectionSelectModal({
  isOpen,
  onClose,
  infectionTypes,
  selectedInfectionIds,
  setSelectedInfectionIds,
}: Props) {

  const toggle = (infectionTypeId: number) => {
    setSelectedInfectionIds(prev =>
      prev.includes(infectionTypeId)
        ? prev.filter(id => id !== infectionTypeId)
        : [...prev, infectionTypeId]
    )
  }

  if (!isOpen) return null

return createPortal(
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/30">
      <div className="w-[500px] max-w-[calc(100vw-32px)] rounded-xl bg-gray-200 p-5 shadow-xl">
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <div className="space-y-5">

            {/* ===================================================== */}
            {/* 感染症情報 */}
            {/* ===================================================== */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                感染症情報
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                病棟で管理する感染症を選択してください。
              </p>
            </div>

            {/* ===================================================== */}
            {/* 感染症一覧 */}
            {/* ===================================================== */}
            <div>
              <label className="text-xs font-medium text-gray-600">
                感染症
              </label>

              <div className="mt-1 max-h-80 overflow-y-auto rounded-lg border border-gray-300 bg-white p-3">
                <div className="space-y-1">
                  {infectionTypes.map(type => (
                    <label
                      key={type.id}
                      className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 text-sm text-gray-700 transition hover:bg-gray-50"
                    >
                      <input
                        type="checkbox"
                        checked={selectedInfectionIds.includes(type.id)}
                        onChange={() => toggle(type.id)}
                        className="h-4 w-4 rounded border-gray-300"
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
              </div>
            </div>

            {/* ===================================================== */}
            {/* ボタン */}
            {/* ===================================================== */}
            <div className="flex justify-end border-t border-gray-200 pt-5">
              <button
                onClick={onClose}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
              >
                OK
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>,
    document.body
  )  
}