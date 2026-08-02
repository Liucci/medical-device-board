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

      <div className="w-[420px] rounded-xl bg-white p-6 shadow-xl">

        <h2 className="mb-4 text-lg font-bold">
          病棟感染症設定
        </h2>

        <div className="max-h-80 overflow-y-auto rounded border p-3">

          {infectionTypes.map(type => (
            <label
              key={type.id}
              className="flex cursor-pointer items-center gap-2 py-1"
            >
              <input
                type="checkbox"
                checked={selectedInfectionIds.includes(type.id)}
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
            className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            OK
          </button>

        </div>

      </div>

    </div>,
    document.body
  )
}