"use client"

import { useState } from "react"
import { createPortal } from "react-dom"

type Props = {
  isOpen: boolean
  onClose: () => void
  setHospitals: React.Dispatch<
    React.SetStateAction<HospitalManagementType[]>
  >
}
export default function CreateHospitalModal() {

  const [hospitalName, setHospitalName] = useState("")
  const [pricePlan, setPricePlan] = useState("Basic")
  const [note, setNote] = useState("")

  return createPortal(
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">

      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-8 relative">

        {/* ×ボタン */}
        <button
          className="
            absolute
            left-4
            top-4
            text-2xl
            text-gray-500
            hover:text-black
          "
        >
          ×
        </button>

        <h2 className="text-2xl font-bold mb-6 text-center">
          病院新規登録
        </h2>

        <div className="space-y-4">

          <div>

            <div className="text-sm mb-1">
              病院名
            </div>

            <input
              className="
                border
                border-gray-300
                rounded
                px-3
                py-2
                w-full
              "
            />

          </div>

          <div>

            <div className="text-sm mb-1">
              料金プラン
            </div>

            <select
              className="
                border
                border-gray-300
                rounded
                px-3
                py-2
                w-full
              "
            >
              <option>Free</option>
              <option>Basic</option>
              <option>Standard</option>
              <option>Professional</option>
            </select>

          </div>

          <div>

            <div className="text-sm mb-1">
              備考
            </div>

            <textarea
              rows={5}
              className="
                border
                border-gray-300
                rounded
                px-3
                py-2
                w-full
                resize-none
              "
            />

          </div>

        </div>

        <div className="flex justify-end gap-4 mt-6">

          <button
            className="
              px-4
              py-2
              rounded-lg
              bg-gray-300
              hover:bg-gray-400
            "
          >
            キャンセル
          </button>

          <button
            className="
              px-4
              py-2
              rounded-lg
              bg-blue-500
              text-white
              hover:bg-blue-600
            "
          >
            登録
          </button>

        </div>

      </div>

    </div>,
    document.body
  )
}